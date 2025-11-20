import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Popover, List, Image } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import style from '../css/LoginNav.module.css'

import { clearUserInfo } from "../store/userSlice";
import { useDispatch } from "react-redux";

import useScreenSize from "../hooks/useScreenSize";

export default function LoginNav(props: { openModal: () => void }) {
    const { isLogin, userInfo } = useSelector((state: any) => state.user)

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isMobile = useScreenSize();

    let loginStatus = null;

    const loginNavListClick = (item: string) => {
        if (item === "退出登录") {
            // 清除token
            localStorage.removeItem("userToken")
            // 请仓库
            dispatch(clearUserInfo());
            navigate("/");
        }
        if (item === "个人中心") {
            navigate("/personal");
        }
    }

    if (isLogin) {
        const content = (
            <List
                size="large"
                dataSource={["个人中心", "退出登录"]}
                renderItem={(item) => <List.Item className={style.dropdownContainer} onClick={() => loginNavListClick(item)}>{item}</List.Item>}
            />
        )
        loginStatus = (
            <Popover content={content} placement="bottom" trigger="hover" style={{ padding: 0 }}>
                <Avatar src={<Image
                    preview={false}
                    src={userInfo.avatar}
                />} className={style.avatarContainer} icon={<UserOutlined />}></Avatar>
            </Popover>
        )
    } else {
        loginStatus = (
            <Button type="primary" size="large" onClick={props.openModal}>{isMobile ? <UserOutlined /> : "登录/注册"}</Button>
        )
    }

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            {loginStatus}
        </div>
    )
}