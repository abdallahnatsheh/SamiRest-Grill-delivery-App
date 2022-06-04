import { doc, updateDoc } from "firebase/firestore";
import React from "react";
import { View, Text, Alert } from "react-native";
import {
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { Header, TextButton, IconBotton } from "../../Components";
import { FONTS, COLORS, SIZES, icons } from "../../constants";
import { useAuth } from "../../context/AuthContext";
import { utils } from "../../utils";
import { db } from "../../Firebase/firebase.Config";
// this component draw order list for today only

const OrderList = ({ navigation, route }) => {
  const { orderItem } = route.params;
  const { currentUser } = useAuth();
  // this is the header contain name of the page and buttons in this situation a button to go to pervious page
  function renderHeader() {
    return (
      <Header
        title="قائمة الطلبية"
        containerStyle={{
          height: 50,
          marginHorizontal: SIZES.padding,
          marginTop: 40,
        }}
        leftComponent={
          <IconBotton
            icon={icons.back}
            containerStyle={{
              width: 40,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderRadius: SIZES.radius,
              borderColor: COLORS.gray2,
            }}
            iconStyle={{
              width: 20,
              height: 20,
              tintColor: COLORS.gray2,
            }}
            onPress={() => navigation.goBack()}
          />
        }
      />
    );
  }
  //this draw customer info like name and phone ...
  function customerInfo() {
    return (
      <ScrollView>
        <View
          style={{
            marginTop: SIZES.padding,
            paddingVertical: SIZES.padding,
            borderRadius: SIZES.radius,
            borderWidth: 2,
            borderColor: COLORS.lightGray2,
            backgroundColor: COLORS.white,
            marginBottom: SIZES.padding,
          }}
        >
          {/*TRACK ORDER AND ORDER ID */}
          <View
            style={{
              justifyContent: "space-between",
              paddingHorizontal: SIZES.padding,
            }}
          >
            <View>
              <Text style={{ padding: 10, ...FONTS.h3 }}>
                اسم الزبون:
                {" " +
                  orderItem.userData.firstName +
                  " " +
                  orderItem.userData.lastName}
              </Text>
              <Text style={{ padding: 10, ...FONTS.h3 }}>
                عنوان الزبون:
                {" " +
                  orderItem.userData.firstAddress +
                  " " +
                  orderItem.userData.secondAddress}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  utils.dialCall(orderItem.userData.phoneNumber.slice(1))
                }
              >
                <Text
                  style={{ padding: 10, ...FONTS.h3, color: COLORS.primary }}
                >
                  رقم الهاتف:{" " + orderItem.userData.phoneNumber}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
  function renderTrackOrder(item) {
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
            paddingHorizontal: SIZES.padding,
          }}
        >
          <Text style={{ color: COLORS.darkGray, ...FONTS.body3 }}>
            {item.totalPrice}₪
          </Text>
          <View>
            <Text style={{ ...FONTS.h3 }}>{item.name}</Text>
            {item.price.types.length > 0 && (
              <Text style={{ ...FONTS.body4, color: COLORS.black }}>
                {item?.price?.types[item?.types]?.name}
              </Text>
            )}
            {item.addons.length > 0 && (
              <Text style={{ ...FONTS.body5, color: COLORS.darkGray }}>
                {item.addons.map((addon) => addon.name + ",")}
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  }
  const handleStartDelivery = () => {
    const userData = doc(db, "AdminEmp", currentUser.uid);
    updateDoc(userData, {
      isDelivering: true,
      orderDeliverNow: orderItem.id,
    })
      .then(() => {
        const orderData = doc(db, "orders", orderItem.id);
        updateDoc(orderData, {
          status: "قيد التوصيل",
        })
          .then(() => {
            navigation.navigate("Map", {
              dataUser: orderItem,
              id: orderItem.id,
            });
          })
          .catch((error) => {
            console.log("write delivery details error:", error);
            Alert.alert("خطأ", "خطأ في الخدمة", [{ text: "حسناً" }]);
          });
      })
      .catch((error) => {
        console.log("write delivery details error:", error);
        Alert.alert("خطأ", "خطأ في الخدمة", [{ text: "حسناً" }]);
      });
  };

  function renderFooter() {
    return (
      <View style={{ marginTop: SIZES.radius, marginBottom: SIZES.padding }}>
        {orderItem.shippingFee && (
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
                paddingHorizontal: SIZES.padding,
              }}
            >
              <Text style={{ color: COLORS.darkGray, ...FONTS.body3 }}>
                {orderItem.shippingFee}₪
              </Text>
              <View>
                <Text style={{ ...FONTS.h3 }}> التوصيل</Text>
              </View>
            </View>
          </View>
        )}
        {customerInfo()}
        <TextButton
          buttonContainerStyle={{ height: 55, borderRadius: SIZES.base }}
          label="تم"
          onPress={() => navigation.goBack()}
        />
        {orderItem.status == "قيد الطبخ" && (
          <TextButton
            buttonContainerStyle={{
              height: 55,
              borderRadius: SIZES.base,
              marginTop: SIZES.padding,
            }}
            label="توصيل الطلبية"
            onPress={() =>
              Alert.alert("بدء التوصيل", "هل تريد فعلا بدأ توصيل الطلبية", [
                {
                  text: "ليس الاّن",
                },
                {
                  text: "أكيد",
                  onPress: () => handleStartDelivery(),
                },
              ])
            }
          />
        )}
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
      {renderHeader()}
      <FlatList
        data={orderItem.orders}
        keyExtractor={(item) => `${item.id}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: SIZES.padding }}
        renderItem={({ item }) => {
          return renderTrackOrder(item);
        }}
        ListFooterComponent={renderFooter()}
      />
    </View>
  );
};

export default OrderList;
