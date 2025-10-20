import request from "./request";
import { IResponse } from "../types/common";
import { ITypeRes } from "../types/api";

// 获取类别类型
export function getType(): Promise<IResponse<ITypeRes[]>> {
    return request({
        url: "/api/type",
        method: "get",
    });
}