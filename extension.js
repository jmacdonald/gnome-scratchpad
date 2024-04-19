import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import Config from './config.js';
import KeyBinder from './keybinder.js';
import Window from './window.js';

export default class ScratchpadExtension extends Extension {
  enable() {
    console.warn("enabling scratchpad extension");
    this.config = new Config().parse();
    this.keyBinder = new KeyBinder();
    this.applyBindings();
  }

  applyBindings() {
    for (const binding of this.config.bindings) {
      this.keyBinder.listenFor(binding.keybind, () => {
        this.toggleWindow(binding.app);
      });
    }
    this.keyBinder.listenFor(this.config.hide_keybind, () => {
      this.hideWindows();
    });
  }

  disable() {
    console.warn("disabling scratchpad extension");
    this.keyBinder.clearBindings();
  }

  toggleWindow(name) {
    let win = Window.find(name);

    if (win === null) { return; }

    if (win.focused()) {
      win.hide();
    } else {
      win.resize(this.config.window_width, this.config.window_height);
      win.center();
      win.show();
    }
  }

  hideWindows() {
    for (const binding of this.config.bindings) {
      Window.find(binding.app)?.hide();
    }
  }
}
