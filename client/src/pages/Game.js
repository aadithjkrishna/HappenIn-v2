// Game.js
import React from "react";
import GameCanvas from "../Components/GameCanvas";
import NavBar from '../Components/NavBar'

const Game = () => {
  return (
    <div>
      <NavBar />
      <h1>Mini Game</h1>
      <GameCanvas width={800} height={600} />
    </div>
  );
};

export default Game;