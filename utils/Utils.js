import { Linking } from "react-native";

function isValidEmail(value) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(value).toLowerCase());
}

function validateEmail(value, setEmailError) {
  if (value == "") {
    setEmailError("");
  } else if (isValidEmail(value)) {
    setEmailError("");
  } else {
    setEmailError("البريد الالكتروني غير صالح");
  }
}

function calculateAngle(coordinates) {
  let startLat = coordinates[0]["latitude"];
  let startLng = coordinates[0]["longitude"];
  let endLat = coordinates[1]["latitude"];
  let endLng = coordinates[1]["longitude"];
  let dx = endLat - startLat;
  let dy = endLng - startLng;

  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

//calculate final price
const handleFinalPrice = (
  item,
  foodTypeAddon,
  foodTypeValue,
  neededQuantitiy
) => {
  let TypeSum = 0;
  if (foodTypeAddon.length > 0) {
    foodTypeAddon.map((addon) =>
      item.price.addons.find((add, i) => {
        if (add.name === addon.name) {
          TypeSum += Number(add.value);
        }
      })
    );
  } else {
    TypeSum = 0;
  }
  let sum =
    (item.price.types.length > 0
      ? item.price.types[foodTypeValue].value + TypeSum
      : item.price.defaultPrice.value + TypeSum) * neededQuantitiy;
  let finalprice =
    (item.deals.enabled && !item.deals.dailyDealEnable) ||
    (item.deals.enabled && item.deals.dailyDealEnable)
      ? sum - (sum * item.deals.value) / 100
      : sum;
  return finalprice.toFixed(2);
};
function dialCall(number) {
  let phoneNumber = "";
  if (Platform.OS === "android") {
    phoneNumber = `tel:0${number}`;
  } else {
    phoneNumber = `telprompt:0${number}`;
  }
  Linking.openURL(phoneNumber);
}
const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const utils = {
  isValidEmail,
  validateEmail,
  calculateAngle,
  handleFinalPrice,
  dialCall,
  wait,
};

export default utils;
