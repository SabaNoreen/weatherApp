import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from "react-native";
import axios from "axios";

const API_KEY = "e495a683473bf92558f90082a492bc10";

interface WeatherData {
  name: string;
  sys: {
    country: string;
  };
  main: {
    temp: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}


export default function Index() {
  const [city, setCity] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string>("");

  const fetchWeather = async () => {
    if (!city) {
      setError("Please enter a city name.");
      return;
    }
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      setWeather(res.data);
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
          <Text style={styles.city}>
             {weather.name}, {weather.sys.country}</Text>
          <Text style={styles.temp}>{Math.round(weather.main.temp)}°C</Text>
          <Text style={styles.desc}>{weather.weather[0].description}</Text>
          <Image
            style={styles.icon}
            source={{
              uri:`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
            }}
          />
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
    width: "40%", 
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
  // 🔹 THICKER WEATHER CARD
  card: {
    backgroundColor: "#ffffffdd",
    width: "40%", 
    borderRadius: 20,
    marginTop: 25,
    paddingVertical: 25,
    paddingHorizontal: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 10,
  },
 city: {
    fontSize: 28,
    fontWeight: "900",
    color: "#000",
  },
  temp: {
    fontSize: 46,
    fontWeight: "bold",
    marginVertical: 5,
  },
  desc: {
    fontSize: 20,
    textTransform: "capitalize",
    color: "#444",
  },
  icon: {
    width: 120,
    height: 120,
    marginTop: 10,
  },
});