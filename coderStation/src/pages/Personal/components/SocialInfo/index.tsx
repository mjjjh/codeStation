import React from "react";
import { Button, Form, Input, Space } from "antd";

interface IProps {
    socialInfo: Partial<{ mail: string, qq: string, wechat: string, github: string }>
    closeModal: (refresh?: boolean, data?: any) => void
}

type FieldType = {
    mail: string;
    qq: string;
    wechat: string;
    github: string
};

const SocialInfo: React.FC<IProps> = ({ socialInfo, closeModal }) => {
    const [form] = Form.useForm<FieldType>();

    const submitInfo = (values: any) => {
        closeModal(true, { ...values })
        // 清空输入
        form.setFieldsValue({ ...values })
    };

    return (
        <Form
            form={form}
            name="social"
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            onFinish={submitInfo}
            autoComplete="off"
            initialValues={socialInfo}
            key='socialForm'
        >
            <Form.Item<FieldType>
                label="邮箱"
                name="mail"
                // 邮箱正则
                rules={[{
                    type: 'email',
                    message: '请输入正确的邮箱格式'
                }]}
                validateTrigger="onBlur"
            >
                <Input placeholder="请输入邮箱" />
            </Form.Item>

            <Form.Item<FieldType>
                label="QQ"
                name="qq"
                // QQ正则
                rules={[{ pattern: /^[1-9][0-9]{4,9}$/, message: '请输入正确的QQ号' }]}
                validateTrigger="onBlur"

            >
                <Input placeholder="请输入QQ" />
            </Form.Item>

            <Form.Item<FieldType>
                label="微信"
                name="wechat"
                // 微信正则
                rules={[{ pattern: /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/, message: '请输入正确的微信号' }]}
                validateTrigger="onBlur"

            >
                <Input placeholder="请输入微信" />
            </Form.Item>
            <Form.Item<FieldType>
                label="GitHub"
                name="github"
                // GitHub正则
                rules={[{ pattern: /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/, message: '请输入正确的GitHub' }]}
                validateTrigger="onBlur"

            >
                <Input placeholder="请输入GitHub" />
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

export default SocialInfo;