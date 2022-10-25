import React, { memo, useState, useEffect, useRef } from 'react'
import { Icon, Pull } from 'zarm'
import dayjs from 'dayjs'

import style from './index.module.less'
import BillItem from '@/components/BillItem'
import CustomIcon from '@/components/CustomIcon'
import PopupAddBill from '@/components/PopupAddBill'
import PopupType from '@/components/PopupType'
import PopupDate from '@/components/PopupDate'
import { get, REFRESH_STATE, LOAD_STATE } from '@/utils'

const Home = memo(() => {
  const [currentTime, setCurrentTime] = useState(dayjs().format('YYYY-MM'))// 当前筛选时间
  const [page, setPage] = useState(1) //分页
  const [list, setList] = useState([]) //数据列表
  const [totalPage, setTotalPage] = useState(0)//总页数
  const [refreshing, setRefreshing] = useState(REFRESH_STATE.complete)//下拉刷新状态
  const [loading, setLoading] = useState(LOAD_STATE.normal)//下拉加载状态
  const addRef = useRef() // 添加账单
  const typeRef = useRef() //账单类型
  const [currentSelect, setCurrentSelect] = useState({})
  const monthRef = useRef() //筛选月份
  const [totalExpense, setTotalExpense] = useState(0) //总支出
  const [totalIncome, setTotalIncome] = useState(0) //总收入


  useEffect(() => {
    getBillList()//请求数据
  }, [page, currentSelect, currentTime]);

  // 请求数据列表函数
  const getBillList = async () => {
    const {data} = await get(`/bill/list?page=${page}&page_size=5&date=${currentTime}&type_id=${currentSelect.id || 'all'}`)
    if(page == 1) {
      setList(data.list)
    } else {
      setList(list.concat(data.list))
    }
    let totalEx = 0;
    let totalIn = 0
    data?.list.forEach(item => {
      totalEx += item.bills.reduce((pre, cur) => {
        if(cur.pay_type == 1) {
          pre += Number(cur.amount)
          console.log(pre);
        }
        return pre
      }, 0)
      totalIn += item.bills.reduce((pre, cur) => {
        if(cur.pay_type == 2) {
          pre += Number(cur.amount)
          console.log(pre);
        }
        return pre
      }, 0)
    })
    setTotalExpense(totalEx)
    setTotalIncome(totalIn)
    setTotalPage(data.totalPage)
    // 上滑加载状态
    setLoading(LOAD_STATE.success);
    setRefreshing(REFRESH_STATE.success);
  }

  const refreshData = () => {
    setRefreshing(REFRESH_STATE.loading)
    if(page != 1) {
      setPage(1)
    } else {
      getBillList()
    }
  }

  const loadData = () => {
    if(page < totalPage) {
      setLoading(LOAD_STATE.loading)
      setPage(page + 1)
    }
  }

  const addToggle = () => {
    typeRef?.current?.show()
    // 添加账单列表
    addRef?.current?.show()
  }

  const toggle =() => {
    typeRef?.current?.show()
  }

  const select = (item) => {
    setRefreshing(REFRESH_STATE.loading)
    setPage(1)
    setCurrentSelect(item)
  }

  // 选择月份
  const monthToggle = () => {
    monthRef?.current?.show()
  }

  // 筛选月份
  const selectMonth = (item) => {
    setRefreshing(REFRESH_STATE.loading)
    setPage(1)
    setCurrentTime(item)
  }

  return (
    <div className={style.home}>
      <div className={style.header}>
        <div className={style.dataWrap}>
          <span className={style.expense}>总支出：<b>¥{totalExpense}</b></span>
          <span className={style.income}>总收入：<b>¥{totalIncome}</b></span>
        </div>

        <div className={style.typeWrap}>
          <div className={style.left}>
            <span className={style.title} onClick={toggle}>{currentSelect.name || '全部类型'}<Icon className={style.arrow} type='arrow-bottom' /></span>
          </div>
          <div className={style.right}>
            <span className={style.time} onClick={monthToggle}>{currentTime}<Icon className={style.arrow} type='arrow-bottom' /></span>
          </div>
        </div>
      </div>
      <div className={style.contentWrap}>
        {
          list?.length ? <Pull
            animationDuration={200}
            stayTime={400}
            refresh={{
              state: refreshing,
              handler: refreshData
            }}
            load={{
              state: loading,
              distance: 200,
              handler: loadData
            }}
          >
            {
              list.map((item, index) => <BillItem key={index} bill={item.bills} date={item.date} />)
            }
          </Pull> : null
        }
      </div>
      <PopupType ref={typeRef} onSelect={select} />
      <PopupDate ref={monthRef} mode='month' onSelect={selectMonth} />
      <div className={style.add} onClick={addToggle}><CustomIcon type='tianjia' /></div>
      <PopupAddBill ref={addRef} onReload={refreshData} />
    </div>
  )
})

export default Home