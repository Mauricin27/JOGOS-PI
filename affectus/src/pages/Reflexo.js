import React, { useEffect, useState, useRef } from "react";
import "../styles/Reflexo.css";

export default function JogoReflexo() {
  const [blocoAtivo, setBlocoAtivo] = useState(null);
  const [pontuacao, setPontuacao] = useState(0);
  const [vidas, setVidas] = useState(5);
  const [jogando, setJogando] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [animacaoBloco, setAnimacaoBloco] = useState(null);

  const historicoRef = useRef([]);
  const bloqueandoClickRef = useRef(false);
  const blocos = [0, 1, 2, 3, 4, 5];

  // Escolher bloco aleatório sem repetir o anterior
  function escolherAleatorio() {
    let aleatorio;
    do {
      aleatorio = Math.floor(Math.random() * blocos.length);
    } while (historicoRef.current.at(-1) === aleatorio);
    historicoRef.current.push(aleatorio);
    if (historicoRef.current.length > 3) historicoRef.current.shift();
    return aleatorio;
  }

  function ativarBloco() {
    if (!jogando) return;
    setBlocoAtivo(escolherAleatorio());
  }

  function iniciarJogo() {
    historicoRef.current = [];
    setPontuacao(0);
    setVidas(5);
    setMostrarModal(false);
    setJogando(true);
    setAnimacaoBloco(null);
    setBlocoAtivo(escolherAleatorio());
  }

  function reiniciarJogo() {
    setPontuacao(0);
    setVidas(5);
    setJogando(false);
    setBlocoAtivo(null);
    setMostrarModal(false);
    setAnimacaoBloco(null);
    bloqueandoClickRef.current = false;
  }

  // Clique nos blocos
  function clicarBloco(index) {
    if (!jogando || bloqueandoClickRef.current) return;
    bloqueandoClickRef.current = true;

    if (index === blocoAtivo) {
      // Acertou
      setPontuacao((p) => p + 1);
      setAnimacaoBloco({ index, tipo: "correto" });

      setTimeout(() => {
        setAnimacaoBloco(null);
        ativarBloco();
        bloqueandoClickRef.current = false;
      }, 0);
    } else {
      // Errou
      setPontuacao((p) => Math.max(0, p - 1));
      setVidas((v) => {
        if (v <= 1) {
          setJogando(false);
          setMostrarModal(true);
          setBlocoAtivo(null);
          return 0;
        }
        return v - 1;
      });
      setAnimacaoBloco({ index, tipo: "errado" });

      setTimeout(() => {
        setAnimacaoBloco(null);
        ativarBloco();
        bloqueandoClickRef.current = false;
      }, 200);
    }
  }

  return (
    <div className="container-jogo-reflexo">
      <header className="header-jogo-reflexo">
        <div className="reflexo-btns">
          <button
            className="reflexo-sair-btn"
            onClick={() => (window.location.href = "/")}
          >
            ⮜
          </button>
          <button className="botao-reiniciar-reflexo" onClick={reiniciarJogo}>
            🗘
          </button>

          {/* BARRA DE VIDAS */}
          <div className="vidas-container">
            <div
              className={`barra-vidas ${vidas <= 2 ? "critico" : vidas <= 3 ? "medio" : ""}`}
              style={{ width: `${(vidas / 5) * 100}%` }}
            ></div>
          </div>
        </div>
      </header>

      <div className="tabuleiro-reflexos">
        {blocos.map((_, i) => (
          <div
            key={i}
            onClick={() => clicarBloco(i)}
            className={`bloco 
              ${i === blocoAtivo ? "ativo" : ""} 
              ${animacaoBloco?.index === i ? animacaoBloco.tipo : ""}
            `}
          />
        ))}
      </div>

      <button
        className={`iniciar-jogo-reflexo ${jogando || mostrarModal ? "oculto" : ""}`}
        onClick={iniciarJogo}
      >
        INICIAR JOGO
      </button>

      {mostrarModal && (
        <div className="modal-fim-reflexo">
          <div className="modal-conteudo-reflexo">
            <h2>FIM DE JOGO</h2>
            <p>
              SUA PONTUAÇÃO: <strong>{pontuacao}</strong>
            </p>
            <button onClick={iniciarJogo} className="btn-modal-jogar-reflexo">
              JOGAR NOVAMENTE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
