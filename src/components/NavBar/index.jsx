import React, { memo, useState } from 'react'
import { TabBar } from 'zarm';
import { useNavigate } from 'react-router-dom'

import CustomIcon from '../CustomIcon';
// import PropTypes from 'prop-types';
// import 


const NavBar = memo(({ showNav }) => {
  const [activeKey, setActiveKey] = useState('/');
  const navigate = useNavigate()
  const changeTab = (path) => {
    setActiveKey(path)
    navigate(path)
  }
  return (
    <TabBar visible={showNav} activeKey={activeKey} onChange={changeTab}>
      <TabBar.Item
        itemKey='/'
        title='账单'
        icon={<CustomIcon type='zhangdan' />}
      />
      <TabBar.Item
        itemKey='/data'
        title='统计'
        icon={<CustomIcon type='tongji' />}
      />
      <TabBar.Item
        itemKey='/user'
        title='我的'
        icon={<CustomIcon type='wode' />}
      />
    </TabBar>
  )
})

// NavBar.propTypes = {
//   showNav: PropTypes.bool
// }

export default NavBar