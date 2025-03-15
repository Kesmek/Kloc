"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _normalizer = require("./normalizer");
Object.keys(_normalizer).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _normalizer[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _normalizer[key];
    }
  });
});
var _unistyles = require("./unistyles");
Object.keys(_unistyles).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _unistyles[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _unistyles[key];
    }
  });
});
var _color = require("./color");
Object.keys(_color).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _color[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _color[key];
    }
  });
});
//# sourceMappingURL=index.js.map