# ReactLearn
安装
```
npm create vite@latest
```
# Hooks

## useState

## useEffect
- 副作用概念：
    - 纯函数：一个确切的参数在函数中运行后，一定能得到一个确切的值
    - 如果函数存在副作用，就不是一个纯函数，所谓副作用，指的是函数的结果不可控，不可预期
    - 常见的副作用有发送网络请求、添加一些监听的注册和取消注册，手动修改DOM，以前将这些副作用写作生命周期钩子函数中，现在书写在useEffect这个hook中
- 副作用的依赖
    - 副作用函数每次重新渲染后，都会重新执行，有时候需要设置依赖项，传递第二个参数，第二个参数为一个依赖数组
    - 如果想要副作用函数只执行一次，可以设置空数组作为依赖项，请求时要这样设置

# router
安装
```
npm i react-router
```
## 路由模式
包裹根组件
- history BrowserRouter
- hashRouter HashRouter

Routes：类似v5的switch，提供上下文环境
``` jsx
 <Routes>
          <Route path='/' element={<Navigate  to="/home" replace={true}></Navigate>}></Route>
          <Route path='/home' element={<Home />}></Route>
          <Route path='/about' element={<About />}></Route>
          <Route path='/detail/:id' element={<Detail />}></Route>
          <Route path='/add' element={<AddOrEdit />}></Route>
          <Route path='/edit/:id' element={<AddOrEdit />}></Route>
        </Routes>
```
## 组件
NavLink 类似link，会被渲染成a标签，路由跳转
Navigate 路由跳转

## hooks
useParams 获取动态路由参数

useNavigate 路由跳转

useLocation 获取当前路由信息


## useRoutes 
等价于  `<Routes></Routes>`
使用js对象替换jsx
``` jsx
function Router(){
    return useRoutes([
        {path:"/",element:<Navigate to="/home" />},
        {path:"/home",element:<Home />},
        {path:"/about",element:<About />},
        {path:"/add",element:<AddOrEdit />},
        {path:"/edit/:id",element:<AddOrEdit />},
        {path:"/detail/:id",element:<Detail />},
    ])
}
```

### 嵌套路由
children配置类似vueRouter
显示窗口为 `<Outlet />`
``` jsx
 { 
            path: "/about", 
            element: <About /> ,
            children:[
                {
                    path: 'email',
                    element: <Email />
                },
                {
                    path: 'phone',
                    element: <Phone />
                },
                {
                    path: "",
                    element: <Navigate replace to="email" />
                }
            ]
        },
```

# Redux
安装
```
npm install @reduxjs/toolkit react-redux
```
 
- store
- reducer
- actionType
- action
通过store.dispatch(action)来触发action，action会被传递到reducer中，reducer会返回新的state，store会自动更新，DOM通过store.subscribe(render)来重新渲染。
通过store.getState()来获取state

## react-redux 和 redux Toolkit
文件结构从原来四个简化成两个，有些东西通过toolkit自动生成

## 使用
页面渲染从仓库（store）拿数据，有数据直接拿，没数据就给仓库派发（dispatch）异步请求任务createAsyncThunk，这个任务内部请求数据后会自动更新仓库的数据，页面重新渲染
``` javascript
export const getDataAsync = createAsyncThunk(名字(仓库名/操作名Async), async (参数, thunkAPI) => {
    const res = await axios.get(url, { params: 参数 })
    thunkAPI.dispatch(action(res))
})
```