import React from "react";
import { Link } from "react-router-dom";
import "../styles/GamesScreen.css";
import dente1 from '../assets/dente2.png';
import elefante from '../assets/3d.png';
import control from '../assets/control.png';
import memoriaImg from '../assets/MEMORIA.png';
import jogoArrasta from '../assets/JogoArrasta.png';
import matematica from '../assets/MATEMATICO.png';
import anagramaImg from '../assets/ANAGRAMA.png';
import PIRATAIMG from '../assets/PIRATA.png';
import REFLEXOIMG from "../assets/REFLEXOIMG.png";
import JOGOVELHA from "../assets/JOGOVELHA.png";
import EQUACAOimg from "../assets/EQUACAOIMG.png";
import PARESIMG from "../assets/PARESIMG.png";
import ESCOVANDO from "../assets/ESCOVANDO.png";



export default function GamesScreen(){
    const games = [
    { id: 1, img: memoriaImg, name: "Jogo Da Memória" },
    { id: 2, img: jogoArrasta, name: "Certo e Errado" },
    { id: 3, img: anagramaImg, name: "Anagrama De Palavras" },
    { id: 4, img: matematica, name: "Jogo Matemático" },
    { id: 5, img: ESCOVANDO, name: "Jogo De Escovação" },
    { id: 6, img: PIRATAIMG, name: "Caça ao Tesouro" },
    { id: 7, img: PARESIMG, name: "Jogo Dos Pares" },
    { id: 8, img: JOGOVELHA, name: "Jogo Da Velha" },
    { id: 9, img: EQUACAOimg, name: "Equação Misteriosa"},
    { id: 10, img: REFLEXOIMG, name: "Jogo Do Reflexo"},
    ];

    return (
      <div className="areaJogos-container">
        <div className="areaJogosVoltar-container">
        <button className="areaJogosVoltar-btn">🡨</button>   
       </div>
       <header className="areaJogos-header">
        <div className="imgLeft-container">
            <img src={dente1} alt="Left" className="areaJogosLeft-img" />
        </div>
        <div className="areaJogosHeader-center">
            <h1 className="areaJogosTitle">COLORS PLAY</h1>
            <h1 className="areaJogosTitle2">APRENDA INGLÊS JOGANDO!</h1>
            <button className="areaJogosPlay-btn" onClick={() => console.log("Arduino")}>JOGAR!</button>
        </div>
        <div className="imgRight-container">
            <img src={elefante} alt="Right" className="areaJogosRight-img" />
        </div>
       </header>

       <div className="jogosPlace-container">
           <div className="jogosPlace-header">
           <img src={control} alt="Controle" className="jogosPlace-icone" />
           <h1 className="jogosPlaceH1">LET'S PLAY! - VAMOS JOGAR!</h1>
       </div>

        <div className="jogosPlace-grid">
            {games.map((game) => (
                <Link key={game.id} to={`/game/${game.id}`} className="game-card">
                    <img src={game.img} alt={game.name} /> 
                    <div className="jogo-info">
                        <span>{game.name}</span>
                    </div>
                </Link>
            ))}
         </div>
        </div>
       </div>
    );
}
