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
const SignIn = ({ navigation }) => {
  //email is here
  const [email, setEmail] = React.useState("");
  //email password is here
  const [password, setPassword] = React.useState("");
  //email vallidations errors
  const [emailError, setEmailError] = React.useState("");
  //show password or not
  const [showPass, setShowPass] = React.useState(false);
  //save email switch
  const [saveMe, setSaveMe] = React.useState(false);
  //function to check if everything validate to enable signin
  function isEnableSignIn() {
    return email != "" && password != "" && emailError == "";
  }
  return (
    <AuthLayout title="تسجيل الدخول" subtitle="مرحبا بعودتك !">
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
          onChange={(value) => setPassword(value)}
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
        {/**SAVE ME & FORGOT PASSWORD */}
        <View
          style={{
            flexDirection: "row",
            marginTop: SIZES.radius,
            justifyContent: "space-between",
          }}
        >
          <TextButton
            label="نسيت كلمة السر ؟"
            buttonContainerStyle={{
              backgroundColor: null,
            }}
            labelStyle={{
              color: COLORS.gray,
              ...FONTS.body4,
            }}
            onPress={() => navigation.navigate("ForgotPassword")}
          />
          <CustomSwitch value={saveMe} onChange={(value) => setSaveMe(value)} />
        </View>
        {/**SIGN IN  */}
        <TextButton
          label="تسجيل الدخول"
          buttonContainerStyle={{
            height: 55,
            alignItems: "center",
            marginTop: SIZES.padding,
            borderRadius: SIZES.radius,
            backgroundColor: isEnableSignIn()
              ? COLORS.primary
              : COLORS.transparentPrimray,
          }}
          onPress={() => navigation.replace("Home")}
          disabled={isEnableSignIn() ? false : true}
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
            label={"انشئ حسابك"}
            buttonContainerStyle={{
              marginRight: 3,
              backgroundColor: null,
            }}
            labelStyle={{ color: COLORS.primary, ...FONTS.h3 }}
            onPress={() => navigation.navigate("SignUp")}
          />
        </View>
        <View>
          <TextIconButton
            containerStyle={{
              height: 50,
              alignItems: "center",
              marginTop: SIZES.radius,
              borderRadius: SIZES.radius,
              backgroundColor: COLORS.lightGray2,
            }}
            icon={icons.google}
            iconPosition="LEFT"
            iconStyle={{ tintColor: COLORS.lightOrange }}
            label="تسجيل باستخدام جوجل"
            labelStyle={{
              marginLeft: SIZES.radius,
            }}
            onPress={() => navigation.replace("Home")}
          />
        </View>
      </View>
      {/**FOOTER SECTION */}
    </AuthLayout>
  );
};

export default SignIn;
