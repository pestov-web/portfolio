import React from 'react';
import { Button } from '@mui/material';

function ResumeButton() {
  return (
    <Button
      href="#"
      aria-label="Резюме"
      variant={'outlined'}
      sx={{ marginLeft: 4, display: { xs: 'none', md: 'block' } }}
    >
      Резюме
    </Button>
  );
}

export default ResumeButton;
