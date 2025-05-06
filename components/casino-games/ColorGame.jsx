import React, { useEffect, useState } from "react";

const COLORS = ["red", "green", "violet"];
const GAME_MODES = ["30Sec", "1Min", "3Min", "5Min"];
const GAME_TIMINGS = { "30Sec": 30, "1Min": 60, "3Min": 180, "5Min": 300 };

const ColorGameApp = () => {
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [balance, setBalance] = useState(100);
  const [bet, setBet] = useState(0);
  const [timer, setTimer] = useState(GAME_TIMINGS["30Sec"]);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [myBets, setMyBets] = useState([]);
  const [gameMode, setGameMode] = useState("30Sec");
  const [roundId, setRoundId] = useState(Date.now());
  const [showResultScreen, setShowResultScreen] = useState(false);
  const [countdownActive, setCountdownActive] = useState(false);
  const [hasPlacedBet, setHasPlacedBet] = useState(false);
  const [showColorBetMenu, setShowColorBetMenu] = useState(false);

  useEffect(() => {
    let interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          handleGameRound();
          setHasPlacedBet(false);
          return GAME_TIMINGS[gameMode];
        } else {
          if (prev === 6) setCountdownActive(true);
          return prev - 1;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameMode]);

  const handlePlaceBet = () => {
    if (hasPlacedBet || bet <= 0 || !selectedColor) return;
    if (balance < bet) return alert("Insufficient balance!");
    setBalance((prev) => prev - bet);
    setHasPlacedBet(true);
    setMyBets((prev) => [
      ...prev,
      {
        round: roundId,
        bet,
        chosenColor: selectedColor,
        chosenNumber: selectedNumber,
        result: "Pending",
      },
    ]);
    setShowColorBetMenu(false);
  };

  const handleGameRound = () => {
    const winColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const winNumber = Math.floor(Math.random() * 10);
    const won = selectedColor === winColor || selectedNumber === winNumber;

    const newResult = {
      round: roundId,
      number: winNumber,
      color: winColor,
      size: bet < 5 ? "Small" : "Big",
    };

    // Update history with last 10 results
    setHistory((prev) => {
      const updatedHistory = [newResult, ...prev].slice(0, 10);
      return updatedHistory;
    });

    if (hasPlacedBet) {
      if (won) {
        setBalance((prev) => prev + bet * 2); // Double the bet amount on win
        setResult(`You won! Number: ${winNumber}, Color: ${winColor}`);
      } else {
        setResult(`You lost! Number: ${winNumber}, Color: ${winColor}`);
      }

      // Update myBets with the result
      setMyBets((prev) =>
        prev.map((b) =>
          b.round === roundId
            ? {
                ...b,
                resultColor: winColor,
                resultNumber: winNumber,
                result: won ? "WIN" : "LOSE",
              }
            : b
        )
      );
    } else {
      setResult(`Round Result: Number: ${winNumber}, Color: ${winColor}`);
    }

    setShowResultScreen(true);
    setTimeout(() => setShowResultScreen(false), 3000);
    setCountdownActive(false);
    setRoundId(Date.now());
  };

  const handleColorBetClick = (color) => {
    setSelectedColor(color);
    setShowColorBetMenu(true);
  };

  const handleCloseColorBetMenu = () => {
    setShowColorBetMenu(false);
  };

  const handleBetAmountChange = (amount) => {
    setBet(amount);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black text-white overflow-hidden">
      {/* Navbar with Balance */}
      <div className="bg-blue-900 text-white px-4 py-2 flex justify-between items-center relative z-10">
        <div className="font-bold text-xl flex items-center">
          <span className="text-yellow-400">🎮 99EXCH</span>
        </div>
        <div>Balance: ₹{balance}</div>
      </div>

      {/* Game Mode */}
      <div className="flex justify-center space-x-2 mt-3 relative z-10">
        {GAME_MODES.map((mode) => (
          <button
            key={mode}
            onClick={() => setGameMode(mode)}
            className={`px-3 py-1 rounded-full text-sm ${gameMode === mode ? "bg-blue-600" : "bg-gray-700"}`}
          >
            Win Go {mode}
          </button>
        ))}
      </div>

      {/* Main Game Area */}
      <div className="flex justify-center items-center h-[60%] relative z-10">
        <div className="bg-blue-900 p-4 rounded-lg text-center w-[300px]">
          <div className="text-sm text-gray-400">How to play</div>
          <div className="text-2xl font-bold">Time remaining</div>
          <div className="text-4xl font-bold">00:{timer < 10 ? `0${timer}` : timer}</div>
          <div className="text-lg">{roundId}</div>
          <div className="flex justify-center space-x-2 mt-4">
            <button className="px-4 py-2 bg-green-600 rounded" onClick={() => handleColorBetClick("green")}>Green</button>
            <button className="px-4 py-2 bg-purple-600 rounded" onClick={() => handleColorBetClick("violet")}>Violet</button>
            <button className="px-4 py-2 bg-red-600 rounded" onClick={() => handleColorBetClick("red")}>Red</button>
          </div>
          <div className="grid grid-cols-5 gap-2 mt-4">
            {[...Array(10).keys()].map((num) => (
              <button
                key={num}
                onClick={() => setSelectedNumber(num)}
                className={`px-2 py-2 rounded ${selectedNumber === num ? "bg-white text-black" : "bg-gray-700"}`}
              >
                {num}
              </button>
            ))}
          </div>
          <div className="flex justify-center space-x-2 mt-4">
            <button className="px-4 py-2 bg-red-600 rounded">Random</button>
            <button className="px-2 py-2 bg-gray-700 rounded">x1</button>
            <button className="px-2 py-2 bg-gray-700 rounded">x5</button>
            <button className="px-2 py-2 bg-gray-700 rounded">x10</button>
            <button className="px-2 py-2 bg-gray-700 rounded">x20</button>
            <button className="px-2 py-2 bg-gray-700 rounded">x50</button>
            <button className="px-2 py-2 bg-gray-700 rounded">x100</button>
          </div>
          <div className="flex justify-center space-x-2 mt-4">
            <button className="px-4 py-2 bg-yellow-600 rounded flex-1">Big</button>
            <button className="px-4 py-2 bg-blue-600 rounded flex-1">Small</button>
          </div>
        </div>
      </div>

      {/* Color Bet Menu */}
      {showColorBetMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-blue-900 p-4 rounded-lg text-center w-[300px]" style={{ background: selectedColor === "green" ? "#10b981" : selectedColor === "violet" ? "#8b5cf6" : "#ef4444" }}>
            <div className="text-xl font-bold">Win Go {gameMode}</div>
            <div className="text-sm mt-2">Select {selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)}</div>
            <div className="text-sm mt-2">Balance</div>
            <div className="flex justify-center space-x-2 mt-2">
              <button onClick={() => handleBetAmountChange(1)} className="px-2 py-2 bg-gray-700 rounded">1</button>
              <button onClick={() => handleBetAmountChange(10)} className="px-2 py-2 bg-gray-700 rounded">10</button>
              <button onClick={() => handleBetAmountChange(100)} className="px-2 py-2 bg-gray-700 rounded">100</button>
              <button onClick={() => handleBetAmountChange(1000)} className="px-2 py-2 bg-gray-700 rounded">1000</button>
            </div>
            <div className="text-sm mt-2">Quantity</div>
            <div className="flex justify-center space-x-2 mt-2">
              <button onClick={() => setBet((prev) => Math.max(0, prev - 1))} className="px-2 py-2 bg-gray-700 rounded">-</button>
              <button className="px-2 py-2 bg-gray-700 rounded">{bet}</button>
              <button onClick={() => setBet((prev) => prev + 1)} className="px-2 py-2 bg-gray-700 rounded">+</button>
            </div>
            <div className="flex justify-center space-x-2 mt-4">
              <button onClick={handleCloseColorBetMenu} className="px-4 py-2 bg-blue-600 rounded flex-1">Cancel</button>
              <button onClick={() => { handlePlaceBet(); handleCloseColorBetMenu(); }} className="px-4 py-2 bg-green-600 rounded flex-1">Total Amount {bet}</button>
            </div>
            <div className="text-center mt-2">
              <input type="checkbox" id="agree" className="mr-2" />
              <label htmlFor="agree" className="text-sm text-gray-400">I agree <span className="underline">Pre-sale rules</span></label>
            </div>
          </div>
        </div>
      )}

      {/* Game History & Bets */}
      <div className="absolute bottom-0 w-full bg-blue-900 z-10 flex">
        <div className="w-1/2 p-4">
          <h3 className="text-xl font-bold">Game History</h3>
          <ul className="text-sm mt-2 max-h-40 overflow-y-auto">
            {history.map((h, i) => (
              <li key={i} className="border-b py-1">
                {h.round}: Number {h.number} - {h.size} - {h.color.toUpperCase()}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-1/2 p-4">
          <h3 className="text-xl font-bold">My Bets</h3>
          <ul className="text-sm mt-2 max-h-40 overflow-y-auto">
            {myBets.map((b, i) => (
              <li key={i} className="border-b py-1">
                #{b.round}: ₹{b.bet} on {b.chosenColor?.toUpperCase() ?? "-"}
                {b.chosenNumber !== null ? ` or ${b.chosenNumber}` : ""} — Result:{" "}
                {b.result === "Pending" ? "Pending" : `${b.resultColor.toUpperCase()}, ${b.resultNumber} (${b.result})`}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Countdown */}
      {countdownActive && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black bg-opacity-70">
          <div className="text-9xl font-bold flex gap-5">
            <div className="bg-blue-600 px-6 py-2 rounded-xl">0</div>
            <div className="bg-blue-600 px-6 py-2 rounded-xl animate-bounce">{timer}</div>
          </div>
        </div>
      )}

      {/* Result Overlay */}
      {showResultScreen && (
        <div className="absolute inset-0 bg-blue-700 bg-opacity-90 z-20 flex flex-col items-center justify-center">
          <div className="text-6xl font-extrabold">🏆</div>
          <div className="text-4xl font-bold">Round Result</div>
          <div className="text-3xl mt-2">{result}</div>
        </div>
      )}
    </div>
  );
};

export default ColorGameApp;