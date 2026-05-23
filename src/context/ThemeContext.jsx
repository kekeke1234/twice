import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

const DEFAULT_THEME = {
  '--emerald-signal': '#00d992',
  '--voltagent-mint': '#2fd6a1',
  '--abyss-black': '#0d0d14',
  '--carbon-surface': '#1a1a2e',
  '--warm-charcoal': '#2a2a3e',
  '--snow-white': '#abb2bf',
  '--pure-white': '#ffffff',
  '--warm-parchment': '#5c6370',
  '--steel-slate': '#4b5263',
  '--success-emerald': '#98c379',
  '--warning-amber': '#e5c07b',
  '--danger-coral': '#e5534b',
  '--info-teal': '#56b6c2',
  '--soft-purple': '#c678dd',
};

const PRESET_THEMES = {
  default: { name: 'Emerald Dark', colors: { ...DEFAULT_THEME } },
  light: {
    name: 'Light Mode',
    colors: {
      '--emerald-signal': '#10b981',
      '--voltagent-mint': '#34d399',
      '--abyss-black': '#f8fafc',
      '--carbon-surface': '#ffffff',
      '--warm-charcoal': '#e2e8f0',
      '--snow-white': '#1e293b',
      '--pure-white': '#0f172a',
      '--warm-parchment': '#64748b',
      '--steel-slate': '#94a3b8',
      '--success-emerald': '#22c55e',
      '--warning-amber': '#f59e0b',
      '--danger-coral': '#ef4444',
      '--info-teal': '#06b6d4',
      '--soft-purple': '#8b5cf6',
    }
  },
  midnight: {
    name: 'Midnight Blue',
    colors: {
      '--emerald-signal': '#6366f1',
      '--voltagent-mint': '#818cf8',
      '--abyss-black': '#0a0a1a',
      '--carbon-surface': '#1e1e3f',
      '--warm-charcoal': '#2d2d5a',
      '--snow-white': '#e0e0ff',
      '--pure-white': '#ffffff',
      '--warm-parchment': '#6b6b8f',
      '--steel-slate': '#4a4a70',
      '--success-emerald': '#34d399',
      '--warning-amber': '#fbbf24',
      '--danger-coral': '#f87171',
      '--info-teal': '#38bdf8',
      '--soft-purple': '#a78bfa',
    }
  },
  forest: {
    name: 'Forest Green',
    colors: {
      '--emerald-signal': '#22c55e',
      '--voltagent-mint': '#4ade80',
      '--abyss-black': '#0f1a0f',
      '--carbon-surface': '#1a2e1a',
      '--warm-charcoal': '#2a4a2a',
      '--snow-white': '#b8d4b8',
      '--pure-white': '#ffffff',
      '--warm-parchment': '#5a7a5a',
      '--steel-slate': '#4a6a4a',
      '--success-emerald': '#86efac',
      '--warning-amber': '#fcd34d',
      '--danger-coral': '#f87171',
      '--info-teal': '#22d3ee',
      '--soft-purple': '#c084fc',
    }
  },
  sunset: {
    name: 'Sunset Orange',
    colors: {
      '--emerald-signal': '#f97316',
      '--voltagent-mint': '#fb923c',
      '--abyss-black': '#1a0f0a',
      '--carbon-surface': '#2e1a1a',
      '--warm-charcoal': '#4a2a2a',
      '--snow-white': '#f5d5c8',
      '--pure-white': '#ffffff',
      '--warm-parchment': '#8a6a5a',
      '--steel-slate': '#7a5a4a',
      '--success-emerald': '#4ade80',
      '--warning-amber': '#fbbf24',
      '--danger-coral': '#ef4444',
      '--info-teal': '#38bdf8',
      '--soft-purple': '#e879f9',
    }
  },
  ocean: {
    name: 'Ocean Blue',
    colors: {
      '--emerald-signal': '#0ea5e9',
      '--voltagent-mint': '#38bdf8',
      '--abyss-black': '#0a1520',
      '--carbon-surface': '#1a2a3a',
      '--warm-charcoal': '#2a3a4a',
      '--snow-white': '#c0d8e8',
      '--pure-white': '#ffffff',
      '--warm-parchment': '#5a7a8a',
      '--steel-slate': '#4a6a7a',
      '--success-emerald': '#22c55e',
      '--warning-amber': '#fcd34d',
      '--danger-coral': '#f87171',
      '--info-teal': '#06b6d4',
      '--soft-purple': '#a78bfa',
    }
  },
}

export function ThemeProvider({ children }) {
  const [customColors, setCustomColors] = useState(() => {
    const saved = localStorage.getItem('customTheme');
    return saved ? JSON.parse(saved) : null;
  });
  const [activePreset, setActivePreset] = useState(() => {
    return localStorage.getItem('activePreset') || 'default';
  });

  useEffect(() => {
    if (customColors) {
      localStorage.setItem('customTheme', JSON.stringify(customColors));
      Object.entries(customColors).forEach(([varName, value]) => {
        document.documentElement.style.setProperty(varName, value);
      });
    } else if (PRESET_THEMES[activePreset]) {
      Object.entries(PRESET_THEMES[activePreset].colors).forEach(([varName, value]) => {
        document.documentElement.style.setProperty(varName, value);
      });
    }
  }, [customColors, activePreset]);

  const applyPreset = (presetName) => {
    setCustomColors(null);
    setActivePreset(presetName);
    localStorage.setItem('activePreset', presetName);
    localStorage.removeItem('customTheme');
  };

  const updateColor = (varName, value) => {
    setCustomColors(prev => {
      const updated = { ...(prev || PRESET_THEMES[activePreset].colors), [varName]: value };
      return updated;
    });
  };

  const resetTheme = () => {
    setCustomColors(null);
    setActivePreset('default');
    localStorage.removeItem('customTheme');
    localStorage.setItem('activePreset', 'default');
  };

  return (
    <ThemeContext.Provider value={{
      customColors,
      activePreset,
      presets: PRESET_THEMES,
      applyPreset,
      updateColor,
      resetTheme,
      currentColors: customColors || PRESET_THEMES[activePreset]?.colors || DEFAULT_THEME
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
