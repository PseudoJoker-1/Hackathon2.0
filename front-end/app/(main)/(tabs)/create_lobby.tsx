import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { config } from "@/config";

export default function CreateLobby() {
  const [name, setName] = useState("");
  const [rooms, setRooms] = useState("");
  const router = useRouter();

  const handleCreate = async () => {
    if (!name || !rooms) {
      Alert.alert("Ошибка", "Заполните все поля");
      return;
    }

    try {
      // const res = await fetch("http://localhost:8000/api/create_lobby/", {
      const res = await fetch(`${config.URL}:8000/api/create_lobby/`, {
      method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rooms }),
      });

      if (res.ok) {
        Alert.alert("Успех", "Лобби создано!");
        router.push("/"); // вернуться на главную
      } else {
        const err = await res.json();
        Alert.alert("Ошибка", JSON.stringify(err));
      }
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось подключиться к серверу");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Создать лобби</Text>
      <TextInput
        style={styles.input}
        placeholder="Название лобби"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Комнаты (кухня, зал, спальня)"
        value={rooms}
        onChangeText={setRooms}
      />
      <TouchableOpacity style={styles.button} onPress={handleCreate}>
        <Text style={styles.buttonText}>Создать</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 22, textAlign: "center", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  button: { backgroundColor: "#4CAF50", padding: 15, borderRadius: 8 },
  buttonText: { color: "white", textAlign: "center", fontSize: 16 },
});