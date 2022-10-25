import React, { memo, useState, useEffect } from 'react'
import { Cell } from 'zarm'
import typeMap from '@/utils/icons'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

import style from './style.module.less'
import CustomIcon from '../CustomIcon'

const BillItem = memo(({bill, date}) => {
  const [income, setIncome] = useState(0) // 收入
  const [expense, setExpense] = useState(0) // 支出
  const navigate = useNavigate()
// console.log(bill);
  // 监听 bill.bills 计算每日的支出和收入
  useEffect(() => {
    const _income = bill?.filter(item => item.pay_type == 2).reduce((pre, curr) => {
      pre += Number(curr.amount)
      return pre;
    }, 0)
    setIncome(_income)

    const _expense = bill?.filter(i => i.pay_type == 1).reduce((pre, curr) => {
      pre += Number(curr.amount)
      return pre;
    }, 0)
    setExpense(_expense)
  }, [bill]);

  // 前往账单详情
  const goToDetail = (item) => {
    navigate(`/detail/${item.id}`)
  }
  return (
    <div className={style.item}>
      <div className={style.headerDate}>
        <div className={style.date}>{date}</div>
        <div className={style.money}>
          <span>
            <img src="//s.yezgea02.com/1615953405599/zhi%402x.png" alt="支" />
            <span>¥{expense?.toFixed(2)}</span>
          </span>
          <span>
            <img src="//s.yezgea02.com/1615953405599/shou%402x.png" alt="收" />
            <span>¥{income?.toFixed(2)}</span>
          </span>
        </div>
      </div>
      {
        bill?.map(item => <Cell
          className={style.bill}
          key={item.id}
          onClick={() => goToDetail(item)}
          title={
            <>
              <CustomIcon
                className={style.itemIcon}
                type={item.type_id ? typeMap[item.type_id].icon : 1}
              />
              <span>{item.type_name}</span>
            </>
          }
          description={<span style={{ color: item.pay_type == 2 ? 'red' : '#39be77' }}>{`${item.pay_type == 1 ? '-' : '+'}${item.amount}`}</span>}
          help={<div>{dayjs(Number(item.date)).format('HH:mm')} {item.remark ? `| ${item.remark}` : ''}</div>}
        >
        </Cell>)
      }
    </div>
  )
})

export default BillItem