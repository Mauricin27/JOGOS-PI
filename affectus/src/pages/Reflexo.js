import React, { useEffect, useState, useRef } from "react";
import "../styles/Reflexo.css";

export default function JogoReflexo() {
  const [blocoAtivo, setBlocoAtivo] = useState(null);
  const [pontuacao, setPontuacao] = useState(0);
  const [tempo, setTempo] = useState(20);
  const [jogando, setJogando] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const intervaloRef = useRef(null);
  const historicoRef = useRef([]); // guarda os últimos blocos ativados

  const blocos = [0, 1, 2, 3];

  function ativarBlocoAleatorio() {
    let aleatorio;
    let tentativas = 0;

    do {
      aleatorio = Math.floor(Math.random() * blocos.length);
      tentativas++;
    } while (
      historicoRef.current.length >= 2 &&
      historicoRef.current.at(-1) === aleatorio &&
      historicoRef.current.at(-2) === aleatorio &&
      tentativas < 10
    );

    historicoRef.current.push(aleatorio);
    if (historicoRef.current.length > 3) historicoRef.current.shift();

    setBlocoAtivo(aleatorio);
  }

  function iniciarJogo() {
    clearInterval(intervaloRef.current);
    historicoRef.current = [];
    setPontuacao(0);
    setTempo(20);
    setJogando(true);
    setMostrarModal(false);
    ativarBlocoAleatorio();
  }

  function reiniciarJogo() {
    clearInterval(intervaloRef.current);
    historicoRef.current = [];
    setPontuacao(0);
    setTempo(20);
    setJogando(false);
    setBlocoAtivo(null);
    setMostrarModal(false);
  }

  useEffect(() => {
    if (jogando) {
      intervaloRef.current = setInterval(() => {
        setTempo((t) => {
          if (t <= 1) {
            clearInterval(intervaloRef.current);
            setJogando(false);
            setBlocoAtivo(null);
            setMostrarModal(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervaloRef.current);
  }, [jogando]);

  function clicarBloco(index) {
    if (!jogando) return;

    if (index === blocoAtivo) {
      setPontuacao((p) => p + 1);
      setBlocoAtivo(null);
      setTimeout(() => {
        ativarBlocoAleatorio();
      }, 5);
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
          <div className="cronometro">⏱ {tempo}s</div>
        </div>
      </header>

      <div className="tabuleiro-reflexos">
        {blocos.map((b, i) => (
          <div
            key={i}
            onClick={() => clicarBloco(i)}
            className={`bloco ${i === blocoAtivo ? "ativo" : ""}`}
          />
        ))}
      </div>

      <button
        className={`iniciar-jogo-reflexo ${jogando || mostrarModal ? "invisivel" : ""}`}
        onClick={iniciarJogo}
      >
        INICIAR JOGO
      </button>

      {mostrarModal && (
        <div className="modal-fim-reflexo">
          <div className="modal-conteudo-reflexo">
            <h2>⏱ TEMPO ESGOTADO!</h2>
            <p>
              SUA PONTUAÇÃO: <strong>{pontuacao}</strong>
            </p>
            <div className="botoes-modal-reflexo">
              <button onClick={iniciarJogo} className="btn-modal-jogar-reflexo">
                JOGAR NOVAMENTE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
