import React, { useState } from "react";
import "../styles/EquacaoInvisivel.css";
import somAcerto from "../assets/EQUACAO/ACERTOU.mp3";
import somErro from "../assets/EQUACAO/ERROU.mp3";
import MESTRE from "../assets/EQUACAO/MESTRE.png";
import BOARD from "../assets/EQUACAO/BOARD.png";

export default function EquacaoInvisivel() {
  const perguntas = [
    { conta: "? + 5 = 8", resposta: 3, opcoes: [2, 3, 5, 4] },
    { conta: "? - 4 = 2", resposta: 6, opcoes: [6, 5, 8, 7] },
    { conta: "? + 7 = 12", resposta: 5, opcoes: [5, 6, 4, 8] },
    { conta: "? - 3 = 1", resposta: 4, opcoes: [2, 3, 4, 5] },
    { conta: "? + 2 = 7", resposta: 5, opcoes: [5, 6, 4, 7] },
    { conta: "? - 5 = 3", resposta: 8, opcoes: [8, 6, 7, 9] },
    { conta: "? + 4 = 9", resposta: 5, opcoes: [5, 6, 4, 3] },
    { conta: "? - 2 = 5", resposta: 7, opcoes: [6, 7, 5, 8] },
    { conta: "? + 6 = 11", resposta: 5, opcoes: [4, 5, 6, 7] },
    { conta: "? - 1 = 3", resposta: 4, opcoes: [4, 3, 5, 2] },
  ];

  const [indice, setIndice] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
  const [respostaClicada, setRespostaClicada] = useState(null);
  const [somAtivo, setSomAtivo] = useState(true);

  function tocarSom(src) {
    if (somAtivo) {
      const audio = new Audio(src);
      audio.play();
    }
  }

  function verificarResposta(opcao) {
    if (respostaClicada !== null) return;
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
    <div className="fundo-equacao">
      <div className="container-jogo-equacao">
        <header className="header-equacao">
          <div className="header-content">
            <div className="lado-esq-equacao">
              <button onClick={() => window.location.href="/"}>⮜</button>
              <button onClick={reiniciarJogo}>🗘</button>
            </div>

            <div className="titulo-header-equacao">EQUAÇÃO MISTERIOSA</div>

            <div className="lado-dir-equacao">
              <button onClick={() => setSomAtivo(!somAtivo)}>
                {somAtivo ? "♫" : "🔇"}
              </button>
            </div>
          </div>
        </header>

        <div className="container-principal-equacao">
          {!finalizado && (
            <div className="area-jogo-equacao">
              <div className="equacao-problema">
                <img src={MESTRE} alt="DETETIVE" className="detetive-logo" />
                <span className="texto-equacao">{perguntas[indice].conta}</span>
              </div>

              <div className="opcoes-equacao">
                {perguntas[indice].opcoes.map((op, i) => (
                  <button
                    key={i}
                    className={`opcao-resposta-equacao ${
                      respostaClicada === op
                        ? op === perguntas[indice].resposta
                          ? "correto usada"
                          : "errado usada"
                        : ""
                    }`}
                    onClick={() => verificarResposta(op)}
                    disabled={respostaClicada !== null}
                    style={{ backgroundImage: `url(${BOARD})` }}
                  >
                    {op}
                  </button>
                ))}
              </div>
            </div>
          )}

          {finalizado && (
            <div className="modal-resultado-equacao">
              <div className="modal-conteudo-equacao">
                <h2>🎉 Fim de jogo!</h2>
                <p>✅ Acertos: {acertos}</p>
                <p>❌ Erros: {erros}</p>
                <button onClick={reiniciarJogo}>Jogar novamente</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
