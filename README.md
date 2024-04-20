# Gnome Scratchpad Extension

If you've used i3 or Sway, you may be familiar with [their concept of a
"scratchpad"](https://i3wm.org/docs/userguide.html#_scratchpad), which allows
showing/hiding an application as a floating, centered window with a global
shortcut.

This interaction model is ideal for applications you engage with _often but
briefly_. Scratchpads allow you to summon group messaging, email clients,
calendars, or a terminal window instantly from any workspace, and then quickly
dismiss it to get back to what you were doing before.

This extension brings that functionality to Gnome.

## Installation

Clone or copy the contents of this repo to:

```$HOME/.local/share/gnome-shell/extensions/scratchpad@wastedintelligence.com```

## Configuration

Before enabling the extension, you'll need to create an initial configuration
located at:

```$HOME/.config/gnome-scratchpad/config.json```

Here's an initial example to get started:

```json
{
    "window_width": 1800,
    "window_height": 1200,
    "hide_keybind": "<super>n",
    "bindings": [
      { "wmclass": "^Slack$", "keybind": "<super>i" },
      { "wmclass": "^kitty$", "keybind": "<super>Return" }
    ]
}
```

Some of the options are self-explanatory, but we'll cover all of them for good
measure:

* `window_(width|height)`: width/height to which the window will be resized when shown
* `hide_keybind`: keybind used to hide all visible scratchpad windows
* `bindings`: array of rule + shortcut configurations for your scratchpad apps
    * `wmclass`: regex used to target a window based on its class
    * `title`: regex used to target a window based on its title
    * `keybind`: shortcut in `[<Modifiers>+]<keycode>` notation

> [!NOTE]
> You only need to specify `wmclass` _or_ `title`. Of the two, `wmclass` is
> generally more useful, since windows often change their titles based on content.
> If you specify both, they'll form a logical OR, with `wmclass` taking precedence.
>
> If multiple windows match the criteria, the **first** window will be used.

### Finding window classes

The easiest way to find a `wmclass` value for the window you're trying to target
is to use Gnome's "looking glass" feature, which allows inspecting aspects of
Gnome shell; here's how to use it:

1. Make sure the app/window you're trying to identify is running/open
2. Open Gnome's "run command" prompt (`Alt+F2` by default)
3. Type `lg` (for "looking glass") and hit enter
4. A panel opens with buttons on the top right; click the "Windows" button
5. Find the app you're trying to target and make note of its `wmclass` attribute value

### Picking keybinds

Gnome reserves certain keybinds by default; some of these can be cleared, but
others can't. When choosing a keybind, make sure it's not already assigned to
something in `Settings > Keyboard > Keyboard Shortcuts > View and Customize Shortcuts`.
If it is, disable the shortcut or assign it to another keybind.

### Debugging

The two most common configuration issues you're likely to encounter are:

* the `keybind` you're trying to use is unavailable/reserved by Gnome
* the `wmclass` or `title` isn't matching any windows

You can diagnose both of these pretty easily by:

1. Opening Gnome's "Logs" application
2. Clicking the "All" category on the left side to show all messages
3. Using the search function to filter messages containing "gnome-scratchpad"

The extension logs success/failure states when setting up keybinds, as well as
lookup failures when a keybind is handled but a matching window can't be found.

> [!TIP]
> The configuration file is only loaded once, when the extension is initially
> enabled. If you are making changes to it, you can toggle the extension in the
> Gnome extensions app to forcibly reload the configuration.

If none of your keybinds are working, check the extensions app. It's possible
your configuration file isn't valid JSON, which will prevent the extension from
starting. If that's the case, you'll see an error displayed underneath the
extension name.

## Website "applications"

Having instant access to applications from any workspace is useful, but
scratchpads really shine when paired with website "applications", or more
specifically, _site-specific browser windows_. You can configure Chrome/Chromium
to open a website in a dedicated window and then assign a keybind to that
window. This makes it possible to quickly interact with sites like Todoist,
DevDocs, Google Calendar, or anything else that is either unavailable as a
native app or that you'd simply prefer to not install locally.

### Creating a website app

> [!NOTE]
> This functionality is currently limited to Chrome/Chromium. It was previously
> available in Firefox, but [was removed in v86](https://bugzilla.mozilla.org/show_bug.cgi?id=1682593).

You can create a shell script to run a website as an app like so:

```bash
#!/bin/sh

APP_NAME="todoist"

chromium --user-data-dir="$HOME/.config/$APP_NAME" --app=https://$APP_NAME.com
```

Running that will allow you to target the window using the following `bindings` entry:

```json
{ "wmclass": "^chrome\\-todoist\\.com", "keybind": "<super>t" }
```

### Creating a desktop entry

While that works, launching the script from a terminal isn't ideal. To solve that,
add the following contents to a new `$HOME/.local/share/applications/todoist.desktop` file:

```desktop
[Desktop Entry]
Type=Application
Encoding=UTF-8
Name=Todoist
Comment=Todoist Chromium Web Application
Exec=/path/to/todoist/script/above
Icon=application.png
Terminal=false
```

Once Gnome indexes that, you'll be able to launch Todoist from the overview
screen and access it instantly from any workspace by hitting `Super + t`.
