import React, { useState } from "react";
import "../styles/JogoMatematica.css";
import professor from "../assets/MATEMATICA/x2.png";
import FORMOU from "../assets/MATEMATICA/FORMOU.png";
import somAcerto from "../assets/MATEMATICA/ACERTA.mp3";
import somErro from "../assets/MATEMATICA/ERRA.mp3";
import VENCEU from "../assets/MATEMATICA/VENCEU.mp3";
import PERDEU from "../assets/MATEMATICA/PERDEU.mp3";
import QUADRO from "../assets/MATEMATICA/BOARD.png";
import REPROVADO from "../assets/MATEMATICA/REPROVADO.png";
import CEREBRO from "../assets/MATEMATICA/CIENTISTA.png";
import TROFEU from "../assets/MATEMATICA/MAGICO.png";

export default function JogoMatematico() {
  // ARRAY DE PERGUNTAS, COM CONTA, RESPOSTA CORRETA E OPCOES
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

  // ESTADOS DO JOGO
  const [indice, setIndice] = useState(0); // CONTROLE DO INDICE DA PERGUNTA ATUAL
  const [acertos, setAcertos] = useState(0); // CONTROLE DE ACERTOS
  const [erros, setErros] = useState(0); // CONTROLE DE ERROS
  const [finalizado, setFinalizado] = useState(false); // FLAG PARA FINAL DO JOGO
  const [respostaClicada, setRespostaClicada] = useState(null); // FLAG PARA RESPOSTA CLICADA
  const [somAtivo, setSomAtivo] = useState(true); // FLAG PARA SOM ATIVO
  const [mostrarConquista, setMostrarConquista] = useState(null); // FLAG PARA MOSTRAR CONQUISTA

  // CALCULA O PROGRESSO DO JOGO EM PORCENTAGEM
  const progresso = ((indice + 1) / perguntas.length) * 100;

  // FUNCAO PARA TOCAR SOM
  function tocarSom(src) {
    if (somAtivo) {
      const audio = new Audio(src);
      audio.play();
    }
  }

  // FUNCAO PARA VERIFICAR RESPOSTA SELECIONADA
  function verificarResposta(opcao) {
    setRespostaClicada(opcao);

    if (opcao === perguntas[indice].resposta) {
      const novosAcertos = acertos + 1;
      setAcertos(novosAcertos);
      tocarSom(somAcerto);

      // CONQUISTAS DE ACERTOS
      if (novosAcertos === 5) {
        setMostrarConquista("cerebro");
        setTimeout(() => setMostrarConquista(null), 4000);
      }
      if (novosAcertos === 10) {
        setMostrarConquista("trofeu");
        setTimeout(() => setMostrarConquista(null), 4000);
      }
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

  // FUNCAO PARA REINICIAR O JOGO
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
        {/* HEADER DO JOGO */}
        <div className="header-jogo">
          <div className="botoes-header">
            <button className="btn-sair" onClick={() => (window.location.href = "/")}>
              ⮜
            </button>
            <button className="btn-reiniciar" onClick={reiniciarJogo}>
              🗘
            </button>
          </div>

          <div className="header-centro">
            {!finalizado && <h2 className="titulo-jogo">Desafio Matematico</h2>}
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

        {/* MOSTRAR PERGUNTA */}
        {!finalizado && (
          <div className="professor-container">
            <img src={professor} className="professor-img" alt="professor" />
            <div className="balao">
              <p>{perguntas[indice].conta} = ?</p>
            </div>
          </div>
        )}

        {/* MOSTRAR OPCOES DE RESPOSTA */}
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

        {/* MODAL FINAL DO JOGO */}
        {finalizado && (
          <div className="modal-final">
            {acertos >= 6 ? (
              <>
                <h2>PARABENS! VOCE FOI APROVADO!</h2>
                {somAtivo && <audio autoPlay src={VENCEU}></audio>}
                <p>Voce acertou {acertos} de {perguntas.length}!</p>
                <img src={FORMOU} className="modal-img" alt="venceu" />
                <button className="btn-reiniciar" onClick={reiniciarJogo}>
                  Jogar Novamente
                </button>
              </>
            ) : (
              <>
                <h2>OPS... VOCE FOI REPROVADO!</h2>
                {somAtivo && <audio autoPlay src={PERDEU}></audio>}
                <p>Voce acertou {acertos} de {perguntas.length}.</p>
                <img src={REPROVADO} className="modal-img" alt="perdeu" />
                <button className="btn-reiniciar" onClick={reiniciarJogo}>
                  Jogar Novamente
                </button>
              </>
            )}
          </div>
        )}

        {/* POPUPS DE CONQUISTA */}
        {mostrarConquista === "cerebro" && (
          <div className="matematica-conquista-pop">
            <img
              src={CEREBRO}
              alt="Cerebro Rapido"
              className="matematica-conquista-img"
            />
            <p className="matematica-conquista-texto">
              Conquista desbloqueada: Cientista Incrivel!
            </p>
          </div>
        )}

        {mostrarConquista === "trofeu" && (
          <div className="matematica-conquista-pop">
            <img
              src={TROFEU}
              alt="Genio das Equacoes"
              className="matematica-conquista-img"
            />
            <p className="matematica-conquista-texto">
               Conquista desbloqueada: Magico das Equacoes!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
