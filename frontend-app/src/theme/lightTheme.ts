import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#8B4513', // SaddleBrown - a warm brown
    },
    secondary: {
      main: '#A0522D', // Sienna - a reddish-brown
    },
    background: {
      default: '#F5DEB3', // Wheat - a light, warm beige
      paper: '#FFFFFF', // White for paper elements
    },
    text: {
      primary: '#3E2723', // Dark brown for primary text
      secondary: '#6D4C41', // Medium brown for secondary text
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  // You can add more customizations here
});

export default lightTheme;