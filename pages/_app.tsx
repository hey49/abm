import React from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { store } from '../src/redux/store';

declare module '@mui/material/styles' {
  interface Palette {
    normal: Palette['primary'];
  }

  // allow configuration using `createTheme`
  interface PaletteOptions {
    normal?: PaletteOptions['primary'];
  }
}

// Update the Button's color prop options
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    normal: true;
  }
}

const theme = createTheme({
  components: {
  },
  palette: {
    primary: {
      main: '#3b82f6',
    },
    normal: {
      main: '#000',
    },
  },

});

const MyApp = ({ Component, pageProps }: AppProps) => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  </Provider>
);
export default MyApp;
