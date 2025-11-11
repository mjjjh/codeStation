import routerBeforeConfig from "./routerBeforeConfig";
import RouterConfig from "./index";
import { Alert } from "antd";

const RouterBefore = () => {
    const local = location.pathname;
    const router = routerBeforeConfig.find((item) => item.path === local);
    console.log(router);

    if (router?.isNeedLogin) {
        return (
            <Alert
                description='请先登录'
                type='warning'
                onClose={() => {
                    location.pathname = '/';
                }}
                closable
                style={{ margin: '20px' }}
                showIcon
            />
        )
    }
    return (
        <RouterConfig></RouterConfig>
    )
}

export default RouterBefore