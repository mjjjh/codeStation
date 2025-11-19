import React, { useState, useEffect } from 'react';
import { Pagination, Empty } from 'antd';
import { IBookReq, IBookResData } from '@/types/api';
import PageHeader from '@/components/PageHeader';
import { getBooksApi } from '@/api/book';
import BookItem from './components/BookItem';
import { useDispatch, useSelector } from 'react-redux';
import { storeBookPage } from '@/store/storageSlice';
import { RootState, AppDispatch } from '@/store';
import style from './style.module.css'

export const Book: React.FC = () => {
    const [bookList, setBookList] = useState<IBookResData[]>([]);
    const dispatch = useDispatch<AppDispatch>();
    const bookPage = useSelector((state: RootState) => state.storage.bookPage);

    const [pageInfo, setPageInfo] = useState(bookPage);
    // 获取数据
    const getData = async (params: IBookReq) => {
        const res = await getBooksApi(params);
        setBookList(res.data.data);
        const pageInfo = {
            ...params,
            current: res.data.currentPage,
            pageSize: res.data.eachPage,
            totalPage: res.data.count
        }
        setPageInfo(pageInfo);
        dispatch(storeBookPage(pageInfo));
    }
    useEffect(() => {
        getData(pageInfo);
    }, [])

    const searchByTag = (tagId: string) => {
        getData({ current: 1, pageSize: pageInfo.pageSize, totalPage: pageInfo.totalPage, typeId: tagId });
    }

    const bookListRender = bookList.map((book: IBookResData, index) => (<BookItem key={`issue-${index}-${book._id}`} bookInfo={book}></BookItem>))


    return (
        <div>
            <PageHeader title="最新资源" tagClick={searchByTag}></PageHeader>
            {
                bookList.length === 0 ? <Empty /> :
                    <>
                        <div className={style.bookContainer}>
                            {bookListRender}
                        </div>
                        <div className={style.pagination}>
                            <Pagination size="small" current={pageInfo.current} pageSize={pageInfo.pageSize} onChange={(page, pageSize) => { getData({ current: page, pageSize, totalPage: pageInfo.totalPage }) }} total={pageInfo.totalPage} showSizeChanger showQuickJumper />
                        </div>
                    </>
            }
        </div>
    );
}

export default Book;
