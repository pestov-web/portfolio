import * as React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Hero from './Hero';
import Header from './Header';
import { useState } from 'react';
import Projects from './Projects';
import Footer from './Footer';
import About from './About';

function App() {
  const [isThemeDark, setIsThemeDark] = useState(true);

  const toggleTheme = () => setIsThemeDark(!isThemeDark);

  // enable auto theme switching
  // uncomment and change default isThemeDark state to false

  // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  //
  // React.useEffect(() => {
  //   setIsThemeDark(prefersDarkMode);
  // }, [prefersDarkMode]);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: isThemeDark ? 'dark' : 'light',
        },
      }),
    [isThemeDark]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header toggleTheme={toggleTheme} />
      <Hero darkMode={isThemeDark} />
      <About />
      <Projects />
      <Footer />
    </ThemeProvider>
  );
}

export default App;
