import React, { useEffect, useState, useRef } from "react";
import '../styles/Anagrama.css';
import AVANCA from '../assets/ANAGRAMA/AVANCA.mp3';
import ACERTOU from '../assets/ANAGRAMA/POP.mp3';
import ERROU from '../assets/ANAGRAMA/ERROU.mp3';
import CARD from '../assets/ANAGRAMA/CARD4.png';
import VITORIA from '../assets/ANAGRAMA/WIN.mp3';
import TROFEU from '../assets/ANAGRAMA/AUSTRONAUTA.gif';
import PREMIO from '../assets/ANAGRAMA/POSITIVO.png';
import NEGATIVO from '../assets/ANAGRAMA/NEGATIVO.png';

const palavras = [
  { dica: "Se usa para limpar os dentes", palavra: "ESCOVA" },
  { dica: "Usa-se junto da escova", palavra: "CREME" },
  { dica: "Parte do corpo que mastiga", palavra: "DENTE" },
  { dica: "O profissional que cuida dos dentes", palavra: "DENTISTA" },
  { dica: "É usado para enxaguar a boca", palavra: "ENXAGUANTE" },
  { dica: "Parte branca do dente", palavra: "ESMALTE" },
  { dica: "Problema causado por cárie", palavra: "CAVIDADE" },
  { dica: "Usado para passar entre os dentes", palavra: "FIO" },
  { dica: "Mantém a boca saudável", palavra: "HIGIENE" },
  { dica: "Deve-se escovar após as refeições", palavra: "REFEICAO" },
];

