import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import '@ant-design/v5-patch-for-react-19';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { Provider } from 'react-redux';
import store from './store/index.ts';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <Provider store={store}>
    <BrowserRouter>
      <ConfigProvider locale={zhCN}>
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </Provider>
  // </StrictMode>,
)
