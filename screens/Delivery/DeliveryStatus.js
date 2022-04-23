import React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import {
  Header,
  TextButton,
  LineDivider,
  TextIconButton,
} from "../../Components";
import { FONTS, COLORS, SIZES, icons, constants } from "../../constants";

const DeliveryStatus = ({ navigation }) => {
  //KEEP TRACKING STATE VALUE
  const [currentState, setCurrentState] = React.useState(2);
  function renderHeader() {
    return (
      <Header
        title="DELIVERY STATUS"
        containerStyle={{
          height: 50,
          marginHorizontal: SIZES.padding,
          marginTop: 40,
        }}
      />
    );
  }
  function renderInfo() {
    return (
      <View
        style={{ marginTop: SIZES.radius, paddingHorizontal: SIZES.padding }}
      >
        <Text
          style={{ textAlign: "center", color: COLORS.gray, ...FONTS.body4 }}
        >
          Estimated Delivery
        </Text>
        <Text style={{ textAlign: "center", ...FONTS.h2 }}>
          SEPT 2021 / 12:30PM
        </Text>
      </View>
    );
  }
  function renderTrackOrder() {
    return (
      <View
        style={{
          marginTop: SIZES.padding,
          paddingVertical: SIZES.padding,
          borderRadius: SIZES.radius,
          borderWidth: 2,
          borderColor: COLORS.lightGray2,
          backgroundColor: COLORS.white,
        }}
      >
        {/*TRACK ORDER AND ORDER ID */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
            paddingHorizontal: SIZES.padding,
          }}
        >
          <Text style={{ ...FONTS.h3 }}>Track Order</Text>
          <Text style={{ color: COLORS.gray, ...FONTS.body3 }}>ID324DF344</Text>
        </View>
        <LineDivider lineStyle={{ backgroundColor: COLORS.lightGray2 }} />
        <View
          style={{ marginTop: SIZES.padding, paddingHorizontal: SIZES.padding }}
        >
          {constants.track_order_status.map((item, index) => {
            return (
              <View key={`StatusList-${index}`}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginVertical: -5,
                  }}
                >
                  <Image
                    source={icons.check_circle}
                    style={{
                      width: 40,
                      height: 40,
                      tintColor:
                        index <= currentState
                          ? COLORS.primary
                          : COLORS.lightGray1,
                    }}
                  />
                  <View style={{ marginLeft: SIZES.radius }}>
                    <Text style={{ ...FONTS.h3 }}>{item.title}</Text>
                    <Text style={{ color: COLORS.gray, ...FONTS.body4 }}>
                      {item.sub_title}
                    </Text>
                  </View>
                </View>
                {/**if we are not on the last item we will render the line  */}
                {index < constants.track_order_status.length - 1 && (
                  <View>
                    {index < currentState && (
                      <View
                        style={{
                          height: 50,
                          width: 3,
                          marginLeft: 18,
                          backgroundColor: COLORS.primary,
                          zIndex: -1,
                        }}
                      />
                    )}
                    {index >= currentState && (
                      <Image
                        source={icons.dotted_line}
                        resizeMode="cover"
                        style={{
                          height: 50,
                          width: 4,
                          marginLeft: 17,
                        }}
                      />
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>
    );
  }
  function renderFooter() {
    return (
      <View style={{ marginTop: SIZES.radius, marginBottom: SIZES.padding }}>
        {currentState < constants.track_order_status.length - 1 && (
          <View style={{ flexDirection: "row", height: 55 }}>
            {/** cancel button */}
            <TextButton
              buttonContainerStyle={{
                width: "40%",
                borderRadius: SIZES.base,
                backgroundColor: COLORS.lightGray2,
              }}
              label="Cancel"
              labelStyle={{ color: COLORS.primary }}
              onPress={() => navigation.navigate("Home")}
            />
            {/**mapView button */}
            <TextIconButton
              containerStyle={{
                flex: 1,
                marginLeft: SIZES.radius,
                borderRadius: SIZES.base,
                backgroundColor: COLORS.primary,
              }}
              label="Map View"
              labelStyle={{ color: COLORS.white, ...FONTS.h3 }}
              icon={icons.map}
              iconPosition="LEFT"
              iconStyle={{
                width: 25,
                height: 25,
                marginRight: SIZES.base,
                tintColor: COLORS.white,
              }}
              onPress={() => navigation.navigate("Map")}
            />
          </View>
        )}
        {currentState >= constants.track_order_status.length - 1 && (
          <TextButton
            buttonContainerStyle={{ height: 55, borderRadius: SIZES.base }}
            label="DONE"
            onPress={() => navigation.navigate("Home")}
          />
        )}
      </View>
    );
  }
  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: SIZES.padding,
        backgroundColor: COLORS.white,
      }}
    >
      {/**HEADER */}
      {renderHeader()}
      {/**INFO */}
      {renderInfo()}

      {/**TRACK ORDER */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderTrackOrder()}
      </ScrollView>

      {/**FOOTER */}
      {renderFooter()}
    </View>
  );
};

export default DeliveryStatus;
