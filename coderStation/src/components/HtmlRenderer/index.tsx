// components/HtmlRenderer.tsx
import React, { useState } from 'react';
import { Image, Typography } from 'antd';
import parse from 'html-react-parser';
import { HTMLReactParserOptions } from 'html-react-parser';

const { Paragraph } = Typography;

interface HtmlRendererProps {
    html: string; // 传入原始HTML字符串
    containerStyle?: React.CSSProperties; // 容器样式（可选）
    imageStyle?: React.CSSProperties; // 图片样式（可选）
    expandable?: boolean; // 是否可展开
    expandRows?: number; // 展开时的行数
}

/**
 * HTML渲染组件：使用Hook解析HTML，并用Antd组件展示
 */
const HtmlRenderer: React.FC<HtmlRendererProps> = ({
    html,
    containerStyle = { width: '100%', height: '100%' },
    imageStyle = { width: '100%', height: 'auto' },
    expandable = false,
    expandRows = 4
}: HtmlRendererProps) => {
    // 调用Hook解析HTML
    // const parsedContent = useParseHTML(html);
    const [expanded, setExpanded] = useState(false);
    if (!html) return null
    const options: HTMLReactParserOptions = {
        replace: (domNode: any) => {
            if (domNode?.name === 'img') {
                return React.createElement(Image, { ...domNode.attribs, style: imageStyle });
            }
            return domNode;
        }
    }
    const contentBody = parse(html, options);

    return (
        <div style={containerStyle}>
            {expandable && <Paragraph ellipsis={{
                rows: expandRows,
                expandable: 'collapsible',
                expanded,
                onExpand: (_, info) => setExpanded(info.expanded),
            }}
                copyable>
                {contentBody}
            </Paragraph>}
            {!expandable && contentBody}
        </div>
    );
}

export default HtmlRenderer;