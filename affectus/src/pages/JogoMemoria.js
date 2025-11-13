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
import CEREBRO from '../assets/JogoMemoria/ARTISTA.png'; // conquista 1
import TROFEU from '../assets/JogoMemoria/SARGENTO.png'; // conquista 2

export default function JogoMemoria({
    aoSair = () => {},
    efeitosAtivos: efeitosIniciais = true
}) {
    // ARRAY DE IMAGENS DO JOGO
    const imagens = [IMG1, IMG2, IMG3, IMG4, IMG5, IMG6];

    // FUNCAO PARA MONTAR O BARALHO COM PARES E EMBARALHAR
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

    // ESTADOS DO JOGO
    const [baralho, setBaralho] = useState(() => montarBaralho(imagens)); // CONTROLE DO BARALHO
    const [primeiroIndice, setPrimeiroIndice] = useState(null); // PRIMEIRA CARTA SELECIONADA
    const [segundoIndice, setSegundoIndice] = useState(null); // SEGUNDA CARTA SELECIONADA
    const [desabilitado, setDesabilitado] = useState(false); // BLOQUEIO DE CLIQUE
    const [paresCombinados, setParesCombinados] = useState(0); // CONTROLE DE PARES ENCONTRADOS
    const [movimentos, setMovimentos] = useState(0); // CONTROLE DE MOVIMENTOS
    const [mostrarVitoria, setMostrarVitoria] = useState(false); // FLAG DE VITORIA
    const [efeitosAtivos, setEfeitosAtivos] = useState(efeitosIniciais); // FLAG PARA SOMES
    const [mostarAcerto, setMostarAcerto] = useState(false); // FLAG PARA MODAL DE ACERTO
    const [mostrarErro, setMostarErro] = useState(false); // FLAG PARA MODAL DE ERRO
    const [mostrarConquista, setMostrarConquista] = useState(""); // FLAG PARA MODAL DE CONQUISTA

    // REFS PARA AUDIO E TIMEOUTS
    const flipRef = useRef(null); // AUDIO DE FLIP
    const matchRef = useRef(null); // AUDIO DE MATCH
    const errorRef = useRef(null); // AUDIO DE ERRO
    const victoryRef = useRef(null); // AUDIO DE VITORIA
    const timeoutRef = useRef(null); // TIMEOUT PARA LOGICA
    const animTimeoutRef = useRef(null); // TIMEOUT PARA ANIMACAO

    // USEEFFECT PARA DETECTAR VITORIA
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

    // USEEFFECT PARA CONQUISTAS DE 3 E 6 PARES
    useEffect(() => {
        if (paresCombinados === 3) {
            setMostrarConquista("cerebro");
            setTimeout(() => setMostrarConquista(""), 3000);
        } else if (paresCombinados === 6) {
            setMostrarConquista("trofeu");
            setTimeout(() => setMostrarConquista(""), 3000);
        }
    }, [paresCombinados]);

    // USEEFFECT PARA LIMPAR TIMEOUTS AO DESTRUIR COMPONENTE
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
        };
    }, []);

    // FUNCAO PARA RESETAR ESCOLHAS
    const resetEscolhas = (novoBaralho = null) => {
        setPrimeiroIndice(null);
        setSegundoIndice(null);
        setDesabilitado(false);
        if (novoBaralho) setBaralho(novoBaralho);
    };

    // FUNCAO PARA TRATAR CLIQUE NA CARTA
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

        timeoutRef.current = setTimeout(() => {
            const primeira = novoBaralho[primeiroIndice];
            const segunda = novoBaralho[i];

            if (primeira.idPar === segunda.idPar) {
                const atualizado = novoBaralho.map((c) =>
                    c.idPar === primeira.idPar ? { ...c, combinado: true } : c
                );
                setBaralho(atualizado);
                setParesCombinados((m) => m + 1);
                if (efeitosAtivos && matchRef.current) {
                    matchRef.current.currentTime = 0;
                    matchRef.current.play().catch(() => {});
                }
                animTimeoutRef.current = setTimeout(() => {
                    setMostarAcerto(true);
                    setTimeout(() => setMostarAcerto(false), 900);
                }, 50);
            } else {
                const atualizado = novoBaralho.map((c, idx) =>
                    idx === primeiroIndice || idx === i ? { ...c, virado: false } : c
                );
                setBaralho(atualizado);
                if (efeitosAtivos && errorRef.current) {
                    errorRef.current.currentTime = 0;
                    errorRef.current.play().catch(() => {});
                }
                animTimeoutRef.current = setTimeout(() => {
                    setMostarErro(true);
                    setTimeout(() => setMostarErro(false), 900);
                }, 50);
            }
            resetEscolhas();
        }, 700);
    };

    // FUNCAO PARA REINICIAR O JOGO
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
            {/* AUDIOS DO JOGO */}
            <audio ref={flipRef} src={flipSound} preload="auto" />
            <audio ref={matchRef} src={matchSound} preload="auto" />
            <audio ref={errorRef} src={errorSound} preload="auto" />
            <audio ref={victoryRef} src={soundVitoria} preload="auto" />

            <div className="jogoMemoria-content">

                {/* BARRA SUPERIOR COM BOTÕES E ESTATS */}
                <div className="jogoMemoria-topbar">
                    <div className="jogoMemoria-container-topo">
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

                {/* GRID DE CARTAS */}
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

            {/* MODAL DE VITORIA */}
            {mostrarVitoria && (
                <div className="jogoMemoria-vitoria">
                    <div className="vitoria-carta">
                        <img src={medal} alt="Vitoria" className="modalVitoria-img" />
                        <h2>Voce venceu!</h2>
                        <p>Movimentos: {movimentos}</p>
                        <div className="vitoria-acoes">
                            <button onClick={() => window.location.href = "/game/1"} >
                                JOGAR
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL DE ACERTO */}
            {mostarAcerto && (
                <div className="modal-acerto">
                    <img src={CERTO} alt="Acerto img" className="modal-acerto-img" />
                </div>
            )}

            {/* MODAL DE ERRO */}
            {mostrarErro && (
                <div className="modal-erro">
                    <img src={NEGATIVO} alt="Erro img" className="modal-erro-img" />
                </div>
            )}

            {/* MODAL DE CONQUISTAS */}
            {mostrarConquista === "cerebro" && (
                <div className="memoria-conquista-pop">
                    <img src={CEREBRO} alt="Cerebro Rapido" className="memoria-conquista-img" />
                    <p className="memoria-conquista-texto"> ARTISTA NATO: VOCE TEM TALENTO!</p>
                </div>
            )}

            {mostrarConquista === "trofeu" && (
                <div className="memoria-conquista-pop">
                    <img src={TROFEU} alt="Mestre da Memoria" className="memoria-conquista-img" />
                    <p className="memoria-conquista-texto">BRAVO SOLDADO: VOCE TEM BRAVURA!</p>
                </div>
            )}
        </div>
    );
}
