import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

export default class ScratchpadExtension extends Extension {
    enable() {
        console.warn("enabling scratchpad extension");
    }

    disable() {
        console.warn("disabling scratchpad extension");
    }
}
