// import React, {useState} from 'react'
// import { View,Text,StyleSheet,TextInput,TouchableOpacity,Alert } from 'react-native'
// import { Ionicons } from '@expo/vector-icons'
// // import AsyncStorage from '@react-native-async-storage/async-storage'
// import axios from 'axios'
// import { useAuth } from '@/app/context/AuthContext'

// export default function SignUpForm({ router }:{ router: any }){
//   const BASE_URL = 'https://django-api-1082068772584.us-central1.run.app'
//   // const BASE_URL = 'http://localhost:8000'
//   const [name, setName] = useState<string>('')
//   const [email, setEmail] = useState<string>('')
//   const [password, setPassword] = useState<string>('')
//   const [confirmPassword, setConfirmPassword] = useState<string>('')
//   const [showPassword, setShowPassword] = useState<boolean>(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
//   const [code, setCode] = useState<string>('')
//   const [showCodeField, setShowCode] = useState<boolean>(false)
//   const [loading, setLoading] = useState(false)
//   const {login} = useAuth()

//   const requestCode = async()=>{
//     if(!name || !email || !password || !confirmPassword){
//       Alert.alert('Error', 'Please fill in all fields')
//       return
//     }
//     if(password !== confirmPassword){
//       Alert.alert('Error', 'Passwords do not match')
//       return
//     }
//     setLoading(true);
//     try{
//       const res = await axios.post(`${BASE_URL}/api/send-code/`,{ email })
//       if(res.status === 200){
//         setShowCode(true);
//         Alert.alert('Success', 'Verification code sent to your email')
//       }
//       else{
//         Alert.alert('Ошибка', res.data?.message || 'Не удалось отправить код')
//       }
//     } catch(error){
//       console.error('Server Error',error);
//       Alert.alert('Ошибка', 'Сервер не отвечает')
//     } finally{
//       setLoading(false);
//     }
//   }
//   // const loginAndSaveTokens = async()=>{
//   //   try{
//   //     const res = await axios.post(`${BASE_URL}/api/token/`,{ email,password})
//   //     if(res.status == 200){
//   //       const { access, refresh } = res.data
//   //       // await AsyncStorage.setItem('access', access)
//   //       // await AsyncStorage.setItem('refresh', refresh)
//   //       router.replace('/(main)/(tabs)/')
//   //     }
//   //     else{
//   //       throw new Error('Ошибка входа')
//   //     }
//   //   }
//   //   catch(error){
//   //     Alert.alert('Ошибка','Не удалось войти автоматически после регистрации')
//   //   }
//   // }
//   const handleRegister = async()=>{
//     if(!name || !email || !password || !confirmPassword){
//       Alert.alert('Error', 'Please fill in all fields')
//       return;
//     }
//     if(password !== confirmPassword){
//       Alert.alert('Error', 'Passwords do not match')
//       return;
//     }
//     if (!code){
//       Alert.alert('Error', 'Please enter the verification code sent to your email')
//       return;
//     }
//     setLoading(true)
//     try{
//       const res = await axios.post(`${BASE_URL}/api/verify-register/`,{
//         username: name,
//         email,
//         password,
//         code,
//       }, {headers: { 'Content-Type': 'application/json' }});

//       if(res.status >= 200 && res.status < 300){
//         await login(email, password);
//       }
//       else{
//         Alert.alert('Ошибка', res.data?.message || 'Регистрация не удалась')
//       }
//     }
//     catch(error){
//       Alert.alert('Ошибка', 'Сервер не отвечает')
//     } finally{
//       setLoading(false)
//     }
//   }

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
//         <Ionicons name="chevron-back" size={24} color="#1E3A8A" />
//       </TouchableOpacity>

//       <View style={styles.header}>
//         <Text style={styles.title}>Create Account</Text>
//         <Text style={styles.subtitle}>Join Coventry Campus today!</Text>
//       </View>

//       <View style={styles.form}>
//         <TextInput
//           style={styles.input}
//           placeholder="Full Name"
//           value={name}
//           onChangeText={setName}
//           autoCapitalize="words"
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="Email"
//           value={email}
//           onChangeText={setEmail}
//           keyboardType="email-address"
//           autoCapitalize="none"
//         />

//         <View style={styles.inputContainer}>
//           <TextInput
//             style={[styles.input, styles.passwordInput]}
//             placeholder="Password"
//             value={password}
//             onChangeText={setPassword}
//             secureTextEntry={!showPassword}
//           />
//           <TouchableOpacity
//             style={styles.eyeIcon}
//             onPress={() => setShowPassword(!showPassword)}
//           >
//             <Ionicons
//               name={showPassword ? 'eye-off' : 'eye'}
//               size={20}
//               color="#6B7280"
//             />
//           </TouchableOpacity>
//         </View>

