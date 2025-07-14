import { useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { useUser } from '@clerk/clerk-react'
import { Loader } from 'lucide-react'
import axiosInstance from '@/lib/axios'
import { useNavigate } from 'react-router-dom'

const AuthCallbackPage = () => {
  const { isLoaded, user } = useUser()
  const navigate = useNavigate()
  const syncAttempted = useRef(false)

  useEffect(() => {
    const syncUser = async () => {

        if (!isLoaded || !user || syncAttempted.current) return
        try {
        syncAttempted.current = true
        await axiosInstance.post('/auth/callback', {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl || '',
        })
        console.log('User synced successfully')
      } catch (error) {
        console.error('Error during authentication callback:', error)
      } finally {
        navigate('/')
      }
    }

    syncUser()
  }, [isLoaded, user, navigate])

  return (
    <div className='h-screen w-full bg-black flex items-center justify-center'>
      <Card className='w-[90%] max-w-md bg-zinc-900 border-zinc-800'>
        <CardContent className='flex flex-col items-center pt-6 gap-4'>
          <Loader className='size-6 text-emerald-500 animate-spin' />
          <h3 className='text-zinc-400 text-xl font-bold'>Logging you in...</h3>
          <p className='text-zinc-400 text-sm'>Redirecting...</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default AuthCallbackPage
