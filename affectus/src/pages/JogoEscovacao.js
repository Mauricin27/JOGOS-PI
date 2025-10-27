import React, { useEffect, useRef, useState } from "react";
import "../styles/JogoEscovacao.css";
import { Sparkles, Star } from "lucide-react";

import meninaLimpa1 from "../assets/ESCOVACAO/11.png";
import meninaLimpa2 from "../assets/ESCOVACAO/22.png";
import meninaSuja1 from "../assets/ESCOVACAO/33.png";
import meninaSuja2 from "../assets/ESCOVACAO/44.png";

import escova from "../assets/ESCOVACAO/ESCOVA.png";
import enxaguante from "../assets/ESCOVACAO/MENTA.png";
import brilhoSom from "../assets/ESCOVACAO/BRILHO.mp3";
import refrescanteSom from "../assets/ESCOVACAO/BRILHO2.mp3";
import escovandoSom from "../assets/ESCOVACAO/ESCOVANDO.mp3";

export default function JogoEscovacao() {
  const [jogoIniciado, setJogoIniciado] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [olhosAbertos, setOlhosAbertos] = useState(true);
  const [dentesLimpos, setDentesLimpos] = useState(false);
  const [somAtivo, setSomAtivo] = useState(true);
  const [escovaSelecionada, setEscovaSelecionada] = useState(false);
  const [escovaPos, setEscovaPos] = useState({ x: 0, y: 0 });
  const [manchas, setManchas] = useState([]);
  const [mostrarBrilho, setMostrarBrilho] = useState(false);
  const [bolhas, setBolhas] = useState([]);
  const [fumaca, setFumaca] = useState([]);
  const [enxaguanteAtivo, setEnxaguanteAtivo] = useState(false);
  const [enxaguanteSelecionado, setEnxaguanteSelecionado] = useState(false);
  const [mostrarRefrescante, setMostrarRefrescante] = useState(false);
  const [agua, setAgua] = useState([]);
  const [enxaguantePos, setEnxaguantePos] = useState({ x: 0, y: 0 });

  const areaRef = useRef(null);
  const brilhoPlayedRef = useRef(false);
  const escovandoAudioRef = useRef(null);
  const contatoCountRef = useRef(0);
  const refrescantePlayedRef = useRef(false);
  const aguaAudioRef = useRef(null);

  const classesTamanho = ["pequena", "media", "grande"];

  const iniciarJogo = () => {
    setJogoIniciado(true);
    setMostrarBrilho(false);
    setDentesLimpos(false);
    brilhoPlayedRef.current = false;
    contatoCountRef.current = 0;
    refrescantePlayedRef.current = false;
    gerarManchas();
    gerarFumaca();
  };

  const alternarSom = () => setSomAtivo((prev) => !prev);

  useEffect(() => {
    escovandoAudioRef.current = new Audio(escovandoSom);
    escovandoAudioRef.current.volume = 0.5;
    aguaAudioRef.current = new Audio(refrescanteSom);
    aguaAudioRef.current.loop = true;
    aguaAudioRef.current.volume = 0.35;
  }, []);

  // Piscar olhos
  useEffect(() => {
    if (!jogoIniciado) return;
    const intervalo = setInterval(() => {
      setOlhosAbertos(false);
      setTimeout(() => setOlhosAbertos(true), 300);
    }, 3000);
    return () => clearInterval(intervalo);
  }, [jogoIniciado]);

  const gerarManchas = () => {
    const novas = Array.from({ length: 12 }).map(() => ({
      id: Math.random(),
      x: 50 + Math.random() * 150,
      y: 100 + Math.random() * 50,
      sizeClass: classesTamanho[Math.floor(Math.random() * classesTamanho.length)],
      vida: 40,
    }));
    setManchas(novas);
  };

  const gerarFumaca = () => {
    const novasFumacas = Array.from({ length: 15 }).map(() => ({
      id: Math.random(),
      x: 220 + Math.random() * 50,
      y: 80 + Math.random() * 30,
      sizeClass: classesTamanho[Math.floor(Math.random() * classesTamanho.length)],
      vida: 60,
    }));
    setFumaca(novasFumacas);
  };

  // Detecta fim da escovação
  useEffect(() => {
    if (!jogoIniciado) return;
    if (manchas.length === 0 && !brilhoPlayedRef.current) {
      brilhoPlayedRef.current = true;
      setMostrarBrilho(true);
      setDentesLimpos(true);
      if (somAtivo) new Audio(brilhoSom).play().catch(() => {});
      setTimeout(() => setMostrarBrilho(false), 2500);
    }
  }, [manchas, jogoIniciado, somAtivo]);

  // Movimento da escova
  useEffect(() => {
    const marginTop = 100;
    const marginLeft = 110;
    const escovaLargura = 80;

    const handleMouseMove = (e) => {
      if (!escovaSelecionada || !areaRef.current) return;
      const rect = areaRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - escovaLargura / 2;
      const y = e.clientY - rect.top - escovaLargura / 2;
      setEscovaPos({ x, y });

      setManchas((prev) => {
        let algumColidiu = false;
        const novas = prev
          .map((mancha) => {
            const distancia = Math.hypot(
              mancha.x + marginLeft - x,
              mancha.y + marginTop - y
            );
            if (distancia <= escovaLargura / 2) {
              algumColidiu = true;
              const bolhaId = Math.random();
              setBolhas((prevBolhas) => [
                ...prevBolhas,
                { id: bolhaId, x, y, tamanho: Math.random() * 16 + 16 },
              ]);
              setTimeout(
                () =>
                  setBolhas((prevBolhas) =>
                    prevBolhas.filter((b) => b.id !== bolhaId)
                  ),
                1000
              );
              return { ...mancha, vida: mancha.vida - 1 };
            }
            return mancha;
          })
          .filter((m) => m.vida > 0);

        if (somAtivo && contatoCountRef.current < 2 && algumColidiu) {
          contatoCountRef.current += 1;
          new Audio(escovandoSom).play().catch(() => {});
        }
        return novas;
      });
    };

    const handleClickAnywhere = () => {
      if (escovaSelecionada) setEscovaSelecionada(false);
    };

    if (escovaSelecionada) {
      document.body.classList.add("cursor-none");
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("click", handleClickAnywhere);
    } else {
      document.body.classList.remove("cursor-none");
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClickAnywhere);
      document.body.classList.remove("cursor-none");
    };
  }, [escovaSelecionada, somAtivo]);


  // Movimento do enxaguante (arrastar e apagar fumaça)
  // Movimento do enxaguante (arrastar e apagar fumaça)
