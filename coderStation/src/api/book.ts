import request from "./request";
import { IResponse } from "../types/common";
import { IBookReq, IBookResData, IBookRes } from "../types/api";
export function getBooksApi(param: IBookReq): Promise<IResponse<IBookRes>> {
    return request({
        url: "/api/book",
        method: "get",
        params: param
    });
}



export function getBookDetailApi(id: string): Promise<IResponse<IBookResData>> {
    return request({
        url: `/api/book/${id}`,
        method: "get"
    });
}

