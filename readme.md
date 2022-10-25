# 项目说明

本项目使用的是 react v18.2.0 react-router-dom v6.0.2  构建工具使用：vite v3.1.0  框架使用的是：zarm v2.9.16

本项目使用 react 的函数组件，组件都使用 memo函数包裹，当参数改变的时候，组件才会刷新，少量组件需要使用 useRef() 使用的是 forwardRef。

使用 react-router-dom v6 版本，抽离路由配置内容，页面内点击跳转使用的是 useNavigate 传入路径进行跳转，使用 useParams 获取动态路由传的参数

使用 vite 对项目进行配置，配置了 less、代理和路径别名。