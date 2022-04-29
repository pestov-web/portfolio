import React from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import '../css/tsParticles.css';

function TsParticles({ darkMode }) {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <Particles
      className={'canvo'}
      canvasClassName={'canvo__can'}
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: {
            value: darkMode ? '#37383b' : '#ECF2FE',
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
              mode: 'push',
            },
            onHover: {
              enable: true,
              mode: 'repulse',
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
            value: darkMode ? '#ffffff' : '#747a7e',
          },
          links: {
            color: darkMode ? '#5d8e9a' : '#90ACF6',
            distance: 150,
            enable: true,
            opacity: 0.4,
            width: 1,
          },
          collisions: {
            enable: false,
          },
          move: {
            direction: 'none',
            enable: true,
            outModes: {
              default: 'bounce',
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
            type: 'circle',
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

export default TsParticles;
