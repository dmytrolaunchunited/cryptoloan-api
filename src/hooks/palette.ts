import { useMemo } from "react";
import { PaletteOptions } from '@mui/material';
import { useStore } from "react-admin";

export const usePalette = () => {
  const [theme] = useStore('theme', 'dark');
  return useMemo(() => {
    const mode = theme;
    const primary = {
      main: "#368fe7",
    };
    const secondary = {
      main: "#a1a1a1",
    };
    return { mode, primary, secondary } ;
  }, [theme]) as unknown as PaletteOptions;
}
