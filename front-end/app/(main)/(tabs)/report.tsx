import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import client from '@/utils/api/client'
import withAuthProtection from '@/components/common/ProtectedRoute'
import { useSearchParams } from 'expo-router/build/hooks'

const issueTypes = [
  {
    id:'light',
    name:'Lighting',
    icon:'bulb',
    color:'#F59E0B',
  },
  {
    id:'computer',
    name:'Computer',
    icon:'desktop',
    color:'#3B82F6',
  },
  {
    id:'water',
    name:'Water/Plumbing',
    icon:'water',
    color:'#14B8A6',
  },
  {
    id:'internet',
    name:'WiFi/Internet',
    icon:'wifi',
    color:'#8B5CF6',
  },
  {
    id:'heating',
    name:'Heating/Cooling',
    icon:'thermometer',
    color:'#EF4444',
  },
  {
    id:'other',
    name:'Other',
    icon:'warning',
    color:'#6B7280',
  },
]

interface Room {
  id: number
  number: number
}

interface Facility {
  id: number
  title: string
}

function ReportScreen() {
  const [selectedIssue,setSelectedIssue] = useState<string | null>(null)
  const [rooms,setRooms] = useState<Room[]>([])
  const [roomId,setRoomId] = useState<number | null>(null)
  const [description,setDescription] = useState('')
  // const [loading,setLoading] = useState(true) если вернуть это, убрать из useEffect fetchRooms ниже
  const [loading,setLoading] = useState(false) 
  // const [selectedFacility,setSelectedFacility] = useState<{id:number, name:string} | null>(null)
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null)
  const searchParams = useSearchParams()
  const facilityId = searchParams.get('facilityId')

  useEffect(()=>{
    if (!facilityId) return; // Если фасилити не выбрано, не загружаем комнаты

    const fetchRooms = async()=>{
      setLoading(true)
      try{
        // console.log(.id)
        const response = await client.get ('/api/rooms/', {
          params: { facility_id: facilityId }
        });
        console.log('Rooms response:', response.data)


        setRooms(response.data)

        // const response = await client.get('/api/rooms/')
        // setRooms(response.data)
      }
      catch(error){
        console.error('Failed to load rooms:',error)
        Alert.alert('Error','Failed to load rooms')
      }
      finally{
        setLoading(false)
      }
    }
    fetchRooms()
  },[facilityId, selectedFacility])
  const handleSubmit = async()=>{
    if(!selectedIssue || !roomId || !description){
      Alert.alert('Missing Information','Please fill in all fields')
      return
    }
    try{
      const response = await client.post('/api/reports/',{
        report_type: selectedIssue,
        room: roomId,
        description: description,
      })

      if(response.status == 201){
        Alert.alert('Success!','Your report has been submitted, You earned 50 points!')
        setSelectedIssue(null)
        setRoomId(null)
        setDescription('')
      }
    }
    catch(error:any){
      console.error('Submit error',error)
      Alert.alert('Error', error.response?.data?.message || 'Something went wrong')
    }
  }

  if(loading){
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#2563EB" />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Report an Issue</Text>
        <Text style={styles.label}>Issue Type</Text>
        <View style={styles.issueGrid}>
          {issueTypes.map((issue,index)=>(
            <TouchableOpacity key={index} style={[styles.issueCard,selectedIssue == issue.id && styles.issueCardSelected]} onPress={()=> setSelectedIssue(issue.id)}>
              <Ionicons name={issue.icon as any} size={20} color={issue.color} />
              <Text style={{color: selectedIssue == issue.id ? issue.color : '#374151',}}>
                {issue.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>Rooms</Text>
        {rooms.map((room,index)=>(
          <TouchableOpacity key={index} style={[styles.roomOption,roomId == room.id && styles.roomSelected,]} onPress={()=> setRoomId(room.id)}>
            <Text style={styles.roomText}>{room.name}</Text>
          </TouchableOpacity>
        ))}
        <Text style={styles.label}>Description</Text>
        <TextInput style={styles.input} multiline placeholder="Describe the issue in detail" value={description} onChangeText={setDescription} textAlignVertical="top"/>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Ionicons name="send" size={18} color="white" />
          <Text style={styles.submitText}>Submit Report</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default withAuthProtection(ReportScreen)

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollView: { padding: 20 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
  label: { fontSize: 16, fontWeight: '600', marginTop: 20, marginBottom: 8 },
  issueGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  issueCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    width: '47%',
    flexDirection: 'row',
    gap: 8,
  },
  issueCardSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  roomOption: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  roomSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  roomText: { fontSize: 16, color: '#111827' },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    fontSize: 16,
    minHeight: 100,
  },
  submitButton: {
    backgroundColor: '#2563EB',
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
})
