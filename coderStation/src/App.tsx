import './css/App.css'
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Layout } from 'antd';
import RouterConfig from './router';
import { initialUserInfo, changeLoginStatus } from './store/userSlice';
import PageFooter from './components/PageFooter';
import NavHeader from './components/NavHeader';
import LoginForm from './components/LoginForm';
import { useNavigate } from 'react-router-dom';

import { getUserInfoToken, getUserInfo } from './api/user';

const { Header, Footer, Content } = Layout;


function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  // 打开弹框
  const showModal = () => {
    setIsModalOpen(true);
  };

  // 关闭弹框
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // 判断是否登录
  useEffect(() => {
    async function isLogin() {
      const token = localStorage.getItem('userToken');
      if (!token) return;
      const res = await getUserInfoToken();
      if (!res.data) {
        // token过期
        localStorage.removeItem('userToken');
        navigate('/');
        return;
      }
      // 通过id获取用户信息
      const _id = res.data?._id;
      //用户数据存入仓库
      const userData = await getUserInfo(_id);
      dispatch(initialUserInfo(userData.data));
      dispatch(changeLoginStatus(true));
    }
    isLogin();
  }, [])

  return (
    <div className='App'>
      <Layout className='layout'>
        <Header className='header'>
          <NavHeader openModal={showModal} />
        </Header>
        <Content className='content'>
          <RouterConfig />
        </Content>
        <Footer className='footer'>
          <PageFooter />
        </Footer>
      </Layout>
      <LoginForm isShow={isModalOpen} handleCancel={handleCancel} />
    </div>
  )
}

export default App
