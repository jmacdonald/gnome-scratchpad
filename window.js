import Shell from 'gi://Shell';

export default class Window {
  static appSystem = Shell.AppSystem.get_default();

  static find(name) {
    let windows = [];

    // Find the Gnome window instance
    Window.appSystem.get_running().map(app => windows.push(...app.get_windows()));
    const win = windows.find(win => {
      return win.get_title() === name || win.get_wm_class_instance() === name
    });

    // Bail out when it doesn't exist
    if (win === undefined) {
      log(`Couldn't locate "${name}" window`);
      log(`Found these other windows:`);
      Window.logWindows();

      return null;
    }

    // Build a proper, instantiated window
    return new Window(win);
  }

  static logWindows() {
    for (const app of Window.appSystem.get_running()) {
      for (const win of app.get_windows()) {
        log(`=========================`);
        log(`title: "${win.get_title()}"`);
        log(`class instance: "${win.get_wm_class_instance()}"`);
      }
    }
  }

  constructor(gnome_window) {
    this.instance = gnome_window
  }

  resize(width, height) {
    const { x: x, y: y } = this.instance.get_frame_rect();
    this.instance.move_resize_frame(true, x, y, width, height);
  }

  center() {
    // Get the dimensions of the window.
    const { width: windowWidth, height: windowHeight } = this.instance.get_frame_rect();

    // Get the dimensions of the primary display and its position
    // relative to the workspace (which includes all monitors).
    const workspace = global.workspace_manager.get_active_workspace();
    const display = workspace.get_display();
    const primaryMonitorIndex = display.get_primary_monitor();
    const {
      width: monitorWidth,
      height: monitorHeight
    } = workspace.get_work_area_for_monitor(primaryMonitorIndex);
    const {
      x: monitorX,
      y: monitorY
    } = display.get_monitor_geometry(primaryMonitorIndex);

    // Establish the coordinates required to center the window on the
    // primary monitor, accounting for its position in the workspace.
    const x = monitorWidth / 2 - windowWidth / 2 + monitorX;
    const y = monitorHeight / 2 - windowHeight / 2 + monitorY;

    // Center the window, specifying this as a user-driven operation.
    this.instance.move_frame(true, x, y);
  }

  show() {
    // Move the window to the current workspace
    this.instance.change_workspace_by_index(
      global.workspace_manager.get_active_workspace_index(),
      false
    );

    this.instance.unminimize();
    this.instance.raise();
    this.instance.focus(0);
  }

  hide() {
    this.instance.minimize();
  }

  focused() {
    return this.instance.has_focus();
  }
}
