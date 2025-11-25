import React, { useState } from 'react';
import { Pagination, Empty } from 'antd';
import PageHeader from '@/components/PageHeader';
import GameItem from './components/GameItem';
import style from './style.module.css'

export const Games: React.FC = () => {

    const [pageInfo, setPageInfo] = useState({ current: 1, pageSize: 10, totalPage: 1 });

    const [gameList] = useState<{ name: string, url: string, pic: string }[]>([{
        name: "五子棋",
        url: "/games/fiveChess",
        pic: "/static/games/fiveChess.png"
    }]);
    const gameListRender = gameList.map((game, index) => (<GameItem key={index} gameInfo={game}></GameItem>))
    return (
        <div>
            <PageHeader title="游戏" showTag={false}></PageHeader>
            {
                gameList.length === 0 ? <Empty /> :
                    <>
                        <div className={style.gameContainer}>
                            {gameListRender}
                        </div>
                        <div className={style.pagination}>
                            <Pagination size="small" current={pageInfo.current} pageSize={pageInfo.pageSize} onChange={(page, pageSize) => { setPageInfo({ current: page, pageSize, totalPage: pageInfo.totalPage }) }} total={pageInfo.totalPage} showSizeChanger showQuickJumper />
                        </div>
                    </>
            }
        </div>
    );
}

export default Games;
