import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { Socket } from "socket.io-client";
import html2canvas from "html2canvas";

import style from "./style.module.css";
import chessDownSound from "/audio/chessDown.wav";
import EmojiPanel from "@/components/emoji/EmojiPanel";
import { EmojiMap } from "@/components/emoji/EmojiMap";
import type { Emoji, FCObj } from "@/components/emoji/EmojiMap";
import FullScreenEmojiAnimation from "@/components/Animation/FullScreenEmojiAnimation";


import { Modal, Spin, Alert } from 'antd';
import type { AlertProps } from 'antd';


function BtnCell(props: {
  value: string;
  onClick: () => void;
  isOpponentLastMove: boolean;
}) {
  return (
    <div
      className={`${style.cell} ${props.isOpponentLastMove ? style["opponent-last-move"] : ""}`}
      onClick={props.onClick}
    >
      <div className={style["horizontal-line"]} />
      <div className={style["vertical-line"]} />
      <div
        className={`${style.chess} ${style[props.value]} ${props.isOpponentLastMove ? style["opponent-last-move-indicator"] : ""
          }`}
      />
    </div>
  );
}

// 棋盘
function Chess({
  currentPlayer,
  chessTable,
  changeStatus,
  isHost,
  gaming,
  opponentLastMoveIndex,
}: {
  currentPlayer: string;
  chessTable: string[];
  changeStatus: (nextChessTable: string[], index: number) => void;
  isHost: boolean;
  gaming: boolean;
  opponentLastMoveIndex: number | null;
}) {
  const onClick = (index: number) => {
    // 棋盘有棋子 或 游戏结束 或 不是当前玩家 或 不是游戏状态
    if (
      chessTable[index] ||
      win(chessTable) ||
      (isHost && currentPlayer !== "black") ||
      (!isHost && currentPlayer !== "white") ||
      !gaming
    )
      return;
    const nextChessTable = [...chessTable];
    nextChessTable[index] = currentPlayer;
    changeStatus(nextChessTable, index);
  };

  return chessTable.map((item, index) => (
    <BtnCell
      key={index}
      value={item}
      onClick={() => onClick(index)}
      isOpponentLastMove={opponentLastMoveIndex === index}
    />
  ));
}

