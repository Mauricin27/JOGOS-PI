import React, { useState, useEffect } from "react";
import "../styles/JogoDaVelha.css";

import somCliqueMP3 from "../assets/JOGOVELHA/CLICOU.mp3";
import somVitoriaMP3 from "../assets/JOGOVELHA/ACERTOU.mp3";
import somErroMP3 from "../assets/JOGOVELHA/PERDEU.mp3";

export default function JogoDaVelha() {
  const [tabuleiro, setTabuleiro] = useState(Array(9).fill(null));
  const [vezDoX, setVezDoX] = useState(true);
  const [vencedor, setVencedor] = useState(null);
  const [jogarContraIa, setJogarContraIa] = useState(null);
  const [somAtivo, setSomAtivo] = useState(true);
  const [trioVencedor, setTrioVencedor] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(true);
  const [mostrarModalResultado, setMostrarModalResultado] = useState(false);

  const somClique = new Audio(somCliqueMP3);
  const somVitoria = new Audio(somVitoriaMP3);
  const somErro = new Audio(somErroMP3);

  // --- VERIFICA VENCEDOR ---
  const verificarVencedor = (b) => {
    const combinacoes = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let [a, b1, c] of combinacoes) {
      if (b[a] && b[a] === b[b1] && b[a] === b[c]) {
        return { vencedor: b[a], trio: [a, b1, c] };
      }
    }
    return { vencedor: null, trio: [] };
  };

  // --- IA ---
  const jogadaIa = (b) => {
    const chanceErro = Math.random() < 0.15;
    const vazias = b.map((v, i) => (v === null ? i : null)).filter((v) => v !== null);

    if (chanceErro) return vazias[Math.floor(Math.random() * vazias.length)];

    for (let i of vazias) {
      const copia = [...b];
      copia[i] = "O";
      if (verificarVencedor(copia).vencedor === "O") return i;
    }

    for (let i of vazias) {
      const copia = [...b];
      copia[i] = "X";
      if (verificarVencedor(copia).vencedor === "X") return i;
    }

    if (!b[4]) return 4;

    const cantos = [0, 2, 6, 8].filter((i) => !b[i]);
    if (cantos.length) return cantos[Math.floor(Math.random() * cantos.length)];

    return vazias[Math.floor(Math.random() * vazias.length)];
  };

  // --- CLIQUE ---
  const aoClicar = (indice) => {
    if (tabuleiro[indice] || vencedor || jogarContraIa === null) return;

    const novoTabuleiro = [...tabuleiro];
    novoTabuleiro[indice] = vezDoX ? "X" : "O";
    setTabuleiro(novoTabuleiro);
    setVezDoX(!vezDoX);

    if (somAtivo) somClique.play();
  };

  // --- MONITORA JOGO ---
  useEffect(() => {
    const { vencedor: ganhador, trio } = verificarVencedor(tabuleiro);

    if (ganhador || tabuleiro.every((c) => c)) {
      setTrioVencedor(trio);
      setVencedor(ganhador || null);

      // 🔊 Som
      if (somAtivo) {
        if (ganhador === "X" || (ganhador && !jogarContraIa)) somVitoria.play();
        else if (ganhador === "O" && jogarContraIa) somErro.play();
      }

      // ⏳ Delay para abrir modal de resultado
      setTimeout(() => setMostrarModalResultado(true), 2500);

      return;
    }

    // IA
    if (jogarContraIa && !vezDoX && !ganhador) {
      const indiceIa = jogadaIa(tabuleiro);
      setTimeout(() => aoClicar(indiceIa), 600);
    }
  }, [tabuleiro, vezDoX, jogarContraIa, somAtivo]);

  // --- REINICIA ---
  const reiniciarJogo = () => {
    setTabuleiro(Array(9).fill(null));
    setVezDoX(true);
    setVencedor(null);
    setTrioVencedor([]);
    setMostrarModalResultado(false);
  };

  const sairJogo = () => alert("Saindo do jogo...");
  const alternarSom = () => setSomAtivo(!somAtivo);

  const escolherModo = (modo) => {
    setJogarContraIa(modo === "ia");
    reiniciarJogo();
    setMostrarModal(false);
  };

  const abrirModal = () => setMostrarModal(true);

  return (
    <div className="container-principal-velha">
      <div className="container-jogo-velha">
        {/* Modal Escolha de Modo */}
        {mostrarModal && (
          <div className="modal-fundo">
            <div className="modal-conteudo">
              <h2>Escolha o modo de jogo!</h2>
              <button className="botao-modal" onClick={() => escolherModo("2p")}>
                2 JOGADORES
              </button>
              <button className="botao-modal" onClick={() => escolherModo("ia")}>
                CONTRA A MÁQUINA
              </button>
            </div>
          </div>
        )}

        {/* Modal Resultado */}
        {mostrarModalResultado && (
          <div className="modal-fundo">
            <div className="modal-conteudo">
              {vencedor ? (
                <h2 className={jogarContraIa ? (vencedor === "X" ? "texto-vencedor-jogo-velha" : "texto-empate-jogo-velha") : "texto-vencedor-jogo-velha"}>
                  {jogarContraIa
                    ? vencedor === "X"
                      ? "VOCÊ VENCEU!"
                      : "VOCÊ PERDEU!"
                    : ` ${vencedor === "X" ? "Jogador 1" : "Jogador 2"} venceu!`}
                </h2>
              ) : (
                <h2 className="texto-empate-jogo-velha">EMPATE!</h2>
              )}
              <button className="botao-modal" onClick={reiniciarJogo}>
                JOGAR DE NOVO
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="header-barra-topo-velha">
          <div className="grupo-botoes-esquerda-velha">
            <button className="botao-sair-jogo-velha" onClick={() => window.location.href="/"}>⮜</button>
            <button className="botao-reiniciar-jogo-velha" onClick={reiniciarJogo}>🗘</button>
          </div>
          <h1 className="titulo-jogo-velha">JOGO DA VELHA</h1>
          <div className="grupo-botoes-direita-velha">
            <button className="botao-modo-abrir-modal" onClick={abrirModal}>⚙</button>
            <button className="botao-som-efeitos-velha" onClick={alternarSom}>{somAtivo ? "♫" : "🔇"}</button>
          </div>
        </header>

        {/* Tabuleiro */}
        <div className="grade-tabuleiro-jogo-velha">
          {tabuleiro.map((celula, indice) => (
            <div
               key={indice}
               className={`celula-tabuleiro-jogo
               ${celula ? "celula-preenchida-jogo" : ""}
               ${trioVencedor.includes(indice) ? "celula-vencedora" : ""}
               ${celula === "X" ? "vez-x-jogador" : celula === "O" ? "vez-o-jogador" : ""}`}
               onClick={() => aoClicar(indice)}
            >
              {celula}
            </div>
          ))}
        </div>

        {/* Status */}
        <div className="area-status-jogo-velha">
          {jogarContraIa === null ? (
            <p>Escolha o modo de jogo para começar</p>
          ) : !vencedor && !tabuleiro.every((c) => c) ? (
            <p>
              VEZ DE: <span className={vezDoX ? "vez-x-jogador" : "vez-o-jogador"}>{vezDoX ? "X" : "O"}</span>
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
