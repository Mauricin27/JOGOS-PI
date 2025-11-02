import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GamesScreen from "./pages/GamesScreen";
import GameScreen from "./pages/GameScreen";

function App() {
  return (
    <Router>
      <Routes>
        {/* Tela inicial com lista de jogos */}
        <Route path="/" element={<GamesScreen />} />

        {/* Tela de jogo individual */}
        <Route path="/game/:id" element={<GameScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
