import { Linking } from "react-native";
///here contains function used by components

function isValidEmail(value) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(value).toLowerCase());
}
// validate email
function validateEmail(value, setEmailError) {
  if (value == "") {
    setEmailError("");
  } else if (isValidEmail(value)) {
    setEmailError("");
  } else {
    setEmailError("البريد الالكتروني غير صالح");
  }
}
//calculate angle for map marker
function calculateAngle(coordinates) {
  let startLat = coordinates[0]["latitude"];
  let startLng = coordinates[0]["longitude"];
  let endLat = coordinates[1]["latitude"];
  let endLng = coordinates[1]["longitude"];
  let dx = endLat - startLat;
  let dy = endLng - startLng;

  return (Math.atan2(dy, dx) * 180) / Math.PI;
}
// call a specific number
function dialCall(number) {
  let phoneNumber = "";
  if (Platform.OS === "android") {
    phoneNumber = `tel:0${number}`;
  } else {
    phoneNumber = `telprompt:0${number}`;
  }
  Linking.openURL(phoneNumber);
}

const utils = {
  isValidEmail,
  validateEmail,
  calculateAngle,
  dialCall,
};

export default utils;
