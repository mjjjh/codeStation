/**** user ****/
export interface IUserCommonData {
    data: {
        enabled: boolean,
        loginId: string,
        _id: string,
    },
    token: string
}


/**** issue ****/
export interface IIssueReq {
    current: number;
    pageSize: number;
    issueTitle?: string;
    typeId?: string;
    issueStatus: boolean;
}

export interface IIssueResData {
    _id: string, // mongodb 自动生成的 id
    issueTitle: string, // 问题标题
    issueContent: string, // 问题描述
    issuePic: string, // 问题图片
    scanNumber: number, //	问题浏览量
    commentNumber: number, //	评论数
    issueStatus: boolean, //	问题状态
    issueDate: string, //	问题时间
    userId: string,
    typeId: string
    nickname: string
}

export interface IIssueRes {
    count: number;
    currentPage: number;
    data: IIssueResData[];
    eachPage: number;
    totalPage: number;
}

export interface ITypeRes {
    _id: string;
    typeName: string;
}


export type IUserInfo = {
    avatar: string;
    enabled: boolean;
    intro: string;
    lastLoginDate: string;
    loginId: string;
    loginPwd: string;
    mail: string;
    nickname: string;
    points: number;
    qq: string;
    registerDate: string;
    wechat: string;
    _id: string;
}



export type IIssueAddReq = {
    issueTitle: string;
    issueContent: string;
    typeId: string;
    userId: string
}


/**
 * 问题详情响应
 */
export interface IIssueDetailRes {
    commentNumber: string,
    issueContent: string,
    issueDate: string,
    issueStatus: string,
    issueTitle: string,
    nickname: string,
    scanNumber: string,
    typeId: string,
    userId: string,
    _id: string,
}


/**** comment ****/
export interface ICommentReq {
    current: number;
    pageSize: number;
}


export interface ICommentRes {
    currentPage: number,
    eachPage: number,
    count: number,
    totalPage: number,
    data: ICommentResData[],
}

export interface ICommentResData {
    _id: string,
    userId: string,
    issueId: string,
    bookId: string,
    typeId: string,
    commentContent: string, // 对应评论
    commentDate: string, // 评论日期
    commentType: string, // 评论类型
    nickname: string
    avatar: string
}


export interface IAddCommentReq {
    userId: string,
    issueId?: string,
    bookId?: string,
    typeId: string,
    commentContent: string,
    commentType: number,
}



/*** book ***/

export interface IBookReq {
    current: number;
    pageSize: number;
    bookTitle?: string;
    typeId?: string;
}


export interface IBookResData {
    _id: string;
    bookTitle: string, // 书籍标题
    bookPic: string, // 书籍图片
    downloadLink: string, // 下载链接
    bookIntro: string, // 书籍介绍
    scanNumber: number, // 浏览数
    commentNumber: number, // 评论数
    onShelfDate: string, // 上架日期
    requirePoints: number, // 下砸所需积分
    typeId: string
}

export interface IBookRes {
    count: number;
    currentPage: number;
    data: IBookResData[];
    eachPage: number;
    totalPage: number;
}