import React, { useEffect } from "react";
import style from '../css/PageHeader.module.css'
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { getTypeList } from "@/store/typeSlice";
import { Tag } from "antd";

import useScreenSize from "../hooks/useScreenSize";

interface IPageHeaderProps {
    title: string;
    showTag?: boolean
    tagClick?: (e: any) => void
}

const PageHeader: React.FC<IPageHeaderProps> = (props: IPageHeaderProps) => {
    const dispatch = useDispatch<AppDispatch>()
    const { typeList } = useSelector((state: RootState) => state.type)
    const isMobile = useScreenSize()

    const colorArr = ["#108ee9", "#2db7f5", "#f50", "green", "#87d068", "blue", "red", "purple"];

    const { title, showTag = true } = props

    useEffect(() => {
        if (typeList.length === 0) {
            dispatch(getTypeList())
        }
    }, [])

    const tagClickhandler = (e: any) => {
        const tagName = e.target?.textContent
        const typeId = typeList.find(item => item.typeName === tagName)?._id
        if (props.tagClick) {
            props.tagClick(typeId)
        }
    }

    const typeTags = [
        <Tag key={'all'} color="magenta" style={{ cursor: 'pointer' }}>全部</Tag>,
        ...typeList.map((item, index) => <Tag key={item._id} color={colorArr[index % colorArr.length]} style={{ cursor: 'pointer' }}>{item?.typeName}</Tag>
        )]
    return (<div className={style.row}>
        <div className={style.pageHeader} style={{ fontSize: isMobile ? '16px' : '26px' }}>{title}</div>
        <div className={style.tagContainer} onClick={tagClickhandler}>
            {showTag && typeTags}
        </div>

    </div>)
};

export default PageHeader;