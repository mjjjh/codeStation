import React, { useRef, useState, useEffect } from "react";
import { Button, Pagination, message } from "antd";
import { UserOutlined } from '@ant-design/icons';
import { Editor } from '@toast-ui/react-editor';
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import '@toast-ui/editor/dist/toastui-editor.css';
import Comment from "../Comment";
import HtmlRenderer from "../HtmlRenderer";

import { commentListApi, addCommentApi } from "@/api/comment";
import { ICommentResData } from "@/types/api";

import style from "./style.module.css"

interface IProps {
    commentType: number
    issueId: string
    typeId: string
}
const Discuss: React.FC<IProps> = ({ commentType, issueId }) => {

    const editorRef = useRef<any>('');

    const [commentList, setCommentList] = useState<ICommentResData[]>([]);

    const [pageInfo, setPageInfo] = useState({
        current: 1,
        pageSize: 10,
        count: 0
    });

    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    const isLogin = useSelector((state: RootState) => state.user.isLogin);

    // 获取数据
    const getData = async (params: { page: number, pageSize: number } = { page: 1, pageSize: 10 }) => {
        if (commentType === 1) {
            // 问答的评论
            const res = await commentListApi(issueId, {
                current: params.page,
                pageSize: params.pageSize
            });
            setCommentList(res.data.data);
            setPageInfo({
                current: res.data.currentPage,
                pageSize: res.data.eachPage,
                count: res.data.count
            });
        } else if (commentType === 2) {
            // 书籍的评论
        }

    }
    useEffect(() => {
        if (!issueId) return
        getData();
    }, [issueId])

    const avatar = isLogin ? { src: userInfo?.avatar } : { icon: <UserOutlined /> };

    const commentListRender = commentList.map((item) => {
        return (
            <Comment key={item._id} avatar={avatar} name={item.nickname} time={item.commentDate} rightSide={(
                <HtmlRenderer expandable={true} html={item.commentContent} />
            )} />
        )
    })

    const handleReply = () => {
        const commentContent = editorRef.current.getInstance().getHTML();
        const realContent = commentContent.replace(/<p>|<\/p>|<br>|&nbsp;/g, '');
        console.log(realContent);
        if (realContent === '') {
            message.error('评论内容不能为空');
            return
        }
        addCommentApi({
            userId: userInfo._id,
            issueId: issueId,
            commentContent: commentContent,
            typeId: issueId,
            commentType: commentType
        }).then((res) => {
            if (!res.code) {
                message.success('评论成功');
                editorRef.current.getInstance().setHTML('');
            }
            getData();
        }).catch((err) => {
            console.log(err);
        })
    }

    return (
        <div className={style.discussContainer}>
            {/* 评论 */}
            <Comment key='comment' avatar={avatar} name={userInfo?.nickname} rightSide={(
                <>
                    <Editor
                        style={{ width: "100%" }}
                        initialValue=""
                        previewStyle="vertical"
                        height="300px"
                        initialEditType="markdown"
                        useCommandShortcut={true}
                        ref={editorRef}
                    />
                    <Button disabled={!isLogin} className={style.reply} onClick={handleReply} type="primary">回复</Button>
                </>
            )
            } />
            {/* 评论列表 */}
            {commentListRender}

            {/* 分页 */}
            <Pagination className={style.paginationContainer} size="small" current={pageInfo.current} pageSize={pageInfo.pageSize} onChange={(page, pageSize) => { getData({ page, pageSize }) }} total={pageInfo.count} showSizeChanger showQuickJumper />
        </div>
    )
};

export default Discuss;