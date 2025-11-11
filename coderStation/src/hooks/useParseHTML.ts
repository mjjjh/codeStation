// import React, { useEffect, useState } from "react";
// import { Image } from "antd";
// interface Part {
//     type: 'text' | 'image' | 'code' | 'origin';
//     value: string | React.ReactNode;
//     alt?: string;
//     tag?: React.ReactNode;
//     language?: string;
//     tagName?: string;
// }

// // 原始类型标签
// // 允许保留的原生标签（保持不变）
// const originTag = {
//     p: true,
//     div: true,
//     span: true,
//     h1: true,
//     h2: true,
//     h3: true,
//     h4: true,
//     h5: true,
//     h6: true,
//     ul: true,
//     li: true,
//     ol: true,
//     strong: true,
//     em: true,
//     a: true,
//     pre: true,
//     code: true,
//     br: true,
//     img: true,
// } as const;

// // 定义：块级元素列表（需要避免嵌套在 <p> 内的标签）
// const blockTags = new Set([
//     'div', 'pre', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
//     'table', 'form', 'header', 'footer', 'section', 'article'
// ]);


// // 解析html的hook
// const useParseHTML = (html: string) => {
//     const [content, setContent] = useState<any>([]);
//     /**
//  * 辅助函数：判断元素是否为块级元素
//  */
//     const isBlockElement = (tagName: string): boolean => {
//         return blockTags.has(tagName);
//     };
//     useEffect(() => {
//         if (!html) return
//         const parser = new DOMParser();

//         const doc = parser.parseFromString(html, "text/html");
//         const parts: Array<Part> = [];

//         // 根节点遍历：初始 index 为 'root'（避免与子节点 key 冲突）
//         const rootChildren = Array.from(doc.body.childNodes)
//             .map((child, idx) => traverseNodes(child, `root-${idx}`))
//             .filter((child): child is React.ReactElement | string => child !== null);

//         // 根元素（用 Fragment 避免额外 DOM，添加 key）
//         const reactElement = rootChildren.length > 0
//             ? React.createElement(React.Fragment, { key: 'root-element' }, rootChildren)
//             : null;

//         setContent(reactElement);

//         /**
//          * 递归遍历节点（新增 parentTag 参数，判断父标签是否为 <p>）
//          * @param node 当前节点
//          * @param index 用于生成 key
//          * @param parentTag 父标签名（用于检测 <p> 嵌套块级元素）
//          * @returns React 元素或元素数组（修正嵌套后可能返回多个元素）
//          */
//         function traverseNodes(
//             node: Node,
//             index: string = '0',
//             parentTag: string | null = null // 新增：记录父标签
//         ): React.ReactElement | string | null | (React.ReactElement | string | null)[] {
//             // 1. 文本节点：过滤空文本（保持不变）
//             if (node.nodeType === Node.TEXT_NODE) {
//                 const text = node.textContent?.trim() || '';
//                 if (text) {
//                     parts.push({ type: 'text', value: text });
//                     return text;
//                 }
//                 return null;
//             }

//             // 2. 元素节点：处理标签（核心修改：检测 <p> 嵌套块级元素）
//             if (node.nodeType === Node.ELEMENT_NODE) {
//                 const element = node as Element;
//                 const tagName = element.tagName.toLowerCase() as keyof typeof originTag;
//                 const currentKey = `${tagName}-${index}`;

//                 // 递归处理子节点：传递父标签（当前 tagName）
//                 let children = Array.from(node.childNodes)
//                     .map((child, idx) => traverseNodes(child, `${index}-${idx}`, tagName))
//                     .filter((child): child is React.ReactElement | string | null | (React.ReactElement | string)[] =>
//                         child !== null && child !== undefined
//                     );

//                 // 关键修正：如果父标签是 <p>，且当前元素是块级元素 → 不能嵌套，返回兄弟元素数组
//                 if (parentTag === 'p' && isBlockElement(tagName)) {
//                     // 返回 [null, 当前块级元素, null] → 父级 <p> 会拆分
//                     // null 用于触发父级 <p> 的闭合和重新创建
//                     return [null, traverseNodes(node, index, null), null];
//                 }

//                 // 扁平化子元素数组（处理子节点返回的数组，避免嵌套数组）
//                 children = children.flatMap(child => Array.isArray(child) ? child : [child]);

//                 // 3. 图片标签 <img>（保持不变，添加 key）
//                 if (tagName === 'img') {
//                     const imgElement = element as HTMLImageElement;
//                     const src = imgElement.src || imgElement.getAttribute('src') || '';
//                     const alt = imgElement.alt || `图片-${parts.length}`;
//                     const width = imgElement.width || '100%';
//                     const height = imgElement.height || 'auto';

//                     if (src) {
//                         parts.push({ type: 'image', value: src, alt });
//                         return React.createElement(Image, {
//                             key: currentKey,
//                             src,
//                             alt,
//                             style: { width, height, objectFit: 'contain', cursor: 'pointer' },

//                             loading: 'lazy',
//                         });
//                     }
//                     return null;
//                 }

//                 // 4. 代码块 <pre><code>（保持不变，添加 key）
//                 if (tagName === 'pre') {
//                     const codeElement = element.querySelector('code');
//                     const codeContent = codeElement?.textContent?.trim() || '';
//                     const language =
//                         codeElement?.getAttribute('data-language') ||
//                         (codeElement?.className.match(/language-(\w+)/)?.[1] || 'text');

