import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
    fonts: {
      heading: `'Single Day', cursive`,
      body: `'Single Day', cursive`,
    },
    styles: {
      global: {
        // This applies to <body> text (and inherited by most text elements)
        body: {
          textShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
          color: "white"
        },
      },
    },
  });