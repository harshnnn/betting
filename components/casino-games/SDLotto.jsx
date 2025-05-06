import React, { useEffect, useState, useRef } from "react";

const SDlotto = () => {
  const [balance, setBalance] = useState(100);
  const [bet, setBet] = useState(0);
  const [timer, setTimer] = useState(30);
  const [prediction, setPrediction] = useState(null);
  const [result, setResult] = useState(null);
  const [showResultScreen, setShowResultScreen] = useState(false);
  const [countdownActive, setCountdownActive] = useState(false);
  const [hasPlacedBet, setHasPlacedBet] = useState(false);
  const [planePosition, setPlanePosition] = useState({ x: 10, y: 50 });
  const [flightDirection, setFlightDirection] = useState(null);
  const [roundId, setRoundId] = useState(Date.now());
  const [history, setHistory] = useState([]);
  const [myBets, setMyBets] = useState([]);
  const [showBetMenu, setShowBetMenu] = useState(false);
  const [animationFrame, setAnimationFrame] = useState(0);
  const canvasRef = useRef(null);
  const cloudsRef = useRef([]);

  useEffect(() => {
    let interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          handleGameRound();
          setHasPlacedBet(false);
          return 30;
        } else {
          if (prev === 6) setCountdownActive(true);
          return prev - 1;
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setAnimationFrame((prev) => prev + 1);

      if (countdownActive && flightDirection) {
        const progress = (30 - timer) / 30;
        const baseY =
          flightDirection === "up"
            ? 50 - progress * 40
            : 50 + progress * 40;
        const y = Math.max(
          10,
          Math.min(90, baseY + Math.sin(progress * Math.PI) * 5)
        );
        const x = 10 + progress * 80;
        setPlanePosition({ x, y });

        // Draw plane
        ctx.beginPath();
        ctx.moveTo(x * 5, y * 5);
        ctx.lineTo((x + 2) * 5, (y - 1) * 5);
        ctx.lineTo((x + 4) * 5, y * 5);
        ctx.lineTo((x + 2) * 5, (y + 1) * 5);
        ctx.closePath();
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.strokeStyle = "yellow";
        ctx.stroke();

        // Animate clouds
        cloudsRef.current = cloudsRef.current.map((cloud) => ({
          ...cloud,
          left: cloud.left - 0.5,
        }));
      }

      animationId = requestAnimationFrame(animate);
    };

    if (countdownActive) {
      if (cloudsRef.current.length === 0) {
        cloudsRef.current = Array.from({ length: 5 }).map(() => ({
          width: 50,
          height: 30,
          top: Math.random() * 60 + 10,
          left: Math.random() * 100,
          opacity: 0.2 + Math.random() * 0.2,
        }));
      }
      animationId = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(animationId);
  }, [countdownActive, flightDirection, timer]);

  useEffect(() => {
    if (countdownActive) {
      const direction = Math.random() > 0.5 ? "up" : "down";
      setFlightDirection(direction);
    }
  }, [countdownActive]);

  const handlePlaceBet = () => {
    if (hasPlacedBet || bet <= 0 || !prediction) return;
    if (balance < bet) return alert("Insufficient balance!");
    setBalance((prev) => prev - bet);
    setHasPlacedBet(true);
    setMyBets((prev) => [
      ...prev,
      {
        round: roundId,
        bet,
        prediction,
        result: "Pending",
      },
    ]);
    setShowBetMenu(false);
  };

  const handleGameRound = () => {
    const won = prediction === flightDirection;
    const newResult = {
      round: roundId,
      direction: flightDirection,
    };

    setHistory((prev) => [newResult, ...prev].slice(0, 10));

    if (hasPlacedBet) {
      if (won) {
        setBalance((prev) => prev + bet * 2);
        setResult(`You won! Plane went ${flightDirection.toUpperCase()}!`);
      } else {
        setResult(`You lost! Plane went ${flightDirection.toUpperCase()}!`);
      }

      setMyBets((prev) =>
        prev.map((b) =>
          b.round === roundId ? { ...b, result: won ? "WIN" : "LOSE" } : b
        )
      );
    } else {
      setResult(`Round Result: Plane went ${flightDirection.toUpperCase()}!`);
    }

    setShowResultScreen(true);
    setTimeout(() => setShowResultScreen(false), 3000);
    setCountdownActive(false);
    setPlanePosition({ x: 10, y: 50 });
    setFlightDirection(null);
    setRoundId(Date.now());
    cloudsRef.current = [];
  };

  const handlePredictionClick = (dir) => {
    setPrediction(dir);
    setShowBetMenu(true);
  };

  const handleCloseBetMenu = () => {
    setShowBetMenu(false);
  };

  const handleBetAmountChange = (amount) => {
    setBet(amount);
  };

  return (
    <div className="w-screen h-screen fixed top-0 left-0 bg-black text-white overflow-hidden z-0"
    style={{ touchAction: "none" }}>
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900 to-black z-0" />
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="absolute top-0 left-0 z-5"
      ></canvas>

      {/* Clouds */}
      {cloudsRef.current.map((cloud, i) => (
        <div
          key={i}
          className="absolute bg-white rounded-full"
          style={{
            width: cloud.width,
            height: cloud.height,
            top: `${cloud.top}%`,
            left: `${cloud.left}%`,
            opacity: cloud.opacity,
            zIndex: 4,
            transition: "left 0.1s linear",
          }}
        />
      ))}

      {/* Navbar */}
      <div className="bg-blue-900 text-white px-4 py-2 flex justify-between items-center relative z-10">
        <div className="font-bold text-xl flex items-center">
          <span className="text-yellow-400">🚀 Aviator 99EXCH</span>
        </div>
        <div>Balance: ₹{balance}</div>
      </div>

      {/* Game Mode Selector */}
      <div className="flex justify-center space-x-2 mt-3 relative z-10">
        <button className="px-3 py-1 rounded-full text-sm bg-blue-600">
          Aviator Mode
        </button>
      </div>

      {/* Main Game Area */}
      <div className="flex flex-col items-center justify-center h-[70%] relative z-10">
        <div className="bg-blue-900 p-6 rounded-lg text-center w-[350px] relative">
          <div className="text-sm text-gray-400">
            How to Play: Predict if the plane goes Up or Down!
          </div>
          <div className="text-2xl font-bold">Time Remaining</div>
          <div className="text-4xl font-bold">
            00:{timer < 10 ? `0${timer}` : timer}
          </div>
          <div className="text-lg">{roundId}</div>
          <div className="flex justify-center space-x-4 mt-6">
            <button
              onClick={() => handlePredictionClick("up")}
              className="px-6 py-3 bg-green-600 rounded-lg text-white font-semibold hover:bg-green-700 transition transform hover:scale-105"
            >
              Predict Up
            </button>
            <button
              onClick={() => handlePredictionClick("down")}
              className="px-6 py-3 bg-red-600 rounded-lg text-white font-semibold hover:bg-red-700 transition transform hover:scale-105"
            >
              Predict Down
            </button>
          </div>
        </div>
      </div>

      {/* Bet Menu */}
      {showBetMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div
            className="bg-blue-900 p-6 rounded-lg text-center w-[350px]"
            style={{
              backgroundColor: prediction === "up" ? "#10b981" : "#ef4444",
            }}
          >
            <div className="text-xl font-bold">Aviator {timer}s</div>
            <div className="text-sm mt-2">
              Predict {prediction.charAt(0).toUpperCase() + prediction.slice(1)}
            </div>
            <div className="text-sm mt-2">Balance</div>
            <div className="flex justify-center space-x-2 mt-2">
              {[1, 10, 100, 1000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleBetAmountChange(amount)}
                  className="px-2 py-2 bg-gray-700 rounded"
                >
                  {amount}
                </button>
              ))}
            </div>
            <div className="text-sm mt-2">Quantity</div>
            <div className="flex justify-center space-x-2 mt-2">
              <button
                onClick={() => setBet((prev) => Math.max(0, prev - 1))}
                className="px-2 py-2 bg-gray-700 rounded"
              >
                -
              </button>
              <button className="px-2 py-2 bg-gray-700 rounded">{bet}</button>
              <button
                onClick={() => setBet((prev) => prev + 1)}
                className="px-2 py-2 bg-gray-700 rounded"
              >
                +
              </button>
            </div>
            <div className="flex justify-center space-x-2 mt-4">
              <button
                onClick={handleCloseBetMenu}
                className="px-4 py-2 bg-blue-600 rounded flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handlePlaceBet();
                  handleCloseBetMenu();
                }}
                className="px-4 py-2 bg-green-600 rounded flex-1"
              >
                Bet ₹{bet}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result Screen */}
      {showResultScreen && result && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-30 text-center">
          <div className="bg-white text-black p-8 rounded-lg shadow-lg text-xl font-bold">
            {result}
          </div>
        </div>
      )}
    </div>
  );
};

export default SDlotto;
