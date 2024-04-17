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

        const group = new Adw.PreferencesGroup({
            title: _('Appearance'),
            description: _('Configure the appearance of scratchpad windows'),
        });
        page.add(group);

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
        window._settings = this.getSettings();
        window._settings.bind('window-width', widthRow, 'text',
            Gio.SettingsBindFlags.DEFAULT);
        window._settings.bind('window-height', heightRow, 'text',
            Gio.SettingsBindFlags.DEFAULT);
    }
}