import { useState } from "react";
import { useThemeStore } from "~/store/themeStore";
import type { Theme } from "~/types/themes";

export function ThemeEditor() {
  const { currentTheme, addCustomTheme, updateCustomTheme } = useThemeStore();
  const [editingTheme, setEditingTheme] = useState<Theme>({ ...currentTheme });

  const colorCategories = [
    { name: "Base", colors: ["base", "mantle", "crust"] },
    { name: "Surface", colors: ["surface0", "surface1", "surface2"] },
    { name: "Text", colors: ["text", "subtext0", "subtext1"] },
    { name: "Overlay", colors: ["overlay0", "overlay1", "overlay2"] },
    { name: "Accent", colors: ["blue", "lavender", "sapphire", "sky", "teal"] },
    { name: "Colors", colors: ["green", "yellow", "peach", "maroon", "red"] },
    { name: "Special", colors: ["mauve", "pink", "flamingo", "rosewater"] },
  ];

  return (
    <div className="p-6 bg-ctp-mantle rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Theme Editor</h2>
        <div className="flex gap-2">
          <button
            onClick={() => addCustomTheme(editingTheme)}
            className="px-4 py-2 bg-ctp-blue text-white rounded"
          >
            Save as New
          </button>
          <button
            onClick={() => updateCustomTheme(editingTheme.id, editingTheme)}
            className="px-4 py-2 bg-ctp-surface1 rounded"
          >
            Update Current
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="themeName" className="block mb-2 font-medium">
              Theme Name
            </label>
            <input
              type="text"
              id="themeName"
              value={editingTheme.name}
              onChange={e =>
                setEditingTheme({ ...editingTheme, name: e.target.value })
              }
              className="w-full px-3 py-2 bg-ctp-surface0 rounded"
            />
          </div>

          <div>
            <label htmlFor="fonts" className="block mb-2 font-medium">
              Fonts
            </label>
            <div className="space-y-2">
              <input
                type="text"
                id="fonts"
                value={editingTheme.fonts.sans}
                onChange={e =>
                  setEditingTheme({
                    ...editingTheme,
                    fonts: { ...editingTheme.fonts, sans: e.target.value },
                  })
                }
                placeholder="Sans font family"
                className="w-full px-3 py-2 bg-ctp-surface0 rounded"
              />
              <input
                type="text"
                value={editingTheme.fonts.mono}
                onChange={e =>
                  setEditingTheme({
                    ...editingTheme,
                    fonts: { ...editingTheme.fonts, mono: e.target.value },
                  })
                }
                placeholder="Mono font family"
                className="w-full px-3 py-2 bg-ctp-surface0 rounded"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {colorCategories.map(category => (
            <div key={category.name}>
              <h3 className="font-medium mb-2">{category.name}</h3>
              <div className="grid grid-cols-5 gap-2">
                {category.colors.map(colorKey => (
                  <div key={colorKey}>
                    <input
                      type="color"
                      value={
                        editingTheme.colors[
                          colorKey as keyof typeof editingTheme.colors
                        ]
                      }
                      onChange={e =>
                        setEditingTheme({
                          ...editingTheme,
                          colors: {
                            ...editingTheme.colors,
                            [colorKey]: e.target.value,
                          },
                        })
                      }
                      className="w-full h-8 rounded cursor-pointer"
                    />
                    <div className="text-xs mt-1 text-center">{colorKey}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-medium mb-4">Preview</h3>
        <div
          className="p-4 rounded"
          style={{ backgroundColor: editingTheme.colors.base }}
        >
          <div
            className="p-4 rounded"
            style={{ backgroundColor: editingTheme.colors.surface0 }}
          >
            <h4
              style={{ color: editingTheme.colors.text }}
              className="text-lg mb-2"
            >
              Sample Text
            </h4>
            <p style={{ color: editingTheme.colors.subtext0 }}>
              This is how your theme will look like in the browser.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
