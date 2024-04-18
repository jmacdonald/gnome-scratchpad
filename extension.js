import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import Config from './config.js';

export default class ScratchpadExtension extends Extension {
    enable() {
        console.warn("enabling scratchpad extension");
        this.config = new Config().parse();
    }

    disable() {
        console.warn("disabling scratchpad extension");
    }
}
