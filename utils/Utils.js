import { min } from "react-native-reanimated";

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

function validatePassword(value, setPasswordError) {
  if (value.length < 9) {
    setPasswordError("Password must be 9 characters");
  } else {
    setPasswordError("");
  }
}

function validateInput(value, minLength, setError) {
  if (value.length < minLength) {
    setError("Invalid Input");
  } else {
    setError("");
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
//valide names
function validateName(name, minLength, maxLength, setError) {
  const nameArabicRegex = /^[\u0621-\u064A\u0660-\u0669 ]+$/i;
  if (name == "") {
    setError("الاسم مطلوب");
  } else if (name.length < minLength || name.length > maxLength) {
    setError("الاسم غير صالح");
  } else if (!nameArabicRegex.test(name)) {
    setError("الاسم باللغة العربية فقط");
  } else {
    setError("");
  }
}

const utils = {
  validateName,
  isValidEmail,
  validateEmail,
  validatePassword,
  validateInput,
  calculateAngle,
};

export default utils;
