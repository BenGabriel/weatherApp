import { StatusBar } from "expo-status-bar";
import { Animated, Dimensions, Image, StyleSheet, View } from "react-native";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import Typography from "./common/Typography";
import { getWeather } from "./helper/getWeather";
import LottieView from "lottie-react-native";

const { width } = Dimensions.get("window");

type WeatherProps = {
  city: string;
  daily: any;
};

export default function App() {
  const [weatherDetails, setWeatherDetails] = useState<WeatherProps | any>();
  const [loading, setLoading] = useState<boolean>(true);
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const newLocation = await getWeather(
        location.coords.latitude,
        location.coords.longitude
      );
      console.log(newLocation);
      setWeatherDetails(newLocation);
      setLoading(false);
    })();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            position: "absolute",
            backgroundColor: "#fff",
            flex: 1,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <LottieView autoPlay source={require("./assets/cloud.json")} />
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            marginTop: 40
          }}
        >
          <Typography
            text={weatherDetails.city}
            style={{
              textAlign: "center",
              marginTop: 30
            }}
            size={14}
            bold
          />
          <View
            style={{
              height: 600
            }}
          >
            <Animated.FlatList
              data={weatherDetails.daily}
              horizontal
              snapToInterval={width}
              decelerationRate={0}
              showsHorizontalScrollIndicator={false}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: { contentOffset: { x: scrollX } }
                  }
                ],
                { useNativeDriver: false }
              )}
              renderItem={({ item, index }) => {
                const inputRange = [
                  (index - 1) * width,
                  index * width,
                  (index + 1) * width
                ];

                const translateText = scrollX.interpolate({
                  inputRange,
                  outputRange: [50, 0, -50]
                });

                const translateImage = scrollX.interpolate({
                  inputRange,
                  outputRange: [200, 0, -300]
                });

                const textOpacity = scrollX.interpolate({
                  inputRange,
                  outputRange: [0, 1, 0]
                });

                return (
                  <View
                    style={{
                      width,
                      alignItems: "center",
                      paddingTop: 40
                    }}
                  >
                    <Animated.View
                      style={{
                        transform: [
                          {
                            translateX: translateText
                          }
                        ]
                      }}
                    >
                      <Typography text={`${item.temp}°`} size={120} />
                    </Animated.View>
                    <Animated.View
                      style={{
                        transform: [
                          {
                            translateX: translateImage
                          }
                        ]
                      }}
                    >
                      <LottieView
                        style={{
                          width: 200,
                          height: 200,
                          marginTop: 30
                        }}
                        autoPlay
                        source={item.image}
                        resizeMode="contain"
                      />
                    </Animated.View>
                    <Animated.View
                      style={{
                        marginTop: 100,
                        opacity: textOpacity
                      }}
                    >
                      <Typography text={item.weather[0].main} bold />
                    </Animated.View>
                  </View>
                );
              }}
            />
          </View>
          <View
            style={{
              height: 70,
              alignItems: "center"
            }}
          >
            <Animated.FlatList
              data={weatherDetails?.daily}
              horizontal
              showsHorizontalScrollIndicator={false}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: { contentOffset: { x: scrollX } }
                  }
                ],
                {
                  useNativeDriver: false
                }
              )}
              renderItem={({ item, index }) => {
                const inputRange = [
                  (index - 1) * width,
                  index * width,
                  (index + 1) * width
                ];

                const elevation = scrollX.interpolate({
                  inputRange,
                  outputRange: [0, 2, 0]
                });

                const opacity = scrollX.interpolate({
                  inputRange,
                  outputRange: [0, 1, 0]
                });

                const color = scrollX.interpolate({
                  inputRange,
                  outputRange: ["#fff", item.color, "#fff"]
                });

                return (
                  <Animated.View
                    style={{
                      width: 40,
                      alignItems: "center",
                      marginHorizontal: 5,
                      borderRadius: 20,
                      elevation,
                      backgroundColor: color,
                      marginVertical: 2,
                      paddingHorizontal: 10
                    }}
                  >
                    <Image
                      source={item.image2}
                      resizeMode="contain"
                      style={{
                        width: "100%",
                        height: 40
                      }}
                    />
                    <Animated.View
                      style={{
                        opacity
                      }}
                    >
                      <Typography text={`${item.temp}°`} size={12} />
                    </Animated.View>
                  </Animated.View>
                );
              }}
            />
          </View>
        </View>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center"
  }
});
