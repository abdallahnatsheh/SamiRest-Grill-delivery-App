import React from "react";
import { TouchableOpacity, Image } from "react-native";
import { COLORS } from "../constants";

const IconBotton = ({ containerStyle, icon, iconStyle, onPress, disabled }) => {
  return (
    <TouchableOpacity
      style={{ ...containerStyle }}
      onPress={onPress}
      disabled={disabled}
    >
      <Image
        source={icon}
        style={{ width: 30, height: 30, tintColor: COLORS.white, ...iconStyle }}
      />
    </TouchableOpacity>
  );
};
export default IconBotton;