export default function AnagramaJogo() {
  const [indicePalavra, setIndicePalavra] = useState(0);
  const [resposta, setResposta] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [cartasSelecionadas, setCartasSelecionadas] = useState([]);
  const [completou, setCompletou] = useState(false);
  const [pontuacao, setPontuacao] = useState(0);
  const [somAtivo, setSomAtivo] = useState(true);
  const [mostrarPremio, setMostrarPremio] = useState(false);
  const [mostrarErro, setMostrarErro] = useState(false);
  const palavraAtual = palavras[indicePalavra].palavra;
  const dicaAtual = palavras[indicePalavra].dica;
  const totalPalavras = palavras.length;
  const [letrasEmbaralhadas, setLetrasEmbaralhadas] = useState([]);
  const audioAcertoRef = useRef(new Audio(ACERTOU));
  const audioErroRef = useRef(new Audio(ERROU));
  const audioParabensRef = useRef(new Audio(AVANCA));
  const audioVitoriaRef = useRef(new Audio(VITORIA));
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    const embaralhadas = [...palavraAtual].sort(() => Math.random() - 0.5);
    setLetrasEmbaralhadas(embaralhadas);
    setResposta([]);
    setCartasSelecionadas([]);
    setMensagem("");
    setCompletou(false);
  }, [palavraAtual]);

  function vereficarLetra(letra, index) {
    if (completou) return;

    const proximaLetra = palavraAtual[resposta.length];
    if (letra === proximaLetra) {
      const novaResposta = [...resposta, letra];
      setResposta(novaResposta);
      setCartasSelecionadas((prev) => [...prev, index]);
      setPontuacao((prev) => prev + 5);

      if (somAtivo) {
        audioAcertoRef.current.pause();
        audioAcertoRef.current.currentTime = 0;
        audioAcertoRef.current.play();
      }

      if (novaResposta.length === palavraAtual.length) {
        setCompletou(true);
        setMostrarPremio(true);
        setTimeout(() => setMostrarPremio(false), 980);

        if (indicePalavra + 1 < palavras.length) {
          setMensagem("Parabéns!");
          if (somAtivo) {
            audioParabensRef.current.pause();
            audioParabensRef.current.currentTime = 0;
            audioParabensRef.current.play().catch(() => {});
          }
        } else {
          setMensagem("Parabéns! Você completou todas as palavras!");
          setTimeout(() => {
            if (somAtivo) {
              audioVitoriaRef.current.pause();
              audioVitoriaRef.current.currentTime = 0;
              audioVitoriaRef.current.play().catch(() => {});
            }
            setMostrarModal(true);
          }, 2000);
        }
      }
    } else {
      if (somAtivo) {
        audioErroRef.current.pause();
        audioErroRef.current.currentTime = 0;
        audioErroRef.current.play();
      }
      setMostrarErro(true);
      setTimeout(() => setMostrarErro(false), 900);
    }
  }

  function proximaPalavra() {
    if (indicePalavra + 1 < palavras.length) {
      setIndicePalavra(indicePalavra + 1);
      setResposta([]);
      setMensagem("");
      setCompletou(false);
      setCartasSelecionadas([]);
    } else {
      setCompletou(true);
      setMensagem("Fim de jogo!");
      if (somAtivo) {
        audioVitoriaRef.current.pause();
        audioVitoriaRef.current.currentTime = 0;
        audioVitoriaRef.current.play();
      }
      setMostrarModal(true);
    }
  }

  function reiniciarJogo() {
    setIndicePalavra(0);
    setResposta([]);
    setMensagem("");
    setCartasSelecionadas([]);
    setPontuacao(0);
    setCompletou(false);
  }

  return (
    <div className="anagrama-jogo-container">
      <div className="anagrama-jogo-content">
        {/* HEADER */}
        <div className="anagrama-jogo-header">
          <div className="anagrama-header-left">
            <button
              className="anagrama-footer-btn-sair"
              onClick={() => (window.location.href = "/")}
            >
              ⮜ 
            </button>
            <button
              className="anagrama-footer-btn-reiniciar"
              onClick={reiniciarJogo}
            >
              🗘
            </button>
          </div>

          <div className="anagrama-header-center">
            <span className="anagrama-header-progresso">
              PALAVRA {indicePalavra + 1}/{totalPalavras}
            </span>
          </div>

          <div className="anagrama-header-right">
            <span className="anagrama-header-pontuacao">⭐ {pontuacao}</span>
            <button
              onClick={() => setSomAtivo((s) => !s)}
              className="anagrama-header-btn-som"
              aria-label="Ativar ou desativar sons"
            >
              {somAtivo ? "🔊" : "🔇"}
            </button>
          </div>
        </div>

        {/* ÁREA DO JOGO */}
        <div className="anagrama-jogo-area">
          <div className="anagrama-jogo-dica">
            <h2>DICA: {dicaAtual}</h2>
          </div>

          <div className="anagrama-jogo-letras">
            {letrasEmbaralhadas.map((letra, index) => (
              <button
                key={index}
                className={`anagrama-letra-btn ${
                  cartasSelecionadas.includes(index) ? "movendo usada" : ""
                }`}
                onClick={() => vereficarLetra(letra, index)}
                disabled={completou || cartasSelecionadas.includes(index)}
                style={{ backgroundImage: `url(${CARD})` }}
              >
                {letra}
              </button>
            ))}
          </div>

          <div className="anagrama-jogo-resposta">
            {palavraAtual.split("").map((_, index) => (
              <div key={index} className="anagrama-resposta-letra-container">
                {resposta[index] ? (
                  <div
                    className="anagrama-carta-movida"
                    style={{
                      backgroundImage: `url(${CARD})`,
                      textAlign: "center",
                    }}
                  >
                    {resposta[index]}
                  </div>
                ) : (
                  "_"
                )}
              </div>
            ))}
          </div>

          <div className="anagrama-proxima-container">
            <button
              className={`anagrama-proxima-btn ${
                completou ? "ativo" : "inativo"
              }`}
              onClick={proximaPalavra}
              disabled={!completou}
            >
              🢥
            </button>
          </div>
        </div>
      </div>

      {/* MODAL DE VITÓRIA */}
      {mostrarModal && (
        <div className="anagrama-modal-vitoria">
          <div className="anagrama-modal-content">
            <img
              src={TROFEU}
              alt="Trófeu Vitória"
              className="anagrama-modal-image"
            />
            <h2 className="anagrama-modal-mensagem">{mensagem}</h2>
            <p className="anagrama-modal-pontuacao">
              Sua pontuação final: {pontuacao}
            </p>
            <button
              className="anagrama-modal-btn-voltar"
              onClick={() => {
                reiniciarJogo();
                setMostrarModal(false);
              }}
            >
              VOLTAR AO JOGO
            </button>
          </div>
        </div>
      )}

      {/* ANIMAÇÕES */}
      {mostrarPremio && (
        <div className="anagrama-premio-container">
          <img src={PREMIO} alt="Premio Gif" className="anagrama-premio-gif" />
        </div>
      )}

      {mostrarErro && (
        <div className="anagrama-erro-container">
          <img src={NEGATIVO} alt="Negativo gif" className="anagrama-erro-img" />
        </div>
      )}
    </div>
  );
}
