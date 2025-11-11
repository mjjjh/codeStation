import React, { useState, useEffect } from 'react';
import { Pagination, Empty } from 'antd';
import { getIssuesApi } from '@/api/issue';
import { IIssueReq, IIssueResData } from '@/types/api';
import PageHeader from '@/components/PageHeader';
import IssueItem from './components/IssueItem';
import AddButton from '@/pages/Issues/components/AddButton';
import Recommend from '@/components/Recommend';
import ScoreRank from '@/components/ScoreRank';
import { useSelector, useDispatch } from 'react-redux';
import { storeIssuePage } from '@/store/storageSlice';
import { RootState, AppDispatch } from '@/store';
import style from './style.module.css'
export const Issues: React.FC = () => {
    const [issuesList, setIssuesList] = useState<IIssueResData[]>([]);
    const issuePage = useSelector((state: RootState) => state.storage.issuePage);
    const dispatch = useDispatch<AppDispatch>();
    const [pageInfo, setPageInfo] = useState(issuePage);
    // 获取数据
    const getData = async (params: IIssueReq) => {
        const res = await getIssuesApi({
            ...params,
            issueStatus: true
        });
        setIssuesList(res.data.data);
        const pageInfo = {
            ...params,
            current: res.data.currentPage,
            pageSize: res.data.eachPage,
            totalPage: res.data.count
        }
        setPageInfo(pageInfo);
        dispatch(storeIssuePage(pageInfo));
    }
    useEffect(() => {
        getData(pageInfo);
    }, [])

    const serchByTag = (tagId: string) => {
        getData({ current: 1, pageSize: pageInfo.pageSize, totalPage: pageInfo.totalPage, typeId: tagId });
    }

    const issuesListRender = issuesList.map((issue: IIssueResData, index) => (<IssueItem key={`issue-${index}-${issue._id}`} issue={issue}></IssueItem>))

    return (
        <div>
            <PageHeader title="问题列表" tagClick={serchByTag}></PageHeader>
            <div className={style.issueContainer}>
                <div className={style.leftSide}>
                    {
                        issuesList.length === 0 ? <Empty></Empty>
                            : <>
                                {issuesListRender}
                                <div className={style.pagination}>
                                    <Pagination size="small" current={pageInfo.current} pageSize={pageInfo.pageSize} onChange={(page, pageSize) => { getData({ current: page, pageSize, totalPage: pageInfo.totalPage }) }} total={pageInfo.totalPage} showSizeChanger showQuickJumper />
                                </div>
                            </>}
                </div>
                <div className={style.rightSide}>
                    <AddButton></AddButton>
                    <Recommend></Recommend>
                    <ScoreRank></ScoreRank>
                </div>
            </div>
        </div >
    );
}

export default Issues;
