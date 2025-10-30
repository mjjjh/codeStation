// components/HtmlRenderer.tsx
import React, { useState } from 'react';
import { Image, Typography } from 'antd';
import useParseHTML from '@/hooks/useParseHTML';

const { Paragraph } = Typography;

interface HtmlRendererProps {
    html: string; // 传入原始HTML字符串
    containerStyle?: React.CSSProperties; // 容器样式（可选）
    textStyle?: React.CSSProperties; // 文本样式（可选）
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
    textStyle = { width: '100%', height: '100%' },
    imageStyle = { width: '100%', height: 'auto' },
    expandable = false,
    expandRows = 4
}: HtmlRendererProps) => {
    // 调用Hook解析HTML
    const parsedContent = useParseHTML(html);
    const [expanded, setExpanded] = useState(false);

    const contentBody = (parsedContent.map((item, index) => (
        <div key={index} style={{ marginBottom: '16px' }}>
            {item.type === 'text' && (
                // 文本内容：用Antd Paragraph渲染
                <Paragraph key={index} style={textStyle}>{item.value}</Paragraph>
            )}
            {item.type === 'image' && (
                // 图片内容：用Antd Image渲染（带放大预览）
                <Image
                    key={index}
                    style={imageStyle}
                    src={item.value as string}
                    alt={item?.alt}
                    preview={{
                        toolbarRender: () => <div style={{ color: 'white' }}>点击空白处关闭</div>, // 自定义预览工具栏
                    }}
                />
            )}
            {item.type === 'code' && (
                <div key={index} data-language={item.language}><pre><code>{item.value}
                </code></pre></div>
            )}
            {
                item.type === 'origin' && (
                    <React.Fragment key={index}>
                        {item.tag}
                    </React.Fragment>
                )
            }
        </div>
    )))

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