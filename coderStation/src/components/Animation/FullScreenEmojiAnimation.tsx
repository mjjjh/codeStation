import React, { useEffect, useRef } from "react";
import type { Emoji } from "@/components/emoji/EmojiMap";

interface FullScreenEmojiAnimationProps {
  emoji: Emoji | null;
  onAnimationEnd: () => void;
}

const FullScreenEmojiAnimation: React.FC<FullScreenEmojiAnimationProps> = ({ emoji, onAnimationEnd }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const particlesRef = useRef<Array<{ x: number; y: number; size: number; speedX: number; speedY: number; opacity: number }>>([]);
  const startTimeRef = useRef<number>(0);
  const animationDuration = 2000; // 动画持续时间（毫秒）

  useEffect(() => {
    if (!emoji || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置canvas尺寸
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 初始化粒子
    const initParticles = () => {
      const particles: typeof particlesRef.current = [];
      const particleCount = 5; // 粒子数量
      
      for (let i = 0; i < particleCount; i++) {
        // 在屏幕中心位置生成粒子
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // 随机角度和距离
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 50;
        
        particles.push({
          x: centerX + Math.cos(angle) * distance,
          y: centerY + Math.sin(angle) * distance,
          size: Math.random() * 30 + 20, // 随机大小
          speedX: (Math.random() - 0.5) * 5,
          speedY: (Math.random() - 0.5) * 5 - 2, // 向上飘动
          opacity: 1
        });
      }
      
      particlesRef.current = particles;
      startTimeRef.current = Date.now();
    };

    // 绘制动画
    const draw = () => {
      if (!ctx) return;
      
      // 清除画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 计算经过的时间
      const elapsed = Date.now() - startTimeRef.current!;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      // 绘制粒子
      particlesRef.current.forEach((particle) => {
        // 更新位置
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // 应用重力效果
        particle.speedY += 0.05;
        
        // 根据进度更新透明度和大小
        particle.opacity = 1 - progress;
        const currentSize = particle.size * (1 - progress * 0.5);
        
        // 绘制表情
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.font = `${currentSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(emoji.emoji, particle.x, particle.y);
        ctx.restore();
      });
      
      // 继续动画或结束
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(draw);
      } else {
        onAnimationEnd();
      }
    };

    // 启动动画
    initParticles();
    animationFrameRef.current = requestAnimationFrame(draw);

    // 清理
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [emoji, onAnimationEnd]);

  if (!emoji) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        pointerEvents: 'none'
      }}
    />
  );
};

export default FullScreenEmojiAnimation;