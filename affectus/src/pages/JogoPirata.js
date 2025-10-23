import React, { useState, useEffect, useRef } from "react";
import "../styles/JogoPirata.css";

import PirataLateral from "../assets/PIRATA/Pirata-TP.png";
import TesouroImg from "../assets/PIRATA/TESOURO.png";
import NavioImg from "../assets/PIRATA/NAVIO.png"; // Ícone que avança no tabuleiro
import VENCEU from "../assets/PIRATA/ACERTA.mp3";
import ERROU from "../assets/PIRATA/ERRA.mp3";
import LOGO from "../assets/PIRATA/LOGO.png";

// Perguntas
import Pergunta1 from "../assets/PIRATA/1.png";
import Pergunta2 from "../assets/PIRATA/12.png";
import Pergunta3 from "../assets/PIRATA/8.png";
import Pergunta4 from "../assets/PIRATA/3.png";
import Pergunta5 from "../assets/PIRATA/7.png";
import Pergunta6 from "../assets/PIRATA/2.png";
import Pergunta7 from "../assets/PIRATA/6.png";
import Pergunta8 from "../assets/PIRATA/5.png";
import Pergunta9 from "../assets/PIRATA/10.png";
import Pergunta10 from "../assets/PIRATA/4.png";

export default function JogoPirata() {
  const [posicao, setPosicao] = useState(0);
  const [somAtivo, setSomAtivo] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [perguntaIndex, setPerguntaIndex] = useState(0);
  const [animacao, setAnimacao] = useState("");
  const [fimDeJogo, setFimDeJogo] = useState(null); // "vitoria" | "derrota"

  const audioAcerto = useRef(new Audio(VENCEU));
  const audioErro = useRef(new Audio(ERROU));

  const perguntas = [
    { pergunta: "Quantas vezes por dia escovamos os dentes?", opcoes: ["1 vez", "2 ou 3 vezes", "Só quando comer doce"], correta: 1, imagem: Pergunta1 },
    { pergunta: "O que usamos para limpar entre os dentes?", opcoes: ["Fio dental", "Escova", "Enxaguante"], correta: 0, imagem: Pergunta2 },
    { pergunta: "O que acontece se não escovar os dentes?", opcoes: ["Nada", "Ficam mais fortes", "Aparecem cáries"], correta: 2, imagem: Pergunta3 },
    { pergunta: "Pra que serve o flúor?", opcoes: ["Branquear", "Deixar os dentes fortes", "Dar sabor"], correta: 1, imagem: Pergunta4 },
    { pergunta: "Quando trocamos a escova?", opcoes: ["A cada 3 meses", "A cada 6 meses", "Quando suja"], correta: 0, imagem: Pergunta5 },
    { pergunta: "Quando é bom escovar os dentes?", opcoes: ["Antes do café", "Depois das refeições", "Só à noite"], correta: 1, imagem: Pergunta6 },
    { pergunta: "Qual comida dá mais cárie?", opcoes: ["Frutas", "Doces", "Verduras"], correta: 1, imagem: Pergunta7 },
    { pergunta: "O que é a placa?", opcoes: ["Comida", "Bactérias grudadas", "Remédio"], correta: 1, imagem: Pergunta8 },
    { pergunta: "O que causa mau hálito?", opcoes: ["Escovar", "Restos de comida", "Beber água"], correta: 1, imagem: Pergunta9 },
    { pergunta: "Quem cuida dos dentes?", opcoes: ["Médico", "Dentista", "Professor"], correta: 1, imagem: Pergunta10 }
  ];

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const tocarSom = (audioRef) => {
    if (!somAtivo) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  };

  const mover = async (passos, som) => {
    let novaPos = posicao;
    const destino = Math.max(0, Math.min(19, posicao + passos));
    setAnimacao(passos > 0 ? "acerto" : "erro");

    for (let i = 0; i < Math.abs(passos); i++) {
      novaPos += passos > 0 ? 1 : -1;
      novaPos = Math.max(0, Math.min(19, novaPos));
      setPosicao(novaPos);
      tocarSom(som);
      await delay(400);
    }

    setAnimacao("");
    return novaPos;
  };

  const responder = async (i) => {
    setMostrarModal(false); // Oculta modal primeiro
    await delay(300); // Delay para desaparecer

    const pergunta = perguntas[perguntaIndex];
    const correta = i === pergunta.correta;

    const novaPos = await mover(correta ? 2 : -2, correta ? audioAcerto : audioErro);

    const proxima = perguntaIndex + 1;

    if (novaPos >= 19) {
      await delay(300);
      setFimDeJogo("vitoria");
    } else if (novaPos <= 0 && perguntaIndex > 0) {
      await delay(300);
      setFimDeJogo("derrota");
    } else if (proxima >= perguntas.length && novaPos < 19) {
      await delay(300);
      setFimDeJogo("derrota");
    } else {
      await delay(400);
      setPerguntaIndex(proxima);
      setMostrarModal(true); // Exibe modal novamente
    }
  };

  const iniciarJogo = () => {
    setPosicao(0);
    setFimDeJogo(null);
    setPerguntaIndex(0);
    setMostrarModal(true);
  };

  const calcularPosicaoNavio = (index) => {
    // Converte posição de 0-19 para grid
    const col = index % 5;
    const row = Math.floor(index / 5);
    const tamanhoCasa = 60;
    const gap = 12;
    const left = col * (tamanhoCasa + gap);
    const top = row * (tamanhoCasa + gap);
    return { left, top };
  };

  const navioStyle = calcularPosicaoNavio(posicao);

  return (
    <div className="jogo-pitara-container">
      <header className="jogo-header">
        <img src={LOGO} alt="Logo Pirata" className="logo" />
        <h1 className="titulo-jogo">Aventura do Pirata Sorridente 🏴‍☠️</h1>
        <button className="botao-som-pirata" onClick={() => setSomAtivo(!somAtivo)}>
          {somAtivo ? "🔊" : "🔇"}
        </button>
      </header>

      <div className="jogo-pirata-area">
        {/* Conteúdo do jogo */}
        <div className={`tabuleiro-lateral ${mostrarModal ? "esconder" : ""}`}>
          <img src={PirataLateral} alt="Pirata" className="pirata-lateral" />
          <div className="tabuleiro-container">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className={`casa ${i < posicao ? "passada" : ""} ${i === posicao ? "ativa" : ""}`}
              ></div>
            ))}
            <img
              src={NavioImg}
              alt="Navio"
              className="icone-pirata"
              style={{ top: `${navioStyle.top}px`, left: `${navioStyle.left}px` }}
            />
          </div>
          <img src={TesouroImg} alt="Tesouro" className="tesouro-lateral" />
        </div>

        {/* Modal */}
        {mostrarModal && (
          <div className="overlay-modal">
            <div className="area-pergunta-central">
              <img
                src={perguntas[perguntaIndex].imagem}
                alt="Pergunta"
                className="img-pergunta-topo"
              />
              <h2>{perguntas[perguntaIndex].pergunta}</h2>
              <div className="opcoes-respostas-pistas">
                {perguntas[perguntaIndex].opcoes.map((op, i) => (
                  <button key={i} onClick={() => responder(i)}>
                    {op}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {!mostrarModal && !fimDeJogo && posicao === 0 && (
          <button className="botao-comecar" onClick={iniciarJogo}>
            Começar jogo
          </button>
        )}

        {fimDeJogo === "vitoria" && (
          <div className="tela-vitoria">
            <h2>🎉 Parabéns, você encontrou o tesouro! 🏴‍☠️</h2>
            <img src={TesouroImg} alt="Tesouro" className="tesouro-vitoria" />
            <button onClick={iniciarJogo}>Jogar novamente</button>
          </div>
        )}

        {fimDeJogo === "derrota" && (
          <div className="tela-derrota">
            <h2>💀 O pirata caiu no mar e perdeu o tesouro...</h2>
            <img src={PirataLateral} alt="Pirata Triste" className="pirata-triste" />
            <button onClick={iniciarJogo}>Tentar novamente</button>
          </div>
        )}
      </div>

      <div className="pirata-footer">
        <button className="botao-sair" onClick={() => (window.location.href = "/")}>
          SAIR
        </button>
      </div>
    </div>
  );
}
