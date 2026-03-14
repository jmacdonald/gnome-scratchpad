import { Extension } from "resource:///org/gnome/shell/extensions/extension.js";
import Gio from "gi://Gio";
import Config from "./config.js";
import KeyBinder from "./keybinder.js";
import Window from "./window.js";

export default class ScratchpadExtension extends Extension {
  enable() {
    log("[gnome-scratchpad] enabling extension");
    this.config = new Config().parse();
    this.keyBinder = new KeyBinder();
    this.applyBindings();
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
  }

  toggleWindow(binding) {
    let win = Window.find(binding);

    if (!win) {
      if (binding.launch_cmd && !this._launching) {
        this._launching = true;
        const cmd = binding.launch_cmd.split(' ');
        try {
          Gio.Subprocess.new(cmd, Gio.SubprocessFlags.NONE);
        } catch (e) {
          log(
            `[gnome-scratchpad] failed to launch [cmd=${binding.launch_cmd}]: ${e.message}`)
        } finally {
          setTimeout(() => { this._launching = false; }, 1000);
        }
      }

      return;
    }

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
