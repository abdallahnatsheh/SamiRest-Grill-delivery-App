import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  AppState,
} from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import {
  COLORS,
  FONTS,
  icons,
  images,
  SIZES,
  dummyData,
  constants,
} from "../../constants";
import { utils } from "../../utils";
import { IconBotton } from "../../Components";
import { Alert, BackHandler } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../Firebase/firebase.Config";

const LOCATION_TASK_NAME = "LOCATION_TASK_NAME";
let foregroundSubscription = null;

const Map = ({ navigation, route }) => {
  //customer data
  const dataCustomer =
    route.params.dataUser?.dataUser || route.params.dataUser?.userData;
  const orderData = route.params.id;
  //map refrence for settings
  const mapView = React.useRef();
  //worker data
  const { dataUser } = useAuth();
  //region of the map
  const [region, setRegion] = React.useState(null);
  //destination means customer data
  const [toLoc, setToLoc] = React.useState(null);
  //temporary location in the restaurant door
  const [fromLoc, setFromLoc] = React.useState(dummyData.fromLocs[1]);
  //angle of the marker
  const [angle, setAngle] = React.useState(0);
  const [isReady, setIsReady] = React.useState(false);
  //arrival duration from worker to customer
  const [duration, setDuration] = React.useState("");
  //distance between worker and customer
  const [distance, setDistance] = React.useState(null);
  const [allCor, setAllCor] = React.useState();
  //app state if in forefround or background
  const appState = React.useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = React.useState(
    appState.current
  );
  //disable or enable map buttons when the map loading
  const [disableBtn, setDisableBtn] = React.useState(true);
  //check if its first time accessing the map to send full data to db
  //if not first time send only coordinates
  const [firstAccessMap, setFirstAccessMap] = React.useState(true);
  //check app if run foreground or background
  React.useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);

    return () => {
      AppState.remove("change", _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to the foreground!");
      startForegroundUpdate();
    } else if (nextAppState === "background") {
      console.log("App has come to the background!");
      startBackgroundUpdate();
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    //console.log("AppState now ", appState.current);
  };

  // Define the background task for location tracking
  TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
      console.error(error);
      return;
    }
    if (data) {
      // Extract location coordinates from data
      const { locations } = data;
      const location = locations[0];
      if (location) {
        setFromLoc(location.coords);
        updateLocation(location.coords);
      }
    }
  });
  //initialise tracking service
  React.useEffect(async () => {
    //request permission for location in foreground and background
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert("عليك اعطاء صلاحيات الموقع لتفعيل خاصية التتبع");
      return;
    } else {
      if (status.granted) await Location.requestBackgroundPermissionsAsync();
    }
    let initialRegion = {
      latitude: 31.768318999999998,
      longitude: 35.21371,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    };
    setRegion(initialRegion);
    //setFromLoc(dummyData.fromLocs[1]);
    try {
      console.log("dataCustomer", dataCustomer);
      let result = await Location.geocodeAsync(
        dataCustomer.firstAddress + "," + dataCustomer?.secondAddress
      );
      //console.log(result);
      setToLoc({
        latitude: result[0].latitude,
        longitude: result[0].longitude,
      });
    } catch (e) {
      console.log("geo error", e.message);
    }
    //console.log("AppState.currentState", AppState.currentState);

    startForegroundUpdate();
  }, []);

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        return true;
      }
    );
    return () => BackHandler.remove();
  }, []);
  // Render
  // Start location tracking in foreground
  const startForegroundUpdate = async () => {
    // Check if foreground permission is granted
    const { granted } = await Location.getForegroundPermissionsAsync();
    if (!granted) {
      console.log("location tracking denied");
      return;
    }

    // Make sure that foreground location tracking is not running
    foregroundSubscription?.remove();

    //make sure background service not running
    await stopBackgroundUpdate();
    // Start watching position in real-time
    foregroundSubscription = await Location.watchPositionAsync(
      {
        // For better logs, we set the accuracy to the most sensitive option
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 3000,
        distanceInterval: 10,
      },
      (location) => {
        console.log("location tracking foregoudn: ", location.coords);
        updateLocation(location.coords);
        setFromLoc(location.coords);
        setDisableBtn(false);
      }
    );
  };
  const updateLocation = async (liveLocation) => {
    const orderDatas = doc(db, "orders", orderData);
    console.log("updating location~!!");
    if (firstAccessMap) {
      await updateDoc(orderDatas, {
        workerData: {
          firstName: dataUser.firstName,
          lastName: dataUser.lastName,
          personalImage: dataUser.personalImage,
          phoneNumber: dataUser.phoneNumber,
          uid: dataUser.uid,
          liveCoor: liveLocation,
        },
      })
        .then(() => {
          setFirstAccessMap(false);
          console.log("its false now and only one time must be ");
        })
        .catch((error) => {
          console.log("write delivery details error:", error);
          Alert.alert("خطأ", "خطأ في الخدمة", [{ text: "حسناً" }]);
        });
    } else if (!firstAccessMap) {
      await updateDoc(orderDatas, {
        workerData: {
          liveCoor: liveLocation,
        },
      })
        .then(() => {
          setFirstAccessMap(false);
          console.log("access every time is must");
        })
        .catch((error) => {
          console.log("write delivery details error:", error);
          Alert.alert("خطأ", "خطأ في الخدمة", [{ text: "حسناً" }]);
        });
    }
  };
  const makeOrderStatusDone = async () => {
    console.log(dataUser);
    const orderDatas = doc(db, "orders", orderData);
    console.log("updating status~!!");
    await updateDoc(orderDatas, {
      status: "تم التوصيل",
    })
      .then(async () => {
        console.log("update worder status to be ready to take orders");
        const orderDataWorker = doc(db, "AdminEmp", dataUser.uid);
        await updateDoc(orderDataWorker, {
          isDelivering: false,
          orderDeliverNow: "",
        })
          .then(() => {
            dataUser.isDelivering = false;
            dataUser.orderDeliverNow = "";
            stopForegroundUpdate();
            stopBackgroundUpdate();
            navigation.replace("Home");
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

  // Stop location tracking in foreground
  const stopForegroundUpdate = () => {
    foregroundSubscription?.remove();
    setFromLoc(null);
  };

  // Start location tracking in background
  const startBackgroundUpdate = async () => {
    // Don't track position if permission is not granted
    const { granted } = await Location.getBackgroundPermissionsAsync();
    if (!granted) {
      console.log("location tracking denied");
      return;
    }

    // Make sure the task is defined otherwise do not start tracking
    const isTaskDefined = await TaskManager.isTaskDefined(LOCATION_TASK_NAME);
    if (!isTaskDefined) {
      console.log("Task is not defined");
      return;
    }

    // Don't track if it is already running in background
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TASK_NAME
    );
    if (hasStarted) {
      console.log("Already started");
      return;
    }
    stopForegroundUpdate();

    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      // For better logs, we set the accuracy to the most sensitive option
      accuracy: Location.Accuracy.BestForNavigation,
      // Make sure to enable this notification if you want to consistently track in the background
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: "SamiRest-Grill تتبع الموقع",
        notificationBody: "يتم تتبع موقعك من خلال تطبيق مطعم سامي",
        notificationColor: "#fff",
      },
    });
  };

  // Stop location tracking in background
  const stopBackgroundUpdate = async () => {
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TASK_NAME
    );
    if (hasStarted) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      console.log("Location tacking stopped");
    }
  };

  function renderMaps() {
    return (
      <MapView
        ref={mapView}
        style={{
          flex: 1,
        }}
        loadingEnabled
        loadingIndicatorColor
        mapType="mutedStandard"
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
      >
        {fromLoc && (
          <Marker
            key={"fromLoc"}
            identifier="fromLoc"
            coordinate={fromLoc}
            tracksViewChanges={false}
            title={"موقعك"}
            pinColor={"#FF8000"}
            //rotation={angle}
            anchor={{ x: 0.5, y: 0.5 }}
          ></Marker>
        )}

        {toLoc && (
          <Marker
            key={"toLoc"}
            identifier="toLoc"
            coordinate={toLoc}
            title={"موقع الزبون"}
            tracksViewChanges={false}
            pinColor={"#0080FF"}
            anchor={{ x: 0.5, y: 0.5 }}
          ></Marker>
        )}

        <MapViewDirections
          origin={fromLoc}
          destination={toLoc}
          apikey={constants.GOOGLE_MAP_API_KEY}
          strokeWidth={5}
          strokeColor={COLORS.primary}
          mode="DRIVING"
          optimizeWaypoints={true}
          onReady={(result) => {
            setDuration(Math.ceil(result.duration));
            setAllCor(result.coordinates);
            console.log("distance : ", result.distance);
            setDistance(result.distance);
            if (!isReady) {
              // Fit route into maps
              mapView.current.fitToCoordinates(result.coordinates, {
                edgePadding: {
                  right: SIZES.width * 0.1,
                  bottom: 400,
                  left: SIZES.width * 0.1,
                  top: SIZES.height * 0.1,
                },
              });

              // Reposition the navigator
              let nextLoc = {
                latitude: result.coordinates[0]["latitude"],
                longitude: result.coordinates[0]["longitude"],
              };

              if (result.coordinates.length >= 2) {
                let angle = utils.calculateAngle(result.coordinates);
                setAngle(angle);
              }

              setFromLoc(nextLoc);
              setIsReady(true);
            }
          }}
        />
      </MapView>
    );
  }

  function renderHeaderButtons() {
    return (
      <>
        <View
          style={{
            position: "absolute",
            top: SIZES.padding * 2,
            right: SIZES.padding,
          }}
        >
          <IconBotton
            icon={icons.globe}
            containerStyle={{
              ...styles.buttonStyle,
            }}
            iconStyle={{
              width: 20,
              height: 20,
              tintColor: COLORS.gray,
            }}
            disabled={disableBtn}
            onPress={() => {
              mapView.current.fitToCoordinates(allCor ? allCor : fromLoc),
                {
                  edgePadding: {
                    right: SIZES.width * 0.1,
                    bottom: 400,
                    left: SIZES.width * 0.1,
                    top: SIZES.height * 0.1,
                  },
                };
            }}
          />

          <IconBotton
            icon={icons.focus}
            containerStyle={{
              marginTop: SIZES.radius,
              ...styles.buttonStyle,
            }}
            iconStyle={{
              width: 20,
              height: 20,
              tintColor: COLORS.gray,
            }}
            disabled={disableBtn}
            onPress={() => {
              mapView.current.fitToSuppliedMarkers(["fromLoc"]),
                {
                  edgePadding: {
                    right: SIZES.width * 0.1,
                    bottom: 400,
                    left: SIZES.width * 0.1,
                    top: SIZES.height * 0.1,
                  },
                };
            }}
          />
        </View>
      </>
    );
  }

  function renderDeliveryInfo() {
    return (
      <View
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
        }}
      >
        {/* Shadow */}
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={[COLORS.transparent, COLORS.lightGray1]}
          style={{
            position: "absolute",
            top: -20,
            left: 0,
            right: 0,
            height: Platform.OS === "ios" ? 200 : 50,
          }}
        />

        <View
          style={{
            padding: SIZES.padding,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            backgroundColor: COLORS.white,
          }}
        >
          {/* Delivery Time */}
          <View
            style={{
              flexDirection: "row-reverse",
              alignItems: "center",
            }}
          >
            <Image
              source={icons.clock}
              style={{
                width: 40,
                height: 40,
                tintColor: COLORS.black,
              }}
            />

            <View
              style={{
                marginRight: SIZES.padding,
              }}
            >
              <Text style={{ color: COLORS.gray, ...FONTS.body4 }}>
                وقت وصول طلبيتك
              </Text>
              <Text style={{ ...FONTS.h3 }}>{duration} دقيقة</Text>
            </View>
          </View>

          {/* Address */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: SIZES.padding,
              flexDirection: "row-reverse",
            }}
          >
            <Image
              source={icons.focus}
              style={{
                width: 40,
                height: 40,
                tintColor: COLORS.black,
              }}
            />

            <View
              style={{
                marginRight: SIZES.padding,
              }}
            >
              <Text style={{ color: COLORS.gray, ...FONTS.body4 }}>عنوانك</Text>
              <Text style={{ ...FONTS.h3 }}>
                {dataCustomer.firstAddress + "," + dataCustomer?.secondAddress}
              </Text>
            </View>
          </View>

          {/* Customer Details */}
          <TouchableOpacity
            style={{
              flexDirection: "row-reverse",
              height: 70,
              marginTop: SIZES.padding,
              borderRadius: SIZES.radius,
              paddingHorizontal: SIZES.radius,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: COLORS.primary,
            }}
            onPress={() => {
              utils.dialCall(dataCustomer.phoneNumber.slice(1));
            }}
          >
            <Image
              source={images.profile}
              style={{
                width: 40,
                height: 40,
                borderRadius: 5,
              }}
            />

            <View style={{ flex: 1, marginRight: SIZES.radius }}>
              <Text style={{ color: COLORS.white, ...FONTS.h3 }}>
                {dataCustomer.firstName}
              </Text>
              <Text style={{ color: COLORS.white, ...FONTS.body4 }}>
                الزبون
              </Text>
            </View>

            <View
              style={{
                height: 40,
                width: 40,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderRadius: 5,
                borderColor: COLORS.white,
                backgroundColor: COLORS.transparentWhite1,
              }}
            >
              <Image
                source={icons.call}
                style={{
                  width: 30,
                  height: 30,
                }}
              />
            </View>
          </TouchableOpacity>
          {/* make the delivery to done status */}
          {distance && Number(distance) <= 0.15 && (
            <TouchableOpacity
              style={{
                flexDirection: "row-reverse",
                height: 70,
                marginTop: SIZES.padding,
                borderRadius: SIZES.radius,
                paddingHorizontal: SIZES.radius,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: COLORS.primary,
              }}
              onPress={() =>
                Alert.alert(
                  "انهاء الطلبية",
                  "هل تريد فعلا انهاء الطلبية وأنه تم تسليمها؟",
                  [
                    {
                      text: "ليس الاّن",
                    },
                    {
                      text: "أكيد",
                      onPress: () => makeOrderStatusDone(),
                    },
                  ]
                )
              }
            >
              <View
                style={{
                  flex: 1,
                  marginRight: SIZES.radius,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: COLORS.white, ...FONTS.h3 }}>
                  تم استلام الطلبية!
                </Text>
              </View>

              <View
                style={{
                  height: 40,
                  width: 40,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderRadius: 5,
                  borderColor: COLORS.white,
                  backgroundColor: COLORS.transparentWhite1,
                }}
              >
                <Image
                  source={icons.correct}
                  style={{
                    width: 30,
                    height: 30,
                    tintColor: COLORS.white,
                  }}
                />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {/* Map */}
      {renderMaps()}
      {/* Header Buttons */}
      {renderHeaderButtons()}

      {/* Delivery Info */}
      {renderDeliveryInfo()}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    width: 40,
    height: 40,
    borderRadius: SIZES.radius,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.gray2,
    backgroundColor: COLORS.white,
  },
});

export default Map;
