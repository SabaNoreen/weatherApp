import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from "react-native";
import axios from "axios";

const API_KEY = "7fa7ce8b09e88cb61288213c92104176";

type WeatherData = {
  city: string;
  temp: number;
  feels_like: number;
  condition: string;
  description: string;
  humidity: number;
  wind: number;
  icon: string;
};

export default function Index() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!city) {
      setError("Please enter a city name.");
      return;
    }
    try {
      const res = await axios.get(
       `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );

      const data = res.data;
      // ✅ Parse and simplify the data structure
      const parsed = {
        city: `${data.name}${data.sys && data.sys.country ? ", " + data.sys.country : ""}`,
        temp: Math.round(data.main.temp),
        feels_like: Math.round(data.main.feels_like),
        condition: data.weather?.[0]?.main ?? "",
        description: data.weather?.[0]?.description ?? "",
        humidity: data.main.humidity,
        wind: data.wind.speed,
        icon: data.weather?.[0]?.icon ?? "01d",
      };

      setWeather(parsed);
      setError("");
    } catch (err) {
      setError("City not found. Try again!");
      setWeather(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌤 Weather App</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter city name"
        value={city}
        onChangeText={setCity}
      />

      <TouchableOpacity style={styles.button} onPress={fetchWeather}>
        <Text style={styles.buttonText}>Get Weather</Text>
      </TouchableOpacity>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {weather && (
        <View style={styles.card}>
          <Text style={styles.city}>{weather.city}</Text>
          <Image
            style={styles.icon}
            source={{
              uri: `https://openweathermap.org/img/wn/${weather.icon}@2x.png`,
            }}
          />

          <Text style={styles.temp}>{weather.temp}°C</Text>
          <Text style={styles.desc}>{weather.description}</Text>

          {/* ✅ New Weather Details */}
          <View style={styles.details}>
            <Text style={styles.detailText}>🌡️ Feels Like: {weather.feels_like}°C</Text>
            <Text style={styles.detailText}>💧 Humidity: {weather.humidity}%</Text>
            <Text style={styles.detailText}>💨 Wind: {weather.wind} m/s</Text>
            <Text style={styles.detailText}>⛅ Condition: {weather.condition}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#87CEEB",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },
  input: {
    backgroundColor: "#fff",
    width: "30%",
    padding: 14,
    borderRadius: 12,
    textAlign: "center",
    marginBottom: 12,
    fontSize: 18,
  },
  button: {
    backgroundColor: "#355C7D",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
  card: {
    backgroundColor: "#ffffffdd",
    width: "25%",
    borderRadius: 16,
    marginTop: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 6,
  },
  city: {
    fontSize: 26,
    fontWeight: "900",
    color: "#000",
  },
  temp: {
    fontSize: 38,
    fontWeight: "bold",
    marginVertical: 3,
  },
  desc: {
    fontSize: 18,
    textTransform: "capitalize",
    color: "#444",
    marginBottom: 5,
  },
  icon: {
    width: 80,
    height: 80,
    marginTop: 5,
  },
  details: {
    marginTop: 10,
    alignItems: "flex-start",
  },
  detailText: {
    fontSize: 16,
    color: "#333",
    marginVertical: 2,
  },
}); 