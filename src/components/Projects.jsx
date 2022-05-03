import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Grid,
  IconButton,
  Link,
  Typography,
} from '@mui/material';

import GitHubIcon from '@mui/icons-material/GitHub';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { projectsList } from '../data/projects';

function Projects() {
  const isEven = (number) => number % 2 === 0;

  return (
    <Container maxWidth={'md'} component={'section'}>
      <Divider textAlign="left" component={'h2'} sx={{ py: 4 }}>
        Мои работы
      </Divider>
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          px: '0 !important',
        }}
      >
        {projectsList.map((item) => (
          <Card raised key={item.id} sx={{ display: 'flex' }}>
            <Grid container direction={'row'}>
              <Grid
                item
                xs={12}
                sm={6}
                sx={{
                  order: { xs: 1, sm: `${isEven(item.id) ? 0 : 1}` },
                }}
              >
                <CardContent
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    p: '15px !important',
                  }}
                >
                  <Typography component={'h2'} variant={'h5'}>
                    {item.nameRu}
                  </Typography>
                  <Typography component={'p'} paragraph>
                    {item.description}
                  </Typography>
                  <Box alignSelf={isEven(item.id) ? 'flex-start' : 'flex-end'}>
                    <IconButton
                      aria-label={item.labelGh}
                      sx={[
                        (theme) => ({
                          '&:hover': { color: theme.palette.primary.main },
                        }),
                      ]}
                    >
                      <GitHubIcon />
                    </IconButton>
                    <IconButton
                      aria-label={item.labelDemo}
                      sx={[
                        (theme) => ({
                          '&:hover': { color: theme.palette.primary.main },
                        }),
                      ]}
                    >
                      <OpenInNewIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: '15px', boxSizing: 'border-box' }}>
                  <Link href={item.prjUrl} target="_blank" rel="noreferrer">
                    {' '}
                    <CardMedia
                      component="img"
                      height="250"
                      image={item.image}
                      alt={`${item.nameRu} screenshot`}
                      sx={[
                        {
                          width: '100%',
                          objectFit: 'cover',
                          objectPosition: 'top',
                          filter: 'saturate(10%)',
                          transition: 'all 0.4s',
                          boxShadow:
                            '0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%)',
                          borderRadius: '4px',
                          boxSizing: 'border-box',
                          ':hover': {
                            filter: 'saturate(100%)',
                            transform: 'scale(1.08, 1.12)',
                          },
                        },
                        (theme) => ({
                          '&:hover': { color: theme.palette.primary.main },
                        }),
                      ]}
                    />
                  </Link>
                </Box>
              </Grid>
            </Grid>
          </Card>
        ))}
      </Container>
    </Container>
  );
}

export default Projects;