useEffect(() => {
  if (!enxaguanteSelecionado) return;

  const area = areaRef.current;
  if (!area) return;

  const enxaguanteLargura = 80;

  const handleMouseMove = (e) => {
    const rect = area.getBoundingClientRect();
    const x = e.clientX - rect.left - enxaguanteLargura / 2;
    const y = e.clientY - rect.top - enxaguanteLargura / 2;
    setEnxaguantePos({ x, y });

    let tocouFumaca = false;

    setFumaca((prevFumaca) => {
      const novas = prevFumaca
        .map((f) => {
          const fx = f.x - 30; // Ajuste de margem
          const fy = f.y + 130; // Ajuste de margem
          const distancia = Math.hypot(fx - x, fy - y);

          if (distancia <= enxaguanteLargura / 2) {
            tocouFumaca = true;
            return { ...f, vida: f.vida - 1 };
          }
          return f;
        })
        .filter((f) => f.vida > 0);

      // Só tocar o som quando todas as fumacas forem removidas
      if (novas.length === 0 && !refrescantePlayedRef.current) {
        refrescantePlayedRef.current = true;
        setMostrarRefrescante(true);
        if (somAtivo) {
          aguaAudioRef.current?.play().catch(() => {});
        }
        setTimeout(() => setMostrarRefrescante(false), 3000);
      }

      if (tocouFumaca) {
        const id = Math.random();
        setAgua((prev) => [...prev, { id, x, y }]);
        setTimeout(() => {
          setAgua((prev) => prev.filter((a) => a.id !== id));
        }, 600);
      }

      return novas;
    });
  };

  const handleClickAnywhere = () => {
    setEnxaguanteSelecionado(false);
    setEnxaguanteAtivo(false);
    aguaAudioRef.current?.pause();
    aguaAudioRef.current.currentTime = 0;
  };

  document.body.classList.add("cursor-none");
  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("click", handleClickAnywhere);

  return () => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("click", handleClickAnywhere);
    document.body.classList.remove("cursor-none");
    aguaAudioRef.current?.pause();
    aguaAudioRef.current.currentTime = 0;
  };
}, [enxaguanteSelecionado, somAtivo]);

    
 

  const handleSelecionarEscova = (e) => {
    e.stopPropagation();
    setEscovaSelecionada((prev) => !prev);
    setEnxaguanteSelecionado(false);
    setEnxaguanteAtivo(false);
  };

  const handleSelecionarEnxaguante = (e) => {
    e.stopPropagation();
    setEscovaSelecionada(false);
    setEnxaguanteSelecionado(true);
    setEnxaguanteAtivo(true);
  };

  const imagemMenina = dentesLimpos
    ? olhosAbertos
      ? meninaLimpa1
      : meninaLimpa2
    : olhosAbertos
    ? meninaSuja1
    : meninaSuja2;

  return (
    <div className="escovacao-container">
      {!jogoIniciado ? (
        <div className="escovacao-menu">
          <h1 className="escovacao-titulo">Jogo da Escovação</h1>
          <button className="escovacao-btn jogar" onClick={iniciarJogo}>
            Jogar
          </button>
          <button
            className="escovacao-btn sair"
            onClick={() => (window.location.href = "/")}
          >
            Sair
          </button>
        </div>
      ) : (
        <div className="escovacao-tela" ref={areaRef}>
          <header className="escovacao-header">
            <button
              className="escovacao-btn voltar"
              onClick={() => (window.location.href = "/")}
            >
              ⏴
            </button>
            <button
              className="escovacao-btn acessorios"
              onClick={() => setMostrarModal(true)}
            >
              Acessórios
            </button>
            <button className="escovacao-btn som" onClick={alternarSom}>
              {somAtivo ? "🔊" : "🔇"}
            </button>
          </header>

          <div className="escovacao-area">
            <div className="escovacao-menina-container">
              <img src={imagemMenina} alt="Menina" className="escovacao-menina" />

              {!dentesLimpos &&
                manchas.map((m) => (
                  <div
                    key={m.id}
                    className={`escovacao-mancha ${m.sizeClass}`}
                    style={{ left: `${m.x}px`, top: `${m.y}px` }}
                  />
                ))}

              {fumaca.map((f) => (
                <div
                  key={f.id}
                  className="escovacao-fumaca"
                  style={{
                    left: `${f.x}px`,
                    top: `${f.y}px`,
                    opacity: f.vida / 40,
                  }}
                />
              ))}

              {agua.map((a) => (
                <div
                  key={a.id}
                  className="escovacao-agua"
                  style={{ left: `${a.x}px`, top: `${a.y}px` }}
                />
              ))}

              {mostrarRefrescante && (
                <div className="escovacao-refrescante">
                  <Star className="estrela1" />
                  <Star className="estrela2" />
                  <Star className="estrela3" />
                </div>
              )}

              {bolhas.map((b) => (
                <div
                  key={b.id}
                  className="escovacao-bolha"
                  style={{
                    left: `${b.x}px`,
                    top: `${b.y}px`,
                    width: `${b.tamanho}px`,
                    height: `${b.tamanho}px`,
                  }}
                />
              ))}

              {mostrarBrilho && (
                <div className="escovacao-brilho">
                  <Sparkles className="escovacao-estrela estrela1" />
                  <Sparkles className="escovacao-estrela estrela2" />
                  <Sparkles className="escovacao-estrela estrela3" />
                </div>
              )}

              {escovaSelecionada && (
                <img
                  src={escova}
                  alt="escova"
                  className="escovacao-escova"
                  style={{
                    left: `${escovaPos.x}px`,
                    top: `${escovaPos.y}px`,
                    position: "absolute",
                    pointerEvents: "none",
                  }}
                />
              )}

              {enxaguanteAtivo && (
                <img
                  src={enxaguante}
                  alt="enxaguante"
                  className="escovacao-enxaguante"
                  style={{
                    left: `${enxaguantePos.x}px`,
                    top: `${enxaguantePos.y}px`,
                    position: "absolute",
                    pointerEvents: "none",
                  }}
                />
              )}
            </div>

            <div className="escovacao-icon-container">
              <div className="escovacao-icon-item">
                <img
                  src={escova}
                  alt="escova-icon"
                  className={`escovacao-icon ${
                    escovaSelecionada ? "selecionada" : ""
                  }`}
                  onClick={handleSelecionarEscova}
                />
                <p className="escovacao-icon-texto">Escovar</p>
              </div>

              <div className="escovacao-icon-item">
                <img
                  src={enxaguante}
                  alt="enxaguante-icon"
                  className={`escovacao-icon ${
                    enxaguanteSelecionado ? "selecionada" : ""
                  }`}
                  onClick={handleSelecionarEnxaguante}
                />
                <p className="escovacao-icon-texto">Enxaguar</p>
              </div>
            </div>
          </div>

          {mostrarModal && (
            <div className="escovacao-modal" onClick={() => setMostrarModal(false)}>
              <div
                className="escovacao-modal-conteudo"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="escovacao-modal-titulo">Acessórios do Jogo 🧼</h3>
                <div className="escovacao-modal-lista">
                  <div className="escovacao-modal-item">
                    <img src={escova} alt="escova" className="escovacao-modal-img" />
                    <p className="escovacao-modal-texto">
                      ESCOVA: Clique no ícone e mova o mouse sobre os dentes para limpar.
                    </p>
                  </div>
                  <div className="escovacao-modal-item">
                    <img
                      src={enxaguante}
                      alt="enxaguante"
                      className="escovacao-modal-img"
                    />
                    <p className="escovacao-modal-texto">
                      ENXAGUANTE: Passe o mouse sobre a fumaça para refrescar o hálito.
                    </p>
                  </div>
                </div>
                <button
                  className="escovacao-modal-btn-fechar"
                  onClick={() => setMostrarModal(false)}
                >
                  FECHAR
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
