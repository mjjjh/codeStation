import request from "./request";
import { IResponse } from "../types/common";
import { ICommentReq, ICommentRes, IAddCommentReq } from "../types/api";
export function commentListApi(issueId: string, params: ICommentReq): Promise<IResponse<ICommentRes>> {
    return request({
        url: `/api/comment/issuecomment/${issueId}`,
        method: "get",
        params
    });
}


export function addCommentApi(params: IAddCommentReq): Promise<IResponse<string>> {
    return request({
        url: `/api/comment`,
        method: "post",
        data: params
    });
}