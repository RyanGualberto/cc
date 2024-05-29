/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

type ColorsType = {
  "surface": string;
  "surface_40_opc": string;
  "navbar": string;
  "dark_surface": string;
  "pure_black": string;
  "primary_color": string;
  "light_background": string;
  "dark_primary_color": string;
  "main_border_color": string;
  "input_text_color": string;
  "danger": string;
  "dark_surface_60_opc": string;
  "input_background": string;
  "divider": string;
  "white_80_opc": string;
  "white_60_opc": string;
  "dashboard_gradient": readonly string[] & [string, string]
}

export const Colors: ColorsType = {
  "surface": "#171719",
  "surface_40_opc": "rgba(23, 23, 25, 0.4)",
  "divider": "rgba(255, 255, 255, 0.15)",
  "white_80_opc": "rgba(255, 255, 255, 0.8)",
  "white_60_opc": "rgba(255, 255, 255, 0.6)",
  "navbar": "#121418",
  "dark_surface": "#131215",
  "pure_black": "#000000",
  "primary_color": "#AEE67F",
  "light_background": "#56565C",
  "dark_primary_color": "#3B4F2B",
  "danger": "#CE5555",
  "main_border_color": "rgba(255, 255, 255, 0.2)",
  "input_text_color": "#CCCCCC",
  "dark_surface_60_opc": "#131215",
  "input_background": "rgba(1, 1, 1, 0.4)",
  "dashboard_gradient": ["#242D40", "#131215"]
}
