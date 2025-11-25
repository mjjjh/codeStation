import './css/App.css'
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Layout, FloatButton, Modal, message } from 'antd';
import { MessageOutlined } from '@ant-design/icons';

import RouterBefore from './router/RouterBefore';
import { initialUserInfo, changeLoginStatus } from './store/userSlice';
import PageFooter from './components/PageFooter';
import NavHeader from './components/NavHeader';
import LoginForm from './components/LoginForm';
import { useNavigate } from 'react-router-dom';
import AIChat from './components/AIChat/chat';

import { getUserInfoToken, getUserInfo } from './api/user';

const { Header, Footer, Content } = Layout;


function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const [userName, setUserName] = useState('');

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

  // 打开AIChat
  const openAIChat = () => {
    // 用户没有登录，弹出登录框
    if (!localStorage.getItem('userToken')) {
      showModal();
      message.warning('请先登录');
      return;
    }
    setIsAIModalOpen(true);
  };

  // 关闭AIChat
  const closeAIChat = () => {
    setIsAIModalOpen(false);
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
      setUserName(userData.data.nickname);
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
          <RouterBefore />
        </Content>
        <Footer className='footer'>
          <PageFooter />
        </Footer>
      </Layout>
      <LoginForm isShow={isModalOpen} handleCancel={handleCancel} />
      <FloatButton
        shape="circle"
        type="primary"
        style={{ insetInlineEnd: 50 }}
        icon={<MessageOutlined />}
        onClick={openAIChat}
      />
      <Modal
        open={isAIModalOpen}
        onCancel={closeAIChat}
        footer={null}
        className="ai-chat-modal"
        closeIcon={null}
      >
        <AIChat userName={userName} />
      </Modal>
    </div>
  )
}

export default App
