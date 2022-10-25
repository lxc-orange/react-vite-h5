import React, { forwardRef, useState, useRef, useEffect } from 'react'
import { Popup, Icon, Keyboard, Input, Toast } from 'zarm'
import cx from 'classnames'
import dayjs from 'dayjs';

import style from './style.module.less'
import PopupDate from '../PopupDate'
import CustomIcon from '../CustomIcon';
import { get, typeMap, post } from '@/utils'

const PopupAddBill = forwardRef((props, ref) => {
  const [show, setShow] = useState(false) //内部控制弹窗显示隐藏
  const [payType, setpayType] = useState('expense')// 支出、收入类型
  const dateRef = useRef()
  const [date, setDate] = useState(new Date()) // 日期
  const [amount, setAmount] = useState(0)
  const [currentType, setCurrentType] = useState({}) // 当前选中账单类型
  const [expense, setExpense] = useState([]) // 支出类型数组
  const [income, setIncome] = useState([]) // 收入类型数组
  const [remark, setRemark] = useState('') //备注内容
  const [showRemark, setShowRemark] = useState(false) //备注输入框展示控制

  const {detail, onReload} = props

  useEffect(() => {
    if(detail?.id) {
      setpayType(detail?.pay_type == 1 ? 'expense' : 'income')
      setCurrentType({
        id: detail?.type_id,
        name: detail?.type_name
      })
      setRemark(detail?.remark)
      setAmount(detail?.amount)
      setDate(dayjs(Number(detail.date)).$d)
    }
  }, [detail])

  if(ref) {
    ref.current = {
      show: () => {
        setShow(true)
      },
      close: () => {
        setShow(false)
      }
    }
  }
  const changeType = (type) => {
    setpayType(type)
  }
  const selectDate = (val) => {
    setDate(val)
  }

  // 键盘输入金额
  const handleMoney = (value) => {
    // value = value == 'ok' ? 'ok' : Number(value)
    if(value == 'delete') {
      let _amount = amount.slice(0, amount.length -2)
      setAmount(_amount)
      return
    }
    if(value == 'ok') {
      addBill()
      return;
    }
    let _amount = amount.toString() 
    if(value == '.' && _amount.includes('.')) return
    if (value != '.' && _amount.includes('.') && amount && amount.split('.')[1].length >= 2) return
    if(amount == 0) {
      setAmount(value)
      return
    }
    setAmount(amount + value)
  }

  // 收入支出类型
  useEffect(() => {
    async function fetchData() {
      const { data: { list } } = await get('/type/list')
      const _expense = list.filter(i => i.type == 1) //支出
      const _income = list.filter(i => i.type == 2)
      setExpense(_expense)
      setIncome(_income)
      if(!detail?.id) {
        setCurrentType(_expense[0]) // 新建账单，默认是支出类型数组的第一项
      }
    }
    fetchData()
  }, []);

  const addBill = async () => {
    if(!amount) {
      Toast.show('请输入具体金额')
      return
    }
    const params = {
      amount: Number(amount).toFixed(2),
      type_id: currentType.id, //账单种类
      type_name: currentType.name, // 账单种类名称
      date: dayjs(date).unix() * 1000, //日期时间戳
      pay_type: payType == 'expense' ? 1 : 2, // 账单类型传 1 或 2
      remark: remark || '' //备注
    }
    if(detail?.id) {
      params.id = detail?.id
      const result = await post('/bill/update', params)
      Toast.show('修改成功')
    } else {
      const result = await post('/bill/add', params)
      setAmount('')
      setpayType('expense')
      setDate(new Date())
      setRemark('')
      Toast.show('添加成功')
    }
    setShow(false)
    if(props.onReload) {
      props.onReload() // 首页传来的账单获取列表函数，添加后重新获取首页列表
    }
  }

  return (
    <Popup
      visible={show}
      direction="bottom"
      onMaskClick={() => setShow(false)}
      destroy={false}
      mountContainer={() => document.body}
    >
      <div className={style.addWrap}>
        {/* header */}
        <header className={style.header}>
          <span className={style.close} onClick={() => setShow(false)}><Icon type='wrong' /></span>
        </header>
        <div className={style.filter}>
          <div className={style.type}>
          <span onClick={() => changeType('expense')} className={cx({ [style.expense]: true, [style.active]: payType == 'expense' })}>支出</span>
          <span onClick={() => changeType('income')} className={cx({ [style.income]: true, [style.active]: payType == 'income' })}>收入</span>
          </div>
          <div
            className={style.time}
            onClick={() => dateRef?.current?.show()}
          >
            {dayjs(date).format('MM-DD')}<Icon className={style.arrow} type="arrow-bottom" />
          </div>
        </div>
     
        <div className={style.money}>
          <span className={style.sufix}>¥</span>
          <span className={cx(style.amount, style.animation)}>{amount}</span>
        </div>
        {/* 收入支出类型 */}
        <div className={style.typeWarp}>
          <div className={style.typeBody}>
            {/* 通过 payType 判断，是展示收入账单类型，还是支出账单类型 */}
            {
              (payType == 'expense' ? expense : income).map(item => <div onClick={() => setCurrentType(item)} key={item.id} className={style.typeItem}>
                {/* 收入和支出的字体颜色，以及背景颜色通过 payType 区分，并且设置高亮 */}
                <span className={cx({[style.iconfontWrap]: true, [style.expense]: payType == 'expense', [style.income]: payType == 'income', [style.active]: currentType.id == item.id})}>                
                  <CustomIcon className={style.iconfont} type={typeMap[item.id].icon} />
                </span>
                <span>{item.name}</span>
              </div>)
            }
          </div>
        </div>
        {/* 备注 */}
        <div className={style.remark}>
          {
            showRemark ? <Input
              autoHeight
              showLength
              maxLength={50}
              type='text'
              rows={3}
              value={remark}
              placeholder='请输入备注信息'
              onChange={(val) => setRemark(val)}
              onBlur={() => setShowRemark(false)}
            /> : <span className='ab' onClick={() => setShowRemark(true)}>{remark ? remark : '添加备注'}</span>
          }
        </div>

        <Keyboard type='price' onKeyClick={(value) => handleMoney(value)} />
        <PopupDate ref={dateRef} onSelect={selectDate} />

      </div>
    </Popup>
  )
})

export default PopupAddBill