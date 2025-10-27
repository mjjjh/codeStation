import React, { useState, useEffect, useRef } from 'react'
import '@toast-ui/editor/dist/toastui-editor.css';
import style from "./style.module.css"
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store'
import { getTypeList } from '@/store/typeSlice'
import { useNavigate } from 'react-router-dom';

import { Editor } from '@toast-ui/react-editor';
import {
    Button,
    Form,
    Input,
    Select,
    message
} from 'antd';

import { formatSelectData } from '@/utils/tools'

import { addIssueApi } from '@/api/issue'

interface IProps {

}

interface IFormParams {
    title: string,
    category: string,
    description: string
}
type formKey = keyof IFormParams

const AddIssue: React.FC<IProps> = () => {

    const [form] = Form.useForm();
    const [formParams, setFormParams] = useState<IFormParams>({
        title: '',
        category: '',
        description: ''
    })
    const dispatch = useDispatch<AppDispatch>()

    const { typeList } = useSelector((state: RootState) => state.type)
    const { userInfo } = useSelector((state: RootState) => state.user)

    const editorRef = useRef<any>('');

    const navigate = useNavigate()

    useEffect(() => {
        if (typeList.length === 0) {
            dispatch(getTypeList())
        }
    }, [])

    const setHandle = (form: IFormParams, key: formKey, value: string) => {
        const _ = { ...form };
        _[key] = value;
        setFormParams(_);
    }
    const onSubmit = async () => {
        try {
            await form.validateFields();
            const content = editorRef.current.getInstance().getHTML();
            const params = {
                issueTitle: formParams.title,
                typeId: formParams.category,
                issueContent: content,
                userId: userInfo._id
            };
            const res = await addIssueApi(params);
            if (!res.code) {
                navigate('/');
                message.success('您的问题已提交，审核通过后将会进行展示');
            } else {
                message.error(res.msg);
            }

        } catch (err: any) {
            console.log(err);

            message.error(err);
        }
    };


    return (
        <div className={style.container}>
            <Form
                name='addIssue'
                form={form}
            >
                <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
                    <Input style={{ width: '30%' }} placeholder="请输入标题" value={formParams.title} onChange={(e) => setHandle(formParams, 'title', e.target.value)} />
                </Form.Item>
                <Form.Item label="Select" name="category" rules={[{ required: true, message: '请选择分类' }]}>
                    <Select style={{ width: '30%' }} onChange={(value) => setHandle(formParams, 'category', value)}
                        options={formatSelectData(typeList)}>
                    </Select>
                </Form.Item>
                <Form.Item label="描述" name="description" rules={[{ required: true, message: '请输入描述' }]}>
                    <Editor
                        initialValue=""
                        previewStyle="vertical"
                        height="600px"
                        initialEditType="markdown"
                        useCommandShortcut={true}
                        ref={editorRef}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={onSubmit}>
                        提交
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default AddIssue;