import React, { useState, useEffect } from "react";
import { IBookResData, IUserInfo } from "@/types/api";
import { getBookDetailApi } from "@/api/book";
import { Image } from "antd";
import Discuss from "@/components/Discuss";
import HtmlRenderer from "@/components/HtmlRenderer";
import PageHeader from "@/components/PageHeader";
import { useParams } from "react-router-dom";
import style from "./style.module.css";


const BookDtail: React.FC = () => {
    const params = useParams<{
        id: string
    }>()

    const [bookInfo, setBookInfo] = useState<IBookResData>();

    useEffect(() => {
        async function getData() {
            const res = await getBookDetailApi(params.id || "");
            setBookInfo(res.data);
        }
        getData();
    }, [])

    return (
        <div>
            <PageHeader title="问题详情" showTag={false}></PageHeader>
            <div className={style.bookInfoContainer}>
                <div className={style.leftSide}>
                    <div className={style.img}>
                        <Image width={210} height={300} className={style.bookPic} src={bookInfo?.bookPic} alt="" />
                    </div>
                    <div>
                        下载所需积分
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