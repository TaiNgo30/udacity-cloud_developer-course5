import React, { useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import { Dimmer, Loader } from 'semantic-ui-react'

const Callback = () => {
  const { isAuthenticated, isLoading } = useAuth0()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {

        navigate('/')
      } else {

        navigate('/login')
      }
    }
  }, [isLoading, isAuthenticated, navigate])

  return (
    <Dimmer active>
      <Loader content="Loading" />
    </Dimmer>
  )
}

export default Callback
