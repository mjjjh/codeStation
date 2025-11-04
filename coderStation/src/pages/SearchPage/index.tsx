import React, { useState, useEffect } from 'react';
import { Pagination, Empty } from 'antd';
import { getIssuesApi } from '@/api/issue';
import { IIssueResData, IBookResData } from '@/types/api';
import PageHeader from '@/components/PageHeader';
import { getBooksApi } from '@/api/book';
import AddButton from '@/pages/Issues/components/AddButton';
import Recommend from '@/components/Recommend';
import ScoreRank from '@/components/ScoreRank';
import SearchItem from './components/SearchItem';
import { useLocation } from "react-router-dom";
import style from './style.module.css'

const SearchPage = () => {
    // 获取路由参数
    const location = useLocation();
    console.log(location.state);
    const [result, setResult] = useState<IIssueResData[] | IBookResData[]>([]);
    const [pageInfo, setPageInfo] = useState({ current: 1, pageSize: 10, totalPage: 0 });

    const isIssue = (searchCategory: string) => {
        return searchCategory === 'answer';
    }

    const getData = async (params: { current: number, pageSize: number, totalPage: number }) => {
        if (isIssue(location.state.searchCategory)) {
            const res = await getIssuesApi({
                ...params,
                issueTitle: location.state.searchValue,
                issueStatus: true
            });
            setResult(res.data.data);
            const pageInfo = {
                ...params,
                current: res.data.currentPage,
                pageSize: res.data.eachPage,
                totalPage: res.data.count
            }
            setPageInfo(pageInfo);
        } else {
            const res = await getBooksApi({
                ...params,
                bookTitle: location.state.searchValue
            });
            setResult(res.data.data);
            const pageInfo = {
                ...params,
                current: res.data.currentPage,
                pageSize: res.data.eachPage,
                totalPage: res.data.count
            }
            setPageInfo(pageInfo);
        }
    }

    useEffect(() => {
        getData(pageInfo);
    }, [location])

    const resultList = result.map(item => <SearchItem key={item._id} result={item}></SearchItem>);

    return (
        <div>
            <PageHeader title="搜索结果" showTag={false}></PageHeader>
            <div className={style.searchPageContainer}>
                <div className={style.leftSide}>
                    <div className={!isIssue(location.state.searchCategory) ? style.book : ''}>
                        {resultList}
                    </div>
                    {
                        resultList.length === 0 ? <Empty></Empty>
                            : <div className={style.pagination}>
                                <Pagination size="small" current={pageInfo.current} pageSize={pageInfo.pageSize} onChange={(page, pageSize) => { getData({ current: page, pageSize, totalPage: pageInfo.totalPage }) }} total={pageInfo.totalPage} showSizeChanger showQuickJumper />
                            </div>
                    }
                </div>
                <div className={style.rightSide}>
                    <AddButton></AddButton>
                    <Recommend></Recommend>
                    <ScoreRank></ScoreRank>
                </div>
            </div>
        </div >
    )
}

export default SearchPage