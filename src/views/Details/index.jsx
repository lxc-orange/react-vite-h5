import React, { memo, useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
// import qs from 'query-string'
import dayjs from 'dayjs'
import cx from 'classnames'
import { Modal, Toast } from 'zarm'

import s from './style.module.less'
import Header from '@/components/Header'
import CustomIcon from '@/components/CustomIcon'
import { get, typeMap, post } from '@/utils'
import PopupAddBill from '@/components/PopupAddBill'

const Details = memo(() => {
  const params = useParams() // 获取到动态路由传来的值
  const [detail, setDetail] = useState({})
  const navigate = useNavigate()
  const editRef = useRef()

  useEffect(() => {
    getDetail()
  }, []);

  // 获取账单详情
  const getDetail = async () => {
    const { data } = await get(`/bill/detail?id=${params.id}`)
    setDetail(data)
  }

  // 删除账单
  const detelteDetail = () => {
    const id = params.id 
    Modal.confirm({
      title: '删除',
      content: '确认删除账单？',
      onOk: async () => {
        const { data } = await post('/bill/delete', {id})
        console.log(data);
        Toast.show('删除成功')
        navigate('/')
      }
    })
  }

  // 修改账单
  const editBill = () => {

  }

  return (
    <div className={s.detail}>
      <Header title='账单详情' />
      <div className={s.card}>
        <div className={s.type}>
          {/* 通过 pay_type 属性，判断是收入或指出，给出不同的颜色*/}
          <span className={cx({ [s.expense]: detail.pay_type == 1, [s.income]: detail.pay_type == 2 })}>
            {/* typeMap 是我们事先约定好的 icon 列表 */}
            <CustomIcon className={s.iconfont} type={detail.type_id ? typeMap[detail.type_id].icon : 1} />
          </span>
          <span>{ detail.type_name || '' }</span>
        </div>
        {
          detail.pay_type == 1
            ? <div className={cx(s.amount, s.expense)}>-{ detail.amount }</div>
            : <div className={cx(s.amount, s.incom)}>+{ detail.amount }</div>
        }
        <div className={s.info}>
          <div className={s.time}>
            <span>记录时间</span>
            <span>{dayjs(Number(detail.date)).format('YYYY-MM-DD HH:mm')}</span>
          </div>
          <div className={s.remark}>
            <span>备注</span>
            <span>{ detail.remark || '-' }</span>
          </div>
        </div>
        <div className={s.operation}>
          <span onClick={e => detelteDetail()}><CustomIcon type='shanchu' />删除</span>
          <span  onClick={() => editRef?.current?.show()}><CustomIcon type='tianjia' />编辑</span>
        </div>
        <PopupAddBill ref={editRef} detail={detail} onReload={getDetail} />
      </div>
    </div>
  )
})

export default Details