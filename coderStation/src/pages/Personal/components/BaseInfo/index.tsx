import React from "react";
import { Button, Form, Input, Space } from "antd";
import { checkUserPwd } from "@/api/user";

interface IProps {
    nickname: string;
    userid: string
    closeModal: (refresh?: boolean, data?: any) => void
}

type FieldType = {
    oldPassword: string;
    newPassword: string;
    passwordConfirm: string;
    nickname: string
};

const BaseInfo: React.FC<IProps> = ({ nickname, userid, closeModal }) => {
    const [form] = Form.useForm<FieldType>();
    const checkPwd = async (_: any, value: string) => {

        if (!value) {
            return Promise.resolve()
        }
        const res = await checkUserPwd(userid, value)
        if (res.data) {
            return Promise.resolve()
        } else {
            return Promise.reject('密码错误')
        }
    }


    const submitInfo = (values: any) => {
        closeModal(true, { loginPwd: values.newPassword, nickname: values.nickname })
        // 清空输入
        form.resetFields();
        form.setFieldsValue({ nickname: values.nickname })
    };

    return (
        <Form
            form={form}
            name="basic"
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            onFinish={submitInfo}
            autoComplete="off"
            key='basicForm'
        >
            <Form.Item<FieldType>
                label="登录密码"
                name="oldPassword"
                rules={[{
                    validator: checkPwd
                }]}
                validateTrigger="onBlur"
            >
                <Input.Password placeholder="如果要修改密码，请先输入旧密码" />
            </Form.Item>

            <Form.Item<FieldType>
                label="新密码"
                name="newPassword"
                rules={[({ getFieldValue }) => ({
                    validator(_, value) {
                        if (!getFieldValue('oldPassword') && value) {
                            return Promise.reject(new Error('请输入旧密码'));
                        } else if (value && value === getFieldValue('oldPassword')) {
                            return Promise.reject(new Error('新密码不能与旧密码相同'));
                        } else if (value && !/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(value)) {
                            return Promise.reject(new Error('密码必须包含字母和数字的6-16位'));
                        }
                        return Promise.resolve();
                    },
                })]}
            >
                <Input.Password placeholder="请输入新密码" />
            </Form.Item>

            <Form.Item<FieldType>
                label="确认密码"
                name="passwordConfirm"
                rules={[({ getFieldValue }) => ({
                    validator(_, value) {
                        if (value && value !== getFieldValue('newPassword')) {
                            return Promise.reject(new Error('两次输入的密码不一致'));
                        }
                        return Promise.resolve();
                    },
                })]}
            >
                <Input.Password placeholder="请再次输入新密码" />
            </Form.Item>
            <Form.Item<FieldType>
                label="用户昵称"
                name="nickname"
                initialValue={nickname}
                rules={[{ required: true, message: '昵称不能为空' }]}
            >
                <Input placeholder="请输入昵称" />
            </Form.Item>

            <Form.Item label={null} wrapperCol={{ span: 12, offset: 8 }}>
                <Space>
                    <Button type="primary" htmlType="submit">
                        提交
                    </Button>
                    <Button type="primary" htmlType="button" onClick={() => form.resetFields()}>
                        重置
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default BaseInfo;