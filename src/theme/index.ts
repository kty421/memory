import { colors } from "./colors";
import { spacing } from "./spacing";
import { typography } from "./typography";

export const theme = {
  colors,
  spacing,
  typography,
  radius: {
    sm: 10,
    md: 14,
    lg: 18,
    pill: 999
  },
  shadow: {
    card: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2
    }
  }
};

export type Theme = typeof theme;
