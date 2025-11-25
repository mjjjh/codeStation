import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getIssueDetailApi } from "@/api/issue";
import PageHeader from '@/components/PageHeader';
import AddButton from '@/pages/Issues/components/AddButton';
import Recommend from '@/components/Recommend';
import ScoreRank from '@/components/ScoreRank';
import { IIssueDetailRes, IUserInfo } from "@/types/api";
import { getUserInfo } from "@/api/user";
import { Avatar } from "antd";
import { formatTime } from '@/utils/tools';
import HtmlRenderer from '@/components/HtmlRenderer';
import Discuss from "@/components/Discuss";
import useScreenSize from '@/hooks/useScreenSize';

import style from "./style.module.css"

const IssueDetail: React.FC = () => {
    const params = useParams<{
        id: string
    }>()

    const [issueDetail, setIssueDetail] = useState<IIssueDetailRes>();
    const [userInfo, setUserInfo] = useState<IUserInfo>();
    const isMobile = useScreenSize();

    useEffect(() => {
        async function getData() {
            const res = await getIssueDetailApi(params.id || "");
            setIssueDetail(res.data);
            const resUserInfo = await getUserInfo(res.data.userId as string);
            setUserInfo(resUserInfo.data);
        }
        getData();
    }, [])

    return (
        <div>
            <PageHeader title="问题详情" showTag={false}></PageHeader>
            <div className={style.detailContainer}>
                <div className={style.leftSide}>
                    <div className={style.question}>
                        {/* 标题 */}
                        <h1>{issueDetail?.issueTitle}</h1>
                        {/* 用户相关数据 */}
                        <div className={style.questioner}>
                            <Avatar src={userInfo?.avatar} ></Avatar>
                            <div className={style.user}>{userInfo?.nickname}</div>
                            <div>发布于：{formatTime(issueDetail?.issueDate as string)}</div>
                        </div>
                        <div className={style.content}>
                            <HtmlRenderer html={issueDetail?.issueContent as string} imageStyle={{
                                width: '100%',
                                aspectRatio: '1'
                            }}></HtmlRenderer>
                        </div>
                    </div>
                    <Discuss commentType={1} issueId={issueDetail?._id as string} typeId={issueDetail?.typeId as string}></Discuss>
                </div>

                {!isMobile && <div className={style.rightSide} >
                    <AddButton></AddButton>
                    <Recommend></Recommend>
                    <ScoreRank></ScoreRank>
                </div>}
            </div>
        </div >
    )
}

export default IssueDetail