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

  // src/TimelineDataView.ts
  var TimelineDataView = class {
    constructor() {
      this._itemGroupings = [];
    }
    setGroupings(groupings) {
      this._itemGroupings = groupings;
    }
    scrollByYMovement(movementY) {
    }
    draw(context, range) {
      const height = context.canvas.height - range.calculateRequiredHeight();
      context.fillStyle = "#F6F5F5";
      context.fillRect(0, 0, context.canvas.width, height);
      this._drawMinorUnitBars(context, range.minorTicks, height);
    }
    _drawMinorUnitBars(context, rangeMinorTicks, height) {
      context.lineWidth = 1;
      context.strokeStyle = "#c2c2c2";
      context.setLineDash([3, 3]);
      context.beginPath();
      for (const { xPosition } of rangeMinorTicks) {
        context.moveTo(xPosition, 0);
        context.lineTo(xPosition, height);
      }
      context.stroke();
      context.setLineDash([]);
    }
  };
  TimelineDataView._minimumHeight = 50;

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
      this._fromDt = from;
      this._toDt = to;
      this.calculateMinorAndMajorUnitTicks();
    }
    moveByXMovement(movementX) {
      const rangeXMillisValue = (this._toDt.getTime() - this._fromDt.getTime()) / this._canvas.width;
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
    clear() {
      this.setRange(new Date(0), new Date(41024448e5));
    }
    calculateRequiredHeight() {
      return 50;
    }
    calculateMinorAndMajorUnitTicks() {
      const minorTargetTickCount = Math.floor(this._canvas.width / 120);
      const majorTargetTickCount = Math.floor(this._canvas.width / 320);
      const milliRenderWidth = this._canvas.width / (this._toDt.getTime() - this._fromDt.getTime());
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
      console.log({
        minorUnit: this._minorTickUnitAndStep.unit,
        minorStep: this._minorTickUnitAndStep.step,
        majorUnit: this._majorTickUnitAndStep.unit,
        majorStep: this._majorTickUnitAndStep.step
      });
    }
    draw(context) {
      var sizeWidth = context.canvas.clientWidth;
      var sizeHeight = context.canvas.clientHeight;
      const rangeContainerHeight = this.calculateRequiredHeight();
      const rangeContainerWidth = sizeWidth;
      const isMinorUnitDate = ["year", "month", "day"].includes(this._minorTickUnitAndStep.unit);
      const isMajorUnitDate = ["year", "month", "day"].includes(this._majorTickUnitAndStep.unit);
      for (const { date, xPosition } of this._minorUnitTicks) {
        const tickY = sizeHeight - rangeContainerHeight;
        context.lineWidth = 0.5;
        context.beginPath();
        context.moveTo(xPosition, tickY);
        context.lineTo(xPosition, tickY + rangeContainerHeight / 2);
        context.stroke();
        context.lineWidth = 0.5;
        context.font = "16px Arial";
        context.fillStyle = "#595959";
        context.beginPath();
        context.fillText(isMinorUnitDate ? date.toLocaleDateString() : date.toLocaleTimeString(), xPosition + 3, tickY + 18);
        context.stroke();
      }
      for (const { date, xPosition } of this._majorUnitTicks) {
        const tickY = sizeHeight - rangeContainerHeight;
        context.lineWidth = 0.5;
        context.beginPath();
        context.moveTo(xPosition, tickY + rangeContainerHeight / 2);
        context.lineTo(xPosition, tickY + rangeContainerHeight);
        context.stroke();
        context.lineWidth = 0.5;
        context.font = "16px Arial";
        context.fillStyle = "#595959";
        context.beginPath();
        context.fillText(isMajorUnitDate ? date.toLocaleDateString() : date.toLocaleTimeString(), xPosition + 3, tickY + 43);
        context.stroke();
      }
      context.lineWidth = 1;
      context.strokeStyle = "#8a8a8a";
      context.beginPath();
      context.rect(0, sizeHeight - rangeContainerHeight, sizeWidth, rangeContainerHeight);
      context.stroke();
      context.lineWidth = 0.5;
      context.beginPath();
      context.moveTo(0, sizeHeight - rangeContainerHeight / 2);
      context.lineTo(rangeContainerWidth, sizeHeight - rangeContainerHeight / 2);
      context.stroke();
    }
    _findSensibleUnitAndStep(targetTickCount, minorUnit) {
      const millisDiff = this._toDt.getTime() - this._fromDt.getTime();
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
      unitTickCounts.sort((a, b) => {
        return Math.abs(a.ticks - targetTickCount) - Math.abs(b.ticks - targetTickCount);
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
  };

  // src/TempisTimeline.ts
  var TempisTimeline = class {
    constructor(context, options) {
      this._canvasContainerResizeObserver = null;
      this._itemGroupings = [];
      this._options = options;
      this._canvas = this._getCanvas(context);
      this._range = new TimelineRange(this._canvas, this._options.range);
      this._dataView = new TimelineDataView();
      this._createItemGroupings();
      this._resizeCanvas();
      this._setRange();
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
      this._dataView.setGroupings(this._itemGroupings);
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
    _createCanvasEventHandlers() {
      const getMousePos = (evt) => {
        var rect = this._canvas.getBoundingClientRect();
        return {
          x: (evt.clientX - rect.left) / (rect.right - rect.left) * this._canvas.width,
          y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * this._canvas.height
        };
      };
      this._canvas.addEventListener("wheel", (evt) => {
        this._range.zoomRange(evt.deltaY);
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
            this._range.moveByXMovement(-evt.movementX);
          }
          if (Math.abs(evt.movementY) >= 1) {
            this._dataView.scrollByYMovement(evt.movementY);
          }
          this._draw();
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
      this._canvas.width = canvasContainerElement.getBoundingClientRect().width;
      this._canvas.height = canvasContainerElement.getBoundingClientRect().height;
      this._range.calculateMinorAndMajorUnitTicks();
    }
    _draw() {
      var context = this._canvas.getContext("2d");
      context.clearRect(0, 0, this._canvas.width, this._canvas.height);
      const maxDataViewHeight = this._canvas.height - this._range.calculateRequiredHeight();
      this._dataView.draw(context, this._range);
      this._range.draw(context);
    }
  };
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=tempis_timeline.js.map
