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
        height: { xs: '60vh', sm: '70vh' },
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
          alignContent={'space-evenly'}
        >
          <Grid item xs={12} sm={11}>
            <Zoom in={true} timeout={700}>
              <Typography component={'h1'} variant={'h3'}>
                Привет, я Владимир
              </Typography>
            </Zoom>
            <Zoom in={true} timeout={700} style={{ transitionDelay: '500ms' }}>
              <Typography variant={'h5'}>начинающий веб разработчик</Typography>
            </Zoom>

            <Box my={3}>
              <Fade
                in={true}
                timeout={1200}
                style={{ transitionDelay: '1000ms' }}
              >
                <Button variant={'outlined'}>Подробнее</Button>
              </Fade>
            </Box>
          </Grid>
          <Grid item xs={12} sm={1}>
            <Social />
          </Grid>
        </Grid>
      </Container>{' '}
      <TsParticles darkMode={darkMode} />
    </Paper>
  );
}

export default Hero;
