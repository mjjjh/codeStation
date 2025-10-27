import React, { useEffect } from "react";
import style from '../css/PageHeader.module.css'
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { getTypeList } from "@/store/typeSlice";
import { Tag } from "antd";

interface IPageHeaderProps {
    title: string;
    showTag?: boolean
}

const PageHeader: React.FC<IPageHeaderProps> = (props: IPageHeaderProps) => {
    const dispatch = useDispatch<AppDispatch>()
    const { typeList } = useSelector((state: RootState) => state.type)
    const colorArr = ["#108ee9", "#2db7f5", "#f50", "green", "#87d068", "blue", "red", "purple"];

    const { title, showTag = true } = props

    useEffect(() => {
        if (typeList.length === 0) {
            dispatch(getTypeList())
        }
    }, [])

    const typeTags = typeList.map((item, index) => <Tag key={item._id} color={colorArr[index % colorArr.length]}>{item?.typeName}</Tag>
    )

    return (<div className={style.row}>
        <div className={style.pageHeader}>{title}</div>
        {showTag && typeTags}

    </div>)
};

export default PageHeader;