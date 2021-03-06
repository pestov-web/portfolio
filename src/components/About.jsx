import React from 'react';
import {
  Box,
  Button,
  CardMedia,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { firstPhoto } from '../utils/constants';
import { techsList } from '../data/techs';

function About() {
  return (
    <Container maxWidth={'md'} component={'section'} sx={{ py: 10 }}>
      <Divider textAlign="left" component={'h2'} sx={{ py: 4 }} id={'about'}>
        Обо мне
      </Divider>
      <Paper elevation={3}>
        <Grid container>
          <Grid
            item
            padding={2}
            xs={12}
            sm={7}
            md={8}
            sx={{
              order: { xs: '1', sm: '0' },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Box display={'flex'} flexDirection={'column'} gap={1}>
              <Typography> Меня зовут Владимир Пестов</Typography>

              <Typography
                sx={{ display: 'inline' }}
                component="p"
                variant="body2"
                color="text.primary"
              >
                Я ищу свою первую работу.
              </Typography>

              <Typography
                sx={{ display: 'inline' }}
                component="p"
                variant="body2"
              >
                Активно занимаюсь самообразованием, читаю обучающую литературу
                по веб-разработке.
              </Typography>

              <Typography
                sx={{ display: 'inline' }}
                component="p"
                variant="body2"
              >
                Быстро разбираюсь в новых областях и темах, эффективно работаю
                самостоятельно и в команде.
              </Typography>

              <Typography
                sx={{ display: 'inline' }}
                component="p"
                variant="body2"
              >
                Имею бэкграунд системного администратора.
              </Typography>
            </Box>
            <Box>
              <Divider sx={{ paddingTop: { xs: '15px', sm: '0' } }} />
              <Stack
                direction="row"
                flexWrap={'wrap'}
                gap={1}
                sx={{ paddingTop: { xs: '15px' } }}
              >
                {techsList.map((item, index) => (
                  <Chip
                    key={index}
                    label={item.name}
                    size={'small'}
                    sx={[
                      { background: 'none' },
                      (theme) => ({
                        color: theme.palette.primary.main,
                      }),
                    ]}
                  />
                  // <Button key={item.id} size="small">
                  //   {item.name}
                  // </Button>
                ))}
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={12} sm={5} md={4} padding={2} component={'picture'}>
            <Box>
              <CardMedia
                component="img"
                image={firstPhoto}
                alt={` screenshot`}
                sx={[
                  {
                    height: { xs: '400px', sm: '350px', md: '350px' },
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
            </Box>
          </Grid>
        </Grid>
      </Paper>{' '}
    </Container>
  );
}

export default About;
