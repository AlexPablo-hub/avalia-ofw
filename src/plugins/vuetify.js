// src/plugins/vuetify.js
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import '@fontsource/inter';
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'


const darkTheme = {
  dark: true,
  colors: {
    primary: '#1976D2',
    secondary: '#424242',
    accent: '#FF4081',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107',
    background: '#121212',
    surface: '#212121',
  }
};

const lightTheme = {
  dark: false,
  colors: {
    primary: '#1976D2',
    secondary: '#424242',
    accent: '#FF4081',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107',
    background: '#F5F5F5',
    surface: '#FFFFFF',
  }
};

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'darkTheme',
    themes: {
      darkTheme,
      lightTheme
    }
  },
  defaults: {
    global: {
      style: {
        fontFamily: 'Inter, sans-serif'
      }
    },
    VCard: {
      elevation: 2,
    },
    VBtn: {
      variant: 'elevated',
    },
    VAppBar: {
      elevation: 4,
    }
  },
  icons: {
    defaultSet: 'mdi',
  },
});
