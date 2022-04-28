import React from "react";
import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import Social from "./Social";
import ConvBg from "./Particles";

function Hero({ darkMode }) {
  return (
    <Paper
      className={"hero"}
      sx={{
        height: "70vh",
        position: "relative",
        background: "00",
      }}
    >
      {" "}
      <Container sx={{ height: "100%" }} maxWidth={"md"}>
        <Grid
          sx={{ height: "100%" }}
          container
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Grid item>
            <Typography component={"h1"} variant={"h3"}>
              Привет, меня зовут Владимир
            </Typography>
            <Typography variant={"h5"}>я начинающий веб разработчик</Typography>
            <Box my={2}>
              <Button variant={"outlined"}>Подробнее</Button>
            </Box>
          </Grid>
          <Grid item>
            <Social />
          </Grid>
        </Grid>
      </Container>{" "}
      <ConvBg darkMode={darkMode} />
    </Paper>
  );
}

export default Hero;
