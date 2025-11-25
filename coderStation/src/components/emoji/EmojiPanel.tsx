import React, { useState, useRef, useEffect } from 'react';
import style from './style.module.css';

import { EmojiMap, tabName } from "@/components/emoji/EmojiMap";

import { Popover, Tabs } from 'antd'
import type { Emoji } from '@/components/emoji/EmojiMap';

interface EmojiPanelProps {
  onEmojiSelect?: (emoji: Emoji, category: string, isClick: boolean) => void;
}

const EmojiPanel: React.FC<EmojiPanelProps> = ({ onEmojiSelect }) => {
  // 默认 右侧最大元素
  const [position, setPosition] = useState({ x: window.innerWidth - 100 - 20, y: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [popover, setPopover] = useState<boolean>(false);

  const emojis = Object.keys(EmojiMap).map((key) => ({
    category: key,
    key,
    title: tabName[key as keyof typeof tabName],
    emojis: EmojiMap[key as keyof typeof EmojiMap]
  }))

  // 点击表情
  const handleEmojiClick = (category: string, emoji: Emoji, isClick: boolean) => {
    if (onEmojiSelect) {
      onEmojiSelect(emoji, category, isClick);
    }
    setPopover(false);
  };

  // 开始拖拽
  const handleStartDrag = (clientX: number, clientY: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setOffset({
        x: clientX - rect.left,
        y: clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  // 鼠标按下事件
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStartDrag(e.clientX, e.clientY);
  };

  // 触摸开始事件
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleStartDrag(touch.clientX, touch.clientY);
  };

  // 拖拽过程
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y
      });
    }
  };

  // 触摸移动事件
  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging) {
      e.preventDefault(); // 阻止浏览器默认的滚动行为
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - offset.x,
        y: touch.clientY - offset.y
      });
    }
  };

  // 结束拖拽
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 触摸结束事件
  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // 添加全局事件监听
  useEffect(() => {
    if (isDragging) {
      // 鼠标事件
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      // 触摸事件
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, offset]);

  return (
    <div
      className={style["emoji-wrapper"]}
      ref={containerRef}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: 1000
      }}
    >
      <div
        className={style["emoji-container"]}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <Popover trigger="click" open={popover} onOpenChange={(newOpen: boolean) => {
          setPopover(newOpen);
        }} content={
          (<Tabs items={
            emojis.map((item, index) => {
              return {
                key: index.toString(),
                label: item.title,
                children: <div className={style["emoji-panel"]}>
                  {item.emojis.map((emoji) => (
                    <div className={style["emoji-item"]} key={emoji.id} onClick={() => handleEmojiClick(item.category, emoji, true)}>{emoji.emoji}</div>
                  ))}
                </div>
              }
            })
          }>
          </Tabs>)
        }>
          😊 表情
        </Popover>

      </div>
    </div >
  );
};

export default EmojiPanel;