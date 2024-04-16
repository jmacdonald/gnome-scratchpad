import St from 'gi://St';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';


export default class ScratchpadExtension extends Extension {
    enable() {
        console.warn("enabling scratchpad extension");
    }

    disable() {
        console.warn("disabling scratchpad extension");
    }
}
