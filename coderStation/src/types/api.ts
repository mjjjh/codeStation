export interface IIssueReq {
    current: number;
    pageSize: number;
    issueTitle?: string;
    typeId?: string;
    issueStatus: boolean;
}

export interface IIssueReqDate {
    id: string, // mongodb 自动生成的 id
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
    data: IIssueReqDate[];
    eachPage: number;
    totalPage: number;
}

export interface ITypeRes {
    _id: string;
    typeName: string;
}


export type topUserInfo = {
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