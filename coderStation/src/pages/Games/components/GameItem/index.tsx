import React from "react";
import { Image } from "antd";
import { useNavigate } from "react-router-dom";
import style from "./style.module.css";

interface IGameItemProps {
    gameInfo: { name: string, url: string, pic: string };
}

const GameItem: React.FC<IGameItemProps> = ({ gameInfo }) => {
    const navigate = useNavigate();
    return (
        <div className={style.container}>
            <Image width={210} height={300} src={gameInfo.pic} alt="" />
            <div className={style.gameInfo} onClick={() => navigate(gameInfo.url)}>
                <div className={style.gameName}>
                    {gameInfo.name}
                </div>
            </div>
        </div>
    )
}

export default GameItem