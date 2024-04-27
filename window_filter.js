import { Workspace } from 'resource:///org/gnome/shell/ui/workspace.js'
import {
  GroupCyclerPopup,
  WindowCyclerPopup,
  WindowSwitcherPopup,
} from 'resource:///org/gnome/shell/ui/altTab.js'

// Stash references to the original functions
const [w, gcp, wcp, wsp] = [
  Workspace.prototype._isOverviewWindow,
  GroupCyclerPopup.prototype._getWindows,
  WindowCyclerPopup.prototype._getWindows,
  WindowSwitcherPopup.prototype._getWindowList
];

export default class WindowFilter {
  constructor(rules) {
    this.rules = rules;
    this.apply();
  }

  apply() {
    // Monkeypatch a scratchpad condition to the overview window filter
    Workspace.prototype._isOverviewWindow = (win) => {
      return w(win) && !this.isScratchpadWindow(win)
    };

    // Monkeypatch built-in methods with a filter-chained version of themselves
    GroupCyclerPopup.prototype._getWindows = () => gcp().filter(this.is_scratchpad_window);
    WindowCyclerPopup.prototype._getWindows = () => wcp().filter(this.is_scratchpad_window);
    WindowSwitcherPopup.prototype._getWindowList = () => wsp().filter(this.is_scratchpad_window);
  }

  remove() {
    // Restore the original functions
    [
      Workspace.prototype._isOverviewWindow,
      GroupCyclerPopup.prototype._getWindows,
      WindowCyclerPopup.prototype._getWindows,
      WindowSwitcherPopup.prototype._getWindowList
    ] = [w, gcp, wcp, wsp];
  }

  isScratchpadWindow(win) {
    // Try to find a matching rule, coercing to a boolean
    return !!this.rules.find(rule => {
      return (
        (rule.wmclass ? win.get_wm_class_instance().match(new RegExp(rule.wmclass)) : false) ||
        (rule.title ? win.get_title().match(new RegExp(rule.title)) : false)
      )
    });
  }
}
