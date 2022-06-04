import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  FlatList,
} from "react-native";
import Home from "./Home/Home";
import {
  COLORS,
  FONTS,
  SIZES,
  icons,
  constants,
  dummyData,
} from "../constants";
import { Header } from "../Components";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../context/AuthContext";
//this component contains main page with tab buttons and drawer menu
const TabButton = ({ label, icons, onPress }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={{
          flex: 4,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            width: "80%",
            height: 40,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 50,
            backgroundColor: COLORS.primary,
          }}
        >
          <Image
            source={icons}
            style={{
              width: 20,
              height: 20,
              tintColor: COLORS.white,
            }}
          />
          {
            <Text
              numberOfLines={1}
              style={{
                marginLeft: SIZES.base,
                color: COLORS.white,
                ...FONTS.h3,
              }}
            >
              {label}
            </Text>
          }
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
//main home page that draws the order list and the side drawer and the header
const MainLayout = ({ navigation }) => {
  const { currentUser, dataUser } = useAuth();
  const flatListRef = React.useRef();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}
    >
      {/**HEADER */}
      <Header
        containerStyle={{
          height: 50,
          paddingHorizontal: SIZES.padding,
          marginTop: 40,
          alignItems: "center",
        }}
        title={constants.screens.home}
        rightComponent={
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: COLORS.gray2,
              borderRadius: SIZES.radius,
            }}
            onPress={() => navigation.openDrawer()}
          >
            <Image source={icons.menu} />
          </TouchableOpacity>
        }
        leftComponent={
          <TouchableOpacity
            style={{
              borderRadius: SIZES.radius,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() =>
              currentUser
                ? navigation.navigate("MyAccount")
                : navigation.navigate("SignIn")
            }
          >
            <Image
              source={
                dataUser?.personalImage
                  ? { uri: dataUser?.personalImage }
                  : dummyData?.myProfile?.profile_image
              }
              style={{ width: 40, height: 40, borderRadius: SIZES.radius }}
            />
          </TouchableOpacity>
        }
      />

      {/**CONTENT */}
      <View style={{ flex: 1 }}>
        <FlatList
          ref={flatListRef}
          horizontal
          scrollEnabled={false}
          pagingEnabled
          snapToAlignment="center"
          snapToInterval={SIZES.width}
          onScrollToIndexFailed={() => {
            flatListRef?.current?.scrollToIndex({
              index: 0,
            });
          }}
          showsHorizontalScrollIndicator={false}
          data={constants.bottom_tabs}
          keyExtractor={(item) => `${item.id}`}
          renderItem={() => {
            return (
              <View style={{ height: SIZES.height, width: SIZES.width }}>
                <Home navigation={navigation} />
              </View>
            );
          }}
        />
      </View>
      {/**FOOTER */}
      <View style={{ height: 75, justifyContent: "flex-end" }}>
        {/**Shadow effect  */}
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 4 }}
          colors={[COLORS.transparent, COLORS.lightGray1]}
          style={{
            position: "absolute",
            top: -20,
            left: 0,
            right: 0,
            height: 100,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          }}
        />
        {/**Tabs */}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            paddingHorizontal: SIZES.radius,
            paddingBottom: 10,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: COLORS.white,
          }}
        >
          <TabButton label={constants.screens.home} icons={icons.home} />
        </View>
      </View>
    </View>
  );
};

export default MainLayout;
