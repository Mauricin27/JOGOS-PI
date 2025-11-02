import React from "react";
import { useParams, Link } from "react-router-dom";
import JogoMemoria from "../pages/JogoMemoria.js"; 
import ArrastaSolta from "../pages/ArrastaSolta.js";
import AnagramaJogo from "../pages/Anagrama.js";
import JogoMatematico from "../pages/JogoMatematico.js";
import JogoEscovacao from '../pages/JogoEscovacao.js';
import JogoPirata from "../pages/JogoPirata.js";
import JogoDePares from "../pages/JogoDePares.js";
import JogoDaVelha from "../pages/JogoDaVelha.js";
import EquacaoInvisivel from "../pages/EquacaoInvisivel.js";



export default function GameScreen() {
  const { id } = useParams();

  switch (id) {
    case "1":
      return (
        <div>
          <JogoMemoria
            onExit={() => {}}
            effectsOn={true}
            musicOn={true}
          />
        </div>
      );
      case "2":
        return(
          <div>
            <ArrastaSolta />
          </div>
        );
      case "3":
        return(
          <div>
            < AnagramaJogo />
          </div>
        );
        case "4":
          return(
            <div>
              <JogoMatematico />
            </div>
          );

          case "5":
            return(
              <div>
                <JogoEscovacao />
              </div>
            );
          case "6":
            return(
              <div>
                <JogoPirata />
              </div>
            );
            case "7":
            return(
              <div>
                <JogoDePares />
              </div>
            );
          case "8":
            return(
              <div>
                <JogoDaVelha />
              </div>
            );
          case "9":
            return(
              <div>
                <EquacaoInvisivel />
              </div>
            );

          
    default:
      return (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <h1>Jogo {id}</h1>
          <p>Aqui futuramente o jogo {id} estará aqui.</p>
          <Link to="/">
            <button>Voltar</button>
          </Link>
        </div>
      );
  }
}
