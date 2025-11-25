import React, { useRef, useEffect } from "react";

interface ScreenBreakerProps {
  image: string;
  width?: number;
  height?: number;
  broken?: boolean;    // 是否破碎
  clickable?: boolean; // 是否允许点击触发
}

interface Shard {
  tex: HTMLCanvasElement;
  w: number;
  h: number;
  x: number;
  y: number;
  cx: number;
  cy: number;
  vx: number;
  vy: number;
  angle: number;
  omega: number;
  mass: number;
  alive: boolean;
}

const ScreenBreaker: React.FC<ScreenBreakerProps> = ({
  image,
  width = 900,
  height = 600,
  broken = false,
  clickable = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const dpr = window.devicePixelRatio || 1;
  let shards: Shard[] = [];
  let raf: number | null = null;
  let lastTs = 0;

  const COLS = 12;
  const ROWS = 8;
  const GRAVITY = 1400;
  const FRICTION = 0.99;
  const BOUNCE = 0.35;
  const ROT_DRAG = 0.995;

  // 初始化 canvas 尺寸
  const resize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [width, height]);

  // 创建碎片
  const createShards = (ex: number, ey: number) => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    shards = [];

    const off = document.createElement("canvas");
    off.width = width * dpr;
    off.height = height * dpr;
    const offCtx = off.getContext("2d");
    if (!offCtx) return;
    offCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    offCtx.drawImage(img, 0, 0, width, height);

    const cellW = width / COLS;
    const cellH = height / ROWS;

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const x0 = c * cellW;
        const y0 = r * cellH;
        const x1 = x0 + cellW;
        const y1 = y0 + cellH;

        const triangles = [
          [{ x: x0, y: y0 }, { x: x1, y: y0 }, { x: x0, y: y1 }],
          [{ x: x1, y: y1 }, { x: x1, y: y0 }, { x: x0, y: y1 }],
        ];

        triangles.forEach((poly) => {
          const bbx = Math.min(...poly.map((p) => p.x));
          const bby = Math.min(...poly.map((p) => p.y));
          const bbw = Math.ceil(Math.max(...poly.map((p) => p.x)) - bbx);
          const bbh = Math.ceil(Math.max(...poly.map((p) => p.y)) - bby);
          if (bbw === 0 || bbh === 0) return;

          const tex = document.createElement("canvas");
          tex.width = bbw * dpr;
          tex.height = bbh * dpr;
          const tctx = tex.getContext("2d");
          if (!tctx) return;
          tctx.setTransform(dpr, 0, 0, dpr, 0, 0);

          tctx.beginPath();
          poly.forEach((p, i) => {
            if (i === 0) tctx.moveTo(p.x - bbx, p.y - bby);
            else tctx.lineTo(p.x - bbx, p.y - bby);
          });
          tctx.closePath();
          tctx.clip();
          tctx.drawImage(off, -bbx, -bby, width, height);

          const cx = (poly[0].x + poly[1].x + poly[2].x) / 3;
          const cy = (poly[0].y + poly[1].y + poly[2].y) / 3;
          const dx = cx - ex;
          const dy = cy - ey;
          const dist = Math.sqrt(dx * dx + dy * dy) + 0.001;
          const force = 800 + Math.random() * 600;
          const vx =
            (dx / dist) * force * (0.6 + Math.random() * 0.8) +
            (Math.random() - 0.5) * 120;
          const vy =
            (dy / dist) * force * (0.6 + Math.random() * 0.8) +
            (Math.random() - 0.5) * 120;

          shards.push({
            tex,
            w: bbw,
            h: bbh,
            x: bbx,
            y: bby,
            cx,
            cy,
            vx,
            vy,
            angle: (Math.random() - 0.5) * 0.8,
            omega: (Math.random() - 0.5) * 6,
            mass: (bbw * bbh) / 1000 + 0.1,
            alive: true,
          });
        });
      }
    }

    lastTs = performance.now();
    if (!raf) raf = requestAnimationFrame(loop);
  };

  // 动画循环
  const loop = (ts: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dt = Math.min(0.033, (ts - lastTs) / 1000);
    lastTs = ts;

    ctx.clearRect(0, 0, width, height);

    let activeCount = 0;
    shards.forEach((s) => {
      if (!s.alive) return;
      s.vy += (GRAVITY * dt) / s.mass;
      s.vx *= Math.pow(FRICTION, dt * 60);
      s.vy *= Math.pow(FRICTION, dt * 60);
      s.omega *= Math.pow(ROT_DRAG, dt * 60);

      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.angle += s.omega * dt;

      if (s.y + s.h > height) {
        s.vy = -Math.abs(s.vy) * BOUNCE;
        s.vx *= 0.8;
        s.y = height - s.h;
      }

      ctx.save();
      ctx.translate(s.x + s.w / 2, s.y + s.h / 2);
      ctx.rotate(s.angle);
      ctx.translate(-s.w / 2, -s.h / 2);
      ctx.drawImage(s.tex, 0, 0, s.w, s.h);
      ctx.restore();

      if (
        Math.abs(s.vx) < 2 &&
        Math.abs(s.vy) < 2 &&
        Math.abs(s.omega) < 0.05 &&
        s.y > height - 50
      ) {
        s.alive = false;
      } else {
        activeCount++;
      }
    });

    if (activeCount === 0) {
      raf = null;
    } else {
      raf = requestAnimationFrame(loop);
    }
  };

  // 点击触发
  useEffect(() => {
    if (!clickable) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const ex = e.clientX - rect.left;
      const ey = e.clientY - rect.top;
      createShards(ex, ey);
      // 背景消失
      if (imgRef.current) {
        imgRef.current.style.display = 'none';
      }
    };
    // 自动触发
    handleClick({ clientX: width / 2, clientY: height / 2 } as MouseEvent);

    // 清理函数 - 组件卸载时重置图片显示状态
    return () => {
      if (imgRef.current) {
        imgRef.current.style.display = 'block';
      }
    };
  }, [clickable, width, height]);

  // 监听 broken 属性变化
  useEffect(() => {
    if (broken) {
      createShards(width / 2, height / 2);
    }
  }, [broken]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        width: width + "px",
        height: height + "px",
        background: "#000",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
      }}
    >
      <img
        ref={imgRef}
        src={image}
        alt="screen"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        crossOrigin="anonymous"
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "auto",
        }}
      />
    </div>
  );
};

export default ScreenBreaker;
