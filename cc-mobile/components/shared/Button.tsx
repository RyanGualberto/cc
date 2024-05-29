import { Colors } from "@/constants/Colors";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";

type ButtonProps = TouchableOpacity['props'] & {
  variant?: 'primary' | 'disabled';
  label?: string;
  loading?: boolean;
};

export default function Button({
  style,
  variant = "primary",
  label,
  loading,
  ...rest
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        style
      ]}
      activeOpacity={0.8}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={Colors.pure_black} />
      ) : (
        <Text
          style={[
            fontColor[variant],
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderWidth: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primary: {
    backgroundColor: Colors.primary_color,
    borderColor: Colors.dark_primary_color,
    shadowColor: Colors.primary_color,
    shadowOffset: {
      width: 6,
      height: 6,
    },
    shadowRadius: 1,
    elevation: 10,
  },
  disabled: {
    backgroundColor: Colors.surface,
    borderColor: Colors.main_border_color,
  },
})

const fontColor = StyleSheet.create({
  primary: {
    color: Colors.pure_black,
    fontSize: 16,
  },
  disabled: {
    color: Colors.input_text_color,
    fontSize: 16,
  }
})