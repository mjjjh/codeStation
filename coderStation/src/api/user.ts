import request from "./request";

export function getCaptcha(){
    return request({
        url:'/res/captcha',
        method: 'get'
    })
}