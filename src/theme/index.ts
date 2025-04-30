import { extendTheme } from "@chakra-ui/react";
import "@fontsource/kanit";
import "@fontsource/sarabun";

const theme = extendTheme({
  fonts: {
    heading: "Kanit, sans-serif",
    body: "Sarabun, sans-serif",
  },
  colors: {
    brand: {
      50: "#E8F5E9", // very light green (background sections)
      100: "#A5D6A7", // light green
      500: "#4CAF50", // main green (ป่า)
      600: "#388E3C", // darker green (hover/CTA)
      700: "#2F5233", // forest shade (text titles)
    },
    soil: {
      100: "#D7CCC8", // soft earth
      500: "#8D6E63", // main brown (ดิน)
    },
    mushroom: {
      100: "#F5E7E0", // very light mushroom
      300: "#D7BFB4", // medium light mushroom
      500: "#A1887F", // medium mushroom
      700: "#8D6E63", // darker mushroom brown
      base: "#F5F5DC", // beige/ivory (เห็ดถอบ)
    },
    warning: {
      500: "#FFC107", // for "แจ้งจุด" or notices
    },
    background: "#E8F5E9", // Using brand.50 as the background
  },
  styles: {
    global: {
      body: {
        bg: "background",
        color: "gray.800",
      },
      a: {
        color: "brand.600",
        _hover: {
          textDecoration: "underline",
        },
      },
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: "brand",
        rounded: "lg",
      },
    },
    Card: {
      defaultProps: {
        rounded: "xl",
        shadow: "md",
      },
    },
    Box: {
      variants: {
        card: {
          rounded: "xl",
          shadow: "md",
          bg: "white",
          p: 4,
        },
      },
    },
    Container: {
      baseStyle: {
        maxW: "container.xl",
      },
    },
  },
});

export default theme;
