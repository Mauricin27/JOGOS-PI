import React, { useState, useRef, useEffect } from "react";
import "../styles/JogoPirata.css";

import TesouroImg from "../assets/PIRATA/TESOURO.png";
import NavioImg from "../assets/PIRATA/NAVIO.png";

// Áudios antigos (movimento)
import VENCEU from "../assets/PIRATA/ACERTA.mp3";
import ERROU from "../assets/PIRATA/ERRA.mp3";

// Novos áudios para vitória e derrota
import VITORIA from "../assets/PIRATA/VITORIA.mp3";
import DERROTA from "../assets/PIRATA/DERROTA.mp3";

// Perguntas (12)
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
import Pergunta11 from "../assets/PIRATA/9.png";
import Pergunta12 from "../assets/PIRATA/11.png";

export default function JogoPirata() {
  const [posicao, setPosicao] = useState(0);
  const [somAtivo, setSomAtivo] = useState(true);
  const [mostrarPergunta, setMostrarPergunta] = useState(false);
  const [perguntaIndex, setPerguntaIndex] = useState(0);
  const [animacao, setAnimacao] = useState("");
  const [fimDeJogo, setFimDeJogo] = useState(false);
  const [jogoIniciado, setJogoIniciado] = useState(false);
  const [derrota, setDerrota] = useState(false);

  // Áudios
  const audioAcerto = useRef(new Audio(VENCEU));
  const audioErro = useRef(new Audio(ERROU));
  const audioVitoria = useRef(new Audio(VITORIA));
  const audioDerrota = useRef(new Audio(DERROTA));

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
    { pergunta: "Quem cuida dos dentes?", opcoes: ["Médico", "Dentista", "Professor"], correta: 1, imagem: Pergunta10 },
    { pergunta: "Quantos dentes temos quando adultos?", opcoes: ["20", "32", "40"], correta: 1, imagem: Pergunta11 },
    { pergunta: "Como escovamos os dentes?", opcoes: ["Pente", "Escova", "Sabonete"], correta: 1, imagem: Pergunta12 },
  ];

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const tocarSom = (audioRef) => {
    if (!somAtivo) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  };

  // 🔹 Movimento mais rápido e fluído
  const mover = async (passos, som) => {
    if (!jogoIniciado) return;
    let novaPos = posicao;
    setAnimacao(passos > 0 ? "acerto" : "erro");

    const duracaoPasso = 550; // era 600ms, agora mais rápido e responsivo
    for (let i = 0; i < Math.abs(passos); i++) {
      novaPos += passos > 0 ? 1 : -1;
      novaPos = Math.max(0, Math.min(11, novaPos));
      setPosicao(novaPos);
      tocarSom(som);
      await delay(duracaoPasso);
    }

    setAnimacao("");
    return novaPos;
  };

  // 🔹 Clique mais responsivo e com feedback visual imediato
  // 🔹 Clique mais responsivo e com delay para exibir próxima pergunta após o navio se mover
