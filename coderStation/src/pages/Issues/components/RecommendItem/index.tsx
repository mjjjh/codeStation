import React from "react";
import style from "./style.module.css"

interface IRecommendItemProps {
    noId: string,
    title: string,
    href: string
}

const Recommend: React.FC<IRecommendItemProps> = ({ noId, title, href }) => {
    return (
        <a href={href} target="_blank" className={style.container}>
            <div className={style.leftSide}>
                {noId}
            </div>
            <div className={style.rightSide}>
                {title}
            </div>
        </a>
    )
}

export default Recommend