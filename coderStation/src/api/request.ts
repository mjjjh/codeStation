import axios from "axios";

const request = axios.create({
    baseURL: '/api',
    timeout:5000
});


request.interceptors.request.use((config) => {
    // 请求处理
    const token = localStorage.getItem('userToken');
    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
},(err: any) => {
    console.log(err);
})


request.interceptors.response.use((response) => {
    // 响应处理
    const res = response.data;
    return res;
},(err: any) => {
    console.log(err);
})

export default request;