import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#D2B48C', // Tan - a light, warm brown
    },
    secondary: {
      main: '#CD853F', // Peru - a medium brown
    },
    background: {
      default: '#2E1C0E', // Very dark brown
      paper: '#4E342E', // Darker brown for paper elements
    },
    text: {
      primary: '#F5DEB3', // Wheat for primary text
      secondary: '#D2B48C', // Tan for secondary text
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  // You can add more customizations here
});

export default darkTheme;