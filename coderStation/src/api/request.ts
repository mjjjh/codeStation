import axios from "axios";

const request = axios.create({
    // baseURL: ''
    timeout:5000
});


request.interceptors.request.use((config) => {
    // 请求处理
    return config;
},(err: any) => {
    console.log(err);
})


request.interceptors.response.use((res) => {
    // 响应处理
    return res;
},(err: any) => {
    console.log(err);
})

export default request;