import React, { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavBar, Icon } from 'zarm'
import style from './style.module.less'

const Header = memo(({title = ''}) => {
  const navigate = useNavigate()
  return (
    <div className={style.headerWarp}>
      <div className={style.block}>
        <NavBar
          className={style.header}
          left={<Icon type='arrow-left' theme='primary' onClick={() => navigate('/')} />}
          title={title}
        />
      </div>
    </div>
  )
})

export default Header