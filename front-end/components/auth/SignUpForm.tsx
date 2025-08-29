import { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Keyboard } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

export default function SignUpForm({ router }:{ router:any }){
  const BASE_URL = 'https://django-api-1082068772584.us-central1.run.app'
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: '',
    code: ''
  })
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [showCodeField, setShowCode] = useState<boolean>(false)
  const [users, setUsers] = useState<any[]>([])
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const inputs = ['username','name','surname','email']
  useEffect(()=>{
    fetchUsers()
  },[])

  const fetchUsers = async()=>{
    try{
      const response = await axios.get(`${BASE_URL}/api/users/`)
      setUsers(response.data)
    }
    catch(error){
      console.error('ошибка получение данных',error)
    }
  }
  const validateField = (name:string, value:string)=>{
    let error = ''
    switch(name){
      case 'username':
        if(value.length < 4) {
          error = 'Имя пользователя должно содержать не менее 4 символов'
        }
        else if(users.some(user => user.username == value)){
          error = 'Имя пользователя уже занято'
        }
      break
      case 'name':
      case 'surname':
        if(value.length < 4){
          error = 'Должно быть не менее 4 символов'
        }
      break
      case 'email':
        if(value.length <= 6 || !value.includes('@') || !value.includes('.')){
          error = 'Некорректный адрес электронной почты'
        }
        else if(users.some(user => user.email == value)){
          error = 'Электронная почта уже зарегистрирована'
        }
      break
      case 'password':
        if(value.length < 8){
          error = 'Пароль должен содержать не менее 8 символов'
        }
        else if(!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/.test(value)) {
          error = 'Пароль должен содержать заглавные и строчные буквы, цифры и специальные символы'
        }
      break
      case 'confirmPassword':
        if(value !== formData.password){
          error = 'Пароли не совпадают'
        }
      break
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error == '';
  }

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) validateField(name, value)
  }
  const validateForm = ()=>{
    const fields = ['username','name','surname','email','password','confirmPassword']
    let isValid = true

    fields.forEach((field)=>{
      if(!validateField(field, formData[field as keyof typeof formData])){
        isValid = false
      }
    })
    return isValid
  }
  const requestCode = async()=>{
    Keyboard.dismiss()
    
    if(!validateForm()){
      Alert.alert('Error','пожалуйста,исправьте ошибки в форме')
      return
    }
    try{
      const res = await axios.post(`${BASE_URL}/api/send-code/`,{ email:formData.email })
      if(res.status == 200){
        setShowCode(true)
        Alert.alert('Success', 'код подтверждения отправлен на вашу электронную почту')
      }
    }
    catch(error:any){
      Alert.alert('Error',error.response?.data?.message || 'не удалось отправить код подтверждения')
    }
  }
  const loginAndSaveTokens = async()=>{
    try{
      const data = {
        email: formData.email,
        password: formData.password
      }
      const res = await axios.post(`${BASE_URL}/api/token/`,data)
  
      if(res.status == 200){
        const { access,refresh } = res.data
        await AsyncStorage.setItem('access',access)
        await AsyncStorage.setItem('refresh',refresh)
        console.log('yes2');
        router.push('/(auth)/signin')
      }
    }
    catch(error){
      Alert.alert('Error','не удалось войти автоматически')
    }
  }
  const handleRegister = async()=>{
    if(!validateForm() || !formData.code){
      console.log('no1');
      
      Alert.alert('Error','пожалуйста, заполните все поля корректно')
      return
    }
    try{
      const userData = {
        username: formData.username,
        first_name: formData.name,
        last_name: formData.surname,
        email: formData.email,
        password: formData.password,
        code: formData.code,
      }

      const resp = await axios.post(`${BASE_URL}/api/verify-register/`,userData)

      if(resp.status == 200){
        console.log('yes1');
        
        await loginAndSaveTokens()
      }
    }
    catch(error:any){
      console.log('no2');
      
      Alert.alert('Error',error.response?.data?.message || 'регистрация не удалась')
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView  contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join Coventry Campus today!</Text>
          </View>
          <View style={styles.form}>
            {inputs.map((field)=>(
              <View key={field} style={styles.inputWrapper}>
                <TextInput style={[styles.input, errors[field] && styles.inputError]} placeholder={field.charAt(0).toUpperCase() + field.slice(1)} value={formData[field as keyof typeof formData]} onChangeText={(value)=>{handleChange(field,value)}} autoCapitalize={field == 'email' ? 'none' : 'words'} keyboardType={field == 'email' ? 'email-address' : 'default'} onBlur={()=>{validateField(field, formData[field as keyof typeof formData])}}/>
                {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
              </View>
            ))}
            <View style={styles.inputWrapper}>
              <View style={styles.inputContainer}>
                <TextInput style={[styles.input, styles.passwordInput, errors.password && styles.inputError]} placeholder="Password" value={formData.password} onChangeText={(value)=>{handleChange('password',value)}} secureTextEntry={!showPassword} onBlur={()=>{validateField('password',formData.password)}}/>
                <TouchableOpacity style={styles.eyeIcon} onPress={()=>{setShowPassword(!showPassword)}}>
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#6B7280"/>
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>
            <View style={styles.inputWrapper}>
              <View style={styles.inputContainer}>
                <TextInput style={[styles.input, styles.passwordInput, errors.confirmPassword && styles.inputError]} placeholder="Confirm Password" value={formData.confirmPassword} onChangeText={(value)=>{handleChange('confirmPassword',value)}} secureTextEntry={!showConfirmPassword} onBlur={()=>{validateField('confirmPassword',formData.confirmPassword)}}/>
                <TouchableOpacity style={styles.eyeIcon} onPress={()=>{setShowConfirmPassword(!showConfirmPassword)}}>
                  <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} color="#6B7280"/>
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>
            {showCodeField && (
              <View style={styles.inputWrapper}>
                <TextInput style={[styles.input, errors.code && styles.inputError]} placeholder="Verification Code" value={formData.code} onChangeText={(value) => handleChange('code', value)} keyboardType="number-pad"/>
                {errors.code && <Text style={styles.errorText}>{errors.code}</Text>}
              </View>
            )}
            <TouchableOpacity style={[styles.button, showCodeField && styles.hidden]} onPress={requestCode}>
              <Text style={styles.buttonText}>Request Verification Code</Text>
            </TouchableOpacity>
            {showCodeField && (
              <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Complete Registration</Text>
              </TouchableOpacity>
            )}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={()=>{router.push('/(auth)/signin')}}>
                <Text style={styles.signInLink}>Sign in</Text>
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
  formContainer:{
    width:'100%',
    alignItems:'center',
  },
  header:{
    marginBottom: 40,
    alignItems:'center',
  },
  title:{
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
  inputWrapper:{
    marginBottom: 16,
  },
  inputContainer:{
    position:'relative',
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
  inputError:{
    borderColor:'#EF4444',
  },
  passwordInput:{
    paddingRight: 50,
  },
  eyeIcon:{
    position:'absolute',
    right: 16,
    top: 16,
  },
  button:{
    backgroundColor:'#1E3A8A',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems:'center',
    marginTop: 12,
  },
  hidden:{
    display:'none',
  },
  buttonText:{
    fontSize: 16,
    fontWeight:'600',
    color:'#FFFFFF',
  },
  footer:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    marginTop: 24,
  },
  footerText:{
    fontSize: 14,
    color:'#6B7280',
  },
  signInLink:{
    fontSize: 14,
    fontWeight:'600',
    color:'#3B82F6',
  },
  errorText:{
    color:'#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
})