import React, { memo, useState, useEffect } from 'react'
import { useLocation, useRoutes } from 'react-router-dom';
import route from '@/router';
import NavBar from '@/components/NavBar';


const App = memo(() => {
  const location = useLocation()
  const { pathname } = location; // 获取当前路径
  const needNav = ['/', '/data', '/user'] // 需要底部导航的路径
  const [showNav, setShowNav] = useState(true);
  useEffect(() => {
    setShowNav(needNav.includes(pathname))
  }, [pathname]);
  return (
    <div className='App'>
      <div className='main'>
        {useRoutes(route)}
      </div>
      <div className="navbar">
        <NavBar showNav={showNav} />
      </div>
    </div>
  )
})

export default App