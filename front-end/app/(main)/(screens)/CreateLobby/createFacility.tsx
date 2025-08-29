import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import client from '@/utils/api/client'

interface Room {
  id: string
  title: string
  isEditing: boolean
}

export default function CreateLobby() {
  const [name, setName] = useState('')
  const [rooms, setRooms] = useState<Room[]>([])
  const router = useRouter()
  const MAX_ROOMS = 5

  const addRoom = ()=>{
    if(rooms.length >= MAX_ROOMS){
      Alert.alert('Ошибка',`Максимальное количество комнат ${MAX_ROOMS}`)
      return
    }
    const newRoom: Room = {
      id: Date.now().toString(),
      title: `Комната ${String(rooms.length + 1).padStart(3,'0')}`,
      isEditing: false
    }
    setRooms([...rooms, newRoom])
  }
  const onPressRemoveRoom = (id:string)=>{
    setRooms(rooms.filter((room)=> room.id !== id))
  }
  const onPressEditRoom = (id:string)=>{
    setRooms(rooms.map((room)=> room.id == id ? { ...room, isEditing: !room.isEditing } : room))
  }
  const updateRoomTitle = (id:string,newTitle:string)=>{
    setRooms(rooms.map((room)=> room.id == id ? { ...room, title: newTitle } : room))
  }
  const onPressCreateFacility = async()=>{
    if(!name || rooms.length == 0){
      Alert.alert('Ошибка','Заполните название лобби и добавьте хотя бы одну комнату')
      return
    }
    try{
      const roomsObject = rooms.map((room)=>({ id: room.id, title: room.title }))
      const res = await client.post('/api/create_lobby/',{
        name,
        rooms:roomsObject
      })
      
      Alert.alert('Успех','Лобби создано!')
      router.push('/')
    }
    catch(error:any){
      console.error(error)
      if(error.response){
        Alert.alert('Ошибка',JSON.stringify(error.response.data))
      }
      else{
        Alert.alert('Ошибка','Не удалось подключиться к серверу')
      }
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.backButton} onPress={()=>{router.back()}}>
          <Ionicons name="chevron-back" size={24} color="#1E3A8A" />
        </TouchableOpacity>
        <Text style={styles.title}>Создать лобби</Text>
        <TextInput style={styles.input} placeholder="Название лобби" value={name} onChangeText={setName}/>
        {rooms.map((room,index)=>(
          <View key={index} style={styles.roomItem}>
            {room.isEditing ? (
              <TextInput style={styles.roomInput} value={room.title} onChangeText={(text)=>{updateRoomTitle(room.id,text)}} onBlur={()=>{onPressEditRoom(room.id)}} autoFocus />
            ) : (
              <Text style={styles.roomName}>{room.title}</Text>
            )}
            <View style={styles.roomActions}>
              <TouchableOpacity style={styles.editButton}onPress={()=>{onPressEditRoom(room.id)}}>
                <Ionicons name="pencil" size={18} color="#1E3A8A" />
              </TouchableOpacity>     
              <TouchableOpacity style={styles.deleteButton} onPress={()=>{onPressRemoveRoom(room.id)}}>
                <Ionicons name="trash" size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
        {rooms.length < MAX_ROOMS && (
          <TouchableOpacity style={styles.addButton} onPress={addRoom}>
            <Text style={styles.addButtonText}>{rooms.length > 0 ? 'Добавить еще' : 'Добавить комнату'}</Text>
            <Ionicons name="add" size={24} color="#1E3A8A" style={styles.plusIcon} />
          </TouchableOpacity>
        )} 
        <Text style={styles.roomCounter}>Комнат {rooms.length} / {MAX_ROOMS}</Text>
        <TouchableOpacity style={styles.createButton} onPress={onPressCreateFacility}>
          <Text style={styles.createButtonText}>Создать лобби</Text>
        </TouchableOpacity>
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
    padding: 20,
    alignItems:'center',
  },
  backButton:{
    position:'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  title:{
    fontSize: 24,
    fontWeight:'bold',
    color:'#1E3A8A',
    marginBottom: 30,
    textAlign:'center',
    marginTop: 20,
  },
  input:{
    width:'100%',
    maxWidth: 400,
    backgroundColor:'#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor:'#E5E7EB',
    marginBottom: 20,
  },
  roomItem:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    width:'100%',
    maxWidth: 400,
    backgroundColor:'#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor:'#E5E7EB',
  },
  roomName:{
    fontSize: 16,
    flex: 1,
  },
  roomInput:{
    flex: 1,
    fontSize: 16,
    backgroundColor:'#FFFFFF',
    borderRadius: 6,
    padding: 8,
    borderWidth: 1,
    borderColor:'#E5E7EB',
  },
  roomActions:{
    flexDirection:'row',
    alignItems:'center',
    marginLeft: 10,
  },
  editButton:{
    padding: 8,
    marginRight: 8,
  },
  deleteButton:{
    padding: 8,
    opacity: 0.7,
  },
  addButton:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    width:'100%',
    maxWidth: 400,
    padding: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  plusIcon:{
    marginLeft:8,
  },
  addButtonText:{
    color:'#1E3A8A',
    fontSize: 16,
    fontWeight:'600',
  },
  roomCounter:{
    color:'#6B7280',
    marginBottom: 20,
  },
  createButton:{
    width:'100%',
    maxWidth: 400,
    backgroundColor:'#1E3A8A',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems:'center',
  },
  createButtonText:{
    color:'#FFFFFF',
    fontSize: 16,
    fontWeight:'600',
  },
})