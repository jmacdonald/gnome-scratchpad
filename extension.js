import St from 'gi://St';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';


export default class ScratchpadExtension extends Extension {
    enable() {
        console.warn("enabling scratchpad extension");
        this._settings = this.getSettings();
        this._settings.connect('changed::window-width', (settings, key) => {
            console.warn(`${key} = ${this.window_width().print(true)}`);
        });
        this._settings.connect('changed::window-height', (settings, key) => {
            console.warn(`${key} = ${this.window_height().print(true)}`);
        });
    }

    window_width() {
        return this._settings.get_value('window-width');
    }

    window_height() {
        return this._settings.get_value('window-height');
    }

    disable() {
        console.warn("disabling scratchpad extension");
        this._settings = null;
    }
}
