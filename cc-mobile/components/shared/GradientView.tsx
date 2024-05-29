import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";
import { Dimensions } from "react-native";

type GradientViewProps = LinearGradientProps & {
  colors: [string, string]
  children: React.ReactNode;
};

export default function GradientView({ colors, children, ...rest }: GradientViewProps) {
  const { height } = Dimensions.get("window");

  return (
    <LinearGradient
      colors={colors}
      locations={[0, 0.6]}
      {...rest}
      style={[{ height }, rest.style]}
    >
      {children}
    </LinearGradient>
  );
}