"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unistyles = void 0;
var _UnistylesModule = require("./UnistylesModule");
var _UnistylesRuntime = require("./UnistylesRuntime");
var _UnistyleRegistry = require("./UnistyleRegistry");
var _common = require("../common");
var _mocks = require("./mocks");
class Unistyles {
  constructor() {
    if (_common.isTest) {
      this._bridge = new _mocks.UnistylesMockedBridge();
      this._registry = new _mocks.UnistylesMockedRegistry(this._bridge);
      this._runtime = new _mocks.UnistylesMockedRuntime(this._bridge, this._registry);
      return;
    }
    const isInstalled = _UnistylesModule.UnistylesModule?.install() ?? false;
    if (!isInstalled) {
      throw new Error(_common.UnistylesError.RuntimeUnavailable);
    }

    // @ts-ignore
    // eslint-disable-next-line no-undef
    this._bridge = (_common.isWeb ? globalThis : global).__UNISTYLES__;
    this._registry = new _UnistyleRegistry.UnistyleRegistry(this._bridge);
    this._runtime = new _UnistylesRuntime.UnistylesRuntime(this._bridge, this._registry);
  }
  get registry() {
    return this._registry;
  }
  get runtime() {
    return this._runtime;
  }
}
const unistyles = exports.unistyles = new Unistyles();
//# sourceMappingURL=Unistyles.js.map