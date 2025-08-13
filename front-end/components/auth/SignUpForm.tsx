import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
// import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignUpForm({ router }: { router: any }) {
//   const router = useRouter();
  const BASE_URL = 'https://django-api-1082068772584.us-central1.run.app';  
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');
  const [showCodeField, setShowCode] = useState<boolean>(false);
  const requestCode = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/api/send-code/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const errorText = await res.text();
      if (res.ok) setShowCode(true);
      else Alert.alert('Ошибка', errorText);
    } catch (err) {
      Alert.alert('Ошибка', 'Сервер не отвечает');
    }
  };

  const loginAndSaveTokens = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      console.log('Login response:', res.status, data); // Add this line
      if (!res.ok) throw new Error('Ошибка входа');
      await AsyncStorage.setItem('access', data.access);
      await AsyncStorage.setItem('refresh', data.refresh);
      router.replace('/(tabs)');
    } catch (err) {
      Alert.alert('Ошибка', 'Не удалось войти автоматически после регистрации');
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/api/verify-register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: name, email, password, code }),
      });
      if (res.ok) {
        await loginAndSaveTokens();
      } else {
        const err = await res.text();
        console.error('Ошибка регистрации', err);
        Alert.alert('Ошибка', 'Регистрация не удалась');
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Сервер не отвечает');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color="#1E3A8A" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join Coventry Campus today!</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color="#6B7280"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Ionicons
              name={showConfirmPassword ? 'eye-off' : 'eye'}
              size={20}
              color="#6B7280"
            />
          </TouchableOpacity>
        </View>

        {showCodeField && (
          <TextInput
            style={styles.input}
            placeholder="Enter Code"
            value={code}
            onChangeText={setCode}
          />
        )}

        <TouchableOpacity style={styles.signUpButton} onPress={requestCode}>
          <Text style={styles.signUpButtonText}>Request code</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signUpButton} onPress={handleRegister}>
          <Text style={styles.signUpButtonText}>Continue</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.signInLink}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 24 },
  backButton: { marginTop: 60, marginBottom: 20 },
  header: { marginBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1E3A8A', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6B7280' },
  form: { flex: 1 },
  inputContainer: { position: 'relative', marginBottom: 16 },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  passwordInput: { paddingRight: 50 },
  eyeIcon: { position: 'absolute', right: 16, top: 16 },
  signUpButton: {
    backgroundColor: '#1E3A8A',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  signUpButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24 },
  footerText: { fontSize: 14, color: '#6B7280' },
  signInLink: { fontSize: 14, fontWeight: '600', color: '#3B82F6' },
});
