"use strict";
var tempis_timeline = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/index.ts
  var src_exports = {};
  __export(src_exports, {
    TempisTimeline: () => TempisTimeline
  });

  // src/Utilities.ts
  function parseDate(input) {
    if (!input) {
      throw new Error("Cannot parse input as date as it is not defined");
    }
    if (input instanceof Date) {
      if (isNaN(input.getTime())) {
        throw new Error(`Date is not valid`);
      }
      return input;
    } else if (typeof input === "string") {
      if (isNaN(Date.parse(input))) {
        throw new Error(`Cannot parse input string '${input}' as date as it is not a valid date`);
      }
      return new Date(input);
    } else if (typeof input === "number") {
      if (isNaN(Date.parse(`${input}`))) {
        throw new Error(`Cannot parse input string '${input}' as date as it is not a valid date`);
      }
      return new Date(`${input}`);
    }
    throw new Error(`Cannot parse input '${input}' as date`);
  }
  function clamp(value, min, max) {
    if (value < min) {
      return min;
    } else if (value > max) {
      return max;
    }
    return value;
  }
  function doDateRangesOverlap(aStart, aEnd, bStart, bEnd) {
    if (aStart <= bStart && bStart <= aEnd)
      return true;
    if (aStart <= bEnd && bEnd <= aEnd)
      return true;
    if (bStart < aStart && aEnd < bEnd)
      return true;
    return false;
  }
  function fitCanvasText(context, value, maxWidth) {
    let stringWidth = context.measureText(value).width;
    if (!value || stringWidth <= maxWidth) {
      return value;
    }
    const ellipsisWidth = context.measureText("...").width;
    if (ellipsisWidth > maxWidth) {
      return "";
    }
    let stringCharacterLength = value.length;
    while (stringWidth >= maxWidth - ellipsisWidth && stringCharacterLength-- > 1) {
      value = value.substring(0, stringCharacterLength);
      stringWidth = context.measureText(value).width;
    }
    return `${value}...`;
  }
  function defaults(destination, source) {
    Object.keys(source).forEach((key) => {
      if (destination[key] == null) {
        destination[key] = source[key];
      }
    });
    return destination;
  }

  // src/TimelineItem.ts
  var DEFAULT_ITEM_STYLE = {
    backgroundColor: "#1a006eff",
    fontColor: "#FFFFFF",
    padding: 12,
    borderRadius: 5
  };
  var TimelineItem = class {
    constructor(definition) {
      var _a, _b;
      this._id = definition.id;
      this._caption = (_a = definition.caption) != null ? _a : "";
      this._start = parseDate(definition.start);
      this._end = definition.end ? parseDate(definition.end) : null;
      this._style = defaults((_b = definition.style) != null ? _b : {}, DEFAULT_ITEM_STYLE);
    }
    get id() {
      return this._id;
    }
    get caption() {
      return this._caption;
    }
    get start() {
      return this._start;
    }
    get end() {
      return this._end;
    }
    get style() {
      return this._style;
    }
  };

  // src/TimelineItemGrouping.ts
  var TimelineItemGrouping = class {
    constructor(group, items) {
      this._group = group;
      this._items = items.map((itemDefinition) => new TimelineItem(itemDefinition));
      this._sortItemsByStartDate();
    }
    get group() {
      return this._group;
    }
    get items() {
      return this._items;
    }
    getItemsInRange(fromDt, toDt) {
      return this._items.filter((item) => {
        if (item.end) {
          return doDateRangesOverlap(item.start, item.end, fromDt, toDt);
        } else {
          return item.start.getTime() >= fromDt.getTime() && item.start.getTime() <= toDt.getTime();
        }
      });
    }
    _sortItemsByStartDate() {
      this._items.sort((a2, b) => a2.start.getTime() - b.start.getTime());
    }
  };

  // src/TimelineDataSet.ts
  var TimelineDataSet = class {
    constructor(onChange) {
      this._itemGroupings = [];
      this._minDate = null;
      this._maxDate = null;
      this._onChange = onChange != null ? onChange : null;
    }
    get groupings() {
      return [...this._itemGroupings];
    }
    get minDate() {
      return this._minDate;
    }
    get maxDate() {
      return this._maxDate;
    }
    createGroupings(itemDefinitions) {
      var _a, _b;
      this._itemGroupings = [];
      const itemGroupingMap = {};
      for (const itemDefinition of itemDefinitions != null ? itemDefinitions : []) {
        const groupingKey = (_a = itemDefinition.grouping) != null ? _a : "";
        let group = itemGroupingMap[groupingKey];
        if (!group) {
          group = [];
          itemGroupingMap[groupingKey] = group;
        }
        group.push(itemDefinition);
      }
      for (const [key, value] of Object.entries(itemGroupingMap)) {
        this._itemGroupings.push(new TimelineItemGrouping(key, value));
      }
      this._findMinAndMaxDates();
      (_b = this._onChange) == null ? void 0 : _b.call(this);
    }
    _findMinAndMaxDates() {
      var _a, _b;
      if (this._itemGroupings.length === 0 || this._itemGroupings[0].items.length === 0) {
        this._minDate = null;
        this._maxDate = null;
        return;
      }
      let minDate = null;
      let maxDate = null;
      for (const grouping of this._itemGroupings) {
        for (const item of grouping.items) {
          if (minDate === null || item.start.getTime() < minDate.getTime()) {
            minDate = item.start;
          }
          if (maxDate === null || ((_a = item.end) != null ? _a : item.start).getTime() > maxDate.getTime()) {
            maxDate = (_b = item.end) != null ? _b : item.start;
          }
        }
      }
      this._minDate = minDate;
      this._maxDate = maxDate;
    }
  };

  // src/TimelineDataView.ts
  var DEFAULT_GROUP_VERTICAL_LABEL_MARGIN = 6;
  var DEFAULT_ITEM_VERTICAL_MARGIN = 8;
  var DEFAULT_GROUP_MARGIN = 12;
  var TimelineDataView = class {
    constructor(dataSet) {
      this._scrollYOffset = 0;
      this._drawPlan = null;
      this._dataSet = dataSet;
    }
    scrollByYMovement(movementY) {
      this._scrollYOffset += movementY;
    }
    draw(context, range, yPosition, maxHeight) {
      this._drawPlan = this._createViewDrawPlan(context, range.fromDt, range.toDt);
      this._scrollYOffset = clamp(this._scrollYOffset, Math.min(0, maxHeight - this._drawPlan.height), 0);
      const viewHeight = Math.min(this._drawPlan.height, maxHeight);
      context.clearRect(0, yPosition, context.canvas.width, viewHeight);
      this._drawMinorUnitBars(context, range.minorTicks, yPosition, viewHeight);
      this._drawGroups(context, yPosition, maxHeight);
      return viewHeight;
    }
    getItemAtPoint(point) {
      if (!this._drawPlan) {
        return null;
      }
      for (const groupDrawPlan of this._drawPlan.groupDrawPlans) {
        for (const itemDrawPlan of groupDrawPlan.rows.flat()) {
          if (point.x >= itemDrawPlan.xPositionStart && point.x <= itemDrawPlan.xPositionEnd && point.y >= itemDrawPlan.yPositionStart + this._scrollYOffset && point.y <= itemDrawPlan.yPositionEnd + this._scrollYOffset) {
            return itemDrawPlan.item;
          }
        }
      }
      return null;
    }
    _drawMinorUnitBars(context, rangeMinorTicks, yPosition, height) {
      context.lineWidth = 1;
      context.strokeStyle = "#c2c2c2";
      context.setLineDash([3, 3]);
      context.beginPath();
      for (const { xPosition } of rangeMinorTicks) {
        if (xPosition > 0 && xPosition < context.canvas.width) {
          context.moveTo(xPosition, yPosition);
          context.lineTo(xPosition, yPosition + height);
        }
      }
      context.stroke();
      context.setLineDash([]);
    }
    _drawGroups(context, yPosition, maxHeight) {
      if (!this._drawPlan) {
        return;
      }
      const scrolledYPosition = yPosition + this._scrollYOffset;
      for (let groupDrawPlanIndex = 0; groupDrawPlanIndex < this._drawPlan.groupDrawPlans.length; groupDrawPlanIndex++) {
        const groupDrawPlan = this._drawPlan.groupDrawPlans[groupDrawPlanIndex];
        if (groupDrawPlanIndex > 0) {
          context.lineWidth = 0.5;
          context.strokeStyle = "#595959";
          context.beginPath();
          context.moveTo(0, scrolledYPosition + groupDrawPlan.yPositionStart - 1);
          context.lineTo(context.canvas.clientWidth, scrolledYPosition + groupDrawPlan.yPositionStart - 1);
          context.stroke();
        }
        if (groupDrawPlan.label) {
          context.textBaseline = "top";
          context.fillStyle = "#595959";
          context.beginPath();
          context.fillText(groupDrawPlan.label, 6, scrolledYPosition + groupDrawPlan.yPositionStart + DEFAULT_GROUP_VERTICAL_LABEL_MARGIN);
          context.stroke();
        }
        for (const row of groupDrawPlan.rows) {
          for (const itemDrawPlan of row) {
            const itemFontColour = itemDrawPlan.item.style.fontColor;
            const itemBackgroundColour = itemDrawPlan.item.style.backgroundColor;
            const itemPadding = itemDrawPlan.item.style.padding;
            const itemBorderRadius = itemDrawPlan.item.style.borderRadius;
            if (itemDrawPlan.xPointInTimePosition !== null) {
              context.lineWidth = 2;
              context.strokeStyle = itemFontColour;
              context.fillStyle = itemBackgroundColour;
              const itemMarkerConnectorPath = new Path2D();
              itemMarkerConnectorPath.moveTo(Math.max(itemDrawPlan.xPositionStart, itemDrawPlan.xPointInTimePosition - 20), scrolledYPosition + itemDrawPlan.yPositionStart + (itemDrawPlan.yPositionEnd - itemDrawPlan.yPositionStart) / 2);
              itemMarkerConnectorPath.lineTo(itemDrawPlan.xPointInTimePosition, scrolledYPosition + itemDrawPlan.yPositionEnd + 6);
              itemMarkerConnectorPath.lineTo(Math.min(itemDrawPlan.xPositionEnd, itemDrawPlan.xPointInTimePosition + 20), scrolledYPosition + itemDrawPlan.yPositionStart + (itemDrawPlan.yPositionEnd - itemDrawPlan.yPositionStart) / 2);
              context.fill(itemMarkerConnectorPath);
              context.strokeStyle = itemBackgroundColour;
              context.beginPath();
              context.moveTo(itemDrawPlan.xPointInTimePosition, scrolledYPosition + itemDrawPlan.yPositionStart + (itemDrawPlan.yPositionEnd - itemDrawPlan.yPositionStart) / 2);
              context.lineTo(itemDrawPlan.xPointInTimePosition, 1e3);
              context.stroke();
            }
            context.fillStyle = itemBackgroundColour;
            context.beginPath();
            context.roundRect(itemDrawPlan.xPositionStart, scrolledYPosition + itemDrawPlan.yPositionStart, itemDrawPlan.xPositionEnd - itemDrawPlan.xPositionStart, itemDrawPlan.yPositionEnd - itemDrawPlan.yPositionStart, itemBorderRadius);
            context.fill();
            if (itemDrawPlan.item.caption) {
              const labelStartPositionX = Math.max(itemPadding, itemDrawPlan.xPositionStart + itemPadding);
              const maxLabelWidth = Math.max(0, itemDrawPlan.xPositionEnd - itemPadding - labelStartPositionX) + 1;
              context.textBaseline = "middle";
              context.fillStyle = itemFontColour;
              context.beginPath();
              context.fillText(fitCanvasText(context, itemDrawPlan.item.caption, maxLabelWidth), labelStartPositionX, itemDrawPlan.yPositionStart + (itemDrawPlan.yPositionEnd - itemDrawPlan.yPositionStart) / 2 + scrolledYPosition);
              context.stroke();
            }
          }
        }
      }
    }
    _createViewDrawPlan(context, rangeFromDt, rangeToDt) {
      var _a;
      const groupDrawPlans = [];
      const milliRenderWidth = context.canvas.clientWidth / (rangeToDt.getTime() - rangeFromDt.getTime());
      for (const grouping of this._dataSet.groupings) {
        const itemsInRange = grouping.getItemsInRange(rangeFromDt, rangeToDt);
        if (!itemsInRange.length) {
          continue;
        }
        const itemDrawPlanStacks = [[]];
        for (const item of itemsInRange) {
          let startPositionX = 0;
          let endPositionX = 0;
          let pointInTimePositionX = null;
          if (item.end) {
            startPositionX = milliRenderWidth * (item.start.getTime() - rangeFromDt.getTime());
            endPositionX = milliRenderWidth * (item.end.getTime() - rangeFromDt.getTime());
          } else {
            const itemLabelWidth = context.measureText((_a = item.caption) != null ? _a : "?").width + item.style.padding * 2;
            startPositionX = milliRenderWidth * (item.start.getTime() - rangeFromDt.getTime()) - itemLabelWidth / 2;
            endPositionX = startPositionX + itemLabelWidth;
            pointInTimePositionX = milliRenderWidth * (item.start.getTime() - rangeFromDt.getTime());
            if (startPositionX < 0) {
              startPositionX = 0;
              endPositionX = itemLabelWidth;
            } else if (endPositionX > context.canvas.clientWidth) {
              startPositionX = context.canvas.clientWidth - itemLabelWidth;
              endPositionX = context.canvas.clientWidth;
            }
          }
          const itemDrawPlan = {
            item,
            height: 0,
            xPositionStart: startPositionX,
            xPositionEnd: endPositionX,
            yPositionStart: 0,
            yPositionEnd: 0,
            xPointInTimePosition: pointInTimePositionX
          };
          let wasItemAddedToExistingRowStack = false;
          for (const rowStack of itemDrawPlanStacks) {
            if (rowStack.length === 0 || rowStack[rowStack.length - 1].xPositionEnd < itemDrawPlan.xPositionStart) {
              rowStack.push(itemDrawPlan);
              wasItemAddedToExistingRowStack = true;
              break;
            }
          }
          if (!wasItemAddedToExistingRowStack) {
            itemDrawPlanStacks.push([itemDrawPlan]);
          }
        }
        groupDrawPlans.push({
          label: grouping.group,
          rows: itemDrawPlanStacks,
          yPositionStart: 0,
          yPositionEnd: 0
        });
      }
      let positionY = 0;
      for (const groupDrawPlan of groupDrawPlans) {
        groupDrawPlan.yPositionStart = positionY;
        if (groupDrawPlan.label) {
          const groupLabelMetrics = context.measureText(groupDrawPlan.label);
          positionY += groupLabelMetrics.actualBoundingBoxAscent + groupLabelMetrics.actualBoundingBoxDescent;
          positionY += 2 * DEFAULT_GROUP_VERTICAL_LABEL_MARGIN;
        }
        positionY += DEFAULT_GROUP_MARGIN;
        for (const itemRow of groupDrawPlan.rows) {
          positionY += DEFAULT_ITEM_VERTICAL_MARGIN;
          for (const itemDrawPlan of itemRow) {
            const { actualBoundingBoxAscent, actualBoundingBoxDescent } = context.measureText("Label");
            const itemHeight = actualBoundingBoxAscent + actualBoundingBoxDescent + itemDrawPlan.item.style.padding * 2;
            itemDrawPlan.yPositionStart = positionY;
            itemDrawPlan.yPositionEnd = positionY + itemHeight;
          }
          positionY = Math.max(...itemRow.map((itemDrawPlan) => itemDrawPlan.yPositionEnd));
          positionY += DEFAULT_ITEM_VERTICAL_MARGIN;
        }
        positionY += DEFAULT_GROUP_MARGIN;
        groupDrawPlan.yPositionEnd = positionY;
        positionY += 1;
      }
      return {
        height: positionY,
        width: context.canvas.clientWidth,
        groupDrawPlans
      };
    }
  };
  TimelineDataView._minimumHeight = 50;

  // src/TimelineFont.ts
  var TIMELINE_FONT_DEFAULT_SIZE = 14;
  var TIMELINE_FONT_DEFAULT_FAMILY = "'Helvetica', 'Arial', sans-serif";
  var TimelineFont = class {
    constructor(options = {}) {
      this._options = options;
    }
    get options() {
      return this._options;
    }
    get font() {
      var _a, _b, _c, _d, _e;
      const style = (_a = this._options.style) != null ? _a : "";
      const weight = (_b = this._options.weight) != null ? _b : "";
      const size = (_c = this._options.size) != null ? _c : TIMELINE_FONT_DEFAULT_SIZE;
      const lineHeight = (_d = this._options.lineHeight) != null ? _d : "";
      const family = (_e = this._options.family) != null ? _e : TIMELINE_FONT_DEFAULT_FAMILY;
      return `${style} ${weight} ${size}px ${lineHeight} ${family}`;
    }
    getTextMetrics(text, context) {
      if (typeof text !== "string") {
        throw new Error("expected text to be defined.");
      }
      const originalFont = context.font;
      context.font = this.font;
      const textMetrics = context.measureText(text);
      context.font = originalFont;
      return textMetrics;
    }
  };

  // node_modules/date-format-parse/es/util.js
  function isDate(value) {
    return value instanceof Date || Object.prototype.toString.call(value) === "[object Date]";
  }
  function toDate(value) {
    if (isDate(value)) {
      return new Date(value.getTime());
    }
    if (value == null) {
      return new Date(NaN);
    }
    return new Date(value);
  }
  function isValidDate(value) {
    return isDate(value) && !isNaN(value.getTime());
  }
  function startOfWeek(value) {
    var firstDayOfWeek = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    if (!(firstDayOfWeek >= 0 && firstDayOfWeek <= 6)) {
      throw new RangeError("weekStartsOn must be between 0 and 6");
    }
    var date = toDate(value);
    var day = date.getDay();
    var diff = (day + 7 - firstDayOfWeek) % 7;
    date.setDate(date.getDate() - diff);
    date.setHours(0, 0, 0, 0);
    return date;
  }
  function startOfWeekYear(value) {
    var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ref$firstDayOfWeek = _ref.firstDayOfWeek, firstDayOfWeek = _ref$firstDayOfWeek === void 0 ? 0 : _ref$firstDayOfWeek, _ref$firstWeekContain = _ref.firstWeekContainsDate, firstWeekContainsDate = _ref$firstWeekContain === void 0 ? 1 : _ref$firstWeekContain;
    if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
      throw new RangeError("firstWeekContainsDate must be between 1 and 7");
    }
    var date = toDate(value);
    var year = date.getFullYear();
    var firstDateOfFirstWeek = new Date(0);
    for (var i = year + 1; i >= year - 1; i--) {
      firstDateOfFirstWeek.setFullYear(i, 0, firstWeekContainsDate);
      firstDateOfFirstWeek.setHours(0, 0, 0, 0);
      firstDateOfFirstWeek = startOfWeek(firstDateOfFirstWeek, firstDayOfWeek);
      if (date.getTime() >= firstDateOfFirstWeek.getTime()) {
        break;
      }
    }
    return firstDateOfFirstWeek;
  }
  function getWeek(value) {
    var _ref2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ref2$firstDayOfWeek = _ref2.firstDayOfWeek, firstDayOfWeek = _ref2$firstDayOfWeek === void 0 ? 0 : _ref2$firstDayOfWeek, _ref2$firstWeekContai = _ref2.firstWeekContainsDate, firstWeekContainsDate = _ref2$firstWeekContai === void 0 ? 1 : _ref2$firstWeekContai;
    var date = toDate(value);
    var firstDateOfThisWeek = startOfWeek(date, firstDayOfWeek);
    var firstDateOfFirstWeek = startOfWeekYear(date, {
      firstDayOfWeek,
      firstWeekContainsDate
    });
    var diff = firstDateOfThisWeek.getTime() - firstDateOfFirstWeek.getTime();
    return Math.round(diff / (7 * 24 * 3600 * 1e3)) + 1;
  }

  // node_modules/date-format-parse/es/locale/en.js
  var locale = {
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    weekdays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    weekdaysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    weekdaysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    firstDayOfWeek: 0,
    firstWeekContainsDate: 1
  };
  var en_default = locale;

  // node_modules/date-format-parse/es/format.js
  var REGEX_FORMAT = /\[([^\]]+)]|YYYY|YY?|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|m{1,2}|s{1,2}|Z{1,2}|S{1,3}|w{1,2}|x|X|a|A/g;
  function pad(val) {
    var len = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 2;
    var output = "".concat(Math.abs(val));
    var sign = val < 0 ? "-" : "";
    while (output.length < len) {
      output = "0".concat(output);
    }
    return sign + output;
  }
  function getOffset(date) {
    return Math.round(date.getTimezoneOffset() / 15) * 15;
  }
  function formatTimezone(offset) {
    var delimeter = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    var sign = offset > 0 ? "-" : "+";
    var absOffset = Math.abs(offset);
    var hours = Math.floor(absOffset / 60);
    var minutes = absOffset % 60;
    return sign + pad(hours, 2) + delimeter + pad(minutes, 2);
  }
  var meridiem = function meridiem2(h2, _, isLowercase) {
    var word = h2 < 12 ? "AM" : "PM";
    return isLowercase ? word.toLocaleLowerCase() : word;
  };
  var formatFlags = {
    Y: function Y(date) {
      var y = date.getFullYear();
      return y <= 9999 ? "".concat(y) : "+".concat(y);
    },
    YY: function YY(date) {
      return pad(date.getFullYear(), 4).substr(2);
    },
    YYYY: function YYYY(date) {
      return pad(date.getFullYear(), 4);
    },
    M: function M(date) {
      return date.getMonth() + 1;
    },
    MM: function MM(date) {
      return pad(date.getMonth() + 1, 2);
    },
    MMM: function MMM(date, locale2) {
      return locale2.monthsShort[date.getMonth()];
    },
    MMMM: function MMMM(date, locale2) {
      return locale2.months[date.getMonth()];
    },
    D: function D(date) {
      return date.getDate();
    },
    DD: function DD(date) {
      return pad(date.getDate(), 2);
    },
    H: function H(date) {
      return date.getHours();
    },
    HH: function HH(date) {
      return pad(date.getHours(), 2);
    },
    h: function h(date) {
      var hours = date.getHours();
      if (hours === 0) {
        return 12;
      }
      if (hours > 12) {
        return hours % 12;
      }
      return hours;
    },
    hh: function hh() {
      var hours = formatFlags.h.apply(formatFlags, arguments);
      return pad(hours, 2);
    },
    m: function m(date) {
      return date.getMinutes();
    },
    mm: function mm(date) {
      return pad(date.getMinutes(), 2);
    },
    s: function s(date) {
      return date.getSeconds();
    },
    ss: function ss(date) {
      return pad(date.getSeconds(), 2);
    },
    S: function S(date) {
      return Math.floor(date.getMilliseconds() / 100);
    },
    SS: function SS(date) {
      return pad(Math.floor(date.getMilliseconds() / 10), 2);
    },
    SSS: function SSS(date) {
      return pad(date.getMilliseconds(), 3);
    },
    d: function d(date) {
      return date.getDay();
    },
    dd: function dd(date, locale2) {
      return locale2.weekdaysMin[date.getDay()];
    },
    ddd: function ddd(date, locale2) {
      return locale2.weekdaysShort[date.getDay()];
    },
    dddd: function dddd(date, locale2) {
      return locale2.weekdays[date.getDay()];
    },
    A: function A(date, locale2) {
      var meridiemFunc = locale2.meridiem || meridiem;
      return meridiemFunc(date.getHours(), date.getMinutes(), false);
    },
    a: function a(date, locale2) {
      var meridiemFunc = locale2.meridiem || meridiem;
      return meridiemFunc(date.getHours(), date.getMinutes(), true);
    },
    Z: function Z(date) {
      return formatTimezone(getOffset(date), ":");
    },
    ZZ: function ZZ(date) {
      return formatTimezone(getOffset(date));
    },
    X: function X(date) {
      return Math.floor(date.getTime() / 1e3);
    },
    x: function x(date) {
      return date.getTime();
    },
    w: function w(date, locale2) {
      return getWeek(date, {
        firstDayOfWeek: locale2.firstDayOfWeek,
        firstWeekContainsDate: locale2.firstWeekContainsDate
      });
    },
    ww: function ww(date, locale2) {
      return pad(formatFlags.w(date, locale2), 2);
    }
  };
  function format(val, str) {
    var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    var formatStr = str ? String(str) : "YYYY-MM-DDTHH:mm:ss.SSSZ";
    var date = toDate(val);
    if (!isValidDate(date)) {
      return "Invalid Date";
    }
    var locale2 = options.locale || en_default;
    return formatStr.replace(REGEX_FORMAT, function(match, p1) {
      if (p1) {
        return p1;
      }
      if (typeof formatFlags[match] === "function") {
        return "".concat(formatFlags[match](date, locale2));
      }
      return match;
    });
  }

  // node_modules/date-format-parse/es/parse.js
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }
  function _iterableToArrayLimit(arr, i) {
    if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
      return;
    }
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = void 0;
    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i && _arr.length === i)
          break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null)
          _i["return"]();
      } finally {
        if (_d)
          throw _e;
      }
    }
    return _arr;
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr))
      return arr;
  }
  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  var match1 = /\d/;
  var match2 = /\d\d/;
  var match3 = /\d{3}/;
  var match4 = /\d{4}/;
  var match1to2 = /\d\d?/;
  var matchShortOffset = /[+-]\d\d:?\d\d/;
  var matchSigned = /[+-]?\d+/;
  var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/;
  var YEAR = "year";
  var MONTH = "month";
  var DAY = "day";
  var HOUR = "hour";
  var MINUTE = "minute";
  var SECOND = "second";
  var MILLISECOND = "millisecond";
  var parseFlags = {};
  var addParseFlag = function addParseFlag2(token, regex, callback) {
    var tokens = Array.isArray(token) ? token : [token];
    var func;
    if (typeof callback === "string") {
      func = function func2(input) {
        var value = parseInt(input, 10);
        return _defineProperty({}, callback, value);
      };
    } else {
      func = callback;
    }
    tokens.forEach(function(key) {
      parseFlags[key] = [regex, func];
    });
  };
  var escapeStringRegExp = function escapeStringRegExp2(str) {
    return str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
  };
  var matchWordRegExp = function matchWordRegExp2(localeKey) {
    return function(locale2) {
      var array = locale2[localeKey];
      if (!Array.isArray(array)) {
        throw new Error("Locale[".concat(localeKey, "] need an array"));
      }
      return new RegExp(array.map(escapeStringRegExp).join("|"));
    };
  };
  var matchWordCallback = function matchWordCallback2(localeKey, key) {
    return function(input, locale2) {
      var array = locale2[localeKey];
      if (!Array.isArray(array)) {
        throw new Error("Locale[".concat(localeKey, "] need an array"));
      }
      var index = array.indexOf(input);
      if (index < 0) {
        throw new Error("Invalid Word");
      }
      return _defineProperty({}, key, index);
    };
  };
  addParseFlag("Y", matchSigned, YEAR);
  addParseFlag("YY", match2, function(input) {
    var year = new Date().getFullYear();
    var cent = Math.floor(year / 100);
    var value = parseInt(input, 10);
    value = (value > 68 ? cent - 1 : cent) * 100 + value;
    return _defineProperty({}, YEAR, value);
  });
  addParseFlag("YYYY", match4, YEAR);
  addParseFlag("M", match1to2, function(input) {
    return _defineProperty({}, MONTH, parseInt(input, 10) - 1);
  });
  addParseFlag("MM", match2, function(input) {
    return _defineProperty({}, MONTH, parseInt(input, 10) - 1);
  });
  addParseFlag("MMM", matchWordRegExp("monthsShort"), matchWordCallback("monthsShort", MONTH));
  addParseFlag("MMMM", matchWordRegExp("months"), matchWordCallback("months", MONTH));
  addParseFlag("D", match1to2, DAY);
  addParseFlag("DD", match2, DAY);
  addParseFlag(["H", "h"], match1to2, HOUR);
  addParseFlag(["HH", "hh"], match2, HOUR);
  addParseFlag("m", match1to2, MINUTE);
  addParseFlag("mm", match2, MINUTE);
  addParseFlag("s", match1to2, SECOND);
  addParseFlag("ss", match2, SECOND);
  addParseFlag("S", match1, function(input) {
    return _defineProperty({}, MILLISECOND, parseInt(input, 10) * 100);
  });
  addParseFlag("SS", match2, function(input) {
    return _defineProperty({}, MILLISECOND, parseInt(input, 10) * 10);
  });
  addParseFlag("SSS", match3, MILLISECOND);
  function matchMeridiem(locale2) {
    return locale2.meridiemParse || /[ap]\.?m?\.?/i;
  }
  function defaultIsPM(input) {
    return "".concat(input).toLowerCase().charAt(0) === "p";
  }
  addParseFlag(["A", "a"], matchMeridiem, function(input, locale2) {
    var isPM = typeof locale2.isPM === "function" ? locale2.isPM(input) : defaultIsPM(input);
    return {
      isPM
    };
  });
  function offsetFromString(str) {
    var _ref8 = str.match(/([+-]|\d\d)/g) || ["-", "0", "0"], _ref9 = _slicedToArray(_ref8, 3), symbol = _ref9[0], hour = _ref9[1], minute = _ref9[2];
    var minutes = parseInt(hour, 10) * 60 + parseInt(minute, 10);
    if (minutes === 0) {
      return 0;
    }
    return symbol === "+" ? -minutes : +minutes;
  }
  addParseFlag(["Z", "ZZ"], matchShortOffset, function(input) {
    return {
      offset: offsetFromString(input)
    };
  });
  addParseFlag("x", matchSigned, function(input) {
    return {
      date: new Date(parseInt(input, 10))
    };
  });
  addParseFlag("X", matchTimestamp, function(input) {
    return {
      date: new Date(parseFloat(input) * 1e3)
    };
  });
  addParseFlag("d", match1, "weekday");
  addParseFlag("dd", matchWordRegExp("weekdaysMin"), matchWordCallback("weekdaysMin", "weekday"));
  addParseFlag("ddd", matchWordRegExp("weekdaysShort"), matchWordCallback("weekdaysShort", "weekday"));
  addParseFlag("dddd", matchWordRegExp("weekdays"), matchWordCallback("weekdays", "weekday"));
  addParseFlag("w", match1to2, "week");
  addParseFlag("ww", match2, "week");

  // src/TimelineRangeView.ts
  var DEFAULT_MINOR_UNIT_LABEL_FORMATS = {
    millisecond: "SSS",
    second: "HH:mm:ss",
    minute: "HH:mm",
    hour: "HH:mm",
    day: "D",
    month: "MMM",
    year: "YYYY"
  };
  var DEFAULT_MAJOR_UNIT_LABEL_FORMATS = {
    second: "D MMMM HH:mm:ss",
    minute: "D MMMM HH:mm",
    hour: "ddd D MMMM HH:mm",
    day: "ddd D MMMM",
    month: "MMMM YYYY",
    year: "YYYY"
  };
  var DEFAULT_UNIT_LABEL_PADDING = 4;
  var TimelineRangeView = class {
    constructor(canvas, options = {}) {
      this._fromDt = new Date();
      this._toDt = new Date(this._fromDt.getTime() + 31556952e4);
      this._minorTickUnitAndStep = { unit: "year", step: 2 };
      this._majorTickUnitAndStep = { unit: "year", step: 10 };
      this._minorUnitTicks = [];
      this._majorUnitTicks = [];
      this._canvas = canvas;
      this._options = options;
    }
    get position() {
      var _a;
      return (_a = this._options.position) != null ? _a : "bottom";
    }
    get fromDt() {
      return this._fromDt;
    }
    get toDt() {
      return this._toDt;
    }
    get minorTicks() {
      return this._minorUnitTicks;
    }
    setRange(from, to) {
      this._fromDt = new Date(from);
      this._toDt = new Date(to);
      if (this._fromDt.getTime() === this._toDt.getTime()) {
        this._fromDt.setTime(this._fromDt.getTime() - 60 * 1e3);
        this._toDt.setTime(this._toDt.getTime() + 60 * 1e3);
      }
      this.calculateMinorAndMajorUnitTicks();
    }
    moveByXMovement(movementX) {
      const rangeXMillisValue = (this._toDt.getTime() - this._fromDt.getTime()) / this._canvas.clientWidth;
      this._fromDt.setTime(this._fromDt.getTime() + rangeXMillisValue * movementX);
      this._toDt.setTime(this._toDt.getTime() + rangeXMillisValue * movementX);
      this.calculateMinorAndMajorUnitTicks();
    }
    moveByStep(unit, step) {
      if (unit === "millisecond") {
        this._fromDt.setMilliseconds(this._fromDt.getMilliseconds() + step);
        this._toDt.setMilliseconds(this._toDt.getMilliseconds() + step);
      } else if (unit === "second") {
        this._fromDt.setSeconds(this._fromDt.getSeconds() + step);
        this._toDt.setSeconds(this._toDt.getSeconds() + step);
      } else if (unit === "minute") {
        this._fromDt.setMinutes(this._fromDt.getMinutes() + step);
        this._toDt.setMinutes(this._toDt.getMinutes() + step);
      } else if (unit === "hour") {
        this._fromDt.setHours(this._fromDt.getHours() + step);
        this._toDt.setHours(this._toDt.getHours() + step);
      } else if (unit === "day") {
        this._fromDt.setDate(this._fromDt.getDate() + step);
        this._toDt.setDate(this._toDt.getDate() + step);
      } else if (unit === "month") {
        this._fromDt.setMonth(this._fromDt.getMonth() + step);
        this._toDt.setMonth(this._toDt.getMonth() + step);
      } else if (unit === "year") {
        this._fromDt.setFullYear(this._fromDt.getFullYear() + step);
        this._toDt.setFullYear(this._toDt.getFullYear() + step);
      }
      this.calculateMinorAndMajorUnitTicks();
    }
    zoomRange(amount) {
      const zoomValue = (this._toDt.getTime() - this._fromDt.getTime()) * (clamp(amount, -1, 1) * 0.1);
      this._fromDt.setMilliseconds(this._fromDt.getMilliseconds() - zoomValue);
      this._toDt.setMilliseconds(this._toDt.getMilliseconds() + zoomValue);
      this.calculateMinorAndMajorUnitTicks();
    }
    clearRange() {
      this.setRange(new Date(0), new Date(41024448e5));
    }
    calculateRequiredHeight() {
      var context = this._canvas.getContext("2d");
      const unitLabelTextMetrics = context.measureText("Fri 13 April 1990");
      return DEFAULT_UNIT_LABEL_PADDING * 4 + (unitLabelTextMetrics.actualBoundingBoxAscent + unitLabelTextMetrics.actualBoundingBoxDescent) * 2;
    }
    calculateMinorAndMajorUnitTicks() {
      const minorTargetTickCount = Math.floor(this._canvas.clientWidth / 120);
      const majorTargetTickCount = Math.floor(this._canvas.clientWidth / 320);
      const milliRenderWidth = this._canvas.clientWidth / (this._toDt.getTime() - this._fromDt.getTime());
      this._minorTickUnitAndStep = this._findSensibleUnitAndStep(minorTargetTickCount);
      this._majorTickUnitAndStep = this._findSensibleUnitAndStep(majorTargetTickCount, this._minorTickUnitAndStep.unit);
      const minorTickDates = this._getTickDates(this._minorTickUnitAndStep);
      const majorTickDates = this._getTickDates(this._majorTickUnitAndStep);
      this._minorUnitTicks = minorTickDates.map((tickDate) => {
        return {
          date: tickDate,
          xPosition: milliRenderWidth * (tickDate.getTime() - this._fromDt.getTime())
        };
      });
      this._majorUnitTicks = majorTickDates.map((tickDate) => {
        return {
          date: tickDate,
          xPosition: milliRenderWidth * (tickDate.getTime() - this._fromDt.getTime())
        };
      });
    }
    draw(context, yPosition, position) {
      const rangeContainerHeight = this.calculateRequiredHeight();
      context.clearRect(0, yPosition, context.canvas.clientWidth, rangeContainerHeight);
      const minorTicksYPosition = position === "top" ? yPosition + rangeContainerHeight / 2 : yPosition;
      const majorTicksYPosition = position === "top" ? yPosition : yPosition + rangeContainerHeight / 2;
      for (const { date, xPosition } of this._minorUnitTicks) {
        if (xPosition > 0 && xPosition < context.canvas.clientWidth) {
          context.lineWidth = 1;
          context.strokeStyle = "#c2c2c2";
          context.setLineDash([3, 3]);
          context.beginPath();
          context.moveTo(xPosition, minorTicksYPosition);
          context.lineTo(xPosition, minorTicksYPosition + rangeContainerHeight / 2);
          context.stroke();
        }
        context.textBaseline = "alphabetic";
        context.fillStyle = "#595959";
        context.beginPath();
        context.fillText(this._formatDate(date, this._minorTickUnitAndStep.unit, DEFAULT_MINOR_UNIT_LABEL_FORMATS), xPosition + DEFAULT_UNIT_LABEL_PADDING, minorTicksYPosition + rangeContainerHeight / 2 - DEFAULT_UNIT_LABEL_PADDING);
        context.stroke();
      }
      if (this._minorTickUnitAndStep.unit === "year") {
        return;
      }
      for (let tickIndex = 0; tickIndex < this._majorUnitTicks.length; tickIndex++) {
        const { date, xPosition } = this._majorUnitTicks[tickIndex];
        const isStickyLabel = date.getTime() <= this._fromDt.getTime();
        if (!isStickyLabel && xPosition > 0 && xPosition < context.canvas.clientWidth) {
          context.lineWidth = 2;
          context.lineCap = "round";
          context.setLineDash([]);
          context.beginPath();
          context.moveTo(xPosition, majorTicksYPosition + 3);
          context.lineTo(xPosition, majorTicksYPosition + rangeContainerHeight / 2 - 3);
          context.stroke();
        }
        const tickLabel = this._formatDate(date, this._majorTickUnitAndStep.unit, DEFAULT_MAJOR_UNIT_LABEL_FORMATS);
        let labelXPosition = xPosition + DEFAULT_UNIT_LABEL_PADDING;
        if (isStickyLabel) {
          const labelWidth = context.measureText(tickLabel).width + DEFAULT_UNIT_LABEL_PADDING;
          const nextTickXPosition = this._majorUnitTicks[tickIndex + 1].xPosition;
          labelXPosition = nextTickXPosition > labelWidth ? DEFAULT_UNIT_LABEL_PADDING : nextTickXPosition - labelWidth;
        }
        context.lineWidth = 0.5;
        context.textBaseline = "alphabetic";
        context.fillStyle = "#595959";
        context.beginPath();
        context.fillText(tickLabel, labelXPosition, majorTicksYPosition + rangeContainerHeight / 2 - DEFAULT_UNIT_LABEL_PADDING);
        context.stroke();
      }
    }
    _findSensibleUnitAndStep(targetTickCount, minorUnit) {
      const millisDiff = this._toDt.getTime() - this._fromDt.getTime();
      targetTickCount = Math.max(1, targetTickCount);
      const units = [];
      if (minorUnit === "millisecond") {
        units.push({ unit: "second", factor: 1e3 });
        units.push({ unit: "minute", factor: 60 * 1e3 });
        units.push({ unit: "hour", factor: 60 * 60 * 1e3 });
        units.push({ unit: "day", factor: 24 * 60 * 60 * 1e3 });
        units.push({ unit: "month", factor: 30 * 24 * 60 * 60 * 1e3 });
        units.push({ unit: "year", factor: 365 * 24 * 60 * 60 * 1e3 });
      } else if (minorUnit === "second") {
        units.push({ unit: "minute", factor: 60 * 1e3 });
        units.push({ unit: "hour", factor: 60 * 60 * 1e3 });
        units.push({ unit: "day", factor: 24 * 60 * 60 * 1e3 });
        units.push({ unit: "month", factor: 30 * 24 * 60 * 60 * 1e3 });
        units.push({ unit: "year", factor: 365 * 24 * 60 * 60 * 1e3 });
      } else if (minorUnit === "minute") {
        units.push({ unit: "hour", factor: 60 * 60 * 1e3 });
        units.push({ unit: "day", factor: 24 * 60 * 60 * 1e3 });
        units.push({ unit: "month", factor: 30 * 24 * 60 * 60 * 1e3 });
        units.push({ unit: "year", factor: 365 * 24 * 60 * 60 * 1e3 });
      } else if (minorUnit === "hour") {
        units.push({ unit: "day", factor: 24 * 60 * 60 * 1e3 });
        units.push({ unit: "month", factor: 30 * 24 * 60 * 60 * 1e3 });
        units.push({ unit: "year", factor: 365 * 24 * 60 * 60 * 1e3 });
      } else if (minorUnit === "day") {
        units.push({ unit: "month", factor: 30 * 24 * 60 * 60 * 1e3 });
        units.push({ unit: "year", factor: 365 * 24 * 60 * 60 * 1e3 });
      } else if (minorUnit === "month") {
        units.push({ unit: "year", factor: 365 * 24 * 60 * 60 * 1e3 });
      } else if (minorUnit === "year") {
        units.push({ unit: "year", factor: 365 * 24 * 60 * 60 * 1e3 });
      } else {
        units.push({ unit: "millisecond", factor: 1 });
        units.push({ unit: "second", factor: 1e3 });
        units.push({ unit: "minute", factor: 60 * 1e3 });
        units.push({ unit: "hour", factor: 60 * 60 * 1e3 });
        units.push({ unit: "day", factor: 24 * 60 * 60 * 1e3 });
        units.push({ unit: "month", factor: 30 * 24 * 60 * 60 * 1e3 });
        units.push({ unit: "year", factor: 365 * 24 * 60 * 60 * 1e3 });
      }
      const unitTickCounts = [];
      units.forEach(({ unit, factor }) => {
        const viableStepValues = [];
        if (unit === "millisecond") {
          viableStepValues.push(1, 10, 50, 100, 500);
        } else if (unit === "second") {
          viableStepValues.push(1, 10, 15, 30);
        } else if (unit === "minute") {
          viableStepValues.push(1, 10, 15, 30);
        } else if (unit === "hour") {
          viableStepValues.push(1, 2, 6, 12);
        } else if (unit === "day") {
          viableStepValues.push(1, 2, 5, 10);
        } else if (unit === "month") {
          viableStepValues.push(1, 3, 6);
        } else if (unit === "year") {
          viableStepValues.push(1, 2, 5, 10, 20, 50, 100, 500);
        }
        viableStepValues.forEach((step) => {
          unitTickCounts.push({ unit, ticks: millisDiff / factor / step, step });
        });
      });
      unitTickCounts.sort((a2, b) => {
        return Math.abs(a2.ticks - targetTickCount) - Math.abs(b.ticks - targetTickCount);
      });
      return { unit: unitTickCounts[0].unit, step: unitTickCounts[0].step };
    }
    _getTickDates(unitAndStep) {
      let currentDate;
      if (unitAndStep.unit === "year") {
        currentDate = new Date(this._fromDt.getFullYear(), 0);
      } else if (unitAndStep.unit === "month") {
        currentDate = new Date(this._fromDt.getFullYear(), this._fromDt.getMonth());
      } else if (unitAndStep.unit === "day") {
        currentDate = new Date(this._fromDt.getFullYear(), this._fromDt.getMonth(), this._fromDt.getDate());
      } else if (unitAndStep.unit === "hour") {
        currentDate = new Date(this._fromDt.getFullYear(), this._fromDt.getMonth(), this._fromDt.getDate(), this._fromDt.getHours());
      } else if (unitAndStep.unit === "minute") {
        currentDate = new Date(this._fromDt.getFullYear(), this._fromDt.getMonth(), this._fromDt.getDate(), this._fromDt.getHours(), this._fromDt.getMinutes());
      } else if (unitAndStep.unit === "second") {
        currentDate = new Date(this._fromDt.getFullYear(), this._fromDt.getMonth(), this._fromDt.getDate(), this._fromDt.getHours(), this._fromDt.getMinutes(), this._fromDt.getSeconds());
      } else if (unitAndStep.unit === "millisecond") {
        currentDate = new Date(this._fromDt.getFullYear(), this._fromDt.getMonth(), this._fromDt.getDate(), this._fromDt.getHours(), this._fromDt.getMinutes(), this._fromDt.getSeconds(), this._fromDt.getMilliseconds());
      } else {
        throw new Error(`unknown unit: ${unitAndStep.unit}`);
      }
      const minorTickDates = [currentDate];
      while (currentDate.getTime() < this._toDt.getTime()) {
        currentDate = new Date(currentDate.getTime());
        switch (unitAndStep.unit) {
          case "year":
            currentDate.setFullYear(currentDate.getFullYear() + unitAndStep.step);
            break;
          case "month":
            currentDate.setMonth(currentDate.getMonth() + unitAndStep.step);
            break;
          case "day":
            currentDate.setDate(currentDate.getDate() + unitAndStep.step);
            break;
          case "hour":
            currentDate.setHours(currentDate.getHours() + unitAndStep.step);
            break;
          case "minute":
            currentDate.setMinutes(currentDate.getMinutes() + unitAndStep.step);
            break;
          case "second":
            currentDate.setSeconds(currentDate.getSeconds() + unitAndStep.step);
            break;
          case "millisecond":
            currentDate.setMilliseconds(currentDate.getMilliseconds() + unitAndStep.step);
            break;
          default:
            throw new Error(`unknown unit: ${unitAndStep.unit}`);
        }
        minorTickDates.push(currentDate);
      }
      return minorTickDates;
    }
    _formatDate(date, unit, labelFormats) {
      return format(date, labelFormats[unit]);
    }
  };

  // src/TempisTimeline.ts
  var TempisTimeline = class {
    constructor(context, options) {
      this._canvasContainerResizeObserver = null;
      var _a;
      this._options = options;
      this._canvas = this._getCanvas(context);
      this._rangeView = new TimelineRangeView(this._canvas, this._options.range);
      this._dataSet = new TimelineDataSet(() => this._onDataSetChange());
      this._dataView = new TimelineDataView(this._dataSet);
      this._font = new TimelineFont((_a = this._options.style) == null ? void 0 : _a.font);
      this._dataSet.createGroupings(this._options.items);
      this._resizeCanvas();
      if (options.responsive !== false) {
        this._createCanvasContainerResizeObserver();
      }
      this._createCanvasEventHandlers();
      this._draw();
    }
    _getCanvas(context) {
      if (!context) {
        throw new Error(`no canvas defined`);
      } else if (context instanceof HTMLCanvasElement) {
        return context;
      } else if (typeof context === "string") {
        const targetElement = document.querySelector(context);
        if (!targetElement || !(targetElement instanceof HTMLCanvasElement)) {
          throw new Error(`no HTMLCanvasElement element matching selector ${context}`);
        }
        return targetElement;
      }
      throw new Error("whatcha doing this isn't a valid value!");
    }
    _createCanvasContainerResizeObserver() {
      const canvasContainerElement = this._canvas.parentElement;
      if (!canvasContainerElement) {
        throw new Error("Cannot resize canvas as it has no parent element, is it detached?");
      }
      this._canvasContainerResizeObserver = new ResizeObserver(() => {
        this._resizeCanvas();
        this._draw();
      });
      this._canvasContainerResizeObserver.observe(canvasContainerElement);
    }
    _createCanvasEventHandlers() {
      const getMousePos = (evt) => {
        var rect = this._canvas.getBoundingClientRect();
        return {
          x: (evt.clientX - rect.left) / (rect.right - rect.left) * this._canvas.clientWidth,
          y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * this._canvas.clientHeight
        };
      };
      this._canvas.addEventListener("wheel", (evt) => {
        this._rangeView.zoomRange(evt.deltaY);
        this._draw();
      });
      let isMouseDown = false;
      this._canvas.addEventListener("mousedown", (evt) => {
        isMouseDown = true;
      }, false);
      this._canvas.addEventListener("mouseup", (evt) => {
        isMouseDown = false;
      }, false);
      this._canvas.addEventListener("mouseleave", (evt) => {
        isMouseDown = false;
      }, false);
      this._canvas.addEventListener("mousemove", (evt) => {
        if (isMouseDown) {
          if (Math.abs(evt.movementX) >= 1) {
            this._rangeView.moveByXMovement(-evt.movementX);
          }
          if (Math.abs(evt.movementY) >= 1) {
            this._dataView.scrollByYMovement(evt.movementY);
          }
          this._draw();
        }
      }, false);
      this._canvas.addEventListener("click", (evt) => {
        const clickedItem = this._dataView.getItemAtPoint(getMousePos(evt));
        if (clickedItem) {
          console.log(`clicked item ${clickedItem.caption}`);
        }
      }, false);
      this._canvas.addEventListener("dblclick", (evt) => {
        const clickedItem = this._dataView.getItemAtPoint(getMousePos(evt));
        if (clickedItem) {
          console.log(`double clicked item ${clickedItem.caption}`);
        }
      }, false);
    }
    _resizeCanvas() {
      if (this._options.responsive === false) {
        return;
      }
      const canvasContainerElement = this._canvas.parentElement;
      if (!canvasContainerElement) {
        throw new Error("Cannot resize canvas as it has no parent element, is it detached?");
      }
      const canvasContext = this._canvas.getContext("2d");
      this._canvas.style.width = canvasContainerElement.getBoundingClientRect().width + "px";
      this._canvas.style.height = canvasContainerElement.getBoundingClientRect().height + "px";
      const dpr = window.devicePixelRatio || 1;
      this._canvas.width = this._canvas.offsetWidth * dpr;
      this._canvas.height = this._canvas.offsetHeight * dpr;
      canvasContext.scale(dpr, dpr);
      this._rangeView.calculateMinorAndMajorUnitTicks();
    }
    _onDataSetChange() {
      if (this._dataSet.minDate && this._dataSet.maxDate) {
        this._rangeView.setRange(this._dataSet.minDate, this._dataSet.maxDate);
      } else {
        this._rangeView.clearRange();
      }
    }
    _draw() {
      var context = this._canvas.getContext("2d");
      context.clearRect(0, 0, this._canvas.clientWidth, this._canvas.clientHeight);
      context.font = this._font.font;
      const rangeViewHeight = this._rangeView.calculateRequiredHeight();
      const dataViewYPosition = ["top", "both"].includes(this._rangeView.position) ? rangeViewHeight : 0;
      const dataViewMaxHeight = this._canvas.clientHeight - dataViewYPosition - (["bottom", "both"].includes(this._rangeView.position) ? rangeViewHeight : 0);
      const dataViewHeight = this._dataView.draw(context, this._rangeView, dataViewYPosition, dataViewMaxHeight);
      let totalRenderHeight = dataViewHeight;
      if (["top", "both"].includes(this._rangeView.position)) {
        this._rangeView.draw(context, 0, "top");
        totalRenderHeight += rangeViewHeight;
      }
      if (["bottom", "both"].includes(this._rangeView.position)) {
        this._rangeView.draw(context, dataViewYPosition + dataViewHeight, "bottom");
        totalRenderHeight += rangeViewHeight;
      }
      context.clearRect(0, totalRenderHeight, this._canvas.clientWidth, this._canvas.clientHeight - totalRenderHeight);
    }
  };
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=tempis_timeline.js.map
