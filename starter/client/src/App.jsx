import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import { Grid, Menu, Segment } from 'semantic-ui-react'
import { EditTodo } from './components/EditTodo'
import { LogIn } from './components/LogIn'
import { NotFound } from './components/NotFound'
import { Todos } from './components/Todos'
import Callback from './components/Callback'
import { Dimmer, Loader } from 'semantic-ui-react'


export default function App() {
  const { isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0()
  const navigate = useNavigate()

  function generateMenu() {
    return (
      <Menu>
        <Menu.Item as={Link} to={'/'}>
          Home
        </Menu.Item>
        <Menu.Menu position="right">{logInLogOutButton()}</Menu.Menu>
      </Menu>
    )
  }

  function logInLogOutButton() {
    if (isAuthenticated) {
      return (
        <Menu.Item name="logout" onClick={() => logout({ returnTo: window.location.origin })}>
          Log Out
        </Menu.Item>
      )
    } else {
      return (
        <Menu.Item name="login" onClick={() => loginWithRedirect()}>
          Log In
        </Menu.Item>
      )
    }
  }

  if (isLoading) {
    return (
      <Dimmer active inverted>
        <Loader size="large">Loading...</Loader>
      </Dimmer>
    )
  }


  return (
    <div>
      <Segment style={{ padding: '8em 0em' }} vertical>
        <Grid container stackable verticalAlign="middle">
          <Grid.Row>
            <Grid.Column width={16}>
              {generateMenu()}

              <Routes>
                <Route path="/" exact element={isAuthenticated ? <Todos /> : <LogIn />} />
                <Route path="/callback" element={<Callback />} />
                <Route path="/todos/:todoId/edit" exact element={<EditTodo />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </div>
  )
}

