import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import Config from './config.js';
import KeyBinder from './keybinder.js';
import Window from './window.js';
import WindowFilter from './window_filter.js';

export default class ScratchpadExtension extends Extension {
  enable() {
    log("[gnome-scratchpad] enabling extension");
    this.config = new Config().parse();
    this.keyBinder = new KeyBinder();
    this.applyBindings();
    this.windowFilter = new WindowFilter(this.config.bindings);
  }

  applyBindings() {
    for (const binding of this.config.bindings) {
      this.keyBinder.listenFor(binding.keybind, () => {
        this.toggleWindow(binding);
      });
    }
    this.keyBinder.listenFor(this.config.hide_keybind, () => {
      this.hideWindows();
    });
  }

  disable() {
    log("[gnome-scratchpad] disabling extension");
    this.keyBinder.clearBindings();
    this.windowFilter.remove();
  }

  toggleWindow(binding) {
    let win = Window.find(binding);

    if (win === null) { return; }

    if (win.focused()) {
      win.hide();
    } else {
      win.arrange(this.config.window_width, this.config.window_height);
      win.show();
    }
  }

  hideWindows() {
    for (const binding of this.config.bindings) {
      Window.find(binding)?.hide();
    }
  }
}
