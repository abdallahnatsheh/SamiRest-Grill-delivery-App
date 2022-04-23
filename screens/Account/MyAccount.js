import React from "react";
import { View, ScrollView, Image } from "react-native";

import { Header, IconBotton, TextButton, InfoItem } from "../../Components";
import { COLORS, SIZES, icons, dummyData } from "../../constants";

const MyAccount = ({ navigation }) => {
  function renderHeader() {
    return (
      <Header
        title="حسابي الشخصي"
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
          <TextButton
            label="تعديل"
            labelStyle={{
              color: COLORS.primary,
            }}
            buttonContainerStyle={{
              backgroundColor: null,
            }}
            onPress={() => navigation.navigate("MyAccountEdit")}
          />
        }
      />
    );
  }

  function renderSectionOne() {
    return (
      <View
        style={{
          marginTop: SIZES.padding,
          borderRadius: SIZES.radius,
          paddingHorizontal: SIZES.radius,
          backgroundColor: COLORS.lightGray2,
        }}
      >
        <View
          style={{
            borderRadius: SIZES.radius,
            alignItems: "center",
            justifyContent: "center",
            paddingTop: SIZES.radius,
          }}
        >
          <Image
            source={dummyData?.myProfile?.profile_image}
            style={{ width: 100, height: 100, borderRadius: SIZES.radius }}
          />
        </View>
        <InfoItem label="الاسم الشخصي" value="محمد " />
        <InfoItem label="اسم العائلة" value="حمادة" />
        <InfoItem label="رقم الهاتف" value="0531234567" withDivider={false} />
      </View>
    );
  }

  function renderSectionTwo() {
    return (
      <View
        style={{
          marginTop: SIZES.padding,
          borderRadius: SIZES.radius,
          paddingHorizontal: SIZES.radius,
          backgroundColor: COLORS.lightGray2,
        }}
      >
        <InfoItem label="تاريخ الميلاد" value="03/03/1990" />

        <InfoItem label="الجنس" value="ذكر" />

        <InfoItem label="تاريخ الانضمام" value="20/4/2022" />

        <InfoItem label="البريد الإلكتروني" value="abdnatsheh33@gmail.com" />

        <InfoItem label=" العنوان الاساسي" value="القدس, بيت حنينا" />
        <InfoItem
          label=" العنوان الفرعي"
          value=" 6 شارع الاصمعي "
          withDivider={false}
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

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: SIZES.padding,
        }}
      >
        {renderSectionOne()}
        {renderSectionTwo()}
      </ScrollView>
    </View>
  );
};

export default MyAccount;
