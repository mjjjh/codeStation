import React, { useEffect } from "react";
import style from './style.module.css'
import { IIssueResData } from "@/types/api";
import { formatTime } from "@/utils/tools";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getTypeList } from "@/store/typeSlice";
import { RootState, AppDispatch } from "@/store";
import { Tag } from "antd";
interface IIsueItemProps {
    issue: IIssueResData
}

const IssueItem: React.FC<IIsueItemProps> = ({ issue }: IIsueItemProps) => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()

    const { typeList } = useSelector((state: RootState) => state.type)
    const { commentNumber, scanNumber, issueTitle, issueContent, _id, nickname, issueDate, typeId } = issue

    const colorArr = ["#108ee9", "#2db7f5", "#f50", "green", "#87d068", "blue", "red", "purple"];

    useEffect(() => {
        if (typeList.length === 0) {
            dispatch(getTypeList())
        }
    }, [])



    const type = typeList.find(item => item._id === typeId)
    return (
        <div className={style.container}>
            <div className={style.issueNum}>
                <div>{commentNumber}</div>
                <span>回答</span>
            </div>
            <div className={style.issueNum}>
                <div>{scanNumber}</div>
                <span>浏览</span></div>
            <div className={style.issueContainer}>
                <div className={style.top} onClick={() => navigate(`/issue/detail/${_id}`)}>{issueTitle}</div>

                <div className={style.bottom}>
                    <div className={style.left}>
                        <Tag color={colorArr[typeList.indexOf(type!) % colorArr.length]}>{type?.typeName}</Tag>
                    </div>
                    <div className={style.right}>
                        {/* 用户昵称 */}
                        <Tag color="volcano"> {nickname}</Tag>
                        {formatTime(issueDate)}
                    </div>
                </div>
            </div>

        </div>
    )
};

export default IssueItem;