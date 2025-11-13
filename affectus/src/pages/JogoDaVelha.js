import React, { useState, useEffect, useCallback, useMemo } from "react";
import "../styles/JogoDaVelha.css";

import somCliqueMP3 from "../assets/JOGOVELHA/CLICOU.mp3";
import somVitoriaMP3 from "../assets/JOGOVELHA/ACERTOU.mp3";
import somErroMP3 from "../assets/JOGOVELHA/PERDEU.mp3";
import TROFEU from "../assets/JOGOVELHA/MAGO.png";

export default function JogoDaVelha() {
  const [tabuleiro, setTabuleiro] = useState(Array(9).fill(null));
  const [vezDoX, setVezDoX] = useState(true);
  const [vencedor, setVencedor] = useState(null);
  const [jogarContraIa, setJogarContraIa] = useState(null);
  const [somAtivo, setSomAtivo] = useState(true);
  const [trioVencedor, setTrioVencedor] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(true);
  const [mostrarModalResultado, setMostrarModalResultado] = useState(false);
  const [mostrarConquista, setMostrarConquista] = useState(false);

  //  MEMORIZA OS SONS PARA NÃO RECRIAR A CADA RENDER
  const somClique = useMemo(() => new Audio(somCliqueMP3), []);
  const somVitoria = useMemo(() => new Audio(somVitoriaMP3), []);
  const somErro = useMemo(() => new Audio(somErroMP3), []);

  //  VERIFICA VENCEDOR 
  // ESTA FUNÇÃO CHECA TODAS AS COMBINAÇÕES POSSÍVEIS DE LINHAS, COLUNAS E DIAGONAIS
  // PARA IDENTIFICAR SE EXISTE UM VENCEDOR. RETORNA O VENCEDOR E O TRIO DE POSIÇÕES.
  const verificarVencedor = useCallback((b) => {
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
  }, []);

  
  // ESTA FUNÇÃO DEFINE A LÓGICA DA INTELIGÊNCIA ARTIFICIAL.
  // ELA ESCOLHE UMA JOGADA BASEADA EM CHANCES, TENTANDO VENCER OU BLOQUEAR O JOGADOR.
  // SE NÃO HOUVER MOVIMENTOS CRÍTICOS, ESCOLHE UMA CASA ALEATÓRIA.
  const jogadaIa = useCallback((b) => {
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
  }, [verificarVencedor]);

  // CLIQUE 
  // ESTA FUNÇÃO É CHAMADA QUANDO O JOGADOR CLICA EM UMA CASA DO TABULEIRO.
  // ELA REGISTRA A JOGADA, ALTERNA O TURNO E REPRODUZ O SOM DO CLIQUE.
  const aoClicar = useCallback(
    (indice) => {
      if (tabuleiro[indice] || vencedor || jogarContraIa === null) return;

      const novoTabuleiro = [...tabuleiro];
      novoTabuleiro[indice] = vezDoX ? "X" : "O";
      setTabuleiro(novoTabuleiro);
      setVezDoX(!vezDoX);

      if (somAtivo) somClique.play();
    },
    [tabuleiro, vencedor, jogarContraIa, vezDoX, somAtivo, somClique]
  );

  //  MONITORA O JOGO 
  // ESTE USEEFFECT É RESPONSÁVEL POR VERIFICAR CONSTANTEMENTE O ESTADO DO JOGO.
  // ELE DETECTA QUANDO ALGUÉM VENCE, REPRODUZ OS SONS DE VITÓRIA OU DERROTA,
  // E TAMBÉM FAZ A IA JOGAR AUTOMATICAMENTE QUANDO FOR SUA VEZ.
  useEffect(() => {
    const { vencedor: ganhador, trio } = verificarVencedor(tabuleiro);

    if (ganhador || tabuleiro.every((c) => c)) {
      setTrioVencedor(trio);
      setVencedor(ganhador || null);

      if (somAtivo) {
        if (ganhador === "X" || (ganhador && !jogarContraIa)) somVitoria.play();
        else if (ganhador === "O" && jogarContraIa) somErro.play();
      }

      // CONQUISTA AO VENCER A IA
      if (jogarContraIa && ganhador === "X") {
        setMostrarConquista(true);
        setTimeout(() => setMostrarConquista(false), 6000);
      }

      setTimeout(() => setMostrarModalResultado(true), 2500);
      return;
    }

    if (jogarContraIa && !vezDoX && !ganhador) {
      const indiceIa = jogadaIa(tabuleiro);
      setTimeout(() => aoClicar(indiceIa), 600);
    }
  }, [
    tabuleiro,
    vezDoX,
    jogarContraIa,
    somAtivo,
    verificarVencedor,
    jogadaIa,
    aoClicar,
    somErro,
    somVitoria,
  ]);

  // FUNÇÕES AUXILIARES 
  // ESTA FUNÇÃO REINICIA TODO O JOGO, LIMPA O TABULEIRO E RESETA OS ESTADOS.
  const reiniciarJogo = useCallback(() => {
    setTabuleiro(Array(9).fill(null));
    setVezDoX(true);
    setVencedor(null);
    setTrioVencedor([]);
    setMostrarModalResultado(false);
  }, []);

  // ESTA FUNÇÃO ATIVA OU DESATIVA OS SONS
  const alternarSom = useCallback(() => setSomAtivo((prev) => !prev), []);

  // ESTA FUNÇÃO PERMITE AO JOGADOR ESCOLHER O MODO DE JOGO 2 JOGADORES OU CONTRA IA.
  const escolherModo = useCallback(
    (modo) => {
      setJogarContraIa(modo === "ia");
      reiniciarJogo();
      setMostrarModal(false);
    },
    [reiniciarJogo]
  );

  // ESTA FUNÇÃO REABRE O MODAL DE ESCOLHA DE MODO.
  const abrirModal = useCallback(() => setMostrarModal(true), []);

  return (
    <div className="container-principal-velha">
      <div className="container-jogo-velha">
        {/* MODAL ESCOLHA */}
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

        {/* MODAL RESULTADO */}
        {mostrarModalResultado && (
          <div className="modal-fundo">
            <div className="modal-conteudo">
              {vencedor ? (
                <h2
                  className={
                    jogarContraIa
                      ? vencedor === "X"
                        ? "texto-vencedor-jogo-velha"
                        : "texto-empate-jogo-velha"
                      : "texto-vencedor-jogo-velha"
                  }
                >
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

        {/* HEADER */}
        <header className="header-barra-topo-velha">
          <div className="grupo-botoes-esquerda-velha">
            <button
              className="botao-sair-jogo-velha"
              onClick={() => (window.location.href = "/")}
            >
              ⮜
            </button>
            <button className="botao-reiniciar-jogo-velha" onClick={reiniciarJogo}>
              🗘
            </button>
          </div>
          <h1 className="titulo-jogo-velha">JOGO DA VELHA</h1>
          <div className="grupo-botoes-direita-velha">
            <button className="botao-modo-abrir-modal" onClick={abrirModal}>
              ⚙
            </button>
            <button className="botao-som-efeitos-velha" onClick={alternarSom}>
              {somAtivo ? "♫" : "🔇"}
            </button>
          </div>
        </header>

        {/* TABULEIRO */}
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

        {/* STATUS */}
        <div className="area-status-jogo-velha">
          {jogarContraIa === null ? (
            <p>Escolha o modo de jogo para começar</p>
          ) : !vencedor && !tabuleiro.every((c) => c) ? (
            <p>
              VEZ DE:{" "}
              <span className={vezDoX ? "vez-x-jogador" : "vez-o-jogador"}>
                {vezDoX ? "X" : "O"}
              </span>
            </p>
          ) : null}
        </div>

        {/*  CONQUISTA */}
        {mostrarConquista && (
          <div className="velha-conquista-pop">
            <img
              src={TROFEU}
              alt="Estrategista Supremo"
              className="velha-conquista-img"
            />
            <p className="velha-conquista-texto">
               Conquista desbloqueada: Estrategista Supremo!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
