import React, { useState } from "react";
import "../styles/EquacaoInvisivel.css";
import somAcerto from "../assets/EQUACAO/ACERTOU.mp3";
import somErro from "../assets/EQUACAO/ERROU.mp3";
import MESTRE from "../assets/EQUACAO/MESTRE.png";
import BOARD from "../assets/EQUACAO/BOARD.png";
import CEREBRO from "../assets/EQUACAO/CEREBRO.png";
import TROFEU from "../assets/EQUACAO/TROFEU.png";

export default function EquacaoInvisivel() {
  // LISTA DE PERGUNTAS, CADA UMA COM A EQUAÇÃO, RESPOSTA CORRETA E OPÇÕES DE RESPOSTA
  const perguntas = [
    { conta: "? + 6 = 12", resposta: 6, opcoes: [5, 6, 7, 8] },
    { conta: "? - 3 = 9", resposta: 12, opcoes: [10, 12, 11, 9] },
    { conta: "? + 4 = 15", resposta: 11, opcoes: [9, 10, 11, 12] },
    { conta: "? - 7 = 8", resposta: 15, opcoes: [13, 14, 15, 16] },
    { conta: "? + 5 = 18", resposta: 13, opcoes: [12, 13, 14, 15] },
    { conta: "? - 2 = 6", resposta: 8, opcoes: [7, 8, 9, 10] },
    { conta: "? + 3 = 9", resposta: 6, opcoes: [5, 6, 7, 8] },
    { conta: "? - 4 = 10", resposta: 14, opcoes: [12, 13, 14, 15] },
    { conta: "? + 7 = 20", resposta: 13, opcoes: [11, 12, 13, 14] },
    { conta: "? - 5 = 5", resposta: 10, opcoes: [9, 10, 11, 12] },
  ];

  // ESTADOS DO JOGO (INDICE DA PERGUNTA ATUAL, ACERTOS, ERROS, ETC)
  const [indice, setIndice] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
  const [respostaClicada, setRespostaClicada] = useState(null);
  const [somAtivo, setSomAtivo] = useState(true);
  const [mostrarConquista, setMostrarConquista] = useState(null);

  // FUNÇÃO PARA TOCAR UM SOM, SE O SOM ESTIVER ATIVADO
  function tocarSom(src) {
    if (somAtivo) {
      const audio = new Audio(src);
      audio.play();
    }
  }

  // FUNÇÃO PRINCIPAL: VERIFICA SE O JOGADOR ACERTOU OU ERROU UMA RESPOSTA
  function verificarResposta(opcao) {
    // EVITA CLICAR EM MAIS DE UMA OPÇÃO AO MESMO TEMPO
    if (respostaClicada !== null) return;
    setRespostaClicada(opcao);

    // SE A RESPOSTA FOR CORRETA
    if (opcao === perguntas[indice].resposta) {
      const novosAcertos = acertos + 1;
      setAcertos(novosAcertos);
      tocarSom(somAcerto);

      // DESBLOQUEIA CONQUISTA "CÉREBRO RÁPIDO" AO ACERTAR 5
      if (novosAcertos === 5) {
        mostrarPopupConquista("cerebro");
      }

      // DESBLOQUEIA CONQUISTA "MESTRE DAS EQUAÇÕES" AO ACERTAR TODAS
      if (novosAcertos === perguntas.length) {
        mostrarPopupConquista("trofeu");
      }
    } else {
      // SE A RESPOSTA ESTIVER ERRADA
      setErros(erros + 1);
      tocarSom(somErro);
    }

    // ESPERA 1 SEGUNDO E PASSA PARA A PRÓXIMA PERGUNTA OU FINALIZA O JOGO
    setTimeout(() => {
      if (indice + 1 < perguntas.length) {
        setIndice(indice + 1);
      } else {
        setFinalizado(true);
      }
      setRespostaClicada(null);
    }, 1000);
  }

  // FUNÇÃO PARA EXIBIR O POPUP DE CONQUISTA (E ESCONDER APÓS 5 SEGUNDOS)
  function mostrarPopupConquista(tipo) {
    setMostrarConquista(tipo);
    setTimeout(() => setMostrarConquista(null), 5000);
  }

  // FUNÇÃO PARA REINICIAR O JOGO (ZERA TUDO)
  function reiniciarJogo() {
    setIndice(0);
    setAcertos(0);
    setErros(0);
    setFinalizado(false);
    setRespostaClicada(null);
  }

  // INTERFACE VISUAL DO JOGO
  return (
    <div className="fundo-equacao">
      <div className="container-jogo-equacao">
        <header className="header-equacao">
          <div className="header-content">
            <div className="lado-esq-equacao">
              <button onClick={() => (window.location.href = "/")}>⮜</button>
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
          {/* ÁREA PRINCIPAL DO JOGO (MOSTRA A EQUAÇÃO E AS OPÇÕES) */}
          {!finalizado && (
            <div className="area-jogo-equacao">
              <div className="equacao-problema">
                <img src={MESTRE} alt="DETETIVE" className="detetive-logo" />
                <span className="texto-equacao">{perguntas[indice].conta}</span>
              </div>

              {/* BOTÕES DE RESPOSTA */}
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

          {/* MODAL FINAL (MOSTRA O RESULTADO QUANDO O JOGO TERMINA) */}
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

        {/* POPUPS DAS CONQUISTAS */}
        {mostrarConquista === "cerebro" && (
          <div className="equacao-conquista-pop">
            <img
              src={CEREBRO}
              alt="Cérebro Rápido"
              className="equacao-conquista-img"
            />
            <p className="equacao-conquista-texto">
              🧠 Conquista desbloqueada: Cérebro Rápido!
            </p>
          </div>
        )}

        {mostrarConquista === "trofeu" && (
          <div className="equacao-conquista-pop">
            <img
              src={TROFEU}
              alt="Mestre das Equações"
              className="equacao-conquista-img"
            />
            <p className="equacao-conquista-texto">
              🏆 Conquista desbloqueada: Mestre das Equações!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