//         <View style={styles.inputContainer}>
//           <TextInput
//             style={[styles.input, styles.passwordInput]}
//             placeholder="Confirm Password"
//             value={confirmPassword}
//             onChangeText={setConfirmPassword}
//             secureTextEntry={!showConfirmPassword}
//           />
//           <TouchableOpacity
//             style={styles.eyeIcon}
//             onPress={() => setShowConfirmPassword(!showConfirmPassword)}
//           >
//             <Ionicons
//               name={showConfirmPassword ? 'eye-off' : 'eye'}
//               size={20}
//               color="#6B7280"
//             />
//           </TouchableOpacity>
//         </View>

//         {showCodeField && (
//           <TextInput
//             style={styles.input}
//             placeholder="Enter Code"
//             value={code}
//             onChangeText={setCode}
//           />
//         )}

//         <TouchableOpacity style={styles.signUpButton} onPress={requestCode} disabled={loading || showCodeField}>
//           <Text style={styles.signUpButtonText}>Request code</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.signUpButton} onPress={handleRegister} disabled={loading}>
//           <Text style={styles.signUpButtonText}>Continue</Text>
//         </TouchableOpacity>

//         <View style={styles.footer}>
//           <Text style={styles.footerText}>Already have an account? </Text>
//           <TouchableOpacity onPress={() => router.back()}>
//             <Text style={styles.signInLink}>Sign in</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 24 },
//   backButton: { marginTop: 60, marginBottom: 20 },
//   header: { marginBottom: 40 },
//   title: { fontSize: 28, fontWeight: 'bold', color: '#1E3A8A', marginBottom: 8 },
//   subtitle: { fontSize: 16, color: '#6B7280' },
//   form: { flex: 1 },
//   inputContainer: { position: 'relative', marginBottom: 16 },
//   input: {
//     backgroundColor: '#F8FAFC',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//     fontSize: 16,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     marginBottom: 16,
//   },
//   passwordInput: { paddingRight: 50 },
//   eyeIcon: { position: 'absolute', right: 16, top: 16 },
//   signUpButton: {
//     backgroundColor: '#1E3A8A',
//     borderRadius: 12,
//     paddingVertical: 16,
//     alignItems: 'center',
//     marginTop: 12,
//   },
//   signUpButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
//   footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24 },
//   footerText: { fontSize: 14, color: '#6B7280' },
//   signInLink: { fontSize: 14, fontWeight: '600', color: '#3B82F6' },
// });


import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import axios from 'axios'
import { useAuth } from '@/app/context/AuthContext'

export default function SignUpForm({ router }: { router: any }) {
  const BASE_URL = 'https://django-api-1082068772584.us-central1.run.app'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [code, setCode] = useState('')
  const [showCodeField, setShowCode] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const requestCode = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const res = await axios.post(`${BASE_URL}/api/send-code/`, { email })
      if (res.status === 200) {
        setShowCode(true)
        Alert.alert('Success', 'Verification code sent to your email')
      } else {
        Alert.alert('Ошибка', res.data?.message || 'Не удалось отправить код')
      }
    } catch (error) {
      console.error('Server Error', error)
      Alert.alert('Ошибка', 'Сервер не отвечает')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match')
      return
    }
    if (!code) {
      Alert.alert('Error', 'Please enter the verification code sent to your email')
      return
    }
    setLoading(true)
    try {
      const res = await axios.post(
        `${BASE_URL}/api/verify-register/`,
        { username: name, email, password, code },
        { headers: { 'Content-Type': 'application/json' } }
      )

      if (res.status >= 200 && res.status < 300) {
        await login(email, password)
      } else {
        Alert.alert('Ошибка', res.data?.message || 'Регистрация не удалась')
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Сервер не отвечает')
    } finally {
      setLoading(false)
    }
  }

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
        <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} autoCapitalize="words" />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#6B7280" />
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
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {showCodeField && <TextInput style={styles.input} placeholder="Enter Code" value={code} onChangeText={setCode} />}

        <TouchableOpacity style={styles.signUpButton} onPress={requestCode} disabled={loading || showCodeField}>
          <Text style={styles.signUpButtonText}>Request code</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signUpButton} onPress={handleRegister} disabled={loading}>
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
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 24 },
  backButton: { marginTop: 60, marginBottom: 20 },
  header: { marginBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1E3A8A', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6B7280' },
  form: { flex: 1 },
  inputContainer: { position: 'relative', marginBottom: 16 },
  input: { backgroundColor: '#F8FAFC', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 16, fontSize: 16, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 16 },
  passwordInput: { paddingRight: 50 },
  eyeIcon: { position: 'absolute', right: 16, top: 16 },
  signUpButton: { backgroundColor: '#1E3A8A', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 12 },
  signUpButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24 },
  footerText: { fontSize: 14, color: '#6B7280' },
  signInLink: { fontSize: 14, fontWeight: '600', color: '#3B82F6' },
})
