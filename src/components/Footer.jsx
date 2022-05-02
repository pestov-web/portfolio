import React from 'react';
import { Container, Paper, Typography } from '@mui/material';

function Footer() {
  return (
    <Container component={'footer'} sx={{ height: 200, paddingTop: 6 }}>
      <Typography>Footer</Typography>
    </Container>
  );
}

export default Footer;
