import { useState } from "react";
import { NavLink } from "react-router-dom"

import { Button, Input, Select, Space } from 'antd';

import LoginNav from "./LoginNav";

export default function NavHeader(props) {
    const options = [
        { value: 'answer', label: '问答' },
        { value: 'book', label: '书籍' },
        // { value: 'interview', label: '面试题' },
    ]

    const [searchText, setSearchText] = useState('')
    
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
                <Space.Compact >
                    <Select defaultValue="answer" size="large"  options={options} />
                    <Input.Search placeholder="请输入要搜索的内容"  size="large" allowClear onSearch={(value) => setSearchText(value)} enterButton="搜索" />
                </Space.Compact>
            </div>
            <div className="loginBtnContainer">
                <LoginNav openModal={props.openModal}/>
            </div>
        </div>
    )
}