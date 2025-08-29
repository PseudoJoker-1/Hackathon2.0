import { useRouter } from 'expo-router'
import SignUpForm from '@/components/auth/SignUpForm'

export default function SignUpScreen() {
  const router = useRouter()
  return <SignUpForm router={router} />
}