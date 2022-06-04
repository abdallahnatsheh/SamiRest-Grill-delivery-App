import { doc, getDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
} from "react-native";
import { OrderCard } from "../../Components";
import { COLORS, SIZES, FONTS, icons, dummyData } from "../../constants";
import { useAuth } from "../../context/AuthContext";
import { useProfileOrdersHook } from "../../Hooks/profileOrdersHook";
import { db } from "../../Firebase/firebase.Config";
import axios from "axios";

const Home = ({ navigation }) => {
  //import the data of the user
  const { currentUser, dataUser } = useAuth();
  //get order data from this custom hook
  const [ordersList, length] = useProfileOrdersHook();
  //this state contains order list of today date
  const [filteredOrder, setFilteredOrder] = useState([]);
  //get today date and time
  const [today, setToday] = React.useState("");

  //here this hook will filter the order list for deliver order only that have today's date
  //but the worker want a previous order he can write the id of it in the search bar
  useEffect(async () => {
    if (dataUser.isDelivering === true && dataUser.orderDeliverNow != "") {
      const docRef = doc(db, "orders", dataUser.orderDeliverNow);
      const docSnap = await getDoc(docRef);
      console.log("docSnap: ", docSnap.data());
      navigation.replace("Map", {
        dataUser: docSnap.data(),
        id: dataUser.orderDeliverNow,
      });
    } else {
      setFilteredOrder(bookorderlistmaker());
    }
  }, [ordersList, length, currentUser, dataUser]);
  //get currnet israel time from external api
  React.useEffect(() => {
    function getCurrentTime() {
      axios
        .get(`http://worldtimeapi.org/api/timezone/Asia/Jerusalem`)
        .then((res) => {
          setToday(new Date(JSON.stringify(res.data.datetime).slice(1, -1)));
        });
    }
    getCurrentTime();
  }, []);
  //filter order list to the deliver type of orders
  //works by getting today's date and then filter the result by type
  //and then filter it by date
  function bookorderlistmaker() {
    if (ordersList.length > 0) {
      const date =
        today.getFullYear() +
        "-0" +
        (today.getMonth() + 1) +
        "-0" +
        today.getDate();

      let tempList = ordersList.filter((item) => item.orderType == "deliver");
      tempList = tempList.filter((item) => item.status == "قيد الطبخ");
      tempList = tempList.filter((item) => item.date == date);
      console.log(date);
      console.log(tempList.length);
      return tempList;
    }
    return [];
  }

  //rednder delivery order list
  function renderOrders() {
    return (
      <View
        style={{
          flex: 1,
          paddingTop: SIZES.padding,
          paddingHorizontal: SIZES.padding,
        }}
      >
        <FlatList
          data={filteredOrder}
          keyExtractor={(item) => `${item.id}`}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <OrderCard orderItem={item} dataUser={dataUser} />
          )}
          ListFooterComponent={
            <View style={{ height: 230 }}>
              <TouchableOpacity
                onPress={() => {
                  navigation.replace("Home");
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    justifyContent: "center",
                    padding: 10,
                    color: COLORS.primary,
                    ...FONTS.h4,
                  }}
                >
                  اضغط هنا للتحديث
                </Text>
              </TouchableOpacity>
              <View style={{ paddingTop: 500, height: 60 }}>
                <Text></Text>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View>
              <Text
                style={{
                  textAlign: "center",
                  justifyContent: "center",
                  padding: 10,
                  ...FONTS.h2,
                }}
              >
                لا يوجد طلبات حتى الان
              </Text>
            </View>
          }
        />
      </View>
    );
  }
  //search bar that the worker can use to search by order id
  function renderSearch() {
    return (
      <View
        style={{
          flexDirection: "row",
          height: 40,
          alignItems: "center",
          marginHorizontal: SIZES.padding,
          marginVertical: SIZES.base,
          paddingHorizontal: SIZES.radius,
          borderRadius: SIZES.radius,
          backgroundColor: COLORS.lightGray2,
        }}
      >
        {/**TEXT INPUT */}
        <TextInput
          style={{
            flex: 1,
            marginRight: SIZES.radius,
            ...FONTS.body3,
            textAlign: "right",
          }}
          placeholder="ابحث عن طلب من خلال رمز تعريفي ..."
          onChangeText={(text) => {
            if (text) {
              let temp = ordersList.filter((a) => a.id.includes(text));
              setFilteredOrder(temp);
            } else {
              setFilteredOrder(bookorderlistmaker());
            }
          }}
        />
        <Image
          source={icons.search}
          style={{ height: 20, width: 20, tintColor: COLORS.black }}
        />
      </View>
    );
  }
  //show the screen if user is logged in , and if orderlist existed
  return currentUser ? (
    ordersList.length >= 0 ? (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.white,
        }}
      >
        {renderSearch()}
        {renderOrders()}
      </View>
    ) : (
      <View style={[styles.container, styles.horizontal]}>
        {renderSearch()}
      </View>
    )
  ) : (
    <View>
      {/** if the worker is not logged in the page will be replaced to signin */}
      <TouchableOpacity
        onPress={navigation.replace("SignIn")}
      ></TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});
export default Home;
