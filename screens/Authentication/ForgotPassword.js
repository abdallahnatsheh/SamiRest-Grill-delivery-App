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

const ForgotPassword = ({ navigation }) => {
  //email is here
  const [email, setEmail] = React.useState("");
  //email vallidations errors
  const [emailError, setEmailError] = React.useState("");

  //function to check if everything validate to enable signin
  function isEnable() {
    return email != "" && emailError == "";
  }
  return (
    <AuthLayout
      title="تغيير كلمة المرور"
      subtitle="ادخل بريدك الالكتروني ليصلك الرابط على البريد الالكتروني"
    >
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

        {/**SIGN IN  */}
        <TextButton
          label="ارسل الطلب "
          buttonContainerStyle={{
            height: 55,
            alignItems: "center",
            marginTop: SIZES.padding,
            borderRadius: SIZES.radius,
            backgroundColor: isEnable()
              ? COLORS.primary
              : COLORS.transparentPrimray,
          }}
          onPress={() => navigation.goBack()}
          disabled={isEnable() ? false : true}
        />
      </View>
    </AuthLayout>
  );
};

export default ForgotPassword;
