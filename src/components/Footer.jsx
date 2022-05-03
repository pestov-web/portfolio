import React from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  Paper,
  Typography,
} from '@mui/material';
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
        <box>
          <Button variant={'outlined'}>Владимир Пестов</Button>
        </box>
      </Container>
    </Paper>
  );
}

export default Footer;
