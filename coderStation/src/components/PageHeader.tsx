import React from "react";
import style from '../css/PageHeader.module.css'

interface IPageHeaderProps {
    title: string;
}

const PageHeader: React.FC<IPageHeaderProps> = (props: IPageHeaderProps) => {
    const { title } = props
    return (<div className={style.row}>
        <div className={style.pageHeader}>{title}</div>
    </div>)
};

export default PageHeader;