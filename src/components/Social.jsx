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
    url: '#',
  },
  {
    name: 'LinkedIn',
    icon: LinkedInIcon,
    url: '#',
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
        <Link key={index} href={item.url} target="_blank" rel="noreferrer">
          {' '}
          <IconButton
            aria-label={item.name}
            sx={[
              (theme) => ({
                '&:hover': { color: theme.palette.primary.main },
              }),
            ]}
          >
            {' '}
            <item.icon />
          </IconButton>
        </Link>
      ))}
    </Container>
  );
}

export default Social;
