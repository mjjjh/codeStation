import React, { use } from 'react';


function PageFooter(props) {
    return (
        <div>
            <p className="links">
                <span className="linkItem">友情链接：</span>
                <a
                    href="https://github.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="linkItem"
                >
                    github
                </a>
                <a
                    href="https://kimi.moonshot.cn/"
                    target="_blank"
                    rel="noreferrer"
                    className="linkItem"
                >
                    Kimi-AI
                </a>
                <a
                    href="https://cn.redux.js.org/tutorials/quick-start"
                    target="_blank"
                    rel="noreferrer"
                    className="linkItem"
                >
                    Redux
                </a>
                <a
                    href="https://zh-hans.react.dev/reference/react"
                    target="_blank"
                    rel="noreferrer"
                    className="linkItem"
                >
                    React
                </a>
            </p>
            <p>© 2025 - Coder Station</p>
            <p>Powered by Create React App</p>
        </div>
    );
}

export default PageFooter;
