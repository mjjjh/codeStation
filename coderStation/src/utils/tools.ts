import { ITypeRes } from "@/types/api";

/**
 * 时间格式化
 */
export function formatTime(time: string) {
    const date = new Date(parseInt(time));

    const Y = date.getFullYear();
    const M = (date.getMonth() + 1).toString().padStart(2, '0');
    const D = date.getDate().toString().padStart(2, '0');



    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    const s = date.getSeconds().toString().padStart(2, '0');
    // 距离今天超过一天,显示日期
    if (new Date().getTime() - date.getTime() > 24 * 60 * 60 * 1000) {
        return `${Y}-${M}-${D}`;
    }

    if (new Date().getTime() - date.getTime() < 24 * 60 * 60 * 1000) {
        return `${h}:${m}:${s}`;
    }

    // 一周内显示星期
    const week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    return `${Y}-${M}-${D} ${week[date.getDay()]}`;



}


/**
 * 选择框的数据格式化
 */
export function formatSelectData(data: ITypeRes[]) {
    return data.map((item: any) => {
        return {
            label: item.typeName,
            value: item._id
        }
    })
}