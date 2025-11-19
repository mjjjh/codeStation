import React, { ReactElement, useState } from "react";
import { Card, Descriptions, Image, Upload, message, Modal, Typography } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import PageHeader from "@/components/PageHeader";
import { IUserInfo } from "@/types/api";
import { updateUserInfoAsync } from "@/store/userSlice";
import BaseInfo from "./components/BaseInfo";
import SocialInfo from "./components/SocialInfo";
import IntroInfo from "./components/IntroInfo";
import { formatTime } from "@/utils/tools";
import style from "./style.module.css"

type toStringType<T> = {
    [K in keyof T]?: string;
} & {
    [key: string]: string;
};

const Personal: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>()
    const { userInfo } = useSelector((state: RootState) => state.user)

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalTitle, setModalTitle] = useState<string>("")
    const [modalContent, setModalContent] = useState<ReactElement>()


    const updateAvatorHandle = async (url?: string) => {
        dispatch(updateUserInfoAsync({ userid: userInfo._id, newInfo: { avatar: url } }))
    }

    // 用户信息
    const userInfoTitle: toStringType<IUserInfo> = {
        loginId: "登录账号",
        loginPwd: "登录密码",
        nickname: "用户昵称",
        points: "用户积分",
        lastLoginDate: "最后登录时间",
        registerDate: "注册时间",
        avatar: "当前头像",
    }
    const userRender = (Object.keys(userInfoTitle) as Array<keyof IUserInfo>).map((item, index) => {
        if (item === "avatar") {
            return {
                key: index,
                label: userInfoTitle[item],
                children: (<div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <Image width={100} height={100} src={userInfo[item]} key={index}></Image>
                    <Upload
                        listType="picture-card"
                        maxCount={1}
                        action='api/api/upload'
                        onChange={(info) => {
                            if (info.file.status === 'done') {
                                if (info.file.response.code === 0) {
                                    message.success(`头像修改成功`);
                                    updateAvatorHandle(info.file.response.data)
                                }
                            } else if (info.file.status === 'error') {
                                message.error(`头像修改失败`);
                            }
                        }}
                    ><PlusOutlined /></Upload>
                </div>)
            }
        }
        return {
            key: index,
            label: userInfoTitle[item],
            children: (item === 'registerDate' || item === 'lastLoginDate') ? formatTime(userInfo[item] || '0') : (item === 'loginPwd' && "*** *** ***" || userInfo[item] || "--"),
        }
    })

    // 社交账号
    const socialTitle: toStringType<IUserInfo> = {
        mail: "邮箱",
        qq: "QQ",
        wechat: "微信",
        github: "GitHub",
    }
    const socialRender = (Object.keys(socialTitle) as Array<keyof IUserInfo>).map((item, index) => {
        return {
            key: index,
            label: socialTitle[item],
            children: userInfo[item] || "--",
        }
    })

    // 个人简介
    const intro = userInfo.intro || "这个人很懒,什么都没有留下~~"
    const introRender = <Typography.Paragraph>{intro}</Typography.Paragraph>

    // 弹窗完成修改
    const closeModal = (refresh?: boolean, data?: any) => {
        setIsModalOpen(false)
        if (refresh) {
            message.success('信息修改成功');
            dispatch(updateUserInfoAsync({ userid: userInfo._id, newInfo: data }))
        }
    }

    const handleEdit = (type: string) => {
        setIsModalOpen(true)
        switch (type) {
            case 'base':
                setModalTitle('基本信息')
                setModalContent(<BaseInfo nickname={userInfo.nickname} userid={userInfo._id} closeModal={closeModal}></BaseInfo>)
                break;
            case 'social':
                setModalTitle('社交账号')
                setModalContent(<SocialInfo socialInfo={{ mail: userInfo.mail, qq: userInfo.qq, wechat: userInfo.wechat, github: userInfo.github }} closeModal={closeModal}></SocialInfo>)
                break;
            case 'intro':
                setModalTitle('个人简介')
                setModalContent(<IntroInfo introInfo={{ intro }} closeModal={closeModal}></IntroInfo>)
                break;
            default:
                break;
        }
    }




    return (
        <div>
            <PageHeader title="个人中心" showTag={false}></PageHeader>
            <div className={style.container}>
                <Card title="基本信息" extra={<div className={style.edit} onClick={() => handleEdit('base')}>编辑</div>}>
                    <Descriptions
                        items={userRender}
                    />
                </Card>
                <Card title="社交账号" extra={<div className={style.edit} onClick={() => handleEdit('social')}>编辑</div>}>
                    <Descriptions
                        items={socialRender}
                    />
                </Card>
                <Card title="个人简介" extra={<div className={style.edit} onClick={() => handleEdit('intro')}>编辑</div>}>
                    {introRender}
                </Card>
            </div>
            <Modal
                title={modalTitle}
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpen}
                footer={null}
                onCancel={() => closeModal()}
            >
                {modalContent}
            </Modal>
        </div>
    );
};

export default Personal;