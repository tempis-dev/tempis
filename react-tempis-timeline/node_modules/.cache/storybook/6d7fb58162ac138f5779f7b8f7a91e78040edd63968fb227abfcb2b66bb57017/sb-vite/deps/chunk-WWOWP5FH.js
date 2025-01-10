import {
  require_isObject
} from "./chunk-CN4Y6LVA.js";
import {
  require_baseGetTag
} from "./chunk-ZHZVNHID.js";
import {
  __commonJS
} from "./chunk-LK32TJAX.js";

// node_modules/lodash/isFunction.js
var require_isFunction = __commonJS({
  "node_modules/lodash/isFunction.js"(exports, module) {
    var baseGetTag = require_baseGetTag();
    var isObject = require_isObject();
    var asyncTag = "[object AsyncFunction]";
    var funcTag = "[object Function]";
    var genTag = "[object GeneratorFunction]";
    var proxyTag = "[object Proxy]";
    function isFunction(value) {
      if (!isObject(value)) {
        return false;
      }
      var tag = baseGetTag(value);
      return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
    }
    module.exports = isFunction;
  }
});

export {
  require_isFunction
};
//# sourceMappingURL=chunk-WWOWP5FH.js.map
