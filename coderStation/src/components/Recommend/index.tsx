import React from "react";
import { Card, Carousel } from 'antd';
import RecommendItem from "../RecommendItem";

import style from "./style.module.css"
import hot1 from '/hot/hot1.png'
import hot2 from '/hot/hot2.png'
import hot3 from '/hot/hot3.png'
import hot4 from '/hot/hot4.png'

const Recommend: React.FC = () => {
    return (
        <Card title="推荐内容" style={{ maxWidth: '80%', marginTop: 30 }}>
            <Carousel autoplay arrows>
                <div>
                    <img src={hot1} className={style.contentStyle} />
                </div>
                <div>
                    <img src={hot2} className={style.contentStyle} />
                </div>
                <div>
                    <img src={hot3} className={style.contentStyle} />
                </div>
                <div>
                    <img src={hot4} className={style.contentStyle} />
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