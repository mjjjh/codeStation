import React, { useState, useEffect } from 'react';
import { Pagination } from 'antd';
import { getIssuesApi } from '@/api/issue';
import { IIssueReqDate } from '@/types/api';
import PageHeader from '@/components/PageHeader';
import IssueItem from './components/IssueItem';
import AddButton from '@/pages/Issues/components/AddButton';
import Recommend from './components/Recommend';
import style from './style.module.css'
export const Issues: React.FC = () => {
    const [issuesList, setIssuesList] = useState<IIssueReqDate[]>([]);
    const [pageInfo, setPageInfo] = useState({
        current: 1,
        pageSize: 10,
        count: 0
    });
    // 获取数据
    const getData = async (params: { page: number, pageSize: number } = { page: 1, pageSize: 10 }) => {
        const res = await getIssuesApi({
            current: params.page,
            pageSize: params.pageSize,
            issueStatus: true
        });
        setIssuesList(res.data.data);
        setPageInfo({
            current: res.data.currentPage,
            pageSize: res.data.eachPage,
            count: res.data.count
        });
    }
    useEffect(() => {
        getData();
    }, [])

    const issuesListRender = issuesList.map((issue: IIssueReqDate, index) => (<IssueItem key={`issue-${index}-${issue.id}`} issue={issue}></IssueItem>))


    return (
        <div className={style.issueContainer}>
            <div className={style.leftSide}>
                <PageHeader title="问题列表"></PageHeader>
                {issuesListRender}
                <div className="paginationContainer">
                    <Pagination size="small" current={pageInfo.current} pageSize={pageInfo.pageSize} onChange={(page, pageSize) => { getData({ page, pageSize }) }} total={pageInfo.count} showSizeChanger showQuickJumper />
                </div>
            </div>
            <div className={style.rightSide}>
                <AddButton></AddButton>
                <Recommend></Recommend>
            </div>
        </div>
    );
}

export default Issues;
