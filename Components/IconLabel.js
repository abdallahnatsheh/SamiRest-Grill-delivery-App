import React from "react";
import { View, Text, Image } from "react-native";
import { SIZES, COLORS, FONTS, icons, images, dummyData } from "../constants";

const IconLabel = ({ containerStyle, icon, iconStyle, label, labelStyle }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        paddingVertical: SIZES.base,
        paddingHorizontal: SIZES.radius,
        borderRadius: SIZES.radius,
        ...containerStyle,
      }}
    >
      <Text
        style={{
          marginLeft: SIZES.base,
          ...FONTS.body3,
          ...labelStyle,
        }}
      >
        {label}
      </Text>
      <Image source={icon} style={{ width: 20, height: 20, ...iconStyle }} />
    </View>
  );
};
export default IconLabel;
