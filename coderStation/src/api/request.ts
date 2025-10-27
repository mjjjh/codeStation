import axios from "axios";

const request = axios.create({
    baseURL: '/api',
    timeout: 5000
});

// // 存储当前请求的控制器，用于取消重复请求
// const requestMap = new Map<string, AbortController>();
// let preTime: number | null = null;
// let preUrl = "";
request.interceptors.request.use((config) => {

    // // 生成请求唯一标识（这里用 url 简单判断，复杂场景可加上 method、params 等）
    // const requestKey = config.url || '';

    // // 检查是否有重复请求，若有则取消
    // if (requestMap.has(requestKey)) {
    //     const controller = requestMap.get(requestKey);
    //     controller?.abort(); // 取消上一次请求
    //     requestMap.delete(requestKey); // 移除已取消的请求
    // } 

    // // 创建新的控制器，用于后续可能的取消操作
    // const controller = new AbortController();
    // config.signal = controller.signal; // 将信号绑定到当前请求
    // requestMap.set(requestKey, controller);

    // if (preTime && preUrl === config.url && Date.now() - (+preTime) < 200) {
    //     return Promise.reject(preUrl + '请求过于频繁');
    // }

    // 请求处理
    const token = localStorage.getItem('userToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    // preTime = Date.now();
    // preUrl = config.url || '';
    return config;
}, (err: any) => {
    console.log(err);
})


request.interceptors.response.use((response) => {
    // const requestKey = response.config.url || '';
    // requestMap.delete(requestKey);
    // 响应处理
    const res = response.data;
    return res;
}, (err: any) => {
    console.log(err);
})

export default request;