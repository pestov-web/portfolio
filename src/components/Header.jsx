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

import { avatar } from '../utils/constants';
import { navMenu } from '../data/navMenu';
import ResumeButton from './ResumeButton';
import ScrollToButton from './ScrollToButton';

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleBurgerMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <AppBar position={'sticky'} color={'default'}>
      <Container maxWidth={'md'}>
        {' '}
        <Toolbar disableGutters>
          <Avatar
            sx={{
              marginRight: 'auto',
            }}
            alt="Vladimir Pestov"
            src={avatar}
          >
            PW
          </Avatar>{' '}
          {navMenu.map((item, index) => (
            <ScrollToButton item={item} key={index} />
          ))}
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
