import React from "react";
import { Card, Carousel } from 'antd';
import RecommendItem from "../RecommendItem";

import style from "./style.module.css"

const Recommend: React.FC = () => {
    return (
        <Card title="推荐内容" style={{ width: 300 }}>
            <Carousel autoplay>
                <div>
                    <h3 className={style.contentStyle}>1</h3>
                </div>
                <div>
                    <h3 className={style.contentStyle}>2</h3>
                </div>
                <div>
                    <h3 className={style.contentStyle}>3</h3>
                </div>
                <div>
                    <h3 className={style.contentStyle}>4</h3>
                </div>
            </Carousel>
            <RecommendItem noId="1" title="利用使用 Cursor 修复 Ant Design Pro Components 的 issues" href="https://segmentfault.com/a/1190000047298448"></RecommendItem>
            <RecommendItem noId="2" title="做好这件事，vivo 应用生态得以欣欣向荣" href="https://segmentfault.com/a/1190000047315727"></RecommendItem>
            <RecommendItem noId="3" title="昇腾，邀开发者上场" href="https://segmentfault.com/a/1190000047299514"></RecommendItem>
            <RecommendItem noId="4" title="OpenTiny NEXT 内核新生：生成式UI × MCP，重塑前端交互新范式！" href="https://segmentfault.com/a/1190000047273727"></RecommendItem>

        </Card>
    )
}

export default Recommend