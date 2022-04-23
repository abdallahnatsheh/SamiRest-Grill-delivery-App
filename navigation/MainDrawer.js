import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import {
  COLORS,
  FONTS,
  SIZES,
  constants,
  icons,
  dummyData,
} from "../constants";
import { MainLayout } from "../screens";
import { connect } from "react-redux";
import { setSelectedTab } from "../stores/tab/tabAction";
const Drawer = createDrawerNavigator();

const CustomDrawerItem = ({ label, icon, isFocused, onPress }) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        height: 40,
        marginBottom: SIZES.base,
        alignItems: "center",
        paddingLeft: SIZES.radius,
        borderRadius: SIZES.base,
        backgroundColor: isFocused ? COLORS.transparentBlack1 : null,
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
const CustomDrawerContent = ({ navigation, selectedTab, setSelectedTab }) => {
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
            navigation.closeDrawer();
            navigation.navigate("MyAccount");
          }}
        >
          <View style={{ marginRight: SIZES.radius }}>
            <Text style={{ color: COLORS.white, ...FONTS.h3 }}>
              {dummyData.myProfile?.name}
            </Text>
            <Text style={{ color: COLORS.white, ...FONTS.body4 }}>
              إعدادات الحساب
            </Text>
          </View>
          <Image
            source={dummyData.myProfile?.profile_image}
            style={{ width: 50, height: 50, borderRadius: SIZES.radius }}
          />
        </TouchableOpacity>
        {/**drawer items */}
        <View style={{ flex: 1, marginTop: SIZES.padding }}>
          <CustomDrawerItem
            label={constants.screens.home}
            icon={icons.home}
            isFocused={selectedTab == constants.screens.home}
            onPress={() => {
              setSelectedTab(constants.screens.home);
              navigation.navigate("MainLayout");
            }}
          />
          <CustomDrawerItem
            label={constants.screens.mainMenu}
            icon={icons.restaurantMenu}
            onPress={() => {
              navigation.closeDrawer();
              navigation.navigate("MainMenu");
            }}
          />
          <CustomDrawerItem
            label={constants.screens.dailyDeals}
            icon={icons.coupon}
            onPress={() => {
              navigation.closeDrawer();
              navigation.navigate("DailyDeals");
            }}
          />
          <CustomDrawerItem
            label={constants.screens.specialOrders}
            icon={icons.specialOrder}
            isFocused={selectedTab == constants.screens.specialOrders}
            onPress={() => {
              navigation.closeDrawer();
              setSelectedTab(constants.screens.specialOrders);
              navigation.navigate("MainLayout");
            }}
          />

          {/**Line Divider */}
          <View
            style={{
              height: 1,
              marginVertical: SIZES.radius,
              marginLeft: SIZES.radius,
              backgroundColor: COLORS.lightGray1,
            }}
          />
          <CustomDrawerItem label="تتبع طلبك" icon={icons.location} />
          <CustomDrawerItem label="الكوبونات" icon={icons.coupon} />
          <CustomDrawerItem
            label="الاعدادات"
            icon={icons.setting}
            onPress={() => {
              navigation.closeDrawer();
              navigation.navigate("Settings");
            }}
          />
          <CustomDrawerItem
            label="الدعم الفني"
            icon={icons.help}
            onPress={() => {
              navigation.closeDrawer();
              navigation.navigate("Support");
            }}
          />
        </View>
        <View style={{ marginBottom: SIZES.padding }}>
          <CustomDrawerItem
            label="تسجيل الخروج"
            icon={icons.logout}
            onPress={() => navigation.replace("SignIn")}
          />
        </View>
      </View>
    </DrawerContentScrollView>
  );
};
const MainDrawer = ({ selectedTab, setSelectedTab }) => {
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
          <CustomDrawerContent
            navigation={props.navigation}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        )}
      >
        <Drawer.Screen name="MainLayout">
          {(props) => <MainLayout {...props} />}
        </Drawer.Screen>
      </Drawer.Navigator>
    </View>
  );
};

function mapStateToProps(state) {
  return { selectedTab: state.tabReducer.selectedTab };
}
function mapDispatchToProps(dispatch) {
  return {
    setSelectedTab: (selectedTab) => {
      return dispatch(setSelectedTab(selectedTab));
    },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(MainDrawer);