import React from "react";
import { Button, Form, Input, Space } from "antd";

interface IProps {
    introInfo: { intro: string }
    closeModal: (refresh?: boolean, data?: any) => void
}

type FieldType = {
    intro: string
};

const IntroInfo: React.FC<IProps> = ({ introInfo, closeModal }) => {
    const [form] = Form.useForm<FieldType>();

    const submitInfo = (values: any) => {
        if (!values.intro) {
            values.intro = "这个人很懒,什么都没有留下~~"
        }
        closeModal(true, { ...values })
        // 清空输入
        form.setFieldsValue({ ...values })
    };

    return (
        <Form
            form={form}
            name="intro"
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            onFinish={submitInfo}
            autoComplete="off"
            initialValues={introInfo}
            key='introForm'
        >
            <Form.Item<FieldType>
                label="个人简介"
                name="intro"
            >
                <Input.TextArea rows={10} placeholder="请输入个人简介" />
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

export default IntroInfo;