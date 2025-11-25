import React, { useRef, useState, useEffect } from "react";
import { Button, Pagination, message } from "antd";
import { UserOutlined } from '@ant-design/icons';
import { Editor } from '@toast-ui/react-editor';
import { useSelector, useDispatch } from "react-redux";
import { updateUserInfoAsync } from "@/store/userSlice";
import { RootState, AppDispatch } from "@/store";
import '@toast-ui/editor/dist/toastui-editor.css';
import Comment from "../Comment";
import HtmlRenderer from "../HtmlRenderer";

import { commentListApi, addCommentApi } from "@/api/comment";
import { ICommentResData } from "@/types/api";

import style from "./style.module.css"

interface IProps {
    commentType: number
    issueId?: string
    bookId?: string
    typeId: string
}
const Discuss: React.FC<IProps> = ({ commentType, issueId, bookId, typeId }) => {

    const editorRef = useRef<any>('');

    const [commentList, setCommentList] = useState<ICommentResData[]>([]);

    const [pageInfo, setPageInfo] = useState({
        current: 1,
        pageSize: 10,
        count: 0
    });

    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    const isLogin = useSelector((state: RootState) => state.user.isLogin);

    const dispatch = useDispatch<AppDispatch>()


    const toolbarItems = [
        // ['heading', 'bold', 'italic', 'strike'], // 标题、粗体、斜体、删除线
        // ['ul', 'ol', 'task'], // 无序列表、有序列表、任务列表
        ['link', 'image'], // 链接、图片、表格
        // ['code', 'codeblock'], // 代码、代码块
        // ['hr', 'quote'], // 分隔线、引用
        // ['undo', 'redo'], // 撤销、重做
        // ['fullscreen'], // 全屏（可选）
        // 🔥 关键：删除 'modeSwitch'（模式切换按钮）
    ];


    // 获取数据
    const getData = async (params: { page: number, pageSize: number } = { page: 1, pageSize: 10 }) => {
        if (commentType === 1) {
            if (!issueId) return
            // 问答的评论
            const res = await commentListApi(commentType, issueId, {
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
            if (!bookId) return
            const res = await commentListApi(commentType, bookId, {
                current: params.page,
                pageSize: params.pageSize
            });
            setCommentList(res.data.data);
            setPageInfo({
                current: res.data.currentPage,
                pageSize: res.data.eachPage,
                count: res.data.count
            });
        }
    }

    useEffect(() => {
        if (commentType === 1 && !issueId) return
        if (commentType === 2 && !bookId) return
        getData();
    }, [commentType, issueId, bookId]);

    const avatar = isLogin ? { src: userInfo?.avatar } : { icon: <UserOutlined /> };

    const commentListRender = commentList.map((item) => {
        return (
            <Comment key={item._id} avatar={item.avatar} name={item.nickname} time={item.commentDate} rightSide={(
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
            typeId: typeId,
            bookId: bookId,
            commentType: commentType
        }).then((res) => {
            if (!res.code) {
                message.success('评论成功');
                editorRef.current.getInstance().setHTML('');
            }
            dispatch(updateUserInfoAsync({
                userid: userInfo._id,
                newInfo: {
                    points: userInfo.points + 1
                }
            }));
            getData();
        }).catch((err) => {
            console.log(err);
        })
    }

    return (
        <div className={style.discussContainer}>
            {/* 评论 */}
            <Comment key='comment' avatar={avatar.src || avatar.icon} name={userInfo?.nickname} rightSide={(
                <>
                    <Editor
                        style={{ width: "100%" }}
                        toolbarItems={toolbarItems}
                        previewStyle="vertical"
                        height="300px"
                        initialEditType="wysiwyg"
                        hideModeSwitch={true}
                        useCommandShortcut={true}
                        ref={editorRef}
                        initialValue=" "
                    />
                    <Button disabled={!isLogin} className={style.reply} onClick={handleReply} type="primary">回复</Button>
                </>
            )
            } />

            {/* 评论列表 */}
            {commentListRender}
            {commentList.length === 0 ? <div style={{
                fontWeight: '200',
                textAlign: 'center',
                margin: "50px"
            }}>暂无评论</div> :
                <Pagination className={style.paginationContainer} size="small" current={pageInfo.current} pageSize={pageInfo.pageSize} onChange={(page, pageSize) => { getData({ page, pageSize }) }} total={pageInfo.count} showSizeChanger showQuickJumper />
            }
        </div>
    )
};

export default Discuss;