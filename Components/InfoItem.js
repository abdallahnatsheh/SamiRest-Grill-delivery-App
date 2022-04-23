import React from "react";
import { View, Text } from "react-native";

import { LineDivider } from "../Components";
import { COLORS, FONTS } from "../constants";

const InfoItem = ({ label, value, withDivider = true }) => {
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          height: 70,
          alignItems: "center",
        }}
      >
        <Text style={{ flex: 1, textAlign: "left", ...FONTS.body3 }}>
          {value}
        </Text>
        <Text style={{ color: COLORS.gray, ...FONTS.body3 }}>{label}</Text>
      </View>

      {withDivider && (
        <LineDivider
          lineStyle={{
            backgroundColor: COLORS.lightGray1,
          }}
        />
      )}
    </>
  );
};

export default InfoItem;
