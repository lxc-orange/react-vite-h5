import axios from 'axios'
import { Toast } from 'zarm'

const MODE = import.meta.env.MODE // 环境变量

axios.defaults.baseURL = MODE == 'development' ? '/api' : 'http://api.chennick.wang'
 // 设置请求的基础路径
axios.defaults.withCredentials = true
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers['Authorization'] = `${localStorage.getItem('token') || null}` // Authorization 是我们在服务端鉴权的时候用到的，我们在前端设置好 token，服务端通过获取请求头中的 token 去验证每一次请求是否合法
axios.defaults.headers.post['Content-Type'] = 'application/json'

console.log(localStorage.getItem('token'), 'token');
// interceptors 拦截器，下面的是响应拦截器，拦截每一次请求，修改返回的数据格式，判断状态码
axios.interceptors.response.use(res => {
  if (typeof res.data !== 'object') {
    Toast.show('服务端异常！')
    return Promise.reject(res)
  }
  if (res.data.code != 200) {
    if (res.data.msg) Toast.show(res.data.msg)
    if (res.data.code == 401) {
      window.location.href = '/login'
    }
    return Promise.reject(res.data)
  }

  return res.data
})

export default axios