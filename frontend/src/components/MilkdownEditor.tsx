import { useRef, useImperativeHandle, forwardRef } from "react";
import { Crepe } from "@milkdown/crepe";
import { Milkdown, useEditor } from "@milkdown/react";
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

import "@milkdown/crepe/theme/common/style.css";
import "./custom-overrides.css";

interface MilkdownEditorProps {
  value?: string;
  placeholder?: string;
}

export interface MilkdownEditorRef {
  getMarkdown: () => string;
  setReadonly: (readonly: boolean) => void;
}

export const MilkdownEditor = forwardRef<MilkdownEditorRef, MilkdownEditorProps>(
  ({ value = "", placeholder = "여기에 노트를 작성하세요..." }, ref) => {
    const theme = useTheme();
    const crepeRef = useRef<Crepe | null>(null);    useEditor((root) => {
      const crepe = new Crepe({
        root,
        defaultValue: value,
        featureConfigs: {
          [Crepe.Feature.Placeholder]: {
            text: placeholder,
          },
        },
      });
      
      crepeRef.current = crepe;
      
      return crepe;
    }, [value, placeholder]);    // ref를 통해 외부에서 접근 가능한 메서드들 노출
    useImperativeHandle(ref, () => ({
      getMarkdown: () => {
        return crepeRef.current?.getMarkdown() || "";
      },
      setReadonly: (readonly: boolean) => {
        crepeRef.current?.setReadonly(readonly);
      },
    }), []);

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
      }}    >
      <Milkdown />
    </Box>
  );
});

MilkdownEditor.displayName = 'MilkdownEditor';
