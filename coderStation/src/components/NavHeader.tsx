import { useState } from "react";
import { NavLink } from "react-router-dom";

import { Input, Select, Space, Dropdown } from "antd";
import type { MenuProps } from "antd";
import {
  DownOutlined,
  ProfileOutlined,
  ReadOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";

import LoginNav from "./LoginNav";
import useScreenSize from "../hooks/useScreenSize";

export default function NavHeader(props: { openModal: () => void }) {
  const navigate = useNavigate();
  const [searchCategory, setSearchCategory] = useState("answer");
  // 使用自定义hook检测屏幕尺寸
  const isMobile = useScreenSize();

  const options = [
    {
      value: "answer",
      label: isMobile ? (
        <ProfileOutlined style={{ fontSize: "12px" }} />
      ) : (
        "问答"
      ),
    },
    {
      value: "book",
      label: isMobile ? <ReadOutlined style={{ fontSize: "12px" }} /> : "书籍",
    },
    // { value: 'interview', label: '面试题' },
  ];

  // 定义下拉菜单选项
  const menuItems: MenuProps["items"] = [
    {
      key: "1",
      label: <NavLink to="/issues">问答</NavLink>,
    },
    {
      key: "2",
      label: <NavLink to="/books">书籍</NavLink>,
    },
    {
      key: "3",
      label: <NavLink to="/interviews">面试题</NavLink>,
    },
    {
      key: "4",
      label: <NavLink to="/games">游戏</NavLink>,
    },
  ];

  const onChange = (value: string) => {
    setSearchCategory(value);
  };

  const onSearch = (value: string) => {
    if (!value) {
      navigate(`/`);
      return;
    }
    navigate(`/search`, {
      state: {
        searchCategory,
        searchValue: value,
      },
    });
  };

  const goHome = () => {
    navigate(`/`);
  };

  return (
    <div className="headerContainer">
      <div className="logoContainer" onClick={goHome}>
        <div className="logo"></div>
      </div>
      {/* 响应式导航 - 大屏显示普通导航，小屏显示下拉菜单 */}
      {isMobile ? (
        <div className="mobileNavContainer">
          <Dropdown menu={{ items: menuItems }}>
            <MenuUnfoldOutlined className="mobileNavButton" />
          </Dropdown>
        </div>
      ) : (
        <nav className="navContainer">
          <NavLink className="navgation" to="/issues">
            问答
          </NavLink>
          <NavLink className="navgation" to="/books">
            书籍
          </NavLink>
          <NavLink className="navgation" to="/interviews">
            面试题
          </NavLink>
          <NavLink className="navgation" to="/games">
            游戏
          </NavLink>
        </nav>
      )}
      <div className="searchContainer">
        <Space.Compact style={{ width: "100%" }}>
          <Select
            defaultValue="answer"
            size="large"
            suffixIcon={isMobile ? <span></span> : <DownOutlined />}
            options={options}
            onChange={onChange}
          />
          <Input.Search
            placeholder="请输入要搜索的内容"
            size="large"
            allowClear
            enterButton={isMobile ? <SearchOutlined /> : "搜索"}
            onSearch={onSearch}
          />
        </Space.Compact>
      </div>
      <div className="loginBtnContainer">
        <LoginNav openModal={props.openModal} />
      </div>
    </div>
  );
}
