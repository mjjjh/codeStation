import instance from "./request";
export function getStuListApi() {
    return instance({
        method: 'get',
        url: '/students'
    })
}

export function addStuApi(data: any) {
    return instance({
        method: 'post',
        url: '/students',
        data
    })
}

export function detailStuApi(id: any){
    return instance({
        method:'get',
        url: `/students/${id}`
    })
}

export function delStuApi(id: any){
    return instance({
        method:'delete',
        url: `/students/${id}`
    })
}

export function alterStuApi(id: any,data: any){
    return instance({
        method: "put",
        url: `/students/${id}`,
        data
    })
}