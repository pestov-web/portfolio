import React from 'react';
import {
  Box,
  CardMedia,
  Chip,
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { firstPhoto } from '../utils/constants';
import { techsList } from '../data/techs';

function About() {
  return (
    <Container maxWidth={'md'} component={'section'} sx={{ py: 10 }}>
      <Typography component={'h2'} variant={'h4'} sx={{ py: '30px' }}>
        Обо мне
      </Typography>
      <Paper elevation={3}>
        <Grid container>
          <Grid
            item
            padding={2}
            xs={12}
            sm={6}
            md={8}
            sx={{
              order: { xs: '1', sm: '0' },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <List disablePadding={true} subheader>
                <ListItem disableGutters disablePadding>
                  <ListItemText
                    primary="Меня зовут Владимир Пестов"
                    secondary={
                      <Typography
                        sx={{ display: 'inline' }}
                        component="p"
                        variant="body2"
                        color="text.primary"
                      >
                        Я ищу свою первую работу.
                      </Typography>
                    }
                  />
                </ListItem>{' '}
                <ListItem disableGutters disablePadding>
                  <ListItemText
                    secondary={
                      <Typography
                        sx={{ display: 'inline' }}
                        component="p"
                        variant="body2"
                      >
                        Активно занимаюсь самообразованием, просматриваю
                        различные курсы и материалы, читаю обучающую литературу
                        по веб-разработке.
                      </Typography>
                    }
                  />
                </ListItem>{' '}
                <ListItem disableGutters disablePadding>
                  <ListItemText
                    secondary={
                      <Typography
                        sx={{ display: 'inline' }}
                        component="p"
                        variant="body2"
                      >
                        Быстро разбираюсь в новых областях и темах, эффективно
                        работаю самостоятельно и в команде.
                      </Typography>
                    }
                  />
                </ListItem>
              </List>
            </Box>
            <Stack
              direction="row"
              spacing={1}
              sx={{ paddingTop: { xs: '15px' } }}
            >
              {techsList.map((item) => (
                <Chip
                  key={item.id}
                  label={item.name}
                  sx={[
                    {
                      transition: 'all 0.4s',
                    },
                    (theme) => ({
                      '&:hover': { color: theme.palette.primary.main },
                    }),
                  ]}
                />
              ))}
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={4} padding={2} component={'picture'}>
            <box>
              <CardMedia
                component="img"
                height="350"
                image={firstPhoto}
                alt={` screenshot`}
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
                      filter: 'saturate(70%)',
                    },
                  },
                  (theme) => ({
                    '&:hover': { color: theme.palette.primary.main },
                  }),
                ]}
              />
            </box>
          </Grid>
        </Grid>
      </Paper>{' '}
    </Container>
  );
}

export default About;
