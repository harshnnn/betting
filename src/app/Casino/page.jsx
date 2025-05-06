"use client";

import React, { useState } from "react";
import {
  allGameComponents as gameComponents,
  gameThumbnails,
} from "../../../components/gameRegistry";

const casinoTabs = [
  "ALL", "RECENT", "MAC88", "MAC EXCITE", "FUN GAMES",
  "MAC88 VIRTUALS", "COLOR PREDICTION", "SMARTSOFT", "TURBOGAMES",
  "EVOLUTION", "EZUGI GAMING", "VIVO GAMING", "EVOPLAY ENTERNATIMENT",
];

const gameTypes = [
  "DRAGON TIGER", "BACCARAT", "SICBO", "ROULETTE", "POKER", "LUCKY7",
  "ANDARBAHAR", "TEENPATTI", "32CARDS", "OTHERS", "LOTTERY",
  "CRICKETWAR", "HI LOW", "SLOTS", "FUN GAMES", "COLOR PREDICTION"
];

const casinoGamesData = {
  "ALL": [
    "DRAGON TIGER", "DRAGON TIGER LION", "1 DAY DRAGON TIGER",
    "DRAGON TIGER 2", "VR 20-20 DTL", "VR DRAGON TIGER",
    "LIGHTNING DRAGON TIGER", "DRAGON TIGER ONE DAY", "FIRST PERSON DRAGON TIGER",
    "DRAGON TIGER LIVE", "DRAGON TIGER DA SORTE", "DRAGON TIGER IMPERIAL",
    "DRAGON & TIGER", "DRAGON-TIGER2", "DRAGON TIGER SEXY",
    "DRAGON TIGER LIVE88"
  ],
  "EVOPLAY ENTERNATIMENT": [],
  "VIVO GAMING": [],
  "EZUGI GAMING": [],
  "EVOLUTION": [],
  "SMARTSOFT": [],
  "TURBOGAMES": [],
  "MAC88 VIRTUALS": ["VR LUCKY 7", "VR LUCKY 5", "LUCKY 15", "VR TRIO", "VR BOLLYWOOD CASINO", "VR AMAR AKBAR ANTHONY", "CASINO MEET VR"],
  "MAC EXCITE": ["SUPER OVER 1 DAY", "CRICKET MATCH 20-20", "INSTANT SUPER OVER", "DRAGON TIGER", "DRAGON TIGER LION", "1 DAY DRAGON TIGER"],
  "FUN GAMES": ["ROCK PAPER SCISSOR", "VALENTINE", " LANKESH", "VR BOLLYWOOD KISS"],
  "COLOR PREDICTION": ["Color Game", "SD Lotto", "3k Lotre"]
};

const CasinoPage = () => {
  const [selectedTab, setSelectedTab] = useState("ALL");
  const [selectedGameType, setSelectedGameType] = useState("DRAGON TIGER");
  const [selectedGame, setSelectedGame] = useState(null);

  const currentGames =
    casinoGamesData[selectedTab] ||
    casinoGamesData[selectedGameType] ||
    casinoGamesData["ALL"];

  const handleGameClick = (game) => {
    setSelectedGame(game);
  };

  const GameComponent = selectedGame ? gameComponents[selectedGame] : null;

  return (
    <div className="p-4">
      <h2 className="text-blue-900 font-bold text-lg">🎰 CASINO</h2>

      <div className="flex overflow-x-auto gap-4 mt-2 bg-blue-900 text-white font-semibold text-sm px-2 py-1">
        {casinoTabs.map((tab, index) => (
          <button
            key={index}
            className={`px-4 py-1 ${selectedTab === tab ? "bg-white text-blue-900 font-bold" : ""}`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex overflow-x-auto gap-6 mt-4 bg-gray-100 px-2 py-2">
        {gameTypes.map((type, index) => (
          <button
            key={index}
            className={`flex flex-col items-center text-xs font-semibold ${
              selectedGameType === type ? "text-blue-700 underline" : ""
            }`}
            onClick={() => setSelectedGameType(type)}
          >
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              🎮
            </div>
            {type}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {currentGames.map((game, index) => (
          <div
            key={index}
            className="border shadow rounded-md overflow-hidden cursor-pointer"
            onClick={() => handleGameClick(game)}
          >
            <img
              src={gameThumbnails[game] || "/images/default_game.png"}
              alt={game}
              className="w-full h-32 object-cover"
            />
            <div className="bg-blue-800 text-white text-sm text-center py-1 font-semibold">
              {game}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-4">
        <img src="/images/support.png" alt="Customer Support" className="w-20" />
      </div>

      {GameComponent && (
        <GameComponent onClose={() => setSelectedGame(null)} />
      )}
    </div>
  );
};

export default CasinoPage;
