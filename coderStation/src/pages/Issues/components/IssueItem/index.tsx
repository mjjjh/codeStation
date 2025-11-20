import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { getTypeList } from "@/store/typeSlice";
import { IIssueResData } from "@/types/api";
import { formatTime } from "@/utils/tools";
import { Tag,Typography } from "antd";
import style from "@/css/IssueItem.module.css"
interface IIsueItemProps {
    issue: IIssueResData
    isMobile: boolean
}

const IssueItem: React.FC<IIsueItemProps> = ({ issue, isMobile }: IIsueItemProps) => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()

    const { typeList } = useSelector((state: RootState) => state.type)
    const { commentNumber, scanNumber, issueTitle, _id, nickname, issueDate, typeId } = issue

    const colorArr = ["#108ee9", "#2db7f5", "#f50", "green", "#87d068", "blue", "red", "purple"];

    useEffect(() => {
        if (typeList.length === 0) {
            dispatch(getTypeList())
        }
    }, [])



    const type = typeList.find(item => item._id === typeId)
    return (
        <div className={`${style.container} ${isMobile ? style.mobileContainer : ''}`}>
            {!isMobile ? (
                <>
                    <div className={style.issueNum}>
                        <div>{commentNumber}</div>
                        <span>回答</span>
                    </div>
                    <div className={style.issueNum}>
                        <div>{scanNumber}</div>
                        <span>浏览</span></div>
                    <div className={style.issueContainer}>
                        <div className={style.top} onClick={() => navigate(`/issue/detail/${_id}`)}>
                            <Typography.Paragraph ellipsis={{ rows: 3 }}>{issueTitle}</Typography.Paragraph>
                        </div>

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
                </>
            ) : (
                <div className={style.mobileIssueContainer}>
                    <div className={style.top} onClick={() => navigate(`/issue/detail/${_id}`)}>
                        <Typography.Paragraph ellipsis={{ rows: 3 }}>{issueTitle}</Typography.Paragraph>
                    </div>
                    <div className={style.mobileStats}>
                        <div className={style.mobileStatItem}>
                            <span className={style.statNumber}>{commentNumber}</span>
                            <span className={style.statLabel}>回答</span>
                        </div>
                        <div className={style.mobileStatItem}>
                            <span className={style.statNumber}>{scanNumber}</span>
                            <span className={style.statLabel}>浏览</span>
                        </div>
                    </div>
                    <div className={style.bottom}>
                        <div className={style.left}>
                            <Tag color={colorArr[typeList.indexOf(type!) % colorArr.length]}>{type?.typeName}</Tag>
                        </div>
                        <div className={style.right}>
                            <Tag color="volcano"> {nickname}</Tag>
                            {formatTime(issueDate)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
};

export default IssueItem;