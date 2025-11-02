import React, { useEffect, useRef, useState } from "react";
import "../styles/JogoMemoria.css";

import IMG1 from '../assets/JogoMemoria/1.png';
import IMG2 from '../assets/JogoMemoria/2.png';
import IMG3 from '../assets/JogoMemoria/3.png';
import IMG4 from '../assets/JogoMemoria/4.png';
import IMG5 from '../assets/JogoMemoria/5.png';
import IMG6 from '../assets/JogoMemoria/6.png';
import medal from '../assets/JogoMemoria/TROFEU.png';
import duvida from '../assets/JogoMemoria/carta.png';
import flipSound from "../assets/JogoMemoria/flipCard.wav";
import matchSound from "../assets/JogoMemoria/match.mp3";
import errorSound from "../assets/JogoMemoria/error.mp3";
import CERTO from '../assets/JogoMemoria/POSITIVO.png';
import NEGATIVO from '../assets/JogoMemoria/NEGATIVO.png';
import soundVitoria from '../assets/JogoMemoria/SUCESSO.mp3';

export default function JogoMemoria({
    aoSair = () => {},
    efeitosAtivos: efeitosIniciais = true
}) {
    const imagens = [IMG1, IMG2, IMG3, IMG4, IMG5, IMG6];

    function montarBaralho(imgs) {
        const baralho = imgs.flatMap((img, idx) => [
            { uid: `${idx}-a`, idPar: idx, img, combinado: false, virado: false },
            { uid: `${idx}-b`, idPar: idx, img, combinado: false, virado: false },
        ]);

        for (let i = baralho.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [baralho[i], baralho[j]] = [baralho[j], baralho[i]];
        }
        return baralho;
    }

    const [baralho, setBaralho] = useState(() => montarBaralho(imagens));
    const [primeiroIndice, setPrimeiroIndice] = useState(null);
    const [segundoIndice, setSegundoIndice] = useState(null);
    const [desabilitado, setDesabilitado] = useState(false);
    const [paresCombinados, setParesCombinados] = useState(0);
    const [movimentos, setMovimentos] = useState(0);
    const [mostrarVitoria, setMostrarVitoria] = useState(false);
    const [efeitosAtivos, setEfeitosAtivos] = useState(efeitosIniciais);
    const [mostarAcerto, setMostarAcerto] = useState(false);
    const [mostrarErro, setMostarErro] = useState(false);

    // refs para audios
    const flipRef = useRef(null);
    const matchRef = useRef(null);
    const errorRef = useRef(null);
    const victoryRef = useRef(null);
    const timeoutRef = useRef(null);
    const animTimeoutRef = useRef(null);

    // detecta vitória com atraso para exibir modal e tocar som
    useEffect(() => {
        if (paresCombinados === baralho.length / 2) {
            const delay = setTimeout(() => {
                if (efeitosAtivos && victoryRef.current) {
                    victoryRef.current.currentTime = 0;
                    victoryRef.current.play().catch(() => {});
                }
                setMostrarVitoria(true);
            }, 1160); 
            return () => clearTimeout(delay);
        }
    }, [paresCombinados, baralho.length, efeitosAtivos]);

    // cleanup timeouts
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
        };
    }, []);

    const resetEscolhas = (novoBaralho = null) => {
        setPrimeiroIndice(null);
        setSegundoIndice(null);
        setDesabilitado(false);
        if (novoBaralho) setBaralho(novoBaralho);
    };

    const handleCartaClick = (i) => {
        if (desabilitado) return;
        const carta = baralho[i];
        if (carta.virado || carta.combinado) return;

        const novoBaralho = baralho.map((c, idx) => (idx === i ? { ...c, virado: true } : c));
        setBaralho(novoBaralho);

        if (efeitosAtivos && flipRef.current) {
            flipRef.current.currentTime = 0;
            flipRef.current.play().catch(() => {});
        }

        if (primeiroIndice === null) {
            setPrimeiroIndice(i);
            return;
        }
        if (segundoIndice !== null) return;

        setSegundoIndice(i);
        setDesabilitado(true);
        setMovimentos((m) => m + 1);

        // aguarda 700ms para mostrar a segunda carta antes de checar
        timeoutRef.current = setTimeout(() => {
            const primeira = novoBaralho[primeiroIndice];
            const segunda = novoBaralho[i];

            if (primeira.idPar === segunda.idPar) {
                // acertou 
                const atualizado = novoBaralho.map((c) => (c.idPar === primeira.idPar ? { ...c, combinado: true } : c));
                setBaralho(atualizado);
                setParesCombinados((m) => m + 1);
                if (efeitosAtivos && matchRef.current) {
                    matchRef.current.currentTime = 0;
                    matchRef.current.play().catch(() => {});
                }

                // mostrar animação de acerto com delay
                animTimeoutRef.current = setTimeout(() => {
                    setMostarAcerto(true);
                    setTimeout(() => setMostarAcerto(false), 900);
                }, 50);

            } else {
                // errou - vira a carta
                const atualizado = novoBaralho.map((c, idx) =>
                    idx === primeiroIndice || idx === i ? { ...c, virado: false } : c
                );
                setBaralho(atualizado);
                if (efeitosAtivos && errorRef.current) {
                    errorRef.current.currentTime = 0;
                    errorRef.current.play().catch(() => {});
                }

                // mostrar animação de erro com delay
                animTimeoutRef.current = setTimeout(() => {
                    setMostarErro(true);
                    setTimeout(() => setMostarErro(false), 900);
                }, 50);
            }
            resetEscolhas();
        }, 700);
    };

    const reiniciarJogo = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setBaralho(montarBaralho(imagens));
        setParesCombinados(0);
        setMovimentos(0);
        resetEscolhas();
        setMostrarVitoria(false);
        setMostarAcerto(false);
        setMostarErro(false);
    };

    return (
        <div className="jogoMemoria-container">
            <audio ref={flipRef} src={flipSound} preload="auto" />
            <audio ref={matchRef} src={matchSound} preload="auto" />
            <audio ref={errorRef} src={errorSound} preload="auto" />
            <audio ref={victoryRef} src={soundVitoria} preload="auto" />

            <div className="jogoMemoria-content">

            {/* Topbar */}
          <div className="jogoMemoria-topbar">
            <div className="jogoMemoria-container-topo">
            {/* Botões no lugar da logo e título */}
            <button className="jogoMemoria-btn-sair" onClick={() => { window.location.href = "/" }}>
              ⮜
            </button>

            <button className="jogoMemoria-btn" onClick={reiniciarJogo}>
              🗘
            </button>
            </div>

            <div className="stats">Movimentos: {movimentos}</div>
            <div className="stats">Pares: {paresCombinados}/{baralho.length / 2}</div>
  
            <button 
              className="jogoMemoria-musicaON-OFF" 
              onClick={() => setEfeitosAtivos((prev) => !prev)} 
            >
            {efeitosAtivos ? "🔊" : "🔇"}
            </button>
          </div>

                {/* Topbar */}
           

          {/* Grid das cartas */}
           <div className="jogoMemoria-grid">
           {baralho.map((carta, idx) => (
           <button
            key={carta.uid}
            className={`carta-memoria ${carta.virado || carta.combinado ? "flipped" : ""}`}
            onClick={() => handleCartaClick(idx)}
            disabled={carta.combinado}
            aria-label={carta.virado ? "Carta virada" : "Carta fechada"}
              >
            <div className="carta-inner">
            <div className="carta-front">
             <img src={duvida} alt="Carta frente" />
            </div>
            <div className="carta-back">
              <img src={carta.img} alt="figura" />
           </div>
           </div>
           </button>
          ))}
         </div>
        </div>

            {/* Vitória */}
        {mostrarVitoria && (
          <div className="jogoMemoria-vitoria">
            <div className="vitoria-carta">
              <img src={medal} alt="Vitória" className="modalVitoria-img" />
              <h2>Você venceu!</h2>
              <p>Movimentos: {movimentos}</p>
            <div className="vitoria-acoes">
            <button onClick={() => window.location.href = "/game/1"} >
             JOGAR
            </button>
             </div>
           </div>
          </div>
        )}

          {/* Modal de acerto */}
          {mostarAcerto && (
            <div className="modal-acerto">
              <img src={CERTO} alt="Acerto img" className="modal-acerto-img" />
            </div>
          )}

            {/* Modal de erro */}
          {mostrarErro && (
            <div className="modal-erro">
              <img src={NEGATIVO} alt="Erro img" className="modal-erro-img" />
            </div>
          )}
      </div>
    );
}
