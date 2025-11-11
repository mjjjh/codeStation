import request from "./request";
import { IResponse } from "../types/common";
import { IInterViewTitleResData } from "@/types/api";

// 获取面试题标题
export function getInterviewTitleApi(): Promise<IResponse<IInterViewTitleResData[][]>> {
    return request({
        url: "/api/interview/interviewTitle",
        method: "get",
    });
}

// 根据id获取面试信息
export function getInterviewByIdApi(id: string): Promise<IResponse<any>> {
    return request({
        url: `/api/interview/${id}`,
        method: "get",
    });
}