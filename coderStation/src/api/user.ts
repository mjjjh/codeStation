import request from "./request";
import { IUserCommonData, IUserInfo } from "@/types/api";
import { IResponse } from "@/types/common";
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


/**
 * 判断注册的用户是否以及存在
 * @param loginId string
 * @returns 
 */
export function isUserAlready(loginId: string): Promise<IResponse<boolean>> {
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
export function register(userRegisterInfo: userFormInfoReq): Promise<IResponse<IUserCommonData>> {
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
export function login(userLoginInfo: userFormInfoReq): Promise<IResponse<IUserCommonData>> {
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
export function getUserInfo(id: string): Promise<IResponse<IUserInfo>> {
    return request({
        url: `/api/user/${id}`,
        method: 'get'
    })
}

/**
 * 获取当前登录用户信息
 * @returns 
 */
export function getUserInfoToken(): Promise<IUserCommonData> {
    return request({
        url: '/api/user/whoami',
        method: 'get'
    })
}




/**
 * 获取积分前十的用户
 */
export function getTopUser(): Promise<IResponse<IUserInfo[]>> {
    return request({
        url: '/api/user/pointsrank',
        method: 'get'
    })
}

/**
 * 根据id修改用户
 */
export function updateUser(id: string, userFormInfoReq: {
    [K in keyof IUserInfo]?: IUserInfo[K];
}): Promise<IResponse<IUserInfo>> {
    return request({
        url: `/api/user/${id}`,
        method: 'patch',
        data: userFormInfoReq
    })
}