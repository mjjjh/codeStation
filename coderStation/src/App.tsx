import './css/App.css'
import { useState } from 'react';
import { Layout} from 'antd';
import RouterConfig from './router';

import PageFooter from './components/PageFooter';
import NavHeader from './components/NavHeader';
import LoginForm from './components/LoginForm';
const { Header, Footer, Content } = Layout;


function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 打开弹框
  const showModal = () => {
    setIsModalOpen(true);
  };

  // 关闭弹框
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div className='App'>
      <Layout>
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
