import React from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import "./lol.css";

function ConvBg({ darkMode }) {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <Particles
      className={"canvo"}
      canvasClassName={"canvo__can"}
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: {
            value: darkMode ? "#37383b" : "#e0dcdc",
          },
        },
        fullScreen: {
          enable: false,
        },
        fpsLimit: 60,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: "push",
            },
            onHover: {
              enable: true,
              mode: "repulse",
            },
            resize: true,
          },
          modes: {
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 200,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: darkMode ? "#ffffff" : "#747a7e",
          },
          links: {
            color: darkMode ? "#5499ab" : "#5eb69f",
            distance: 150,
            enable: true,
            opacity: 0.2,
            width: 1,
          },
          collisions: {
            enable: false,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: false,
            speed: 1,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 80,
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 5 },
          },
        },
        detectRetina: true,
      }}
    />
  );
}

export default ConvBg;
