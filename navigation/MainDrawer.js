import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { COLORS, FONTS, SIZES, constants, icons, images } from "../constants";
import { MainLayout } from "../screens";
import { useAuth } from "../context/AuthContext";
const Drawer = createDrawerNavigator();

const CustomDrawerItem = ({ label, icon, onPress }) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        height: 40,
        marginBottom: SIZES.base,
        alignItems: "center",
        paddingLeft: SIZES.radius,
        borderRadius: SIZES.base,
        backgroundColor: COLORS.transparentBlack1,
      }}
      onPress={onPress}
    >
      <Image
        source={icon}
        style={{ width: 20, height: 20, tintColor: COLORS.white }}
      />
      <Text style={{ marginLeft: 15, color: COLORS.white, ...FONTS.h3 }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};
const CustomDrawerContent = ({ navigation }) => {
  const { currentUser, dataUser, logout } = useAuth();

  //here we fill the drawer with this custom drawer as we want
  return (
    <DrawerContentScrollView
      scrollEnabled={true}
      contentContainerStyle={{ flex: 1 }}
    >
      <View style={{ flex: 1, paddingHorizontal: SIZES.radius }}>
        {/*close drawer option */}
        <View style={{ alignItems: "flex-start", justifyContent: "center" }}>
          <TouchableOpacity
            style={{ alignItems: "center", justifyContent: "center" }}
            onPress={() => navigation.closeDrawer()}
          >
            <Image
              source={icons.cross}
              style={{
                height: 35,
                width: 35,
                tintColor: COLORS.white,
              }}
            />
          </TouchableOpacity>
        </View>
        {/**profile name and picture */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            marginTop: SIZES.radius,
            alignItems: "center",
          }}
          onPress={() => {
            if (currentUser) {
              navigation.closeDrawer();
              navigation.navigate("MyAccount");
            } else {
              navigation.navigate("SignIn");
            }
          }}
        >
          <View style={{ marginRight: SIZES.radius }}>
            <Text style={{ color: COLORS.white, ...FONTS.h3 }}>
              {currentUser
                ? dataUser.firstName
                  ? dataUser.firstName
                  : "قم بتعبئة معلوماتك"
                : "سجل دخولك اولا"}
            </Text>
            <Text style={{ color: COLORS.white, ...FONTS.body4 }}>
              إعدادات الحساب
            </Text>
          </View>
          <Image
            source={
              dataUser.personalImage
                ? { uri: dataUser.personalImage }
                : images.profile
            }
            style={{ width: 50, height: 50, borderRadius: SIZES.radius }}
          />
        </TouchableOpacity>
        {/**drawer items */}
        <View style={{ flex: 1, marginTop: SIZES.padding }}>
          <CustomDrawerItem
            label={constants.screens.home}
            icon={icons.home}
            onPress={() => {
              navigation.closeDrawer();
              navigation.navigate("MainLayout");
            }}
          />
          <CustomDrawerItem
            label={constants.screens.settings}
            icon={icons.setting}
            onPress={() => {
              navigation.closeDrawer();
              navigation.navigate("Settings");
            }}
          />
          <CustomDrawerItem
            label={constants.screens.support}
            icon={icons.help}
            onPress={() => {
              navigation.closeDrawer();
              navigation.navigate("Support");
            }}
          />
        </View>
        {currentUser && (
          <View style={{ marginBottom: SIZES.padding }}>
            <CustomDrawerItem
              label="تسجيل الخروج"
              icon={icons.logout}
              onPress={async () => {
                await logout();
                navigation.replace("Home");
              }}
            />
          </View>
        )}
      </View>
    </DrawerContentScrollView>
  );
};
const MainDrawer = ({}) => {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <Drawer.Navigator
        screenOptions={{
          drawerType: "slide",
          overlayColor: "transparent",
          headerShown: false,
          drawerPosition: "right",
          drawerStyle: {
            flex: 1,
            width: "65%",
            paddingRight: 20,
            backgroundColor: "transparent",
          },
          sceneContainerStyle: {
            backgroundColor: "transparent",
          },
        }}
        initialRouteName="MainLayout"
        drawerContent={(props) => (
          <CustomDrawerContent navigation={props.navigation} />
        )}
      >
        <Drawer.Screen name="MainLayout">
          {(props) => <MainLayout {...props} />}
        </Drawer.Screen>
      </Drawer.Navigator>
    </View>
  );
};

export default MainDrawer;
