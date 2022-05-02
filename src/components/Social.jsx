import React from 'react';
import GitHubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Grid, IconButton, Link } from '@mui/material';

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

function Social() {
  return (
    <Grid
      sx={{
        display: { xs: 'none', md: 'block' },
      }}
      container
      direction={'column'}
      spacing={1}
    >
      {socialItems.map((item, index) => (
        <Grid key={index} item>
          <Link href={item.url} target="_blank" rel="noreferrer">
            {' '}
            <IconButton
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
        </Grid>
      ))}
    </Grid>
  );
}

export default Social;
