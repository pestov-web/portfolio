import React from 'react';
import { Button } from '@mui/material';

function ResumeButton({ isModal }) {
  return (
    <Button
      href="/resume_hh.pdf"
      aria-label="Резюме"
      variant={'outlined'}
      sx={{
        marginLeft: `${!isModal ? '50px' : '0'}`,
        display: { xs: `${!isModal ? 'none' : 'block'}`, md: 'block' },
        marginTop: `${!isModal ? '0' : '50px'}`,
        width: `${isModal && '100%'}`,
        textAlign: 'center',
      }}
    >
      Резюме
    </Button>
  );
}

export default ResumeButton;
