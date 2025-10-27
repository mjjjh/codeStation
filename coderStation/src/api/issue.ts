import request from "./request";
import { IResponse } from "../types/common";
import { IIssueReq, IIssueRes, IIssueAddReq, IIssueDetailRes } from "../types/api";
export function getIssuesApi(param: IIssueReq): Promise<IResponse<IIssueRes>> {
    return request({
        url: "/api/issue",
        method: "get",
        params: param
    });
}


export function addIssueApi(param: IIssueAddReq): Promise<IResponse<string>> {
    return request({
        url: "/api/issue",
        method: "post",
        data: param
    });
}

export function getIssueDetailApi(id: string): Promise<IResponse<IIssueDetailRes>> {
    return request({
        url: `/api/issue/${id}`,
        method: "get"
    });
}

