import React from 'react';
import {
  Box,
  Button,
  Container,
  Fade,
  Grid,
  Paper,
  Slide,
  Typography,
  Zoom,
} from '@mui/material';
import Social from './Social';
import TsParticles from '../vendors/js/TsParticles';

function Hero({ darkMode }) {
  return (
    <Paper
      component={'section'}
      sx={{
        height: '70vh',
        position: 'relative',
        background: '00',
      }}
    >
      {' '}
      <Container sx={{ height: '100%' }} maxWidth={'md'}>
        <Grid
          sx={{ height: '100%' }}
          container
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Grid item>
            <Zoom in={true} timeout={700}>
              <Typography component={'h1'} variant={'h3'}>
                Привет, меня зовут Владимир
              </Typography>
            </Zoom>
            <Zoom in={true} timeout={700} style={{ transitionDelay: '500ms' }}>
              <Typography variant={'h5'}>
                я начинающий веб разработчик
              </Typography>
            </Zoom>

            <Box my={2}>
              <Fade
                in={true}
                timeout={1200}
                style={{ transitionDelay: '1000ms' }}
              >
                <Button variant={'outlined'}>Подробнее</Button>
              </Fade>
            </Box>
          </Grid>
          <Grid item>
            <Social />
          </Grid>
        </Grid>
      </Container>{' '}
      <TsParticles darkMode={darkMode} />
    </Paper>
  );
}

export default Hero;
