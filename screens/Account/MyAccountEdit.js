import React, { useState } from "react";
import { View, Image, TouchableOpacity, Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";

import {
  Header,
  IconBotton,
  TextButton,
  FormInput,
  FormDateInput,
  FormPicker,
} from "../../Components";
import {
  COLORS,
  SIZES,
  FONTS,
  icons,
  constants,
  dummyData,
} from "../../constants";

const MyAccountEdit = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [personalImage, setPersonalImage] = useState("");
  const [dob, setDob] = useState(null);
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [addr, setAddr] = useState("");
  const [city, setCity] = useState("");
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setPersonalImage(result.uri);
    }
  };
  function renderHeader() {
    return (
      <Header
        title="تعديل الحساب الشخصي"
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
        rightComponent={
          <View
            style={{
              width: 40,
            }}
          />
        }
      />
    );
  }

  function renderForm() {
    return (
      <View
        style={{
          paddingVertical: SIZES.padding,
          paddingHorizontal: SIZES.radius,
          borderRadius: SIZES.radius,
        }}
      >
        {/*personal image picker */}
        <TouchableOpacity
          style={{
            borderRadius: SIZES.radius,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={pickImage}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              borderRadius: SIZES.radius,
            }}
          >
            <Image
              source={
                personalImage
                  ? { uri: personalImage }
                  : dummyData?.myProfile?.profile_image
              }
              style={{
                width: 100,
                height: 100,
                maxHeight: 100,
                maxWidth: 100,
                minHeight: 50,
                minWidth: 50,
                borderRadius: SIZES.radius,
              }}
            />
            <Text
              style={{
                color: COLORS.gray,
                ...FONTS.body4,
                padding: SIZES.padding,
                textAlign: "center",
              }}
            >
              إضغط لتغيير الصورة
            </Text>
          </View>
        </TouchableOpacity>
        {/* first Name and last name */}
        <FormInput
          label="الاسم الشخصي"
          value={firstName}
          onChange={(value) => {
            setFirstName(value);
          }}
          inputContainerStyle={{
            backgroundColor: COLORS.white,
          }}
        />
        <FormInput
          label="اسم العائلة"
          value={lastName}
          onChange={(value) => {
            setLastName(value);
          }}
          inputContainerStyle={{
            backgroundColor: COLORS.white,
          }}
        />

        {/* Phone Number */}
        <FormInput
          label="رقم الهاتف"
          value={phoneNo}
          onChange={(value) => {
            setPhoneNo(value);
          }}
          keyboardType={"number-pad"}
          containerStyle={{
            marginTop: SIZES.radius,
          }}
          inputContainerStyle={{
            backgroundColor: COLORS.white,
          }}
        />

        {/* D.O.B */}
        <FormDateInput
          label="تاريخ الميلاد"
          placeholder="MM/DD/YYYY"
          value={dob}
          setDate={setDob}
          containerStyle={{
            marginTop: SIZES.radius,
          }}
          inputContainerStyle={{
            backgroundColor: COLORS.lightGray2,
          }}
        />

        {/* Gender */}
        <FormPicker
          label="الجنس"
          placeholder="اختر جنسك"
          modalTitle="اختر جنسك"
          value={gender}
          setValue={setGender}
          options={constants.gender}
          containerStyle={{
            marginTop: SIZES.radius,
          }}
          inputContainerStyle={{
            backgroundColor: COLORS.lightGray2,
          }}
        />

        {/* Email */}
        <FormInput
          label="البريد الالكتروني"
          keyboardType="email-address"
          autoCompleteType="email"
          value={email}
          onChange={(value) => {
            setEmail(value);
          }}
          containerStyle={{
            marginTop: SIZES.radius,
          }}
          inputContainerStyle={{
            backgroundColor: COLORS.white,
          }}
        />

        {/* Address */}
        <FormInput
          label="العنوان الاساسي"
          value={addr}
          onChange={(value) => {
            setAddr(value);
          }}
          containerStyle={{
            marginTop: SIZES.radius,
          }}
          inputContainerStyle={{
            backgroundColor: COLORS.white,
          }}
        />

        {/* City */}
        <FormInput
          label="العنوان الفرعي"
          value={city}
          onChange={(value) => {
            setCity(value);
          }}
          containerStyle={{
            marginTop: SIZES.radius,
          }}
          inputContainerStyle={{
            backgroundColor: COLORS.white,
          }}
        />
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

      <KeyboardAwareScrollView
        keyboardDismissMode="on-drag"
        contentContainerStyle={{
          marginTop: SIZES.radius,
          paddingHorizontal: SIZES.padding,
          paddingBottom: 40,
        }}
      >
        {renderForm()}
      </KeyboardAwareScrollView>

      <TextButton
        buttonContainerStyle={{
          height: 60,
          marginTop: SIZES.padding,
          marginHorizontal: SIZES.padding,
          marginBottom: SIZES.padding,
          borderRadius: SIZES.radius,
          backgroundColor: COLORS.primary,
        }}
        label="حفظ التغييرات"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
};

export default MyAccountEdit;
