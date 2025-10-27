import React from "react";
import style from "./style.module.css"
import { Avatar, Divider, } from "antd";
import { formatTime } from "@/utils/tools";


interface IProps {
    avatar: any,
    name: string,
    rightSide: any
    time?: string
}

const Comment: React.FC<IProps> = ({ avatar, name, time, rightSide }) => {
    return (
        <>
            <div className={style.comment}>
                <Avatar className={style.avatar} size={50} {...avatar} ></Avatar>
                <div className={style.content}>
                    <div className={style.questioner}>
                        <div className={style.user}>{name}</div>
                        <div>{time && formatTime(time)}</div>
                    </div>
                    <div className={style.rightSide}>
                        {rightSide}
                    </div>
                </div>
            </div>
            <Divider />
        </>
    )
}


export default Comment;