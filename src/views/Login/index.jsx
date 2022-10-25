import React, { memo, useState, useCallback } from 'react'
import { Cell, Input, Checkbox, Button, Toast } from 'zarm'
import Captcha from 'react-captcha-code'
import cx from 'classNames'
import { useNavigate } from 'react-router-dom'

import style from './style.module.less'
import CustomIcon from '@/components/CustomIcon'
import { post } from '@/utils'

const Login = memo(() => {
  const [ verify, setVerify ] = useState('')//验证码
  const [ username, setUsername ] = useState('') // 密码
  const [ password, SsetPassword ] = useState() // 验证码
  const [ captcha, setCaptcha ] = useState('') // 验证码变化后存储值
  const [ type, setType ] = useState('login') //登录注册类型
  const navigate = useNavigate()

  // 点击验证码，修改验证码的值
  const handleChange = useCallback((captcha) => {
    setCaptcha(captcha)
  }, [])

  const onSubmit = async () => {
    if(!username) {
      Toast.show('请输入账号')
      return
    }
    if(!password) {
      Toast.show('请输入密码')
      return
    }
    try {
      if(type === 'login') {
        const res = await post('/user/login', {
          username,
          password
        })
        console.log(res);
        localStorage.setItem('token', res.data.token)
        navigate('/')
      } else {
        if(!verify){
          Toast.show('验证码错误')
          return
        }else if(verify != captcha) {
          Toast.show('验证码错误')
          return
        }
        const {data} = await post('/api/user/register', {
          username,
          password
        })
        if(data.code != 200) {
          Toast.show(data.msg)
          setUsername('')
        } else {
          Toast.show('注册成功')
          setType('login')
        }
      }
    } catch (error) {
      Toast.show('系统错误')
    }
  }

  return (
    <div className={style.auth}>
      <div className={style.head}></div>
      {/* 登录注册选择 */}
        <div className={style.tab}>
          <span className={cx({ [style.avtive]: type == 'login' })} onClick={() => setType('login')}>登录</span>
          <span className={cx({ [style.avtive]: type == 'register' })} onClick={() => setType('register')}>注册</span>
        </div>
        {/* 表格 */}
        <div className={style.form}>
          <Cell icon={<CustomIcon type="zhanghao" />}>
            <Input
              clearable
              type='text'
              placeholder='请输入账号'
              onChange={(value) => setUsername(value)}
            />
          </Cell>
          <Cell icon={<CustomIcon type="mima" />}>
            <Input
              clearable
              type='password'
              placeholder='请输入密码'
              onChange={(value) => SsetPassword(value)}
            />
          </Cell>
          {
            type === 'register' ? <Cell icon={<CustomIcon type="mima" />}>
              <Input
                clearable
                type='text'
                placeholder='请输入验证码'
                onChange={(value) => setVerify(value)}
              />
              <Captcha charNum={4} onChange={handleChange} />
            </Cell> : null
          }
        </div>
        {/* 底部说明和按钮 */}
        <div className={style.operation}>

          {
            type === 'register' ?  <div className={style.agree}>
              <Checkbox />
              <label className='text-light'>阅读并同意<a>用户手册</a></label>
            </div> : null
          }
          <Button block theme="parimary" onClick={onSubmit}>{type !== 'register' ? '登录' : '注册'}</Button>
        </div>
    </div>
  )
})

export default Login