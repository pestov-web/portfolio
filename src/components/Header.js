import React, { useState } from "react";
import {
  AppBar,
  Avatar,
  Container,
  Divider,
  IconButton,
  Link,
  List,
  ListItem,
  SwipeableDrawer,
  Toolbar,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { avatar } from "../utils/constants";

export const navMenu = [
  { nameRu: "Обо мне", nameEn: "About", href: "#about" },
  { nameRu: "Навыки", nameEn: "Skills", href: "#experience" },
  { nameRu: "Портфолио", nameEn: "Work", href: "#portfolio" },
  { nameRu: "Контакты", nameEn: "Contact", href: "#contact" },
  { nameRu: "Резюме", nameEn: "Resume", href: "#" },
];

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleBurgerMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <AppBar position={"sticky"} color={"default"}>
      <Container maxWidth={"md"}>
        {" "}
        <Toolbar disableGutters>
          <Avatar
            sx={{
              marginRight: "auto",
            }}
            alt="Vladimir Pestov"
            src={avatar}
          >
            PW
          </Avatar>{" "}
          {navMenu.map((item, index) => (
            <Link
              sx={{ display: { xs: "none", sm: "block" } }}
              key={index}
              color={"textPrimary"}
              variant={"button"}
              underline={"none"}
              href={item.href}
              mr={2}
            >
              {item.nameRu}
            </Link>
          ))}
          <IconButton onClick={toggleBurgerMenu}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>
      <SwipeableDrawer
        anchor={"right"}
        open={isOpen}
        onClose={toggleBurgerMenu}
        onOpen={toggleBurgerMenu}
      >
        <div>
          {" "}
          <IconButton onClick={toggleBurgerMenu}>
            <CloseIcon />
          </IconButton>
          <Divider />
        </div>{" "}
        <List>
          {" "}
          {navMenu.map((item, index) => (
            <ListItem key={index}>
              {" "}
              <Link
                color={"textPrimary"}
                variant={"button"}
                underline={"none"}
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
