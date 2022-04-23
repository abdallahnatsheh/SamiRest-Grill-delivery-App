import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { FONTS, SIZES, COLORS, icons } from "../../constants";
import AuthLayout from "./AuthLayout";
import {
  FormInput,
  CustomSwitch,
  TextButton,
  TextIconButton,
} from "../../Components";
import utils from "../../utils/Utils";

const SignUp = ({ navigation }) => {
  //email is here
  const [email, setEmail] = React.useState("");
  //email password is here
  const [password, setPassword] = React.useState("");
  //confirm password
  const [confirmPassword, setconfirmPassword] = React.useState("");
  //confirm password error
  const [confirmPasswordError, setconfirmPasswordError] = React.useState("");

  //email vallidations errors
  const [emailError, setEmailError] = React.useState("");
  //show password or not
  const [showPass, setShowPass] = React.useState(false);

  //function to check if everything validate to enable signin
  function isEnableSignUp() {
    return (
      email != "" &&
      password != "" &&
      confirmPassword != "" &&
      password === confirmPassword &&
      confirmPasswordError == "" &&
      emailError == ""
    );
  }
  return (
    <AuthLayout title="مرحبا بك !" subtitle="انشئ حساب للإستمرار">
      <View style={{ flex: 1, marginTop: SIZES.padding * 2 }}>
        {/**FORM INPUT */}
        <FormInput
          label="البريد الالكتروني"
          keyboardType="email-address"
          autoCompleteType="email"
          onChange={(value) => {
            //validate email
            utils.validateEmail(value, setEmailError);
            setEmail(value);
          }}
          errorMsg={emailError}
          appendComponent={
            //its for validation marks if good or not
            <View style={{ justifyContent: "center" }}>
              <Image
                source={
                  email == "" || (email != "" && emailError == "")
                    ? icons.correct
                    : icons.cross
                }
                style={{
                  height: 20,
                  width: 20,
                  tintColor:
                    email == ""
                      ? COLORS.gray
                      : email != "" && emailError == ""
                      ? COLORS.green
                      : COLORS.red,
                }}
              />
            </View>
          }
        />
        <FormInput
          label="كلمة السر"
          secureTextEntry={!showPass}
          autoCompleteType="password"
          containerStyle={{ marginTop: SIZES.radius }}
          onChange={(value) => {
            setPassword(value);
          }}
          appendComponent={
            //its show password or hide it
            <TouchableOpacity
              style={{
                width: 40,
                justifyContent: "center",
              }}
              onPress={() => setShowPass(!showPass)}
            >
              <Image
                source={showPass ? icons.eye_close : icons.eye}
                style={{ height: 20, width: 20, tintColor: COLORS.gray }}
              />
            </TouchableOpacity>
          }
        />
        <FormInput
          label="تأكيد كلمة المرور"
          secureTextEntry={!showPass}
          autoCompleteType="password"
          containerStyle={{ marginTop: SIZES.radius }}
          onChange={(value) => {
            console.log("conf password: ", confirmPassword);
            //validate confirm password
            if (value == "") {
              setconfirmPasswordError("");
            } else if (value != password && value != "") {
              setconfirmPasswordError("Passwords are not the same");
            }
            setconfirmPassword(value);
          }}
          errorMsg={confirmPasswordError}
          appendComponent={
            //its for validation marks if good or not
            <View style={{ justifyContent: "center" }}>
              <Image
                source={
                  confirmPassword == "" ||
                  (confirmPassword != "" && confirmPasswordError == "")
                    ? icons.correct
                    : icons.cross
                }
                style={{
                  height: 20,
                  width: 20,
                  tintColor:
                    confirmPassword == ""
                      ? COLORS.gray
                      : confirmPassword != "" && confirmPasswordError == ""
                      ? COLORS.green
                      : COLORS.red,
                }}
              />
            </View>
          }
        />
        {/**SIGN IN  */}
        <TextButton
          label="اشتراك"
          buttonContainerStyle={{
            height: 55,
            alignItems: "center",
            marginTop: SIZES.padding,
            borderRadius: SIZES.radius,
            backgroundColor: isEnableSignUp()
              ? COLORS.primary
              : COLORS.transparentPrimray,
          }}
          onPress={() => navigation.navigate("Home")}
          disabled={isEnableSignUp() ? false : true}
        />

        {/**SIGN UP */}
        <View
          style={{
            flexDirection: "row",
            marginTop: SIZES.radius,
            justifyContent: "center",
          }}
        >
          <TextButton
            label={"سجل الاّن"}
            buttonContainerStyle={{
              marginRight: 3,
              backgroundColor: null,
            }}
            labelStyle={{ color: COLORS.primary, ...FONTS.h3 }}
            onPress={() => navigation.goBack()}
          />
          <Text style={{ color: COLORS.darkGray, ...FONTS.body3 }}>
            الديك حساب بالفعل ؟
          </Text>
        </View>
      </View>
    </AuthLayout>
  );
};

export default SignUp;
