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

  // src/TempisTimeline.ts
  var TempisTimeline = class {
    constructor(context, options) {
      this._canvasContainerResizeObserver = null;
      this._options = options;
      this._canvas = this._getCanvas(context);
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
      context.font = "50px Arial";
      context.fillText("Rendered!", 0, 50);
      context.globalCompositeOperation = "destination-over";
      context.fillStyle = "#00FFFF";
      context.fillRect(0, 0, this._canvas.width, this._canvas.height);
      context.globalCompositeOperation = "source-over";
      context.lineWidth = 2;
      context.strokeStyle = "#FF0000";
      context.strokeRect(0, 0, this._canvas.width, this._canvas.height);
    }
  };
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=tempis_timeline.js.map
