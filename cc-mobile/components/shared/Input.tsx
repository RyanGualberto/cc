import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Eye, EyeOff, LucideIcon } from 'lucide-react-native';
import { Colors } from "@/constants/Colors";
import { useState } from "react";

type InputProps = TextInput['props'] & {
  placeholder?: string;
  style?: any;
  Icon?: LucideIcon,
  iconColor?: string;
  iconSize?: number;
}

export default function Input({
  placeholder = "placeholder",
  Icon,
  iconColor = "white",
  iconSize = 18,
  style,
  ...rest
}: InputProps) {
  const [showPassword, setShowPassword] = useState(rest.secureTextEntry)
  const PasswordIcon = showPassword ? Eye : EyeOff
  return (
    <View style={styles.container}>
      {Icon && <Icon
        size={iconSize}
        color={iconColor}
      />}
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={Colors.input_text_color}
        style={styles.input}
        
        {...rest}
        secureTextEntry={showPassword}
      />
      {
        rest.secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{ justifyContent: 'center',}}
            activeOpacity={0.8}
          >
            {rest.secureTextEntry && <PasswordIcon size={iconSize} color={Colors.input_text_color} />}
          </TouchableOpacity>
        )
      }
    </View >
  )
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.input_background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.main_border_color,
    paddingHorizontal: 18,
    gap: 18,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: Colors.input_text_color,
    height: 44
  }
})