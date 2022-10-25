import { Navigate } from 'react-router-dom'

import Home from '@/views/Home'
import Data from '@/views/Data'
import User from '@/views/User'
import Details from '@/views/Details'
import Login from '@/views/Login'
import UserInfo from '@/views/UserInfo'
import Account from '@/views/Account'
import About from '@/views/About'
import NotFound from '@/views/NotFound'

const routes = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/data',
    element: <Data />
  },
  {
    path: '/user',
    element: <User />
  },
  {
    path: '/detail/:id',
    element: <Details />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/userinfo',
    element: <UserInfo />
  },
  {
    path: '/account',
    element: <Account />
  },
  {
    path: '/about',
    element: <About />
  },
  {
    path: '*',
    element: <NotFound />
  }
]

export default routes