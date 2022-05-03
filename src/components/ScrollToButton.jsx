import React from 'react';
import { scrollTo } from '../utils/sctollTo';
import { Button, keyframes } from '@mui/material';

const grow = keyframes`
  from {
    width: 5%;
  }
  to {
    width: 100%;
  }
`;

const ScrollToButton = ({
  toRef,
  duration,
  children,
  onClick,
  isModal,
  item,
}) => {
  const handleMenuClick = () => {
    scrollTo({ id: item.href, ref: toRef, duration });
    if (onClick) {
      onClick();
    }
  };

  return (
    <Button
      onClick={handleMenuClick}
      aria-label={item.nameRu}
      sx={[
        {
          display: { xs: `${!isModal ? 'none' : 'block'}`, md: 'block' },
          paddingY: '15px',
          fontWeight: '500',
          position: 'relative',
          width: `${isModal && '100%'}`,
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
      color={'primary'}
      variant={`${isModal ? 'outlined' : 'button'}`}
      underline={'none'}
      mr={2}
    >
      {item.nameRu}
    </Button>
  );
};

export default ScrollToButton;
