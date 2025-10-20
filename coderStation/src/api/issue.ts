import request from "./request";
import { IResponse } from "../types/common";
import { IIssueReq, IIssueRes } from "../types/api";
export function getIssuesApi(param: IIssueReq): Promise<IResponse<IIssueRes>> {
    return request({
        url: "/api/issue",
        method: "get",
        params: param
    });
}