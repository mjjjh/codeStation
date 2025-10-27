import React, { useState, useEffect } from 'react';
import { Pagination } from 'antd';
import { getIssuesApi } from '@/api/issue';
import { IIssueResDate } from '@/types/api';
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
    const [issuesList, setIssuesList] = useState<IIssueResDate[]>([]);
    const issuePage = useSelector((state: RootState) => state.storage.issuePage);
    const dispatch = useDispatch<AppDispatch>();
    const [pageInfo, setPageInfo] = useState(issuePage);
    // 获取数据
    const getData = async (params: { current: number, pageSize: number, count: number }) => {
        const res = await getIssuesApi({
            current: params.current,
            pageSize: params.pageSize,
            issueStatus: true
        });
        setIssuesList(res.data.data);
        const pageInfo = {
            current: res.data.currentPage,
            pageSize: res.data.eachPage,
            count: res.data.count
        }
        setPageInfo(pageInfo);
        dispatch(storeIssuePage(pageInfo));
    }
    useEffect(() => {
        getData(pageInfo);
    }, [])

    const issuesListRender = issuesList.map((issue: IIssueResDate, index) => (<IssueItem key={`issue-${index}-${issue._id}`} issue={issue}></IssueItem>))


    return (
        <div>
            <PageHeader title="问题列表"></PageHeader>
            <div className={style.issueContainer}>
                <div className={style.leftSide}>
                    {issuesListRender}
                    <div className="paginationContainer">
                        <Pagination size="small" current={pageInfo.current} pageSize={pageInfo.pageSize} onChange={(page, pageSize) => { getData({ current: page, pageSize, count: pageInfo.count }) }} total={pageInfo.count} showSizeChanger showQuickJumper />
                    </div>
                </div>
                <div className={style.rightSide}>
                    <AddButton></AddButton>
                    <Recommend></Recommend>
                    <ScoreRank></ScoreRank>
                </div>
            </div>
        </div>
    );
}

export default Issues;
