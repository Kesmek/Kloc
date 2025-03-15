import { UnistylesModule } from './UnistylesModule';
import { UnistylesRuntime } from './UnistylesRuntime';
import { UnistyleRegistry } from './UnistyleRegistry';
import { UnistylesError, isTest, isWeb } from '../common';
import { UnistylesMockedBridge, UnistylesMockedRegistry, UnistylesMockedRuntime } from './mocks';
class Unistyles {
  constructor() {
    if (isTest) {
      this._bridge = new UnistylesMockedBridge();
      this._registry = new UnistylesMockedRegistry(this._bridge);
      this._runtime = new UnistylesMockedRuntime(this._bridge, this._registry);
      return;
    }
    const isInstalled = UnistylesModule?.install() ?? false;
    if (!isInstalled) {
      throw new Error(UnistylesError.RuntimeUnavailable);
    }

    // @ts-ignore
    // eslint-disable-next-line no-undef
    this._bridge = (isWeb ? globalThis : global).__UNISTYLES__;
    this._registry = new UnistyleRegistry(this._bridge);
    this._runtime = new UnistylesRuntime(this._bridge, this._registry);
  }
  get registry() {
    return this._registry;
  }
  get runtime() {
    return this._runtime;
  }
}
export const unistyles = new Unistyles();
//# sourceMappingURL=Unistyles.js.map