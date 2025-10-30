import React, { useState, useEffect } from 'react';
import { Pagination } from 'antd';
import { IBookResData } from '@/types/api';
import PageHeader from '@/components/PageHeader';
import { getBooksApi } from '@/api/book';
import BookItem from './components/BookItem';
import style from './style.module.css'

export const Book: React.FC = () => {
    const [bookList, setBookList] = useState<IBookResData[]>([]);

    const [pageInfo, setPageInfo] = useState({ current: 1, pageSize: 10, count: 0 });
    // 获取数据
    const getData = async (params: { current: number, pageSize: number, count: number }) => {
        const res = await getBooksApi({
            current: params.current,
            pageSize: params.pageSize,
        });
        setBookList(res.data.data);
        const pageInfo = {
            current: res.data.currentPage,
            pageSize: res.data.eachPage,
            count: res.data.count
        }
        setPageInfo(pageInfo);
    }
    useEffect(() => {
        getData(pageInfo);
    }, [])

    const bookListRender = bookList.map((book: IBookResData, index) => (<BookItem key={`issue-${index}-${book._id}`} bookInfo={book}></BookItem>))


    return (
        <div>
            <PageHeader title="最新资源"></PageHeader>
            <div className={style.bookContainer}>
                {bookListRender}

            </div>
            <div className="paginationContainer">
                <Pagination size="small" current={pageInfo.current} pageSize={pageInfo.pageSize} onChange={(page, pageSize) => { getData({ current: page, pageSize, count: pageInfo.count }) }} total={pageInfo.count} showSizeChanger showQuickJumper />
            </div>
        </div>
    );
}

export default Book;
