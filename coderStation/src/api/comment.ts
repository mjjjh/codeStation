import request from "./request";
import { IResponse } from "../types/common";
import { ICommentReq, ICommentRes, IAddCommentReq } from "../types/api";
export function commentListApi(commentType: number, issueId: string, params: ICommentReq): Promise<IResponse<ICommentRes>> {
    const midChoice = commentType === 1 ? "issuecomment" : "bookcomment";
    return request({
        url: `/api/comment/${midChoice}/${issueId}`,
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