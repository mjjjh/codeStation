import { useEffect, useState } from "react";

interface Part {
    type: 'text' | 'image' | 'code';
    value: string;
    alt?: string;
    language?: string;
}

// 解析html的hook
const useParseHTML = (html: string) => {
    const [content, setContent] = useState<Part[]>([]);

    useEffect(() => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const parts: Array<Part> = [];

        // 遍历 HTML 中的所有子节点（处理文本和图片）
        const traverseNodes = (node: Node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                // 文本节点：过滤空文本（如换行、空格）
                const text = node.textContent?.trim() || '';
                if (text) {
                    parts.push({ type: 'text', value: text });
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const tagName = (node as Element).tagName.toLowerCase();

                if (tagName === 'img') {
                    const element = node as HTMLImageElement;
                    // 处理图片节点
                    const src = element.src || element.getAttribute('src') || '';
                    const alt = element.alt || `图片-${parts.length}`;
                    if (src) {
                        parts.push({ type: 'image', value: src, alt });
                    }
                } else if (tagName === 'pre') {
                    const element = node as HTMLPreElement;
                    // 处理代码块（<pre>标签）
                    // 提取代码内容（<code>子节点的文本）
                    const codeElement = element.querySelector('code');
                    const codeContent = codeElement?.textContent || '';
                    // 提取语言类型（从data-language属性或class中获取）
                    const language =
                        codeElement?.getAttribute('data-language') ||
                        (codeElement?.className.match(/language-(\w+)/)?.[1] || 'text');
                    if (codeContent) {
                        parts.push({ type: 'code', value: codeContent, language });
                    }
                } else {
                    // 其他元素（如 <p>）：递归处理子节点
                    Array.from(node.childNodes).forEach(traverseNodes);
                }
            }
        };
        // 开始解析 HTML 文档的 body 内容
        Array.from(doc.body.childNodes).forEach(traverseNodes);

        setContent(parts);
    }, [html]);

    return content;
};

export default useParseHTML;