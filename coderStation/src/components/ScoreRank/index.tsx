import React, { useState, useEffect } from "react";
import { getTopUser } from "@/api/user"
import { IUserInfo } from "@/types/api"
import { Card } from "antd";
import ScoreItem from "../ScoreItem"

const ScoreRank: React.FC = () => {

    const [topUserInfo, setTopUserInfo] = useState<IUserInfo[]>([])

    useEffect(() => {
        async function getData() {
            const res = await getTopUser();
            setTopUserInfo(res.data)
        }
        getData();
    }, [])

    const rankList = topUserInfo.map((user: IUserInfo, index: number) => (<ScoreItem key={user._id} rank={index + 1} topUserInfo={user}></ScoreItem>))


    return (
        <Card title="积分排行榜" style={{ maxWidth: '80%', marginTop: 30 }}>
            {rankList}
        </Card>
    )
}


export default ScoreRank