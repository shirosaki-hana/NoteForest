import type { FC } from "react";
import { Crepe } from "@milkdown/crepe";
import { Milkdown, useEditor } from "@milkdown/react";
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

import "@milkdown/crepe/theme/common/style.css";
import "./custom-overrides.css";

const markdown = `# Milkdown React Crepe

> You're scared of a world where you're needed.

This is a demo for using Crepe with **React**.`;

export const MilkdownEditor: FC = () => {
  const theme = useTheme();

  useEditor((root) => {
    const crepe = new Crepe({
      root,
      defaultValue: markdown,
    });
    
    return crepe;
  }, []);

  return (
    <Box
      sx={{
        '& .milkdown': {
          '--crepe-color-background': theme.palette.milkdown.background,
          '--crepe-color-on-background': theme.palette.milkdown.onBackground,
          '--crepe-color-surface': theme.palette.milkdown.surface,
          '--crepe-color-surface-low': theme.palette.milkdown.surfaceLow,
          '--crepe-color-on-surface': theme.palette.milkdown.onSurface,
          '--crepe-color-on-surface-variant': theme.palette.milkdown.onSurfaceVariant,
          '--crepe-color-outline': theme.palette.milkdown.outline,
          '--crepe-color-primary': theme.palette.milkdown.primary,
          '--crepe-color-secondary': theme.palette.milkdown.secondary,
          '--crepe-color-on-secondary': theme.palette.milkdown.onSecondary,
          '--crepe-color-inverse': theme.palette.milkdown.inverse,
          '--crepe-color-on-inverse': theme.palette.milkdown.onInverse,
          '--crepe-color-inline-code': theme.palette.milkdown.inlineCode,
          '--crepe-color-error': theme.palette.milkdown.error,
          '--crepe-color-hover': theme.palette.milkdown.hover,
          '--crepe-color-selected': theme.palette.milkdown.selected,
          '--crepe-color-inline-area': theme.palette.milkdown.inlineArea,
          '--crepe-font-title': 'Rubik, Cambria, "Times New Roman", Times, serif',
          '--crepe-font-default': 'Inter, Arial, Helvetica, sans-serif',
          '--crepe-font-code': '"JetBrains Mono", Menlo, Monaco, "Courier New", Courier, monospace',
        },
      }}
    >
      <Milkdown />
    </Box>
  );
};
