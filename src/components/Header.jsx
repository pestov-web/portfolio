import React, { useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  SwipeableDrawer,
  Toolbar,
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Brightness4Icon from '@mui/icons-material/Brightness4';

import { avatar } from '../utils/constants';
import { navMenu } from '../data/navMenu';
import ResumeButton from './ResumeButton';
import ScrollToButton from './ScrollToButton';
import { scrollTo } from '../utils/sctollTo';

function Header({ toggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToTop = () => {
    scrollTo({ id: 'tsparticles' });
  };

  const toggleBurgerMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <AppBar position={'sticky'} color={'default'}>
      <Container maxWidth={'md'}>
        {' '}
        <Toolbar
          disableGutters
          sx={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <Box display={'flex'} alignItems={'center'}>
            <IconButton onClick={scrollToTop}>
              <Avatar alt="Владимир Пестов" src={avatar}>
                PW
              </Avatar>
            </IconButton>

            <IconButton
              onClick={toggleTheme}
              aria-label={'изменить тему'}
              sx={{ marginLeft: 3, height: '40px' }}
            >
              <Brightness4Icon />
            </IconButton>
          </Box>
          <Box display={'flex'} alignItems={'center'}>
            {navMenu.map((item, index) => (
              <ScrollToButton item={item} key={index} />
            ))}{' '}
            <ResumeButton />
            <div>
              {' '}
              <IconButton
                onClick={toggleBurgerMenu}
                sx={{ display: { xs: 'inline-flex', md: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
            </div>
          </Box>{' '}
        </Toolbar>
      </Container>
      <SwipeableDrawer
        anchor={'right'}
        open={isOpen}
        onClose={toggleBurgerMenu}
        onOpen={toggleBurgerMenu}
      >
        <Box>
          {' '}
          <IconButton
            onClick={toggleBurgerMenu}
            sx={{
              my: { xs: '8px', sm: '12px' },
              marginLeft: '130px',
              marginRight: '10px',
            }}
          >
            <CloseIcon />
          </IconButton>
          <Divider />
        </Box>{' '}
        <List>
          {' '}
          {navMenu.map((item, index) => (
            <ListItem key={index}>
              <ScrollToButton
                item={item}
                isModal={true}
                onClick={toggleBurgerMenu}
              />
            </ListItem>
          ))}{' '}
          <ListItem>
            <ResumeButton isModal={true} />
          </ListItem>
        </List>
      </SwipeableDrawer>
    </AppBar>
  );
}

export default Header;