//                     if (codeContent) {
//                         parts.push({ type: 'code', value: codeContent, language });
//                         return React.createElement(
//                             'pre',
//                             {
//                                 key: currentKey,
//                                 style: { backgroundColor: '#292929ff', padding: '16px', borderRadius: '8px' },
//                             },
//                             React.createElement(
//                                 'code',
//                                 {
//                                     key: `${currentKey}-code`,
//                                     style: { fontFamily: 'monospace', fontSize: '14px' },
//                                 },
//                                 codeContent
//                             )
//                         );
//                     }
//                     return null;
//                 }

//                 // 5. 换行标签 <br>（保持不变，添加 key）
//                 if (tagName === 'br') {
//                     return React.createElement('br', { key: currentKey });
//                 }

//                 // 6. 允许保留的原生标签（核心修改：处理 <p> 的子元素拆分）
//                 if (originTag[tagName]) {
//                     // 如果当前是 <p> 标签，处理子元素中的块级元素拆分
//                     if (tagName === 'p') {
//                         let pChildren: (React.ReactElement | string)[] = [];
//                         const siblings: (React.ReactElement | string | null)[] = [];

//                         // 遍历子元素，遇到 null 则拆分 <p>
//                         children.forEach(child => {
//                             if (child === null) {
//                                 // 有 null → 拆分：先创建当前 <p>（如果有内容）
//                                 if (pChildren.length > 0) {
//                                     siblings.push(
//                                         React.createElement('p', { key: `${currentKey}-split-${siblings.length}` }, pChildren)
//                                     );
//                                     pChildren = []; // 重置子元素
//                                 }
//                             } else if (Array.isArray(child)) {
//                                 // 子元素是数组 → 递归处理
//                                 child.forEach(subChild => subChild !== null && siblings.push(subChild));
//                             } else {
//                                 // 正常子元素 → 加入当前 <p>
//                                 pChildren.push(child);
//                             }
//                         });

//                         // 处理剩余的子元素（创建最后一个 <p>）
//                         if (pChildren.length > 0) {
//                             siblings.push(React.createElement('p', { key: `${currentKey}-final` }, pChildren));
//                         }

//                         // 收集 <p> 相关信息到 parts（如果有内容）
//                         if (siblings.length > 0) {
//                             parts.push({
//                                 type: 'origin',
//                                 tagName: 'p',
//                                 tag: React.createElement('p', { key: currentKey }, children),
//                                 value: element.textContent?.trim() || '',
//                             });
//                         }

//                         // 返回拆分后的兄弟元素数组（<p> + 块级元素 + <p>）
//                         return siblings;
//                     }

//                     // 其他原生标签（非 <p>）：正常创建元素
//                     parts.push({
//                         type: 'origin',
//                         tagName: tagName,
//                         tag: React.createElement(tagName, { key: currentKey }, children),
//                         value: element.textContent?.trim() || '',
//                     });

//                     return React.createElement(tagName, { key: currentKey }, children);
//                 }

//                 // 7. 其他未明确允许的标签：用 Fragment 包裹
//                 return React.createElement(React.Fragment, { key: currentKey }, children);
//             }

//             // 3. 注释节点/其他节点：忽略
//             return null;
//         }

//         // // 遍历 HTML 中的所有子节点（处理文本和图片）
//         // const traverseNodes = (node: Node) => {
//         //     if (node.nodeType === Node.TEXT_NODE) {
//         //         // 文本节点：过滤空文本（如换行、空格）
//         //         const text = node.textContent?.trim() || '';
//         //         if (text) {
//         //             parts.push({ type: 'text', value: text });
//         //         }
//         //     } else if (node.nodeType === Node.ELEMENT_NODE) {
//         //         const tagName = (node as Element).tagName.toLowerCase();

//         //         if (tagName === 'img') {
//         //             const element = node as HTMLImageElement;
//         //             // 处理图片节点
//         //             const src = element.src || element.getAttribute('src') || '';
//         //             const alt = element.alt || `图片-${parts.length}`;
//         //             if (src) {
//         //                 parts.push({ type: 'image', value: src, alt });
//         //             }
//         //         } else if (tagName === 'pre') {
//         //             const element = node as HTMLPreElement;
//         //             // 处理代码块（<pre>标签）
//         //             // 提取代码内容（<code>子节点的文本）
//         //             const codeElement = element.querySelector('code');
//         //             const codeContent = codeElement?.textContent || '';
//         //             // 提取语言类型（从data-language属性或class中获取）
//         //             const language =
//         //                 codeElement?.getAttribute('data-language') ||
//         //                 (codeElement?.className.match(/language-(\w+)/)?.[1] || 'text');
//         //             if (codeContent) {
//         //                 parts.push({ type: 'code', value: codeContent, language });
//         //             }
//         //         } else if (originTag[tagName as keyof typeof originTag]) {
//         //             parts.push({ type: 'origin', tag: React.createElement(tagName, null, node.textContent || ''), value: node.textContent || '' });
//         //         } else {
//         //             // 其他元素（如 <p>）：递归处理子节点
//         //             Array.from(node.childNodes).forEach(traverseNodes);
//         //         }
//         //     }
//         // };
//         // // 开始解析 HTML 文档的 body 内容
//         // Array.from(doc.body.childNodes).forEach(traverseNodes);


//         // setContent(parts);
//     }, [html]);
//     // 开始遍历 HTML 文档的 body 子节点（避免解析出的 html/head 标签干扰）

//     return content;
// };

// export default useParseHTML;