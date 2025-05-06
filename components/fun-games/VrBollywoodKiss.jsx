"use client"

import React, { useEffect, useRef, useState } from "react";

const COLORS = ["red", "green", "blue"];

const VrBollywoodKiss = ({ onClose }) => {
  const canvasRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [balance, setBalance] = useState(100); // starting balance
  const [bet, setBet] = useState(0);
  const [result, setResult] = useState(null);
  const [timer, setTimer] = useState(30);
  const [isGameRunning, setIsGameRunning] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      COLORS.forEach((color, index) => {
        ctx.fillStyle = color;
        ctx.fillRect(
          (canvas.width / 3) * index,
          canvas.height / 4,
          canvas.width / 3,
          canvas.height / 2
        );
      });
    };

    draw();
  }, []);

  useEffect(() => {
    let interval;
    if (isGameRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (isGameRunning && timer === 0) {
      const winColor = COLORS[Math.floor(Math.random() * 3)];
      if (selectedColor === winColor) {
        setBalance((prev) => prev + bet);
        setResult(`You won! Winning color was ${winColor}`);
      } else {
        setBalance((prev) => prev - bet);
        setResult(`You lost! Winning color was ${winColor}`);
      }
      setIsGameRunning(false);
    }
    return () => clearInterval(interval);
  }, [isGameRunning, timer]);

  const startGame = () => {
    if (!selectedColor || bet <= 0 || bet > balance) return;
    setResult(null);
    setTimer(30);
    setIsGameRunning(true);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full z-50 bg-black">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />

      <div className="absolute top-5 left-5 text-white z-10">
        <p className="text-xl font-bold">Balance: ₹{balance}</p>
        <div className="flex gap-2 mt-2">
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`px-4 py-2 text-white rounded-lg ${
                selectedColor === color ? "bg-white text-black" : `bg-${color}-600`
              }`}
            >
              {color.toUpperCase()}
            </button>
          ))}
        </div>

        <input
          type="number"
          value={bet}
          onChange={(e) => setBet(Number(e.target.value))}
          placeholder="Enter Bet Amount"
          className="mt-2 px-3 py-1 rounded text-black"
        />

        <button
          onClick={startGame}
          className="ml-2 bg-yellow-400 hover:bg-yellow-300 px-4 py-2 rounded"
        >
          Start
        </button>

        <p className="mt-2">Timer: {timer}s</p>
        {result && <p className="mt-2 font-bold">{result}</p>}
      </div>

      <button
        onClick={onClose}
        className="absolute top-5 right-5 bg-red-600 text-white px-4 py-2 rounded z-10"
      >
        Exit
      </button>
    </div>
  );
};

export default VrBollywoodKiss;
