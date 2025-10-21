import request from "./request";
import { topUserInfo } from "@/types/api";

/**
 * 获取验证码
 * @returns 
 */
export function getCaptcha(): Promise<string> {
    return request({
        url: '/res/captcha',
        method: 'get'
    })
}

export type userInfoData = {
    data: {
        enabled: boolean,
        loginId: string,
        _id: string,
    },
    token: string
}

type userRes<T> = {
    code: number,
    msg: string,
    data: T
}
/**
 * 判断注册的用户是否以及存在
 * @param loginId string
 * @returns 
 */
export function isUserAlready(loginId: string): Promise<userRes<boolean>> {
    return request({
        url: `/api/user/userIsExist/${loginId}`,
        method: 'get'
    })
}



export type userFormInfoReq = {
    loginId?: string;
    nickname?: string;
    loginPwd?: string;
    captcha?: string;
    remember?: boolean;
}


/**
 * 用户注册
 * @param userRegisterInfo userFormInfoReq
 * @returns 
 */
export function register(userRegisterInfo: userFormInfoReq): Promise<userRes<userInfoData>> {
    return request({
        url: '/api/user',
        method: 'post',
        data: userRegisterInfo
    })
}

/**
 * 登录
 * @param userLoginInfo userFormInfoReq
 * @returns 
 */
export function login(userLoginInfo: userFormInfoReq): Promise<userRes<userInfoData>> {
    return request({
        url: '/api/user/login',
        method: 'post',
        data: userLoginInfo
    })
}

/**
 * 通过id获取用户信息
 * @param id string
 * @returns 
 */
export function getUserInfo(id: string): Promise<userRes<userInfoData>> {
    return request({
        url: `/api/user/${id}`,
        method: 'get'
    })
}

/**
 * 获取当前登录用户信息
 * @returns 
 */
export function getUserInfoToken(): Promise<userInfoData> {
    return request({
        url: '/api/user/whoami',
        method: 'get'
    })
}




/**
 * 获取积分前十的用户
 */
export function getTopUser(): Promise<userRes<topUserInfo[]>> {
    return request({
        url: '/api/user/pointsrank',
        method: 'get'
    })
}