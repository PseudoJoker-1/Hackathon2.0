import { useRouter } from 'expo-router';
import SignInForm from '@/components/auth/SignInForm';

export default function SignInScreen() {
  const router = useRouter()
  return <SignInForm router={router} />
}