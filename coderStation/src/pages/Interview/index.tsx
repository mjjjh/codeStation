import React, { useEffect, useState } from 'react';
import { Tree, FloatButton } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { getInterViewTitleList } from '@/store/interViewSlice';
import { getTypeList } from '@/store/typeSlice';
import type { TreeDataNode } from 'antd';
import { getInterviewByIdApi } from '@/api/interview';
import PageHeader from '@/components/PageHeader';
import HtmlRenderer from '@/components/HtmlRenderer';
import style from "./style.module.css"



const Interviews: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const interviewTitleList = useSelector((state: RootState) => state.interView.interViewTitleList)

    const { typeList } = useSelector((state: RootState) => state.type)

    const [interViewTree, setInterViewTree] = useState<TreeDataNode[]>([])

    const [selectedInfo, setSelectedInfo] = useState<string>("");

    useEffect(() => {
        if (interviewTitleList.length === 0) {
            dispatch(getInterViewTitleList())
        }
        if (typeList.length === 0) {
            dispatch(getTypeList())
        }

        if (interviewTitleList.length && typeList.length) {
            const arr = typeList.map((item, index) => {
                return {
                    title: (<h3>{item.typeName}</h3>),
                    key: `father-${item._id}`,
                    children: interviewTitleList[index].map((childItme) => {
                        return {
                            title: (<h4>{childItme.interviewTitle}</h4>),
                            key: childItme._id
                        }
                    })
                }
            })
            setInterViewTree(arr)

        }

    }, [interviewTitleList, typeList])

    let rightSide = null;
    if (selectedInfo) {
        rightSide = <div className={style.rightSide}>
            <HtmlRenderer html={selectedInfo}></HtmlRenderer>
        </div>
    }

    const selectedInterview = (selectedKeys: React.Key[]) => {
        if ((selectedKeys[0] as string).startsWith("father-")) {

            return;
        }
        const interviewId = (selectedKeys[0] as string);
        async function getData() {
            const res = await getInterviewByIdApi(interviewId);
            setSelectedInfo(res.data.interviewContent);
        }
        getData();
    }

    return (
        <div>
            <PageHeader title="面试题大全" showTag={false}></PageHeader>
            <div className={style.interviewContainer}>
                <div className={style.leftSide}>
                    <Tree
                        treeData={interViewTree}
                        onSelect={selectedInterview}
                    />
                </div>
                <div className={style.rightSide}>
                    {rightSide}
                    <FloatButton.BackTop />
                </div>
            </div>
        </div>
    );
}

export default Interviews;