const responder = async (i) => {
  if (!jogoIniciado) return;

  // animação de saída da pergunta atual
  setAnimacao("fadeOut");
  await delay(800); // pequeno fade antes de esconder
  setMostrarPergunta(false);

  const pergunta = perguntas[perguntaIndex];
  const correta = i === pergunta.correta;

  // feedback sonoro e visual imediato
  tocarSom(correta ? audioAcerto : audioErro);
  setAnimacao(correta ? "acerto" : "erro");

  // movimenta o navio (já com animação)
  const novaPos = await mover(
    correta ? 1 : -1,
    correta ? audioAcerto : audioErro
  );

  // ⏳ delay para deixar o navio terminar o movimento antes da próxima pergunta aparecer
  await delay(1200);

  // checagens de derrota e fim de jogo
  if (novaPos === 0 && perguntaIndex > 0 && !correta) {
    setDerrota(true);
    setJogoIniciado(false);
    return;
  }

  const proxima = perguntaIndex + 1;
  if (proxima >= perguntas.length && novaPos < 11) {
    setDerrota(true);
    setJogoIniciado(false);
    return;
  }

  if (novaPos >= 11) {
    setFimDeJogo(true);
    return;
  }

  // reexibe a próxima pergunta (com leve entrada)
  setPerguntaIndex(proxima);
  setAnimacao("fadeIn");
  setMostrarPergunta(true);
  };


  const iniciarJogo = () => {
    setPosicao(0);
    setFimDeJogo(false);
    setDerrota(false);
    setPerguntaIndex(0);
    setMostrarPergunta(true);
    setJogoIniciado(true);
  };

  const calcularPosicaoNavio = (index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    const tamanhoCasa = 120;
    const gap = 12;
    return { left: col * (tamanhoCasa + gap), top: row * (tamanhoCasa + gap) };
  };

  const navioStyle = calcularPosicaoNavio(posicao);
  const progressoAtual = Math.min((posicao / 11) * 100, 100);

  useEffect(() => {
    if (fimDeJogo && somAtivo) {
      audioVitoria.current.pause();
      audioVitoria.current.currentTime = 0;
      audioVitoria.current.play().catch(() => {});
    }
  }, [fimDeJogo, somAtivo]);

  useEffect(() => {
    if (derrota && somAtivo) {
      audioDerrota.current.pause();
      audioDerrota.current.currentTime = 0;
      audioDerrota.current.play().catch(() => {});
    }
  }, [derrota, somAtivo]);

  // ⛵ Animações de erro e acerto mais visuais
  useEffect(() => {
    if (animacao === "erro") {
      document.body.classList.add("pirata-erro-tela");
      const timeout = setTimeout(() => document.body.classList.remove("pirata-erro-tela"), 300);
      return () => clearTimeout(timeout);
    }
  }, [animacao]);

  // Mantém o return original do usuário
  return (
    <div className="jogo-pirata-container">
      <header className="jogo-header-pirata">
        <button className="botao-voltar-pirata" onClick={() => (window.location.href = "/")}>
          ⮜ 
        </button>

        <div className="barra-progresso-pirata">
          <div className="preenchimento-pirata" style={{ width: `${progressoAtual}%` }}></div>
        </div>

        <button className="botao-som-pirata" onClick={() => setSomAtivo(!somAtivo)}>
          {somAtivo ? "♫" : "🔇"}
        </button>
      </header>

      <div className="jogo-pirata-area">
        <div className="tabuleiro-container-pirata">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={`casa ${i < posicao ? "passada" : ""} ${i === posicao ? "ativa" : ""}`}
            >
              {i === 11 && <img src={TesouroImg} alt="Tesouro" className="tesouro-casa-pirata" />}
            </div>
          ))}

          <img
            src={NavioImg}
            alt="Navio"
            className={`icone-pirata ${animacao}`}
            style={{ top: `${navioStyle.top}px`, left: `${navioStyle.left}px` }}
          />
        </div>

        {!jogoIniciado && !fimDeJogo && (
          <button className="botao-comecar-pirata" onClick={iniciarJogo}>
            JOGAR
          </button>
        )}

        {jogoIniciado && mostrarPergunta && !fimDeJogo && (
          <div className={`pergunta-flutuante-pirata ${animacao}`}>
            <div className="conteudo-pergunta-pirata">
              <h3 className="titulo-pergunta-pirata">🏴‍☠️  Pergunta:</h3>
              <img src={perguntas[perguntaIndex].imagem} alt="Pergunta" className="img-pergunta-pirata" />
              <p className="texto-pergunta-pirata">{perguntas[perguntaIndex].pergunta}</p>
              <div className="divisor-pirata"></div>
              <h4 className="titulo-respostas-pirata">Respostas:</h4>
              <div className="opcoes-pirata">
                {perguntas[perguntaIndex].opcoes.map((op, i) => (
                  <button key={i} className="botao-resposta-pirata" onClick={() => responder(i)}>
                    {op}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {fimDeJogo && (
          <div className="modal-vitoria-pirata">
            <div className="modal-fundo-pirata"></div>
            <div className="pergaminho-vitoria-pirata">
              <div className="pergaminho-topo-pirata"></div>
              <div className="conteudo-pergaminho-pirata">
                <h2 className="titulo-vitoria-pirata">
                  🏴‍☠️ Parabéns, você encontrou o tesouro! 💰
                </h2>
                <div className="imagem-tesouro-container">
                  <img src={TesouroImg} alt="Tesouro" className="imagem-tesouro-pirata" />
                </div>
                <button className="botao-vitoria-pirata" onClick={iniciarJogo}>
                  Jogar novamente
                </button>
              </div>
              <div className="pergaminho-rodape-pirata"></div>
            </div>
          </div>
        )}

        {derrota && (
          <div className="modal-derrota-pirata">
            <div className="modal-fundo-pirata"></div>
            <div className="conteudo-derrota-pirata">
              <h2>💀 Você perdeu! 💀</h2>
              <button className="botao-comecar-pirata" onClick={() => (window.location.href = "/game/6")}>
                Começar jogo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
