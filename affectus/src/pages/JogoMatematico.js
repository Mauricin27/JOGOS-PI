import React, { useState } from "react";
import "../styles/JogoMatematica.css";
import professor from "../assets/MATEMATICA/x2.png";
import FORMOU from "../assets/MATEMATICA/FORMOU.png";
import logo from "../assets/MATEMATICA/LOGO.png";
import somAcerto from "../assets/MATEMATICA/ACERTA.mp3";
import somErro from "../assets/MATEMATICA/ERRA.mp3";
import VENCEU from "../assets/MATEMATICA/VENCEU.mp3";
import PERDEU from "../assets/MATEMATICA/PERDEU.mp3";
import QUADRO from "../assets/MATEMATICA/BOARD.png";

export default function JogoMatematico() {
  const perguntas = [
    { conta: "2 + 3", resposta: 5, opcoes: [5, 7, 10, 3] },
    { conta: "4 - 2", resposta: 2, opcoes: [2, 3, 5, 1] },
    { conta: "3 x 3", resposta: 9, opcoes: [6, 8, 9, 12] },
    { conta: "10 ÷ 2", resposta: 5, opcoes: [4, 5, 6, 8] },
    { conta: "6 + 7", resposta: 13, opcoes: [11, 13, 12, 14] },
    { conta: "15 - 9", resposta: 6, opcoes: [7, 8, 6, 9] },
    { conta: "5 x 2", resposta: 10, opcoes: [8, 10, 12, 15] },
    { conta: "12 ÷ 3", resposta: 4, opcoes: [3, 6, 4, 2] },
    { conta: "7 + 8", resposta: 15, opcoes: [14, 15, 16, 18] },
    { conta: "9 - 4", resposta: 5, opcoes: [6, 4, 3, 5] },
  ];

  const [indice, setIndice] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
  const [respostaClicada, setRespostaClicada] = useState(null);
  const [somAtivo, setSomAtivo] = useState(true);

  const progresso = ((indice + 1) / perguntas.length) * 100;

  function tocarSom(src) {
    if (somAtivo) {
      const audio = new Audio(src);
      audio.play();
    }
  }

  function verificarResposta(opcao) {
    setRespostaClicada(opcao);

    if (opcao === perguntas[indice].resposta) {
      setAcertos(acertos + 1);
      tocarSom(somAcerto);
    } else {
      setErros(erros + 1);
      tocarSom(somErro);
    }

    setTimeout(() => {
      if (indice + 1 < perguntas.length) {
        setIndice(indice + 1);
      } else {
        setFinalizado(true);
      }
      setRespostaClicada(null);
    }, 1000);
  }

  function reiniciarJogo() {
    setIndice(0);
    setAcertos(0);
    setErros(0);
    setFinalizado(false);
    setRespostaClicada(null);
  }

  return (
    <div className="container-geral">
      <div className="container-jogo">
        {/* Header */}
        <div className="header-jogo">
          <img src={logo} className="logo-jogo" alt="logo" />
          <div className="header-centro">
            {!finalizado && <h2 className="titulo-jogo">Desafio Matemático</h2>}
            <div className="barra-progresso">
              <div
                className="barra-preenchida"
                style={{ width: `${progresso}%` }}
              ></div>
            </div>
          </div>
          <button className="botao-som" onClick={() => setSomAtivo(!somAtivo)}>
            {somAtivo ? "🔊" : "🔇"}
          </button>
        </div>

        {/* Pergunta */}
        {!finalizado && (
          <div className="professor-container">
            <img src={professor} className="professor-img" alt="professor" />
            <div className="balao">
              <p>{perguntas[indice].conta} = ?</p>
            </div>
          </div>
        )}

        {/* Respostas */}
        {!finalizado && (
          <div className="respostas-container">
            {perguntas[indice].opcoes.map((opcao, i) => (
              <div
                key={i}
                className={`card-resposta ${
                  respostaClicada === opcao
                    ? opcao === perguntas[indice].resposta
                      ? "correto"
                      : "errado"
                    : ""
                }`}
                onClick={() => verificarResposta(opcao)}
                style={{ backgroundImage: `url(${QUADRO})` }}
              >
                <span className="texto-resposta">{opcao}</span>
              </div>
            ))}
          </div>
        )}

        {/* Botões inferiores */}
        {!finalizado && (
          <div className="botoes-jogo-fixo">
            <button className="btn-sair" onClick={() => (window.location.href = "/")}>
              Sair
            </button>
            <button className="btn-reiniciar" onClick={reiniciarJogo}>
              Reiniciar
            </button>
          </div>
        )}

        {/* Modal final */}
        {finalizado && (
          <div className="modal-final">
            {acertos >= 6 ? (
              <>
                <h2>Parabéns!</h2>
                {somAtivo && <audio autoPlay src={VENCEU}></audio>}
                <p>Você acertou {acertos} de {perguntas.length}!</p>
                <img src={FORMOU} className="modal-img" alt="venceu" />
                <button className="btn-reiniciar" onClick={reiniciarJogo}>
                  Jogar Novamente
                </button>
              </>
            ) : (
              <>
                <h2>Você pode melhorar!</h2>
                {somAtivo && <audio autoPlay src={PERDEU}></audio>}
                <p>Você acertou {acertos} de {perguntas.length}.</p>
                <img src={FORMOU} className="modal-img" alt="perdeu" />
                <button className="btn-reiniciar" onClick={reiniciarJogo}>
                  Jogar Novamente
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
