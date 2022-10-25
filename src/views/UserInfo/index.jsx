import React, { memo, useState, useEffect } from 'react'
import { FilePicker, Button, Input, Toast } from 'zarm'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import s from './style.module.less'
import Header from '@/components/Header'
import { get, post } from '@/utils'

const UserInfo = memo(() => {
  const [user, setUser] = useState('')
  const [avatar, setAvatar] = useState({})
  const [signature, setSignature] = useState('')
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  useEffect(() => {
    getUserInfo()
  }, [])

  // 获取用户信息
  const getUserInfo = async () => {
    const { data } = await get('/user/get_userinfo');
    // console.log(data);
    setUser(data);
    setAvatar('http://api.chennick.wang' + data.avatar)
    setSignature(data.signature)
  }

  // 获取图片回调
  const handleSelect = (file) => {
    console.log(file.file);
    if(file?.file.size > 200 * 1024) {
      Toast.show('上传头像不能超过 200 KB')
      return
    }
    let formData = new FormData()
    // 生成 form-data 数据
    formData.append('file', file.file)
    // 通过 axios 设置 'Content-Type multipart/form-data 进行文件上传
    axios({
      method: 'post',
      url: `/upload`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': token
      }
    }).then(res => {
      setAvatar('http://api.chennick.wang' + res.data)
      console.log(res.data);
    })
  }

  const save = async () => {
    const { data } = await post('/user/edit_userinfo', {
      signature,
      avatar
    })
    Toast.show('修改成功')
    navigate('/user')
  }

  return (
    <>
      <Header title='用户信息' />
      <div className={s.userinfo}>
        <h1>个人资料</h1>
        <div className={s.item}>
          <div className={s.title}>头像</div>
          <div className={s.avatar}>
            <img src={avatar} className={s.avatarUrl} alt="" />
            <div className={s.desc}>
              <span>支持 jpg、png、jpeg 格式大小 200KB 以内的图片</span>
              <FilePicker className={s.filePicker} onChange={handleSelect} accept='image/*'>
                <Button className={s.upload} theme='primary' size='xs'>点击上传</Button>
              </FilePicker>
            </div>
          </div>
        </div>
        <div className={s.item}>
          <div className={s.title}>个性签名</div>
          <div className={s.signature}>
            <Input
              clearable
              type='text'
              value={signature}
              placeholder='请输入个性签名'
              onChange={(value) => setSignature(value)}
            />
          </div>
        </div>
        <Button onClick={save} style={{marginTop: 50}} block theme='primary'>保存</Button>
      </div>
    </>
  )
})

export default UserInfo