import React, { useState } from 'react'
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ScrollView,
  Keyboard 
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '@/app/context/AuthContext'

export default function SignInForm({ router }:{ router:any }) {
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [showPassword,setShowPassword] = useState(false)
  const { login } = useAuth()

  const handleSignIn = async()=>{
    if(!email || !password){
      Alert.alert('Error','пожалуйста, заполните все поля')
      return
    }
    try{
      await login(email,password)
    }
    catch(error:any){
      Alert.alert('Login Failed',error.message)
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          <View style={styles.header}>
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <Text style={styles.subtitle}>Sign in to continue!</Text>
          </View>
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"/>
            </View>
            <View style={styles.inputContainer}>
              <TextInput style={[styles.input, styles.passwordInput]} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={!showPassword}/>
              <TouchableOpacity style={styles.eyeIcon} onPress={()=>{setShowPassword(!showPassword)}}>
                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#6B7280"/>
              </TouchableOpacity>
            </View>
            <TouchableOpacity>
              <Text style={styles.forgotPassword}>Forgot password?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
              <Text style={styles.signInButtonText}>Log In</Text>
            </TouchableOpacity>
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={()=>{router.push('/(auth)/signup')}}>
                <Text style={styles.signUpLink}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor:'#FFFFFF',
  },
  scrollContent:{
    flexGrow: 1,
    justifyContent:'center',
    paddingHorizontal: 24,
  },
  backButton:{
    position:'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  formContainer:{
    width:'100%',
    alignItems:'center',
  },
  header:{
    marginBottom: 40,
    alignItems:'center',
  },
  welcomeText:{
    fontSize: 28,
    fontWeight:'bold',
    color:'#1E3A8A',
    marginBottom: 8,
    textAlign:'center',
  },
  subtitle:{
    fontSize: 16,
    color:'#6B7280',
    textAlign:'center',
  },
  form:{
    width:'100%',
    maxWidth: 400,
  },
  inputContainer:{
    position:'relative',
    marginBottom: 16,
  },
  input:{
    backgroundColor:'#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor:'#E5E7EB',
  },
  passwordInput:{
    paddingRight: 50,
  },
  eyeIcon:{
    position:'absolute',
    right: 16,
    top: 16,
  },
  forgotPassword:{
    fontSize: 14,
    color:'#3B82F6',
    textAlign:'right',
    marginBottom: 24,
  },
  signInButton:{
    backgroundColor:'#1E3A8A',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems:'center',
    marginBottom: 24,
  },
  signInButtonText:{
    fontSize: 16,
    fontWeight:'600',
    color:'#FFFFFF',
  },
  divider:{
    flexDirection:'row',
    alignItems:'center',
    marginBottom: 24,
  },
  dividerLine:{
    flex: 1,
    height: 1,
    backgroundColor:'#E5E7EB',
  },
  dividerText:{
    marginHorizontal: 16,
    fontSize: 14,
    color:'#6B7280',
  },
  footer:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
  },
  footerText:{
    fontSize: 14,
    color:'#6B7280',
  },
  signUpLink:{
    fontSize: 14,
    fontWeight:'600',
    color:'#3B82F6',
  },
})