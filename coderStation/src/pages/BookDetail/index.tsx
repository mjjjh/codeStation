import React, { useState, useEffect } from "react";
import { IBookResData } from "@/types/api";
import { getBookDetailApi } from "@/api/book";
import { Image, Modal, message } from "antd";
import Discuss from "@/components/Discuss";
import HtmlRenderer from "@/components/HtmlRenderer";
import PageHeader from "@/components/PageHeader";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { updateUserInfoAsync } from "@/store/userSlice";
import style from "./style.module.css";

const BookDtail: React.FC = () => {
    const params = useParams<{
        id: string
    }>()

    const [bookInfo, setBookInfo] = useState<IBookResData>();
    const { _id, points } = useSelector((state: RootState) => state.user.userInfo);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        async function getData() {
            const res = await getBookDetailApi(params.id || "");
            setBookInfo(res.data);
        }
        getData();
    }, [])

    const download = () => {
        Modal.confirm({
            title: "下载确认",
            content: "确认下载将扣除" + bookInfo?.requirePoints + "积分",
            okText: "确定",
            cancelText: "取消",
            okType: "primary",
            onOk: async () => {
                if (points < (bookInfo?.requirePoints || 0)) {
                    message.error("积分不足");
                    return
                };
                await dispatch(updateUserInfoAsync({ userid: _id, newInfo: { points: points - (bookInfo?.requirePoints || 0) } }));
                window.open(bookInfo?.downloadLink as string);
            }
        })
    }

    return (
        <div>
            <PageHeader title="问题详情" showTag={false}></PageHeader>
            <div className={style.bookInfoContainer}>
                <div className={style.leftSide}>
                    <div className={style.img}>
                        <Image height={300} className={style.bookPic} src={bookInfo?.bookPic} alt="" />
                    </div>
                    <div>
                        <span className={style.downloadLink} onClick={download}>下载</span>所需积分
                        <span className={style.requirePoints}>{bookInfo?.requirePoints}</span>
                        分
                    </div>
                </div>
                <div className={style.rightSide}>
                    <div className={style.title}>
                        {bookInfo?.bookTitle}
                    </div>
                    <HtmlRenderer expandable={true} expandRows={15} html={bookInfo?.bookIntro as string}></HtmlRenderer>
                </div>
            </div>
            <div className={style.comment}>
                <Discuss commentType={2} bookId={bookInfo?._id as string} typeId={bookInfo?.typeId as string}></Discuss>
            </div>

        </div>
    )
}

export default BookDtail