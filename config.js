import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

export default class Config {
  constructor() {
    const filepath = GLib.build_filenamev([
      GLib.get_home_dir(),
      '.config',
      'gnome-scratchpad',
      'config.json'
    ]);
    this.file = Gio.File.new_for_path(filepath);
    this.decoder = new TextDecoder('utf-8');
  }

  parse() {
    const [ok, data, _] = this.file.load_contents(null);
    return JSON.parse(this.decoder.decode(data));
  }
}

