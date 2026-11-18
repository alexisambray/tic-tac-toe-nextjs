"use client";

import Image from "next/image";
import { useState } from "react";

type Player = "X" | "O";
type Cell = Player | null;

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const playerInfo = {
  X: {
    name: "Pooh",
    icon: "🧸",
  },
  O: {
    name: "Honey",
    icon: "🍯",
  },
};

export default function Home() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");

  const [winner, setWinner] = useState<Player | null>(null);
  const [winningLine, setWinningLine] = useState<number[]>([]);
  const [isDraw, setIsDraw] = useState(false);

  const [score, setScore] = useState({
    X: 0,
    O: 0,
    draws: 0,
  });

  const [gameStarted, setGameStarted] = useState(false);
  const [firstPlayer, setFirstPlayer] = useState<Player | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  // Check if there is a winner
  const checkWinner = (newBoard: Cell[]): Player | null => {
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;

      if (
        newBoard[a] &&
        newBoard[a] === newBoard[b] &&
        newBoard[a] === newBoard[c]
      ) {
        return newBoard[a];
      }
    }

    return null;
  };

  // Find the exact three boxes that created the win
  const getWinningLine = (newBoard: Cell[]): number[] => {
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;

      if (
        newBoard[a] &&
        newBoard[a] === newBoard[b] &&
        newBoard[a] === newBoard[c]
      ) {
        return combination;
      }
    }

    return [];
  };

  // Randomly choose who goes first
  const rollForFirstPlayer = () => {
    if (isRolling) return;

    setIsRolling(true);
    setFirstPlayer(null);

    setTimeout(() => {
      const randomPlayer: Player = Math.random() < 0.5 ? "X" : "O";

      setFirstPlayer(randomPlayer);
      setCurrentPlayer(randomPlayer);
      setIsRolling(false);
    }, 900);
  };

  // Start the game
  const startGame = () => {
    if (!firstPlayer) return;

    setGameStarted(true);
    setBoard(Array(9).fill(null));
    setWinner(null);
    setWinningLine([]);
    setIsDraw(false);
    setCurrentPlayer(firstPlayer);
  };

  // Handle board clicks
  const handleCellClick = (index: number) => {
    if (board[index] || winner || isDraw) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;

    const gameWinner = checkWinner(newBoard);

    setBoard(newBoard);

    // Winner
    if (gameWinner) {
      setWinner(gameWinner);
      setWinningLine(getWinningLine(newBoard));

      setScore((prevScore) => ({
        ...prevScore,
        [gameWinner]: prevScore[gameWinner] + 1,
      }));

      return;
    }

    // Draw
    if (newBoard.every((cell) => cell !== null)) {
      setIsDraw(true);

      setScore((prevScore) => ({
        ...prevScore,
        draws: prevScore.draws + 1,
      }));

      return;
    }

    // Switch players
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  };

  // New round — keeps the score
  const handleNewGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setWinningLine([]);
    setIsDraw(false);
    setFirstPlayer(null);
    setGameStarted(false);
    setIsRolling(false);
  };

  // Reset everything
  const handleResetScore = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setWinningLine([]);
    setIsDraw(false);
    setFirstPlayer(null);
    setGameStarted(false);
    setIsRolling(false);

    setScore({
      X: 0,
      O: 0,
      draws: 0,
    });
  };

  return (
    <main className="min-h-screen bg-[#FFF8E7] px-6 py-10 text-[#5C3B20]">
      <div className="mx-auto flex min-h-[90vh] max-w-4xl items-center justify-center">
        {!gameStarted ? (
          /* =========================
             START SCREEN
          ========================= */
          <div className="w-full max-w-xl rounded-[2rem] bg-white p-8 text-center shadow-xl sm:p-12">
            {/* BANNER */}
            <div className="mb-6 overflow-hidden rounded-3xl">
              <Image
                src="/bear-honey-banner.jpg"
                alt="A cozy bear enjoying honey in the forest"
                width={1408}
                height={768}
                className="h-auto w-full"
                priority
              />
            </div>

            {/* TITLE */}
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              WINNIE THE POOH&apos;S
            </h1>

            <h2 className="mt-2 text-5xl font-black text-[#D89B2B] sm:text-6xl">
              HONEY HUNT
            </h2>

            <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-[#8B6B4A] sm:text-base">
              A sweet little game of strategy, friendship, and honey.
            </p>

            {/* FIRST PLAYER */}
            <div className="my-10 rounded-3xl bg-[#FFF3C7] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#9A6A22]">
                Who goes first?
              </p>

              <div
                className={`my-6 text-7xl transition-transform ${
                  isRolling ? "animate-bounce" : ""
                }`}
              >
                {isRolling
                  ? "🎲"
                  : firstPlayer
                    ? playerInfo[firstPlayer].icon
                    : "🎲"}
              </div>

              {isRolling ? (
                <p className="font-bold text-[#9A6A22]">
                  Rolling the honey dice...
                </p>
              ) : firstPlayer ? (
                <div>
                  <p className="text-xl font-black">
                    {playerInfo[firstPlayer].name.toUpperCase()} GOES FIRST!
                  </p>

                  <p className="mt-2 text-sm text-[#8B6B4A]">
                    Ready to start the honey hunt?
                  </p>
                </div>
              ) : (
                <p className="text-sm text-[#8B6B4A]">
                  Roll to find out who starts the hunt!
                </p>
              )}

              {!firstPlayer && !isRolling && (
                <button
                  onClick={rollForFirstPlayer}
                  className="mt-6 rounded-full bg-[#D89B2B] px-8 py-3 font-bold text-white shadow-md transition hover:scale-105 hover:bg-[#C88C20]"
                >
                  ROLL THE DICE
                </button>
              )}

              {isRolling && (
                <button
                  disabled
                  className="mt-6 cursor-not-allowed rounded-full bg-[#D89B2B] px-8 py-3 font-bold text-white opacity-60"
                >
                  🎲 ROLLING...
                </button>
              )}
            </div>

            {/* START GAME */}
            {firstPlayer && !isRolling && (
              <button
                onClick={startGame}
                className="w-full rounded-full bg-[#9B4A2F] px-8 py-4 text-lg font-black text-white shadow-md transition hover:scale-[1.02] hover:bg-[#843E27]"
              >
                START THE HUNT 🌼
              </button>
            )}

            <p className="mt-6 text-xs text-[#B29475]">
              A cozy little Tic-Tac-Toe adventure
            </p>
          </div>
        ) : (
          /* =========================
             GAME SCREEN
          ========================= */
          <div className="w-full max-w-3xl">
            {/* TITLE */}
            <div className="mb-8 text-center">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#9A6A22]">
                Winnie the Pooh&apos;s
              </p>

              <h1 className="mt-1 text-4xl font-black text-[#D89B2B] sm:text-5xl">
                HONEY HUNT
              </h1>
            </div>

            {/* SCOREBOARD */}
            <div className="mb-6 grid grid-cols-3 gap-3">
              {/* POOH */}
              <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
                <div className="text-2xl">🧸</div>

                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#8B6B4A]">
                  Pooh
                </p>

                <p className="text-2xl font-black">{score.X}</p>
              </div>

              {/* DRAWS */}
              <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
                <div className="text-2xl">🍯</div>

                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#8B6B4A]">
                  Draws
                </p>

                <p className="text-2xl font-black">{score.draws}</p>
              </div>

              {/* HONEY */}
              <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
                <div className="text-2xl">🍯</div>

                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#8B6B4A]">
                  Honey
                </p>

                <p className="text-2xl font-black">{score.O}</p>
              </div>
            </div>

            {/* WIN / TURN STATUS */}
            <div
              className={`mb-6 rounded-2xl px-6 py-4 text-center transition-all duration-500 ${
                winner
                  ? "bg-[#FFE49A] shadow-[0_0_25px_rgba(216,155,43,0.35)] ring-2 ring-[#D89B2B]"
                  : isDraw
                    ? "bg-[#FFF3C7]"
                    : "bg-[#FFF3C7]"
              }`}
            >
              {winner ? (
                <div className="animate-pulse">
                  <p className="text-2xl font-black text-[#9B4A2F] sm:text-3xl">
                    {playerInfo[winner].icon}{" "}
                    {playerInfo[winner].name.toUpperCase()} WINS THE HUNT! 🎉
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#8B6B4A]">
                    {winner === "X"
                      ? "Pooh found the sweetest victory! 🍯"
                      : "Honey claimed the sweetest victory! 🍯"}
                  </p>
                </div>
              ) : isDraw ? (
                <p className="text-xl font-black">🍯 IT&apos;S A SWEET DRAW!</p>
              ) : (
                <p className="text-lg font-bold">
                  {playerInfo[currentPlayer].icon}{" "}
                  {playerInfo[currentPlayer].name.toUpperCase()}&apos;S TURN
                </p>
              )}
            </div>

            {/* BOARD */}
            <div className="mx-auto grid max-w-md grid-cols-3 gap-3">
              {board.map((cell, index) => {
                const isWinningCell = winningLine.includes(index);

                return (
                  <button
                    key={index}
                    onClick={() => handleCellClick(index)}
                    disabled={Boolean(cell) || Boolean(winner) || isDraw}
                    className={`aspect-square rounded-3xl text-5xl shadow-md transition-all duration-300 sm:text-6xl ${
                      isWinningCell
                        ? "scale-105 animate-pulse bg-[#FFF0B3] ring-4 ring-[#D89B2B] shadow-[0_0_30px_rgba(216,155,43,0.65)]"
                        : "bg-white hover:-translate-y-1 hover:shadow-lg"
                    } disabled:cursor-default`}
                  >
                    {cell ? playerInfo[cell].icon : ""}
                  </button>
                );
              })}
            </div>

            {/* ACTIONS */}
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                onClick={handleNewGame}
                className="rounded-full bg-[#D89B2B] px-7 py-3 font-bold text-white transition hover:scale-105 hover:bg-[#C88C20]"
              >
                🍯 NEW GAME
              </button>

              <button
                onClick={handleResetScore}
                className="rounded-full border-2 border-[#D8C4A8] bg-white px-7 py-3 font-bold text-[#7A5A3A] transition hover:bg-[#FFF8E7]"
              >
                RESET SCORE
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
