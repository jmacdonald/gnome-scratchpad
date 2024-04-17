import Gio from 'gi://Gio';
import Adw from 'gi://Adw';

import {ExtensionPreferences, gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';


export default class ScratchpadPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        // Create a preferences page, with a single group
        const page = new Adw.PreferencesPage({
            title: _('General'),
            icon_name: 'dialog-information-symbolic',
        });
        window.add(page);

        page.add(this._appearanceGroup());
        page.add(this._appsGroup());
    }

    _appsGroup() {
        const group = new Adw.PreferencesGroup({
            title: _('Scratchpad apps'),
            description: _('Configure apps and their key bindings'),
        });

        const settings = this.getSettings();
        const apps = settings.get_value('apps').unpack();
        for (const app of apps) {
            const [name, binding] = app.recursiveUnpack();
            group.add(new Adw.ActionRow({ title: _(name) }));
        }

        return group;
    }

    _appearanceGroup() {
        const group = new Adw.PreferencesGroup({
            title: _('Appearance'),
            description: _('Configure the appearance of scratchpad windows'),
        });

        // Create scratchpad window dimension configuration rows
        const widthRow = new Adw.EntryRow({
            title: _('Window width')
        });
        group.add(widthRow);
        const heightRow = new Adw.EntryRow({
            title: _('Window height')
        });
        group.add(heightRow);

        // Binding row inputs to settings object
        const settings = this.getSettings();
        settings.bind('window-width', widthRow, 'text',
            Gio.SettingsBindFlags.DEFAULT);
        settings.bind('window-height', heightRow, 'text',
            Gio.SettingsBindFlags.DEFAULT);

        return group;
    }
}
