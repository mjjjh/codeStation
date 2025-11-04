import { useState } from "react";
import { NavLink } from "react-router-dom"

import { Input, Select, Space } from 'antd';

import { useNavigate } from "react-router-dom";

import LoginNav from "./LoginNav";

export default function NavHeader(props: { openModal: () => void }) {
    const options = [
        { value: 'answer', label: '问答' },
        { value: 'book', label: '书籍' },
        // { value: 'interview', label: '面试题' },
    ];
    const navigate = useNavigate();
    const [searchCategory, setSearchCategory] = useState('answer');

    const onChange = (value: string) => {
        setSearchCategory(value);
    }

    const onSearch = (value: string) => {
        if (!value) {
            navigate(`/`);
            return;
        }
        navigate(`/search`, {
            state: {
                searchCategory,
                searchValue: value
            }
        });
    }

    return (
        <div className="headerContainer">
            <div className="logoContainer">
                <div className="logo"></div>
            </div>
            <nav className="navContainer">
                <NavLink className='navgation' to="/issues">问答</NavLink>
                <NavLink className='navgation' to='/books'>书籍</NavLink>
                <NavLink className='navgation' to='/interviews'>面试题</NavLink>
                <a href="https://duyi.ke.qq.com/" className="navgation" target="_blank">视频教程</a>
            </nav>
            <div className="searchContainer">
                <Space.Compact style={{ width: '100%' }}>
                    <Select defaultValue="answer" size="large" options={options} onChange={onChange} />
                    <Input.Search placeholder="请输入要搜索的内容" size="large" allowClear enterButton="搜索" onSearch={onSearch} />
                </Space.Compact>
            </div>
            <div className="loginBtnContainer">
                <LoginNav openModal={props.openModal} />
            </div>
        </div>
    )
}