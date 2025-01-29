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

  // src/TimelineItem.ts
  var TimelineItem = class {
    constructor(definition) {
      var _a;
      this._id = definition.id;
      this._caption = (_a = definition.caption) != null ? _a : "";
      this._start = parseDate(definition.start);
      this._end = parseDate(definition.end);
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
  };

  // src/TimelineItemGrouping.ts
  var TimelineItemGrouping = class {
    constructor(group, items) {
      this._group = group;
      this._items = items.map((itemDefinition) => new TimelineItem(itemDefinition));
    }
    get group() {
      return this._group;
    }
    get items() {
      return this._items;
    }
  };

  // src/TimelineRange.ts
  var TimelineRange = class {
    constructor(options = {}) {
      this._fromDt = new Date(0);
      this._toDt = new Date(41024448e5);
      this._options = options;
    }
    setRange(from, to) {
      this._fromDt = from;
      this._toDt = to;
    }
    clear() {
      this.setRange(new Date(0), new Date(41024448e5));
    }
    draw(context) {
      const sensibleUnitAndStep = this._findSensibleMinorUnitAndStep();
      const minorTickDates = this._getMinorTickDates(sensibleUnitAndStep);
      console.log(minorTickDates);
    }
    _findSensibleMinorUnitAndStep(targetMinorTickCount = 5) {
      const millisDiff = this._toDt.getTime() - this._fromDt.getTime();
      const units = [
        { unit: "millisecond", factor: 1 },
        { unit: "second", factor: 1e3 },
        { unit: "minute", factor: 60 * 1e3 },
        { unit: "hour", factor: 60 * 60 * 1e3 },
        { unit: "day", factor: 24 * 60 * 60 * 1e3 },
        { unit: "week", factor: 7 * 24 * 60 * 60 * 1e3 },
        { unit: "month", factor: 30 * 24 * 60 * 60 * 1e3 },
        { unit: "year", factor: 365 * 24 * 60 * 60 * 1e3 }
      ];
      const unitMinorTickCounts = [];
      units.forEach(({ unit, factor }) => {
        [1, 2, 5, 10, 20, 50, 100].forEach((step) => {
          unitMinorTickCounts.push({ unit, ticks: millisDiff / factor / step, step });
        });
      });
      unitMinorTickCounts.sort((a, b) => {
        return Math.abs(a.ticks - targetMinorTickCount) - Math.abs(b.ticks - targetMinorTickCount);
      });
      return { unit: unitMinorTickCounts[0].unit, step: unitMinorTickCounts[0].step };
    }
    _getMinorTickDates(unitAndStep) {
      let currentDate;
      if (unitAndStep.unit === "year") {
        currentDate = new Date(this._fromDt.getFullYear(), 0);
      } else if (unitAndStep.unit === "month") {
        currentDate = new Date(this._fromDt.getFullYear(), this._fromDt.getMonth());
      } else if (unitAndStep.unit === "week") {
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
        throw new Error("unknown unit!");
      }
      const minorTickDates = [currentDate];
      while (currentDate.getTime() < this._toDt.getTime()) {
        currentDate = new Date(currentDate.getTime());
        if (unitAndStep.unit === "year") {
          currentDate.setFullYear(currentDate.getFullYear() + unitAndStep.step);
        }
        if (unitAndStep.unit === "month") {
          currentDate.setMonth(currentDate.getMonth() + unitAndStep.step);
        }
        if (unitAndStep.unit === "week") {
        }
        if (unitAndStep.unit === "day") {
          currentDate.setDate(currentDate.getDate() + unitAndStep.step);
        }
        if (unitAndStep.unit === "hour") {
          currentDate.setHours(currentDate.getHours() + unitAndStep.step);
        }
        if (unitAndStep.unit === "minute") {
          currentDate.setMinutes(currentDate.getMinutes() + unitAndStep.step);
        }
        if (unitAndStep.unit === "second") {
          currentDate.setSeconds(currentDate.getSeconds() + unitAndStep.step);
        }
        if (unitAndStep.unit === "millisecond") {
          currentDate.setMilliseconds(currentDate.getMilliseconds() + unitAndStep.step);
        }
        minorTickDates.push(currentDate);
      }
      return minorTickDates;
    }
  };

  // src/TempisTimeline.ts
  var TempisTimeline = class {
    constructor(context, options) {
      this._canvasContainerResizeObserver = null;
      this._itemGroupings = [];
      this._options = options;
      this._canvas = this._getCanvas(context);
      this._range = new TimelineRange(this._options.range);
      this._createItemGroupings();
      this._setRange();
      this._resizeCanvas();
      if (options.responsive !== false) {
        this._createCanvasContainerResizeObserver();
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
    _createItemGroupings() {
      var _a, _b;
      this._itemGroupings = [];
      const itemGroupingMap = {};
      for (const itemDefinition of (_a = this._options.items) != null ? _a : []) {
        const groupingKey = (_b = itemDefinition.grouping) != null ? _b : "";
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
    }
    _setRange() {
      if (this._itemGroupings.length === 0 || this._itemGroupings[0].items.length === 0) {
        this._range.clear();
        return;
      }
      let minDate = null;
      let maxDate = null;
      for (const grouping of this._itemGroupings) {
        for (const item of grouping.items) {
          if (minDate === null || item.start.getTime() < minDate.getTime()) {
            minDate = item.start;
          }
          if (maxDate === null || item.end.getTime() > maxDate.getTime()) {
            maxDate = item.end;
          }
        }
      }
      this._range.setRange(minDate, maxDate);
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
    _resizeCanvas() {
      if (this._options.responsive === false) {
        return;
      }
      const canvasContainerElement = this._canvas.parentElement;
      if (!canvasContainerElement) {
        throw new Error("Cannot resize canvas as it has no parent element, is it detached?");
      }
      this._canvas.width = canvasContainerElement.getBoundingClientRect().width;
      this._canvas.height = canvasContainerElement.getBoundingClientRect().height;
    }
    _draw() {
      var context = this._canvas.getContext("2d");
      context.fillStyle = "black";
      context.font = "12px Arial";
      context.fillText(`Got ${this._itemGroupings.length} groups!!!!`, 0, 50);
      context.globalCompositeOperation = "destination-over";
      context.fillStyle = "#00FFFF";
      context.fillRect(0, 0, this._canvas.width, this._canvas.height);
      context.globalCompositeOperation = "source-over";
      context.lineWidth = 2;
      context.strokeStyle = "#FF0000";
      context.strokeRect(0, 0, this._canvas.width, this._canvas.height);
      this._range.draw(context);
    }
  };
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=tempis_timeline.js.map
