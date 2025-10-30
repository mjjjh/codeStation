import React from "react";
import { IBookResData } from "@/types/api";
import { Image } from "antd";
import { useNavigate } from "react-router-dom";
import style from "./style.module.css";

interface IBookItemProps {
    bookInfo: IBookResData;
}

const BookItem: React.FC<IBookItemProps> = ({ bookInfo }) => {
    const navigate = useNavigate();
    return (
        <div className={style.container}>
            <Image width={210} height={300} className={style.bookPic} src={bookInfo.bookPic} alt="" />
            <div className={style.bookInfo} onClick={() => navigate(`/books/detail/${bookInfo._id}`)}>
                <div className={style.bookName}>
                    {bookInfo.bookTitle}
                </div>
                <div className={style.bookNum}>
                    <span>浏览数:{bookInfo.scanNumber}</span>
                    <span>评论数:{bookInfo.commentNumber}</span>
                </div>
            </div>
        </div>
    )
}

export default BookItem