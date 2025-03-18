import { useState, useRef, useEffect } from "react";
import { Modal, Radio, Form, Input, Button, Row, Col, Checkbox } from "antd"
import type { CheckboxGroupProps, CheckboxChangeEvent } from 'antd/es/checkbox';
import { getCaptcha } from "../api/user";
import style from '../css/LoginForm.module.css'
// import style from '../css/LoginForm.module.css'
type FieldType = {
    loginId?: string;
    nickname?: string;
    password?: string;
    captcha?: string;
    remember?: boolean;
};


export default function LoginForm(props) {

    const [radioValue, setRadioValue] = useState('0');

    // 登录表单的ref
    const loginInfoForm = useRef(null);
    // 注册表单的ref
    const registerFormRef = useRef(null);
    const [loginInfo, setLoginInfo] = useState<FieldType>({
        loginId: "",
        password: "",
        captcha: "",
        remember: true
    });

    // 注册表单的状态数据
    const [registerInfo, setRegisterInfo] = useState({
        loginId: "",
        nickname: "",
        captcha: "",
    })


    const options: CheckboxGroupProps<string>['options'] = [
        { label: '登录', value: '0' },
        { label: '注册', value: '1' },
    ];


    // 验证码请求

    useEffect(() => {
        async function getCaptchaReq() {
            const res = await getCaptcha();
            console.log(res);

            return res;
        }
        getCaptchaReq();
    }, [])

    const handleOk = () => {
        props.handleCancel();
    }

    // 切换登录/注册
    const getRadioValue = (e: CheckboxChangeEvent) => {
        setRadioValue(e.target.value)
    }

    const updateInfo = (info: FieldType, value: string | boolean, key: keyof FieldType, setInfo: any) => {
        const _ = { ...info, [key]: value };
        setInfo(_);
    }

    // 更新验证码
    const captchaClickHandle = () => {

    }

    function loginHandle() { }

    function registerHandle() {

    }



    let container = null;
    if (radioValue === '0') {
        // 登录表单
        container = (
            <div className={style.container}>
                <Form
                    name="basic1"
                    onFinish={loginHandle}
                    // onFinishFailed={onFinishFailed}
                    // autoComplete="off"
                    ref={loginInfoForm}
                >
                    <Form.Item<FieldType>
                        label="登录账号"
                        name="loginId"
                        rules={[{ required: true, message: "请输入账号", }]}
                    >
                        <Input
                            placeholder="请输入你的登录账号"
                            value={loginInfo.loginId}
                            onChange={(e) => updateInfo(loginInfo, e.target.value, 'loginId', setLoginInfo)}
                        />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="登录密码"
                        name="password"
                        rules={[{ required: true, message: "请输入密码", }]}
                    >
                        <Input.Password
                            placeholder="请输入你的登录密码，新用户默认为123456"
                            value={loginInfo.password}
                            onChange={(e) => updateInfo(loginInfo, e.target.value, 'password', setLoginInfo)}
                        />
                    </Form.Item>

                    {/* 验证码 */}
                    <Form.Item<FieldType>
                        label="验证码"
                        name="captcha"
                        rules={[{ required: true, message: "请输入验证码", }]}
                    >
                        <Row align="middle">
                            <Col span={16}>
                                <Input
                                    placeholder="请输入验证码"
                                    value={loginInfo.captcha}
                                    onChange={(e) => updateInfo(loginInfo, e.target.value, 'captcha', setLoginInfo)}
                                />
                            </Col>
                            <Col span={6}>
                                <div
                                    className={style.captchaImg}
                                    onClick={captchaClickHandle}
                                // dangerouslySetInnerHTML={{ __html: captcha }}
                                ></div>
                            </Col>
                        </Row>
                    </Form.Item>

                    <Form.Item<FieldType>
                        name="remember"
                        // valuePropName="checked" 
                        label={null}
                        wrapperCol={{
                            offset: 5,
                            span: 16,
                        }}>
                        <Checkbox
                            onChange={(e) => updateInfo(loginInfo, e.target.checked, 'remember', setLoginInfo)}
                            checked={loginInfo.remember}
                        >记住我</Checkbox>
                    </Form.Item>

                    <Form.Item label={null}
                        wrapperCol={{
                            offset: 5,
                            span: 16,
                        }}
                    >
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ marginRight: 20 }}
                        >
                            登录
                        </Button>
                        <Button type="primary" htmlType="submit">
                            重置
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    } else {
        // 注册表单
        container = (
            <div className={style.container}>
                <Form
                    name="basic2"
                    autoComplete="off"
                    ref={registerFormRef}
                    onFinish={registerHandle}
                >
                    <Form.Item
                        label="登录账号"
                        name="loginId"
                        rules={[
                            {
                                required: true,
                                message: "请输入账号，仅此项为必填项",
                            },
                            // 验证用户是否已经存在
                            // { validator: checkLoginIdIsExist },
                        ]}
                        validateTrigger='onBlur'
                    >
                        <Input
                            placeholder="请输入账号"
                            value={registerInfo.loginId}
                            onChange={(e) => updateInfo(registerInfo, e.target.value, 'loginId', setRegisterInfo)}
                        />
                    </Form.Item>

                    <Form.Item
                        label="用户昵称"
                        name="nickname"
                    >
                        <Input
                            placeholder="请输入昵称，不填写默认为新用户xxx"
                            value={registerInfo.nickname}
                            onChange={(e) => updateInfo(registerInfo, e.target.value, 'nickname', setRegisterInfo)}
                        />
                    </Form.Item>

                    <Form.Item
                        name="registercaptcha"
                        label="验证码"
                        rules={[
                            {
                                required: true,
                                message: '请输入验证码',
                            },
                        ]}
                    >
                        <Row align="middle">
                            <Col span={16}>
                                <Input
                                    placeholder="请输入验证码"
                                    value={registerInfo.captcha}
                                    onChange={(e) => updateInfo(registerInfo, e.target.value, 'captcha', setRegisterInfo)}
                                />
                            </Col>
                            <Col span={6}>
                                <div
                                    className={style.captchaImg}
                                    onClick={captchaClickHandle}
                                // dangerouslySetInnerHTML={{ __html: captcha }}
                                ></div>
                            </Col>
                        </Row>
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 5,
                            span: 16,
                        }}
                    >
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ marginRight: 20 }}
                        >
                            注册
                        </Button>
                        <Button type="primary" htmlType="submit">
                            重置
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }


    return (
        <Modal title="注册/登录" open={props.isShow} onOk={handleOk} onCancel={props.handleCancel}>
            <Radio.Group
                block
                value={radioValue}
                options={options}
                defaultValue='0'
                optionType="button"
                buttonStyle="solid"
                onChange={(e) => getRadioValue(e)}
            />
            {container}
        </Modal>
    )
}