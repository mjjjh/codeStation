import React, { useState, useEffect, use } from "react";
import { getTopUser } from "@/api/user"
import { topUserInfo } from "@/types/api"
import { Card } from "antd";
import ScoreItem from "../ScoreItem"

import style from "./style.module.css"

const ScoreRank: React.FC = () => {

    const [topUserInfo, setTopUserInfo] = useState<topUserInfo[]>([])

    useEffect(() => {
        async function getData() {
            const res = await getTopUser();
            setTopUserInfo(res.data)
        }
        getData();
    }, [])

    const rankList = topUserInfo.map((user: topUserInfo, index: number) => (<ScoreItem key={user._id} rank={index + 1} topUserInfo={user}></ScoreItem>))


    return (
        <Card title="积分排行榜" style={{ width: 300 }}>
            {rankList}
        </Card>
    )
}


export default ScoreRank