import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
    Modal,
    Radio,
    Form,
    Input,
    Button,
    Row,
    Col,
    Checkbox,
    message,
} from "antd";
import type { FormInstance } from "antd/es/form";
import type { CheckboxGroupProps, CheckboxChangeEvent } from "antd/es/checkbox";
import {
    getCaptcha,
    isUserAlready,
    register,
    login,
    userFormInfoReq,
    getUserInfo,
} from "../api/user";
import { IUserCommonData } from "@/types/api";
import { initialUserInfo, changeLoginStatus } from "../store/userSlice";
import style from "../css/LoginForm.module.css";
// import style from '../css/LoginForm.module.css'
type FieldType = userFormInfoReq;

type LoginFormProp = {
    isShow: boolean;
    handleCancel: () => void;
};

export default function LoginForm(props: LoginFormProp) {
    const dispatch = useDispatch();
    // 登录注册切换
    const [radioValue, setRadioValue] = useState("0");
    // 登录表单的ref
    const loginInfoForm = useRef<FormInstance>(null);
    // 注册表单的ref
    const registerFormRef = useRef<FormInstance>(null);
    const [loginInfo, setLoginInfo] = useState<FieldType>({
        loginId: "",
        loginPwd: "",
        captcha: "",
        remember: true,
    });

    // 注册表单的状态数据
    const [registerInfo, setRegisterInfo] = useState({
        loginId: "",
        nickname: "",
        captcha: "",
    });

    const options: CheckboxGroupProps<string>["options"] = [
        { label: "登录", value: "0" },
        { label: "注册", value: "1" },
    ];

    // 验证码请求
    const [captcha, setCaptcha] = useState("");
    async function getCaptchaReq() {
        const res = await getCaptcha();
        setCaptcha(res);
    }

    useEffect(() => {
        // 每次弹窗变化要重新请求
        getCaptchaReq();
    }, [props.isShow]);

    const handleOk = () => {
        props.handleCancel();
    };

    // 切换登录/注册
    const getRadioValue = (e: CheckboxChangeEvent) => {
        setRadioValue(e.target.value);
        // 每次切换也要重新请求验证码
        getCaptchaReq();
    };

    const updateInfo = (
        info: FieldType,
        value: string | boolean,
        key: keyof FieldType,
        setInfo: any
    ) => {
        const _ = { ...info, [key]: value };
        setInfo(_);
    };

    // 更新验证码
    const captchaClickHandle = () => {
        getCaptchaReq();
    };

    // 清空数据
    const clearData = () => {
        setLoginInfo({
            loginId: "",
            loginPwd: "",
            captcha: "",
            remember: true,
        });
        setRegisterInfo({
            loginId: "",
            nickname: "",
            captcha: "",
        });
        if (loginInfoForm.current) {
            loginInfoForm.current.resetFields(); // 清空登录表单
        }
        if (registerFormRef.current) {
            registerFormRef.current.resetFields(); // 清空注册表单
        }
    };

    // 关闭弹窗
    const closeModal = () => {
        clearData();
        props.handleCancel();
    };

    // 登录
    async function loginHandle() {
        console.log("登录");
        const res = await login(loginInfo);
        // 登录失败，重新刷新验证码
        if (!res.data) {
            message.error(res.msg);
            getCaptchaReq();
            return;
        }
        const resData: IUserCommonData = res.data;

        if (!resData.data) {
            message.error("用户账号或密码错误");
            getCaptchaReq();
            return;
        }
        // 用户被冻结
        if (!resData.data.enabled) {
            message.warning("当前用户被冻结，请联系管理员");
            getCaptchaReq();
            return;
        }
        //用户数据存入仓库,存token
        localStorage.setItem("userToken", resData.token);
        const _id = resData.data._id;
        // 通过id获取用户信息
        const userData = await getUserInfo(_id);
        dispatch(initialUserInfo(userData.data));
        dispatch(changeLoginStatus(true));
        // 关闭弹窗
        closeModal();
    }

    // 注册
    async function registerHandle() {
        console.log("注册");
        const res = await register(registerInfo);
        if (res.msg) {
            // 注册失败，重新刷新验证码
            message.error(res.msg);
            getCaptchaReq();
        } else {
            message.success("注册成功,密码默认为123456");
            //用户数据存入仓库
            dispatch(initialUserInfo(res.data));
            dispatch(changeLoginStatus(true));
            // 关闭弹窗
            closeModal();
        }
    }

    // 验证注册的用户是否存在
    const checkLoginIdIsExist = async () => {
        if (registerInfo.loginId === "") return;
        const res = await isUserAlready(registerInfo.loginId);
        console.log(res);
        if (res.data) {
            return Promise.reject("该用户已经注册");
        }
        return Promise.resolve();
    };

    const onReset = () => {
        clearData();
    };

    let container = null;
    if (radioValue === "0") {
        // 登录表单
        container = (
            <div className={style.container}>
                <Form
                    name="basic1"
                    onFinish={loginHandle}
                    // onFinishFailed={onFinishFailed}
                    // autoComplete="off"
                    ref={loginInfoForm}
                    key="loginForm"
                >
                    <Form.Item<FieldType>
                        label="登录账号"
                        name="loginId"
                        rules={[{ required: true, message: "请输入账号" }]}
                    >
                        <Input
                            placeholder="请输入你的登录账号"
                            value={loginInfo.loginId}
                            onChange={(e) =>
                                updateInfo(loginInfo, e.target.value, "loginId", setLoginInfo)
                            }
                        />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="登录密码"
                        name="loginPwd"
                        rules={[{ required: true, message: "请输入密码" }]}
                    >
                        <Input.Password
                            placeholder="请输入你的登录密码，新用户默认为123456"
                            value={loginInfo.loginPwd}
                            onChange={(e) =>
                                updateInfo(loginInfo, e.target.value, "loginPwd", setLoginInfo)
                            }
                        />
                    </Form.Item>

                    {/* 验证码 */}
                    <Form.Item<FieldType>
                        label="验证码"
                        name="captcha"
                        rules={[{ required: true, message: "请输入验证码" }]}
                    >
                        <Row align="middle">
                            <Col span={16}>
                                <Input
                                    placeholder="请输入验证码"
                                    value={loginInfo.captcha}
                                    onChange={(e) =>
                                        updateInfo(
                                            loginInfo,
                                            e.target.value,
                                            "captcha",
                                            setLoginInfo
                                        )
                                    }
                                />
                            </Col>
                            <Col span={6}>
                                <div
                                    className={style.captchaImg}
                                    onClick={captchaClickHandle}
                                    dangerouslySetInnerHTML={{ __html: captcha }}
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
                        }}
                    >
                        <Checkbox
                            onChange={(e) =>
                                updateInfo(
                                    loginInfo,
                                    e.target.checked,
                                    "remember",
                                    setLoginInfo
                                )
                            }
                            checked={loginInfo.remember}
                        >
                            记住我
                        </Checkbox>
                    </Form.Item>

                    <Form.Item
                        label={null}
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
                        <Button type="primary" htmlType="button" onClick={onReset}>
                            重置
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    } else {
        // 注册表单
        container = (
            <div className={style.container}>
                <Form
                    name="basic2"
                    autoComplete="off"
                    ref={registerFormRef}
                    onFinish={registerHandle}
                    key="registerForm"
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
                            { validator: checkLoginIdIsExist },
                        ]}
                        validateTrigger="onBlur"
                    >
                        <Input
                            placeholder="请输入账号"
                            value={registerInfo.loginId}
                            onChange={(e) =>
                                updateInfo(
                                    registerInfo,
                                    e.target.value,
                                    "loginId",
                                    setRegisterInfo
                                )
                            }
                        />
                    </Form.Item>

                    <Form.Item label="用户昵称" name="nickname">
                        <Input
                            placeholder="请输入昵称，不填写默认为新用户xxx"
                            value={registerInfo.nickname}
                            onChange={(e) =>
                                updateInfo(
                                    registerInfo,
                                    e.target.value,
                                    "nickname",
                                    setRegisterInfo
                                )
                            }
                        />
                    </Form.Item>

                    <Form.Item
                        name="registercaptcha"
                        label="验证码"
                        rules={[
                            {
                                required: true,
                                message: "请输入验证码",
                            },
                        ]}
                    >
                        <Row align="middle">
                            <Col span={16}>
                                <Input
                                    placeholder="请输入验证码"
                                    value={registerInfo.captcha}
                                    onChange={(e) =>
                                        updateInfo(
                                            registerInfo,
                                            e.target.value,
                                            "captcha",
                                            setRegisterInfo
                                        )
                                    }
                                />
                            </Col>
                            <Col span={6}>
                                <div
                                    className={style.captchaImg}
                                    onClick={captchaClickHandle}
                                    dangerouslySetInnerHTML={{ __html: captcha }}
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
                        <Button type="primary" htmlType="button" onClick={onReset}>
                            重置
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }

    return (
        <Modal
            title="注册/登录"
            open={props.isShow}
            onOk={handleOk}
            onCancel={closeModal}
        >
            <Radio.Group
                block
                value={radioValue}
                options={options}
                defaultValue="0"
                optionType="button"
                buttonStyle="solid"
                onChange={(e) => getRadioValue(e)}
            />
            {container}
        </Modal>
    );
}
