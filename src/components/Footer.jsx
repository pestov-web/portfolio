import React from 'react';
import { Box, Button, Container, Paper } from '@mui/material';
import Social from './Social';

function Footer() {
  return (
    <Paper
      component={'footer'}
      elevation={3}
      sx={{
        height: '80px',
        marginTop: '100px',
      }}
    >
      <Container
        maxWidth={'md'}
        sx={{
          display: 'flex',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Social place={'footer'} />
        </Box>
        <Box>
          <Button href="mailto:pestov.web@yandex.ru" variant={'outlined'}>
            Написать
          </Button>
        </Box>
      </Container>
    </Paper>
  );
}

export default Footer;
