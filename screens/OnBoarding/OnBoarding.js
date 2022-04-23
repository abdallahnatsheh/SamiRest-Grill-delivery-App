import React from "react";
import { View, Text, ImageBackground, Image, Animated } from "react-native";
import { constants, COLORS, SIZES, images, FONTS } from "../../constants";
//ON BOARDING SCREEN COMPONENET
const OnBoarding = () => {
  function renderHomeLogo() {
    return (
      <View
        style={{
          position: "absolute",
          top: SIZES.height > 800 ? 50 : 25,
          left: 0,
          right: 0,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={images.logo_02}
          resizeMode="contain"
          style={{ width: SIZES.width * 50, height: 100 }}
        />
      </View>
    );
  }
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}
    >
      {renderHomeLogo()}
      <Animated.FlatList
        horizontal
        pagingEnabled
        data={constants.onboarding_screens}
        scrollEventThrottle={16}
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => `${item.id}`}
        renderItem={({ item, index }) => {
          return (
            <View style={{ width: SIZES.width }}>
              {/**HEADER SECTION */}
              <View style={{ flex: 3 }}>
                <ImageBackground
                  source={item.backgroundImage}
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "flex-end",
                    height: "100%",
                    width: "100%",
                  }}
                ></ImageBackground>
              </View>
              {/**DETAIL SECTION */}
            </View>
          );
        }}
      ></Animated.FlatList>
    </View>
  );
};

export default OnBoarding;