const FiveChess: React.FC = () => {
  const [History, setHistory] = useState([Array(15 * 15).fill("")]);
  const [step, setStep] = useState(0);
  const [winRole, setWinRole] = useState("");
  const [roomId, setRoomId] = useState("");

  const [isHost, setIsHost] = useState(false);
  // 当前选择的表情（用于全屏动画）
  const [selectedEmoji, setSelectedEmoji] = useState<Emoji | null>(null);
  // 魔术表情组件状态
  const [magicEmojiComponent, setMagicEmojiComponent] =
    useState<React.ReactNode | null>(null);

  // 创建和加入的按钮disabled
  const [gaming, setGaming] = useState(false);

  // 等待人数、在线人数和房间数状态
  const [waitingCount, setWaitingCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [roomCount, setRoomCount] = useState(0);
  const [roomList, setRoomList] = useState<{ id: string, playerCount: number }[]>([]);
  const [showRoomDropdown, setShowRoomDropdown] = useState(false);

  // 存储对手最后一步棋的索引
  const [opponentLastMoveIndex, setOpponentLastMoveIndex] = useState<
    number | null
  >(null);

  // 遮罩层
  const [show, setShow] = useState(false);
  // 通知层
  const [noticeShow, setNoticeShow] = useState(false);
  const [noticeType, setNoticeType] = useState<AlertProps["type"]>();
  const [noticeMessage, setNoticeMessage] = useState("");

  const currentPlayer = step % 2 === 0 ? "black" : "white";

  const chessTable = History[step];

  const socketRef = useRef<Socket>(null);
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io({
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 3000,
      });
    }
    socketRef.current.on("connect", () => {
      console.log(socketRef.current?.id, "连接成功");
    });
    // 断开连接
    socketRef.current.on("disconnect", (reason) => {
      console.log("断开连接-disconnect", reason);
    });
    // 错误
    socketRef.current.on("error", (err) => {
      // 关闭遮罩层
      setShow(false);
      // 打开通知层
      setNoticeShow(true);
      setNoticeType("error");
      setNoticeMessage(err);
      setTimeout(() => {
        setNoticeShow(false);
      }, 2000);
      // Toast({
      //   message: err,
      //   duration: 2000,
      // });
    });

    // 接收在线用户数更新
    socketRef.current.on("onlineUsersUpdate", (count) => {
      setOnlineUsers(count);
    });

    // 接收房间数更新
    socketRef.current.on("roomCountUpdate", (count) => {
      setRoomCount(count);
      // 房间数变化时重新获取房间列表
      socketRef.current?.emit('getRoomList');
    });

    // 接收房间列表更新
    socketRef.current.on("roomListUpdate", (list) => {
      setRoomList(list);
    });

    // 初始获取房间列表
    socketRef.current?.emit('getRoomList');

  }, []);

  useEffect(() => {
    if (socketRef.current) {
      // 接收其他玩家的移动
      socketRef.current.on("move", (data) => {
        // 关闭通知层
        setNoticeShow(false);
        // 关闭遮罩层
        setShow(false);
        if (data.roomId === roomId) {
          const newChessTable = data.nextChessTable;
          const newStep = data.step;
          if (newStep === 0) {
            setWinRole("");
          }
          setHistory([...History.slice(0, newStep), newChessTable]);
          setStep(newStep);

          console.log(data.index, data.player, currentPlayer);
          // 更新对手最后一步棋的索引
          if (data.index !== undefined) {
            setOpponentLastMoveIndex(data.index);
          }

          if (win(newChessTable)) {
            setWinRole(data.player);
          }
        }
      });
      // 接收悔棋事件
      socketRef.current.on("undo", (data) => {
        if (data.roomId === roomId) {
          // 询问是否同意悔棋
          const agree = window.confirm("是否同意悔棋？");

          if (agree) {
            setHistory((prev) => prev.slice(0, -2));
            setStep((prev) => prev - 2);
            // 发送move
            socketRef.current?.emit("move", {
              roomId: roomId,
              step: step - 2,
              nextChessTable: History[step - 2],
            });
          } else {
            // 拒绝悔棋
            socketRef.current?.emit("diaAgree", {
              player: currentPlayer,
              roomId: roomId,
              message: "对方不同意悔棋",
            });
          }
        }
      });

      // 接收新局事件
      socketRef.current.on("restart", (data) => {
        if (data.roomId === roomId) {
          // 询问是否同意新局
          const agree = window.confirm("是否同意重新开始？");
          if (agree) {
            setHistory([History[0]]);
            setStep(0);
            setWinRole("");
            setOpponentLastMoveIndex(null);
            // 发送move
            socketRef.current?.emit("move", {
              roomId: roomId,
              step: 0,
              nextChessTable: History[0],
            });
          } else {
            // 拒绝新局
            socketRef.current?.emit("diaAgree", {
              player: currentPlayer,
              roomId: roomId,
              message: "对方不同意重新开始",
            });
          }
        }
      });
      // 接收玩家加入事件
      socketRef.current.on("playerJoin", (data) => {
        if (data.roomId === roomId) {
          // 不能创建和加入房间
          setGaming(true);
          setNoticeShow(true);
          setNoticeType("info");
          setNoticeMessage(data.message);
          setTimeout(() => {
            setNoticeShow(false);
          }, 2000);
        }
      });

      // 接收房间等待人数更新
      socketRef.current.on("waitingPlayersUpdate", (data) => {
        if (data.roomId === roomId) {
          setWaitingCount(data.waitingCount);
        }
      });

      // 接收表情事件
      socketRef.current.on("emoji", (data) => {
        if (data.roomId === roomId) {
          console.log(data, "表情");

          // 显示表情
          onEmojiSelect(data.emoji, data.category, false);
        }
      });
    }
    return () => {
      socketRef.current?.off("move");
      socketRef.current?.off("undo");
      socketRef.current?.off("restart");
      socketRef.current?.off("playerJoin");
      socketRef.current?.off("waitingPlayersUpdate");
      socketRef.current?.off("emoji");
    };
  }, [roomId, History]);

  const createRoom = () => {
    if (waitingCount > 0) {
      return;
    }
    socketRef.current?.emit("createRoom", (newRoomId: string) => {
      setRoomId(newRoomId);
      setIsHost(true);
      // 加入房间后，等待人数更新为1
      setWaitingCount(1);
    });
  };

  const joinRoom = () => {
    socketRef.current?.emit("joinRoom", roomId, (success: boolean) => {
      if (success) {
        if (isHost) {
          return;
        }
        setIsHost(false);
      } else {
        setNoticeShow(true);
        setNoticeType("error");
        setNoticeMessage("加入房间失败");
        setTimeout(() => {
          setNoticeShow(false);
        }, 2000);
      }
    });
  };

  // 播放落子音效
  const playChessSound = () => {
    try {
      const audio = new Audio(chessDownSound);
      audio.volume = 0.5; // 设置音量为50%
      audio.play().catch((error) => {
        console.warn("音效播放失败:", error);
      });
    } catch (error) {
      console.warn("创建音效对象失败:", error);
    }
  };

  // 改变状态
  const changeStatus = (nextChessTable: string[], index: number) => {
    // 落子提示当前位置
    setOpponentLastMoveIndex(index);
    setHistory([...History, nextChessTable]);
    const nextStep = step + 1;
    setStep(nextStep);
    // 播放落子音效
    playChessSound();
    // 发送新的棋盘
    socketRef.current?.emit("move", {
      step: nextStep,
      nextChessTable: nextChessTable,
      history: History,
      player: currentPlayer,
      roomId: roomId,
      index: index,
    });
    if (win(nextChessTable)) {
      getWin(currentPlayer);
    }
  };

  const getWin = (role: string) => {
    setWinRole(role);
  };

  // 悔棋
  const handleUndo = () => {
    if (History.length > 1) {
      // 发送悔棋事件
      socketRef.current?.emit("undo", {
        player: currentPlayer,
        roomId: roomId,
      });
      // 打开遮罩层
      setShow(true);
    }
  };

  // 新局
  const handleNewGame = () => {
    socketRef.current?.emit("restart", {
      player: currentPlayer,
      roomId: roomId,
    });
    // 打开遮罩层
    setShow(true);
  };

  // 处理表情选择
  const onEmojiSelect = (emoji: Emoji, category: string, isClick: boolean) => {
    if (emoji) {
      if (category === "common") {
        // 设置当前选择的表情，触发全屏动画
        setSelectedEmoji(emoji);
        setMagicEmojiComponent(null);
      } else if (category === "magic") {
        const magicEmoji = EmojiMap.magic.find((item) => item.id === emoji.id);
        // 魔术表情，渲染组件
        if (magicEmoji?.component) {
          const dom = document.querySelector("body") as HTMLElement;
          // 使用html2canvas捕获屏幕并转换为data URL
          html2canvas(dom).then((canvas) => {
            // 将canvas转换为data URL
            const imageSrc = canvas.toDataURL("image/png");
            const Component = magicEmoji.component as React.FC<FCObj>;
            setMagicEmojiComponent(
              <Component
                broken={false}
                clickable={true}
                image={imageSrc}
                width={window.innerWidth}
                height={window.innerHeight}
              />
            );

            // 5秒后移除魔术表情组件
            setTimeout(() => {
              setMagicEmojiComponent(null);
            }, 5000);
          });
        }
      }
      // 只有主动点击了才发送
      if (isClick && roomId) {
        // 发送表情事件
        socketRef.current?.emit("emoji", {
          player: currentPlayer,
          roomId: roomId,
          emoji: emoji,
          category: category,
        });
      }
    }
  };

  // 处理动画结束事件
  const handleAnimationEnd = () => {
    setSelectedEmoji(null);
  };

  return (
    <>
      {/* 房间控制 */}
      <div className={style["controls-container"]}>
        <div className={style["room-controls"]}>
          <div className={style["room-input-container"]}>
            <div className={style["room-input-wrapper"]}>
              <input
                className={style["room-input"]}
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="输入房间号"
              />
              <button
                className={`${style["room-dropdown-toggle"]} ${showRoomDropdown ? style['expanded'] : ''}`}
                onClick={() => setShowRoomDropdown(!showRoomDropdown)}
              >
                ▼
              </button>
            </div>
            {showRoomDropdown && (
              <div className={style["room-dropdown-wrapper"]}>
                <div className={style["room-dropdown"]}>
                  {roomList.length > 0 ? (
                    roomList.map((room) => (
                      <div
                        key={room.id}
                        className={style["room-item"]}
                        onClick={() => {
                          setRoomId(room.id);
                          setShowRoomDropdown(false);
                        }}
                      >
                        {room.id} ({room.playerCount}/2)
                      </div>
                    ))
                  ) : (
                    <div className={`${style["room-item"]} ${style['empty']}`}>暂无可用房间</div>
                  )}
                </div>
              </div>
            )}
          </div>
          <button
            className={`${style["control-btn"]} ${style["primary"]} ${gaming ? style["disabled"] : ""}`}
            onClick={createRoom}
            disabled={gaming}
          >
            🏠 创建房间
          </button>
          <button
            className={`${style["control-btn"]} ${style["primary"]} ${gaming ? style["disabled"] : ""}`}
            onClick={joinRoom}
            disabled={gaming}
          >
            🔗 加入房间
          </button>
        </div>
        <div className={style["game-controls"]}>
          <button className={`${style["control-btn"]} ${style["primary"]}`} disabled={!gaming} onClick={handleNewGame}>
            🔄 新局
          </button>
          <button
            className={`${style["control-btn"]} ${style["secondary"]} ${step <= 1 ? style["disabled"] : ""}`}
            onClick={handleUndo}
            disabled={
              step <= 1 ||
              !!winRole ||
              (isHost && currentPlayer !== "black") ||
              (!isHost && currentPlayer !== "white")
            }
          >
            ⮌ 悔棋
          </button>
        </div>
      </div>
      {/* 在线人数、房间数和等待人数显示 */}
      <div className={style["status-info"]}>
        <div className={style["online-count"]}>🌐 在线总人数: {onlineUsers}</div>
        <div className={style["online-count"]}>🏠 房间总数: {roomCount}</div>
        {gaming && (
          <div className={style["waiting-count"]}>⏳ 房间人数: {waitingCount}/2</div>
        )}
      </div>

      {/* 游戏状态 */}
      <div className={style["status-container"]}>
        <div className={style["my-piece"]}>
          <span className={style["status-text"]}>我方棋子：</span>
          <div className={`${style["piece-indicator"]} ${isHost ? style["black"] : style["white"]}`} />
        </div>

        <div className={`${style["turn-indicator"]} ${style[currentPlayer]}`}>
          <div className={`${style["pulse-piece"]} ${style[currentPlayer]}`} />
          <span className={style["status-text"]}>
            {winRole
              ? `${winRole.toUpperCase()} 胜利!`
              : `${currentPlayer.toUpperCase()} 的回合`}
          </span>
        </div>
      </div>
      <div className={style["winner-text"]}>{winRole && `获胜方：${winRole}`}</div>

      {/* 表情区域 */}
      <EmojiPanel onEmojiSelect={onEmojiSelect} />

      {/* 全屏表情动画 */}
      <FullScreenEmojiAnimation
        emoji={selectedEmoji}
        onAnimationEnd={handleAnimationEnd}
      />
      {/* 魔术表情区域 */}
      {magicEmojiComponent}

      {/* 棋盘 */}
      <div className={style["board-container"]}>
        <Chess
          currentPlayer={currentPlayer}
          chessTable={chessTable}
          changeStatus={changeStatus}
          isHost={isHost}
          gaming={gaming}
          opponentLastMoveIndex={opponentLastMoveIndex}
        />
      </div>
      <Modal
        open={show}
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        closable={false}
        closeIcon={null}
        maskClosable={false}
        footer={null}
      >
        <Spin tip="Loading">等待对方确认...</Spin>
      </Modal>
      <Modal open={noticeShow} closeIcon={null} footer={null}>
        <Alert
          description={noticeMessage}
          type={noticeType}
        />

      </Modal>
    </>
  );
};

