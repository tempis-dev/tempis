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
  function isNullOrUndefined(value) {
    return value === null || value === void 0;
  }
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
    if (min !== void 0 && value < min) {
      return min;
    }
    if (max !== void 0 && value > max) {
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
  function defaults(...sources) {
    if (sources.length === 0)
      return void 0;
    const target = sources[0];
    for (let i = 1; i < sources.length; i++) {
      const source = sources[i];
      if (!source)
        continue;
      Object.keys(source).forEach((key) => {
        const typedKey = key;
        if (target[typedKey] == null) {
          target[typedKey] = source[typedKey];
        }
      });
    }
    return target;
  }

  // src/TimelineItemGrouping.ts
  var TimelineItemGrouping = class {
    constructor(group, items) {
      this._group = group;
      this._items = items;
      this._sortItemsByStartDate();
    }
    get group() {
      return this._group;
    }
    get items() {
      return this._items;
    }
    get selectedItems() {
      return this.items.filter((item) => item.isSelected);
    }
    getItemById(id) {
      var _a;
      return (_a = this._items.find((item) => item.id === id)) != null ? _a : null;
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

  // src/TimelineItemCategory.ts
  var TimelineItemCategory = class {
    constructor(name, style) {
      this._name = name;
      this._style = style;
    }
    get name() {
      return this._name;
    }
    get style() {
      return this._style;
    }
  };

  // src/ColorPalette.ts
  var defaultGlobalPalette = [
    "#7cb620",
    "#1982C4",
    "#6A4C93",
    "#FF595E",
    "#e2b436",
    "#BDBF09",
    "#2292A4",
    "#79B791",
    "#87255B",
    "#B370B0",
    "#646536",
    "#254441",
    "#EC4E20",
    "#429EA6"
  ];
  function getGlobalPalette() {
    return defaultGlobalPalette;
  }

  // src/TimelineItem.ts
  var DEFAULT_ITEM_STYLE = {
    backgroundColor: "#1a006eff",
    fontColor: "#FFFFFF",
    padding: 12,
    borderRadius: 5
  };
  var TimelineItem = class {
    constructor(definition, style) {
      var _a;
      this._definition = definition;
      this._id = definition.id;
      this._caption = (_a = definition.caption) != null ? _a : "";
      this._start = parseDate(definition.start);
      this._end = definition.end ? parseDate(definition.end) : null;
      this._style = style;
      this._isSelected = !!definition.selected;
    }
    get definition() {
      return this._definition;
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
    get isSelected() {
      return this._isSelected;
    }
    set isSelected(value) {
      this._isSelected = value;
    }
  };

  // src/TimelineDataSet.ts
  var TimelineDataSet = class {
    constructor() {
      this._groupings = [];
      this._categories = [];
      this._minDate = null;
      this._maxDate = null;
    }
    get groupings() {
      return [...this._groupings];
    }
    get categories() {
      return [...this._categories];
    }
    get minDate() {
      return this._minDate;
    }
    get maxDate() {
      return this._maxDate;
    }
    getItemById(id) {
      for (const group of this._groupings) {
        const item = group.getItemById(id);
        if (item) {
          return item;
        }
      }
      return null;
    }
    getCategory(name) {
      var _a;
      return (_a = this._categories.find((category) => category.name === name)) != null ? _a : null;
    }
    getSelectedItems() {
      const selectedItems = [];
      for (const group of this._groupings) {
        selectedItems.push(...group.selectedItems);
      }
      return selectedItems;
    }
    update(options) {
      this._createCategories(options);
      this._createGroupings(options);
    }
    _createCategories(options) {
      var _a, _b, _c;
      this._categories = [];
      const categoryNames = [];
      function* paletteCycle() {
        let paletteIndex = 0;
        const palette = getGlobalPalette();
        while (true) {
          yield palette[paletteIndex];
          paletteIndex = (paletteIndex + 1) % palette.length;
        }
      }
      const getNextPaletteColor = paletteCycle();
      for (const categoryDefinition of (_a = options.categories) != null ? _a : []) {
        if (!categoryDefinition.name) {
          continue;
        }
        if (categoryNames.includes(categoryDefinition.name)) {
          throw new Error(`Duplicate category name '${categoryDefinition.name}'`);
        }
        const categoryStyle = (_b = categoryDefinition.style) != null ? _b : {};
        categoryStyle.backgroundColor = (_c = categoryStyle.backgroundColor) != null ? _c : getNextPaletteColor.next().value;
        this._categories.push(new TimelineItemCategory(categoryDefinition.name, categoryStyle));
        categoryNames.push(categoryDefinition.name);
      }
    }
    _createGroupings(options) {
      var _a, _b;
      this._groupings = [];
      const itemGroupingMap = {};
      for (const itemDefinition of (_a = options.items) != null ? _a : []) {
        const groupingKey = (_b = itemDefinition.grouping) != null ? _b : "";
        let group = itemGroupingMap[groupingKey];
        if (!group) {
          group = [];
          itemGroupingMap[groupingKey] = group;
        }
        group.push(itemDefinition);
      }
      for (const [group, groupItemDefinitions] of Object.entries(itemGroupingMap)) {
        this._groupings.push(new TimelineItemGrouping(group, this._createGroupingItems(options, groupItemDefinitions)));
      }
      this._findMinAndMaxDates();
    }
    _createGroupingItems(options, itemDefinitions) {
      return itemDefinitions.map((itemDefinition) => {
        var _a, _b, _c, _d;
        const category = itemDefinition.category ? this.getCategory(itemDefinition.category) : null;
        const resolvedItemStyle = defaults((_a = itemDefinition.style) != null ? _a : {}, (_b = category == null ? void 0 : category.style) != null ? _b : {}, (_d = (_c = options.style) == null ? void 0 : _c.item) != null ? _d : {}, DEFAULT_ITEM_STYLE);
        return new TimelineItem(itemDefinition, resolvedItemStyle);
      });
    }
    _findMinAndMaxDates() {
      var _a, _b;
      if (this._groupings.length === 0 || this._groupings[0].items.length === 0) {
        this._minDate = null;
        this._maxDate = null;
        return;
      }
      let minDate = null;
      let maxDate = null;
      for (const grouping of this._groupings) {
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
  var MINIMUM_RENDERED_LABEL_WIDTH = 5;
  var TimelineDataView = class {
    constructor(dataSet) {
      this._scrollYOffset = 0;
      this._drawPlan = null;
      this._dataSet = dataSet;
    }
    scrollByYMovement(movementY) {
      this._scrollYOffset += movementY;
    }
    draw(context, range, yPosition, maxHeight, fillVertically) {
      this._drawPlan = this._createViewDrawPlan(context, range.fromDt, range.toDt);
      this._scrollYOffset = clamp(this._scrollYOffset, Math.min(0, maxHeight - this._drawPlan.height), 0);
      const viewHeight = fillVertically ? maxHeight : Math.min(this._drawPlan.height, maxHeight);
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
        for (const groupDrawPlanRow of groupDrawPlan.rows) {
          for (const itemDrawPlan of groupDrawPlanRow) {
            this._drawGroupItem(itemDrawPlan, context, scrolledYPosition);
          }
        }
      }
    }
    _drawGroupItem(itemDrawPlan, context, scrolledYPosition) {
      const itemFontColor = itemDrawPlan.item.style.fontColor;
      const itemBackgroundColor = itemDrawPlan.item.style.backgroundColor;
      const itemPadding = itemDrawPlan.item.style.padding;
      const itemBorderRadius = itemDrawPlan.item.style.borderRadius;
      const itemBorderThickness = itemDrawPlan.item.style.borderThickness;
      const itemBorderColor = itemDrawPlan.item.style.borderColor;
      if (itemDrawPlan.xPositionEnd - itemDrawPlan.xPositionStart < 1) {
        return;
      }
      if (itemDrawPlan.item.isSelected) {
        context.shadowColor = "rgba(0, 0, 0, 1)";
        context.shadowBlur = 15;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.fillStyle = "rgba(0, 0, 0, 1)";
        context.beginPath();
        context.roundRect(itemDrawPlan.xPositionStart, scrolledYPosition + itemDrawPlan.yPositionStart, itemDrawPlan.xPositionEnd - itemDrawPlan.xPositionStart, itemDrawPlan.yPositionEnd - itemDrawPlan.yPositionStart, itemBorderRadius);
        context.fill();
        context.shadowColor = "transparent";
      }
      if (itemDrawPlan.xPointInTimePosition !== null) {
        context.lineWidth = 2;
        context.fillStyle = itemBorderThickness && itemBorderColor ? itemBorderColor : itemBackgroundColor;
        context.strokeStyle = itemBorderThickness && itemBorderColor ? itemBorderColor : itemBackgroundColor;
        const itemMarkerConnectorPath = new Path2D();
        itemMarkerConnectorPath.moveTo(Math.max(itemDrawPlan.xPositionStart, itemDrawPlan.xPointInTimePosition - 20), scrolledYPosition + itemDrawPlan.yPositionStart + (itemDrawPlan.yPositionEnd - itemDrawPlan.yPositionStart) / 2);
        itemMarkerConnectorPath.lineTo(itemDrawPlan.xPointInTimePosition, scrolledYPosition + itemDrawPlan.yPositionEnd + 6);
        itemMarkerConnectorPath.lineTo(Math.min(itemDrawPlan.xPositionEnd, itemDrawPlan.xPointInTimePosition + 20), scrolledYPosition + itemDrawPlan.yPositionStart + (itemDrawPlan.yPositionEnd - itemDrawPlan.yPositionStart) / 2);
        context.fill(itemMarkerConnectorPath);
        context.beginPath();
        context.moveTo(itemDrawPlan.xPointInTimePosition, scrolledYPosition + itemDrawPlan.yPositionStart + (itemDrawPlan.yPositionEnd - itemDrawPlan.yPositionStart) / 2);
        context.lineTo(itemDrawPlan.xPointInTimePosition, 1e4);
        context.stroke();
      }
      context.fillStyle = itemBackgroundColor;
      context.beginPath();
      context.roundRect(itemDrawPlan.xPositionStart, scrolledYPosition + itemDrawPlan.yPositionStart, itemDrawPlan.xPositionEnd - itemDrawPlan.xPositionStart, itemDrawPlan.yPositionEnd - itemDrawPlan.yPositionStart, itemBorderRadius);
      context.fill();
      if (itemBorderThickness && itemBorderColor) {
        context.strokeStyle = itemBorderColor;
        context.lineWidth = itemBorderThickness;
        context.beginPath();
        context.roundRect(itemDrawPlan.xPositionStart + context.lineWidth / 2, scrolledYPosition + itemDrawPlan.yPositionStart + context.lineWidth / 2, itemDrawPlan.xPositionEnd - itemDrawPlan.xPositionStart - context.lineWidth, itemDrawPlan.yPositionEnd - itemDrawPlan.yPositionStart - +context.lineWidth, itemBorderRadius);
        context.stroke();
      }
      if (itemDrawPlan.item.caption) {
        const labelStartPositionX = Math.floor(Math.max(itemPadding, itemDrawPlan.xPositionStart + itemPadding));
        const maxLabelWidth = Math.max(0, Math.ceil(itemDrawPlan.xPositionEnd - itemPadding - labelStartPositionX));
        if (maxLabelWidth > MINIMUM_RENDERED_LABEL_WIDTH) {
          context.textBaseline = "middle";
          context.fillStyle = itemFontColor;
          context.beginPath();
          context.fillText(fitCanvasText(context, itemDrawPlan.item.caption, maxLabelWidth), labelStartPositionX, itemDrawPlan.yPositionStart + (itemDrawPlan.yPositionEnd - itemDrawPlan.yPositionStart) / 2 + 1 + scrolledYPosition);
          context.stroke();
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
      this._minDate = new Date(-864e13);
      this._maxDate = new Date(864e13);
      this._minorTickUnitAndStep = { unit: "year", step: 2 };
      this._majorTickUnitAndStep = { unit: "year", step: 10 };
      this._minorUnitTicks = [];
      this._majorUnitTicks = [];
      this._canvas = canvas;
      this._options = options;
      this._parseOptions();
    }
    get position() {
      var _a;
      return (_a = this._options.position) != null ? _a : "bottom";
    }
    get fromDt() {
      return new Date(this._fromDt.getTime());
    }
    get toDt() {
      return new Date(this._toDt.getTime());
    }
    get minorTicks() {
      return this._minorUnitTicks;
    }
    setRange(from, to) {
      this._setFromTime(from.getTime());
      this._setToTime(to.getTime());
      if (this._fromDt.getTime() === this._toDt.getTime()) {
        this._setFromTime(this._fromDt.getTime() - 60 * 1e3);
        this._setToTime(this._toDt.getTime() + 60 * 1e3);
      }
      this.calculateMinorAndMajorUnitTicks();
    }
    centerOnDate(date) {
      const currentRangeLength = this._toDt.getTime() - this._fromDt.getTime();
      this._fromDt.setTime(date.getTime() - currentRangeLength / 2);
      this._toDt.setTime(date.getTime() + currentRangeLength / 2);
      this.calculateMinorAndMajorUnitTicks();
    }
    moveByXMovement(movementX) {
      const currentRange = this._toDt.getTime() - this._fromDt.getTime();
      const rangeXMillisValue = currentRange / this._canvas.clientWidth;
      const targetFrom = this._fromDt.getTime() + rangeXMillisValue * movementX;
      const targetTo = this._toDt.getTime() + rangeXMillisValue * movementX;
      const minMaxRange = this._maxDate.getTime() - this._minDate.getTime();
      if (targetFrom < this._minDate.getTime() && currentRange < minMaxRange) {
        this._setFromTime(targetFrom);
        this._setToTime(this._fromDt.getTime() + currentRange);
      } else if (targetTo > this._maxDate.getTime() && currentRange < minMaxRange) {
        this._setToTime(targetTo);
        this._setFromTime(this._toDt.getTime() - currentRange);
      } else {
        this._setFromTime(targetFrom);
        this._setToTime(targetTo);
      }
      this.calculateMinorAndMajorUnitTicks();
    }
    zoomRange(amount, targetPositionX) {
      const targetPositionMillis = this._fromDt.getTime() + targetPositionX / this._canvas.clientWidth * (this._toDt.getTime() - this._fromDt.getTime());
      const zoomFactor = 1 - clamp(amount, -1, 1) * -0.1;
      this._fromDt.setTime(targetPositionMillis - (targetPositionMillis - this._fromDt.getTime()) * zoomFactor);
      this._toDt.setTime(targetPositionMillis + (this._toDt.getTime() - targetPositionMillis) * zoomFactor);
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
      const { minor: minorUnitAndStep, major: majorUnitAndStep } = this._findSensibleUnitsAndSteps(minorTargetTickCount, majorTargetTickCount);
      this._minorTickUnitAndStep = minorUnitAndStep;
      this._majorTickUnitAndStep = majorUnitAndStep;
      const minorTickDates = this._getTickDates(this._minorTickUnitAndStep);
      const majorTickDates = this._getTickDates(this._majorTickUnitAndStep);
      const milliRenderWidth = this._canvas.clientWidth / (this._toDt.getTime() - this._fromDt.getTime());
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
    _findSensibleUnitsAndSteps(minorTargetTickCount, majorTargetTickCount) {
      const getBestUnitAndStep = (units, targetTickCount) => {
        const millisDiff = this._toDt.getTime() - this._fromDt.getTime();
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
          return Math.abs(a2.ticks - Math.max(1, targetTickCount)) - Math.abs(b.ticks - Math.max(1, targetTickCount));
        });
        return { unit: unitTickCounts[0].unit, step: unitTickCounts[0].step };
      };
      const minorUnitAndStep = getBestUnitAndStep([
        { unit: "millisecond", factor: 1 },
        { unit: "second", factor: 1e3 },
        { unit: "minute", factor: 60 * 1e3 },
        { unit: "hour", factor: 60 * 60 * 1e3 },
        { unit: "day", factor: 24 * 60 * 60 * 1e3 },
        { unit: "month", factor: 30 * 24 * 60 * 60 * 1e3 },
        { unit: "year", factor: 365 * 24 * 60 * 60 * 1e3 }
      ], minorTargetTickCount);
      const majorUnitsAndFactors = [];
      if (minorUnitAndStep.unit === "millisecond") {
        majorUnitsAndFactors.push({ unit: "second", factor: 1e3 });
        majorUnitsAndFactors.push({ unit: "minute", factor: 60 * 1e3 });
        majorUnitsAndFactors.push({ unit: "hour", factor: 60 * 60 * 1e3 });
        majorUnitsAndFactors.push({ unit: "day", factor: 24 * 60 * 60 * 1e3 });
        majorUnitsAndFactors.push({ unit: "month", factor: 30 * 24 * 60 * 60 * 1e3 });
        majorUnitsAndFactors.push({ unit: "year", factor: 365 * 24 * 60 * 60 * 1e3 });
      } else if (minorUnitAndStep.unit === "second") {
        majorUnitsAndFactors.push({ unit: "minute", factor: 60 * 1e3 });
        majorUnitsAndFactors.push({ unit: "hour", factor: 60 * 60 * 1e3 });
        majorUnitsAndFactors.push({ unit: "day", factor: 24 * 60 * 60 * 1e3 });
        majorUnitsAndFactors.push({ unit: "month", factor: 30 * 24 * 60 * 60 * 1e3 });
        majorUnitsAndFactors.push({ unit: "year", factor: 365 * 24 * 60 * 60 * 1e3 });
      } else if (minorUnitAndStep.unit === "minute") {
        majorUnitsAndFactors.push({ unit: "hour", factor: 60 * 60 * 1e3 });
        majorUnitsAndFactors.push({ unit: "day", factor: 24 * 60 * 60 * 1e3 });
        majorUnitsAndFactors.push({ unit: "month", factor: 30 * 24 * 60 * 60 * 1e3 });
        majorUnitsAndFactors.push({ unit: "year", factor: 365 * 24 * 60 * 60 * 1e3 });
      } else if (minorUnitAndStep.unit === "hour") {
        majorUnitsAndFactors.push({ unit: "day", factor: 24 * 60 * 60 * 1e3 });
        majorUnitsAndFactors.push({ unit: "month", factor: 30 * 24 * 60 * 60 * 1e3 });
        majorUnitsAndFactors.push({ unit: "year", factor: 365 * 24 * 60 * 60 * 1e3 });
      } else if (minorUnitAndStep.unit === "day") {
        majorUnitsAndFactors.push({ unit: "month", factor: 30 * 24 * 60 * 60 * 1e3 });
        majorUnitsAndFactors.push({ unit: "year", factor: 365 * 24 * 60 * 60 * 1e3 });
      } else if (minorUnitAndStep.unit === "month") {
        majorUnitsAndFactors.push({ unit: "year", factor: 365 * 24 * 60 * 60 * 1e3 });
      } else if (minorUnitAndStep.unit === "year") {
        majorUnitsAndFactors.push({ unit: "year", factor: 365 * 24 * 60 * 60 * 1e3 });
      } else {
        throw new Error(`unknown minor unit: ${minorUnitAndStep.unit}`);
      }
      return {
        minor: minorUnitAndStep,
        major: getBestUnitAndStep(majorUnitsAndFactors, majorTargetTickCount)
      };
    }
    _getTickDates(unitAndStep) {
      let currentDate;
      if (unitAndStep.unit === "year" || unitAndStep.unit === "month") {
        currentDate = new Date(this._fromDt.getFullYear(), 0);
      } else if (unitAndStep.unit === "day") {
        currentDate = new Date(this._fromDt.getFullYear(), this._fromDt.getMonth());
      } else if (unitAndStep.unit === "hour") {
        currentDate = new Date(this._fromDt.getFullYear(), this._fromDt.getMonth(), this._fromDt.getDate());
      } else if (unitAndStep.unit === "minute") {
        currentDate = new Date(this._fromDt.getFullYear(), this._fromDt.getMonth(), this._fromDt.getDate(), this._fromDt.getHours());
      } else if (unitAndStep.unit === "second") {
        currentDate = new Date(this._fromDt.getFullYear(), this._fromDt.getMonth(), this._fromDt.getDate(), this._fromDt.getHours(), this._fromDt.getMinutes());
      } else if (unitAndStep.unit === "millisecond") {
        currentDate = new Date(this._fromDt.getFullYear(), this._fromDt.getMonth(), this._fromDt.getDate(), this._fromDt.getHours(), this._fromDt.getMinutes(), this._fromDt.getSeconds());
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
    _parseOptions() {
      this._minDate = isNullOrUndefined(this._options.min) ? new Date(-864e13) : parseDate(this._options.min);
      this._maxDate = isNullOrUndefined(this._options.max) ? new Date(864e13) : parseDate(this._options.max);
    }
    _setFromTime(time) {
      this._fromDt.setTime(clamp(time, this._minDate.getTime(), this._maxDate.getTime()));
    }
    _setToTime(time) {
      this._toDt.setTime(clamp(time, this._minDate.getTime(), this._maxDate.getTime()));
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
      this._dataSet = new TimelineDataSet();
      this._dataView = new TimelineDataView(this._dataSet);
      this._font = new TimelineFont((_a = this._options.style) == null ? void 0 : _a.font);
      this._dataSet.update(this._options);
      this._onInitialDataSetChange();
      this._resizeCanvas();
      if (options.responsive !== false) {
        this._createCanvasContainerResizeObserver();
      }
      this._createCanvasEventHandlers();
      this._draw();
    }
    get _selectionMode() {
      var _a;
      return (_a = this._options.selection) != null ? _a : "none";
    }
    getSelection() {
      return this._dataSet.getSelectedItems().map((item) => item.id);
    }
    setItems(items) {
      this._options.items = items;
      this._dataSet.update(this._options);
      this._draw();
    }
    focus(options) {
      if (!options) {
        if (this._dataSet.minDate && this._dataSet.maxDate) {
          this._rangeView.setRange(this._dataSet.minDate, this._dataSet.maxDate);
        }
      } else if (!isNullOrUndefined(options.id)) {
        const item = this._dataSet.getItemById(options.id);
        if (!item) {
          throw new Error(`No item found with ID ${options.id}`);
        } else if (item.end) {
          this._rangeView.setRange(item.start, item.end);
        } else {
          this._rangeView.centerOnDate(item.start);
        }
      } else if (!isNullOrUndefined(options.date)) {
        const date = parseDate(options.date);
        this._rangeView.centerOnDate(date);
      } else if (options.range && options.range.length === 2) {
        const start = parseDate(options.range[0]);
        const end = parseDate(options.range[1]);
        this._rangeView.setRange(start, end);
      }
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
      this._canvas.style.touchAction = "none";
      const dragPixelThreshold = 10;
      let isPointerDown = false;
      let startX = 0;
      let startY = 0;
      const getMouseOrPointerPosition = (event) => {
        var rect = this._canvas.getBoundingClientRect();
        return {
          x: (event.clientX - rect.left) / (rect.right - rect.left) * this._canvas.clientWidth,
          y: (event.clientY - rect.top) / (rect.bottom - rect.top) * this._canvas.clientHeight
        };
      };
      this._canvas.addEventListener("pointerdown", (event) => {
        isPointerDown = true;
        startX = event.clientX;
        startY = event.clientY;
        this._canvas.setPointerCapture(event.pointerId);
      });
      this._canvas.addEventListener("pointermove", (event) => {
        if (!isPointerDown) {
          return;
        }
        if (Math.abs(event.movementX) >= 1) {
          this._rangeView.moveByXMovement(-event.movementX);
        }
        if (Math.abs(event.movementY) >= 1) {
          this._dataView.scrollByYMovement(event.movementY);
        }
        this._draw();
      });
      this._canvas.addEventListener("pointerup", (event) => {
        if (!isPointerDown) {
          return;
        }
        isPointerDown = false;
        const dx = event.clientX - startX;
        const dy = event.clientY - startY;
        if (Math.sqrt(dx * dx + dy * dy) < dragPixelThreshold) {
          const clickedItem = this._dataView.getItemAtPoint(getMouseOrPointerPosition(event));
          if (clickedItem) {
            this._onItemClicked(clickedItem);
          } else {
            this._onCanvasClicked();
          }
        }
        this._canvas.releasePointerCapture(event.pointerId);
      });
      this._canvas.addEventListener("pointercancel", () => {
        isPointerDown = false;
      });
      this._canvas.addEventListener("wheel", (event) => {
        event.preventDefault();
        this._rangeView.zoomRange(event.deltaY, getMouseOrPointerPosition(event).x);
        this._draw();
      });
      this._canvas.addEventListener("dblclick", (evt) => {
        const clickedItem = this._dataView.getItemAtPoint(getMouseOrPointerPosition(evt));
        if (clickedItem) {
          this._onItemDoubleClicked(clickedItem);
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
    _draw() {
      var context = this._canvas.getContext("2d");
      context.clearRect(0, 0, this._canvas.clientWidth, this._canvas.clientHeight);
      context.font = this._font.font;
      const rangeViewHeight = this._rangeView.calculateRequiredHeight();
      const dataViewYPosition = ["top", "both"].includes(this._rangeView.position) ? rangeViewHeight : 0;
      const dataViewMaxHeight = this._canvas.clientHeight - dataViewYPosition - (["bottom", "both"].includes(this._rangeView.position) ? rangeViewHeight : 0);
      const dataViewHeight = this._dataView.draw(context, this._rangeView, dataViewYPosition, dataViewMaxHeight, !!this._options.fillVertically);
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
    _onCanvasClicked() {
      if (this._selectionMode === "none") {
        return;
      }
      const selectedItems = this._dataSet.getSelectedItems();
      if (this._options.onSelectionChange) {
        if (selectedItems.length) {
          this._options.onSelectionChange(selectedItems.map((item) => ({ id: item.id, selected: false })));
        }
      } else {
        selectedItems.forEach((item) => item.isSelected = false);
        this._draw();
      }
    }
    _onItemClicked(item) {
      const isItemInitiallySelected = item.isSelected;
      if (this._selectionMode === "single") {
        const selectedItems = this._dataSet.getSelectedItems();
        const itemsToDeselect = selectedItems.filter((selectedItem) => selectedItem.id !== item.id);
        if (this._options.onSelectionChange) {
          const selectionChangeEvents = itemsToDeselect.map((item2) => ({ id: item2.id, selected: false }));
          if (!isItemInitiallySelected) {
            selectionChangeEvents.push({ id: item.id, selected: true });
          }
          if (selectionChangeEvents.length) {
            this._options.onSelectionChange(selectionChangeEvents);
          }
        } else {
          itemsToDeselect.forEach((selectedItem) => selectedItem.isSelected = false);
          item.isSelected = true;
          this._draw();
        }
      } else if (this._selectionMode === "multi") {
        if (this._options.onSelectionChange) {
          if (!isItemInitiallySelected) {
            this._options.onSelectionChange([{ id: item.id, selected: true }]);
          }
        } else {
          item.isSelected = true;
          this._draw();
        }
      }
      this._options.onItemClick && this._options.onItemClick(item.id);
    }
    _onItemDoubleClicked(item) {
      this._options.onItemDoubleClick && this._options.onItemDoubleClick(item.id);
    }
    _onInitialDataSetChange() {
      if (this._dataSet.minDate && this._dataSet.maxDate) {
        this._rangeView.setRange(this._dataSet.minDate, this._dataSet.maxDate);
      } else {
        this._rangeView.clearRange();
      }
    }
  };
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=tempis_timeline.js.map
