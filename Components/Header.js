import React from "react";
import { View, Text } from "react-native";
import { FONTS } from "../constants";

const Header = ({
  title,
  titleStyle,
  containerStyle,
  leftComponent,
  rightComponent,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        height: 60,
        ...containerStyle,
      }}
    >
      {/**left buttom drawer */}
      {leftComponent}
      {/**tab title */}
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ ...FONTS.h3, ...titleStyle }}>{title}</Text>
      </View>
      {/**profile image */}
      {rightComponent}
    </View>
  );
};
export default Header;
