import { useSelector } from "react-redux"
import { Avatar, Button, Popover, List } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import style from '../css/LoginNav.module.css'


export default function LoginNav(props) {
    const { isLogin, userInfo } = useSelector((state: any) => state.user)
    let loginStatus = null;
    if (isLogin) {
        const content = (
            <List
                size="large"
                dataSource={["个人中心", "退出登录"]}
                renderItem={(item) => <List.Item>{item}</List.Item>}
            />
        )
        loginStatus = (
            <Popover content={content} placement="bottom" trigger="hover">
                <Avatar className={style.avatarContainer} icon={<UserOutlined />}></Avatar>
            </Popover>
        )
    } else {
        loginStatus = (
            <Button type="primary" size="large" onClick={props.openModal}>登录/注册</Button>
        )
    }

    return (
        <div>
            {loginStatus}
        </div>
    )
}