/**
 *
 * 0  1   2  3  4  5  6  7  8  9 10 11 12 13 14
 * 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29
 * 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44
 * 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59
 */
// 右边界值
const rightBorder = Array.from(
  { length: 15 },
  (_, index) => (index + 1) * 15 - 1
);
// 左边界值
const leftBorder = Array.from({ length: 15 }, (_, index) => index * 15);

// 右 下 右下 左下
const dir = [1, 15, 16, -14];
function win(chessTable: string[]): string {
  function check(
    direction: number,
    chessTable: string[],
    chess: string,
    prePox: number,
    count: number
  ): boolean {
    if (count === 5) {
      return true;
    }
    // console.log("数量：", count);

    // 右边界值
    if (
      direction === 0 &&
      rightBorder[Math.floor(prePox / 15)] - prePox < 5 - count
    ) {
      return false;
    }
    // 右下边界值
    if (direction === 2 && rightBorder[Math.floor(prePox / 15)] === prePox) {
      return false;
    }
    // 左下边界值
    if (direction === 3 && leftBorder[Math.floor(prePox / 15)] === prePox) {
      return false;
    }
    const nextPox = prePox + dir[direction];
    if (nextPox >= chessTable.length || chessTable[nextPox] !== chess) {
      return false;
    }
    return check(direction, chessTable, chess, nextPox, count + 1);
  }

  // 整个棋盘遍历
  for (let i = 0; i < chessTable.length; i++) {
    if (!chessTable[i]) {
      continue;
    }
    // console.log("从", i, "开始遍历");
    for (let j = 0; j < dir.length; j++) {
      //   console.log(`${j === 0 ? "右" : j === 1 ? "下" : "右下"}方向`);
      if (check(j, chessTable, chessTable[i], i, 1)) {
        return chessTable[i];
      }
    }
  }
  return "";
}

export default FiveChess;
