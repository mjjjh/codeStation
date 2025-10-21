import React from "react";
import { topUserInfo } from "@/types/api"

import style from "./style.module.css"
import { Avatar } from "antd";

type ScoreItemProps = {
    topUserInfo: topUserInfo;
    rank: number;
}

const ScoreRank: React.FC<ScoreItemProps> = ({ topUserInfo, rank }) => {

    const rankSvg = (color: string) => (<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4182" width="20" height="20"><path d="M816 213.7h-88v-20c0-8-12-16-20-16H268c-26.3 0-47.2 24.9-47.2 41l9.5 22.4-84.2 4.7c-20 0-18.1-8-18.1 8v100c0 84 56 152 136 172 28 76 92 136 176 152v64h-12c-8 0-4 4-4 12l-20 48-22 40c-8 0-12 4-12 12l-50 28c0 8 4 16 12 16l284.8 25c27.6 0 39.2-37 39.2-41v-68c0-8-4-12-12-12h-72v-48c0-8-12-12-24-12h-12v-24c84-16 151-66 175-142 80-20 137-63.5 137-222v-100c0-16.1-12-40.1-32-40.1z m-568 228v71.2c-85.7-38.1-109.6-69.1-115.1-159.1l2-104H248v191.9z m367.9-42.6l-64.5 58.1s-6.5 6.5-6.5 12.9l12.9 83.9c0 12.9-6.5 19.4-19.4 12.9L461 528.2l-83.9 45.2c-6.5 6.5-12.9 0-19.4-6.5v-6.5l12.9-83.9c0-6.5 0-6.5-6.5-12.9l-64.5-58.1c0-12.9 0-19.4 6.5-25.8l6.5-6.5 83.9-12.9c6.5 0 6.5-6.5 12.9-6.5l38.7-77.5c0-6.5 12.9-6.5 19.4-6.5l6.5 6.5 38.7 77.5c0 6.5 6.5 6.5 12.9 6.5l83.9 12.9c6.4 6.5 12.9 19.4 6.4 25.9zM812 345.7c0 52-36 112-84 132v-228l80 3 4 93z m0 0" fill={color} p-id="4183"></path><path d="M788.7 238.6h-88v-20c0-8-12-16-20-16h-440c-8 0-20 8-20 16v20h-88c-20 0-32 24-32 40v100c0 84 56 152 136 172 28 76 92 136 176 152v64h-12c-8 0-24 4-24 12v48h-72c-8 0-12 4-12 12v68c0 8 4 16 12 16h312c8 0 12-12 12-16v-68c0-8-4-12-12-12h-72v-48c0-8-12-12-24-12h-12v-64c84-16 152-76 176-152 80-20 136-88 136-172v-100c0-16-12-40-32-40z m-568 228v28c-48-20-84-68-84-120v-100h84v192z m336-60l-40 36s-4 4-4 8l8 52c0 8-4 12-12 8l-48-24-52 28c-4 4-8 0-12-4v-4l8-52c0-4 0-4-4-8l-40-36c0-8 0-12 4-16l4-4 52-8c4 0 4-4 8-4l24-48c0-4 8-4 12-4l4 4 24 48c0 4 4 4 8 4l52 8c4 4 8 12 4 16z m228-36c0 52-36 100-84 120v-216h84v96z m0 0" fill={color} p-id="4184"></path></svg>)

    let rankShow = null;
    switch (rank) {
        case 1:
            rankShow = rankSvg("#ffda23");
            break;
        case 2:
            rankShow = rankSvg("#c5c5c5");
            break;
        case 3:
            rankShow = rankSvg("#cd9a62");
            break;
        default:
            rankShow = rank
            break;
    }

    return (
        <div className={style.container} >
            <div className={style.left}>
                <div className={style.rank}>{rankShow}</div>
                <Avatar className={style.avatar} src={topUserInfo.avatar} />
                <div className={style.nickname}>{topUserInfo.nickname}</div>
            </div>
            <div className={style.right}>{topUserInfo.points}</div>
        </div>
    )
}


export default ScoreRank