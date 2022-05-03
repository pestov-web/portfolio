import React, { useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  keyframes,
  Link,
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

const grow = keyframes`
  from {
    width: 5%;
  }
  to {
    width: 100%;
  }
`;

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
            <Button
              sx={[
                {
                  display: { xs: 'none', md: 'block' },
                  paddingY: '15px',
                  fontWeight: '500',
                  position: 'relative',
                },
                (theme) => ({
                  '&:hover': {
                    color: theme.palette.primary.main,
                    '&::after': {
                      content: '""',
                      borderBottom: '2px solid',
                      borderColor: theme.palette.primary.main,
                      display: 'block',
                      width: '100%',
                      position: 'absolute',
                      bottom: '0',
                      left: '0',
                      animation: `${grow} 0.7s  ease`,
                    },
                  },
                }),
              ]}
              key={index}
              color={'primary'}
              variant={'button'}
              underline={'none'}
              href={item.href}
              mr={2}
            >
              {item.nameRu}
            </Button>
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
              {' '}
              <Link
                color={'textPrimary'}
                variant={'button'}
                underline={'none'}
                href={item.href}
                mr={2}
              >
                {item.nameRu}
              </Link>
            </ListItem>
          ))}
        </List>
      </SwipeableDrawer>
    </AppBar>
  );
}

export default Header;
