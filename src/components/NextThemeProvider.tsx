'use client'
import CssBaseline from "@mui/material/CssBaseline"
import { createTheme, ThemeProvider } from "@mui/material/styles"

const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
  cssVariables: true,
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
});

type NextThemeProviderProps = {
  children: React.ReactNode;
}
export default function NextThemeProvider(props: NextThemeProviderProps) {
  const { children } = props;
  return <ThemeProvider  theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
}