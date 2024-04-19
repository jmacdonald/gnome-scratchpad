import Meta from 'gi://Meta';
import Shell from 'gi://Shell';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

export default class Keybinder {
  constructor() {
    this.bindings = new Map();

    global.display.connect(
      'accelerator-activated',
      (display, action, deviceId, timestamp) => {
        log(
          'Accelerator Activated: [display={}, action={}, deviceId={}, timestamp={}]',
          display, action, deviceId, timestamp
        );
        this._onAccelerator(action);
      }
    )
  }

  listenFor(keyCombination, callback) {
    log('Trying to listen for hot key [keyCombination={}]', keyCombination);
    let action = global.display.grab_accelerator(keyCombination, 0);

    if (action == Meta.KeyBindingAction.NONE) {
      log('Unable to grab accelerator [keyCombination={}]', keyCombination);
    } else {
      log('Grabbed accelerator [action={}]', action);
      let name = Meta.external_binding_name_for_action(action);
      log('Received binding name for action [name={}, action={}]',
        name, action);

      log('Requesting WM to allow binding [name={}]', name);
      Main.wm.allowKeybinding(name, Shell.ActionMode.ALL);

      this.bindings.set(action, {
        name: name,
        keyCombination: keyCombination,
        callback: callback,
        action: action
      });
    }
  }

  clearBindings() {
    for (let binding of this.bindings) {
      global.display.ungrab_accelerator(binding[1].action);
      Main.wm.allowKeybinding(binding[1].name, Shell.ActionMode.NONE);
    }
  }

  _onAccelerator(action) {
    let binding = this.bindings.get(action);

    if (binding) {
      this.bindings.get(action).callback();
    } else {
      log('No listeners [action={}]', action);
    }
  }
}
