import React from 'react';
import GitHubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Container, IconButton, Link } from '@mui/material';

const socialItems = [
  {
    name: 'GitHub',
    icon: GitHubIcon,
    url: 'https://github.com/pestov-web',
  },
  {
    name: 'Facebook',
    icon: FacebookIcon,
    url: 'https://www.facebook.com/mindwrk',
  },
  {
    name: 'LinkedIn',
    icon: LinkedInIcon,
    url: 'https://www.linkedin.com/in/vladimir-pestov-a36a00238/',
  },
];

function Social({ place }) {
  return (
    <Container
      sx={{
        m: 0,
        p: { xs: 0 },
        display: 'flex',
        flexDirection: { xs: 'row', sm: `${place ? 'row' : 'column'}` },
        gap: '10px',
        listStyle: 'none',
        alignItems: 'flex-end',
      }}
    >
      {' '}
      {socialItems.map((item, index) => (
        <IconButton
          key={index}
          href={item.url}
          target="_blank"
          rel="noreferrer"
          aria-label={item.name}
          sx={[
            (theme) => ({
              '&:hover': { color: theme.palette.primary.main },
            }),
          ]}
        >
          <item.icon />
        </IconButton>
      ))}
    </Container>
  );
}

export default Social;
