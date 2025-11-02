import React, { useEffect, useRef, useState } from "react";
import "../styles/ArrastaSolta.css";
import escovar from '../assets/ARRASTA/escovar.png';
import fioDental from '../assets/ARRASTA/fio-dental.png';
import dentista from '../assets/ARRASTA/dentista.png';
import denteLIMPO from '../assets/ARRASTA/DENTE-LIMPO.png';
import DOCE from '../assets/ARRASTA/DOCES.png';
import DORMIR from '../assets/ARRASTA/DORMIR.png';
import ENXAGUAR from '../assets/ARRASTA/ENXAGUAR.png';
import FUMAR from '../assets/ARRASTA/FUMAR.png';
import naoIr from '../assets/ARRASTA/NAO-IR.png';
import lingua from '../assets/ARRASTA/LINGUA.png';
import SODA from '../assets/ARRASTA/SODA.png';
import SUJO from '../assets/ARRASTA/SUJO.png';
import escovaDente from '../assets/ARRASTA/ESCOVA-DENTE.png';
import morder from '../assets/ARRASTA/MORDER.png';
import ruimGif from '../assets/ARRASTA/RUIM.gif';
import bomGif from '../assets/ARRASTA/BOM.gif';
import otimoGif from '../assets/ARRASTA/OTIMO.gif';
import errouGif from '../assets/ARRASTA/errou.gif';
import popSound from '../assets/ARRASTA/DROPA.mp3';
import beepAcerto from '../assets/ARRASTA/ACERTA.mp3';
import beepErro from '../assets/ARRASTA/ERRA.mp3';

const HABITOS = [
  { id: 1, img: escovar, texto: "Escovar 3 vezes ao dia", correto: true },
  { id: 2, img: fioDental, texto: "Usar fio dental todo dia", correto: true },
  { id: 3, img: dentista, texto: "Ir ao dentista sempre", correto: true },
  { id: 4, img: ENXAGUAR, texto: "Enxaguar a boca depois de comer", correto: true },
  { id: 5, img: escovaDente, texto: "Escovar antes de dormir", correto: true },
  { id: 6, img: denteLIMPO, texto: "Manter os dentes limpos", correto: true },
  { id: 7, img: lingua, texto: "Escovar a língua todo dia", correto: true },
  { id: 8, img: DOCE, texto: "Comer doce e não escovar", correto: false },
  { id: 9, img: morder, texto: "Roer unha suja", correto: false },
  { id: 10, img: DORMIR, texto: "Dormir sem escovar", correto: false },
  { id: 11, img: SODA, texto: "Tomar refri todo dia", correto: false },
  { id: 12, img: FUMAR, texto: "Fumar faz mal", correto: false },
  { id: 13, img: SUJO, texto: "Não usar fio dental", correto: false },
  { id: 14, img: naoIr, texto: "Não ir ao dentista", correto: false },
];

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

export default function ArrastaSolta() {
  const [segundos, setSegundos] = useState(0);
  const [habitos, setHabitos] = useState(shuffle([...HABITOS]));
  const [certos, setCertos] = useState([]);
  const [errados, setErrados] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalResultado, setModalResultado] = useState({ msg: "", img: "" });
  const [sonsAtivos, setSonsAtivos] = useState(true);
  const [animacoes, setAnimacoes] = useState({});

  const audioPop = useRef(null);
  const audioAcerto = useRef(null);
  const audioErro = useRef(null);

  useEffect(() => {
    audioPop.current = new Audio(popSound);
    audioAcerto.current = new Audio(beepAcerto);
    audioErro.current = new Audio(beepErro);
  }, []);

  useEffect(() => {
    const intervalo = setInterval(() => setSegundos(s => s + 1), 1000);
    return () => clearInterval(intervalo);
  }, []);

  const formatarTempo = (s) => {
    const minutos = Math.floor(s / 60);
    const segundosRestantes = s % 60;
    return `${String(minutos).padStart(2, "0")}:${String(segundosRestantes).padStart(2, "0")}`;
  };

  const arrastar = (e, habito) => e.dataTransfer.setData("habitoId", habito.id);

  const soltar = (e, destino) => {
    e.preventDefault();
    const habitoId = parseInt(e.dataTransfer.getData("habitoId"));
    const habito = habitos.find(h => h.id === habitoId);
    if (!habito) return;

    if (destino === "certos") setCertos(prev => [...prev, habito]);
    else setErrados(prev => [...prev, habito]);

    setHabitos(prev => prev.filter(h => h.id !== habitoId));

    if (sonsAtivos && audioPop.current) {
      audioPop.current.currentTime = 0;
      audioPop.current.play();
    }
  };

  const permitirSoltar = (e) => e.preventDefault();

  const reiniciar = () => {
    setHabitos(shuffle([...HABITOS]));
    setCertos([]);
    setErrados([]);
    setSegundos(0);
    setModalAberto(false);
    setModalResultado({ msg: "", img: "" });
    setAnimacoes({});
  };

  const getResultadoPorPontuacao = (score) => {
    if (score >= 1 && score <= 5) return { msg: "OK, você precisa se dedicar mais!", img: ruimGif };
    if (score >= 6 && score <= 9) return { msg: "Muito bem, está indo no caminho certo!", img: bomGif };
    if (score >= 10) return { msg: "Excelente, estou orgulhoso de você!", img: otimoGif };
    return { msg: `Você acertou ${score} hábitos. Tente novamente!`, img: errouGif };
  };

  const handleEnviar = () => {
    let totalAcertos = 0;
    let totalErros = 0;
    let delay = 0;

    [...certos, ...errados].forEach(h => {
      const acertou = (h.correto && certos.includes(h)) || (!h.correto && errados.includes(h));

      if (acertou) totalAcertos++;
      else totalErros++;

      const classeAnimacao = acertou ? "acerto" : "erro";

      setTimeout(() => {
        setAnimacoes(prev => ({ ...prev, [h.id]: classeAnimacao }));

        if (sonsAtivos) {
          if (acertou) {
            audioAcerto.current.currentTime = 0;
            audioAcerto.current.play();
          } else {
            audioErro.current.currentTime = 0;
            audioErro.current.play();
          }
        }
      }, delay);
      delay += 500;
    });

    setTimeout(() => {
      const resultado = getResultadoPorPontuacao(totalAcertos);

      setModalResultado({
        msg: resultado.msg,
        img: resultado.img,
        acertos: totalAcertos,
        erros: totalErros,
        tempo: segundos
      });

      setModalAberto(true);
    }, delay + 500);
  };

  return (
    <div className="arrastaSolta-container">
      <header className="arrastaSolta-header">
        <div className="header-botoes">
          <button className="botao-sair-arrasta" onClick={() => window.location.href = "/"}> 🢀 </button>
          <button className="botao-reinicia-arrasta" onClick={reiniciar}> ↻ </button>
        </div>

        <span className="arrastaSolta-tempo">⏱ {formatarTempo(segundos)}</span>

          <button className="musicaAS-btn" onClick={() => setSonsAtivos(!sonsAtivos)}>
            {sonsAtivos ? "🔊" : "🔇"}
          </button>
      </header>

      {/* HABITOS EM CIMA */}
      <div className="campo-habitos">
        {habitos.map(h => (
          <div
            key={h.id}
            className={`habito ${animacoes[h.id] || ""}`}
            draggable
            onDragStart={(e) => arrastar(e, h)}
            onAnimationEnd={() => setAnimacoes(prev => ({ ...prev, [h.id]: "" }))}
          >
            <img src={h.img} className="habito-img" alt={h.texto} />
            <span className="habito-texto">{h.texto}</span>
          </div>
        ))}
      </div>

      {/* CAMPOS CERTO / ERRADO */}
      <div className="campos-destino">
        <div
          className="campo-destino-certos"
          onDrop={(e) => soltar(e, "certos")}
          onDragOver={permitirSoltar}
        >
          <h3>CERTO</h3>
          {certos.map(h => (
            <div
              key={h.id}
              className={`habito-solto ${animacoes[h.id] || ""}`}
              onAnimationEnd={() => setAnimacoes(prev => ({ ...prev, [h.id]: "" }))}
            >
              <img src={h.img} className="habito-img" alt={h.texto}/>
              <span className="habito-texto">{h.texto}</span>
            </div>
          ))}
        </div>

        <div
          className="campo-destino-errados"
          onDrop={(e) => soltar(e, "errados")}
          onDragOver={permitirSoltar}
        >
          <h3>ERRADO</h3>
          {errados.map(h => (
            <div
              key={h.id}
              className={`habito-solto ${animacoes[h.id] || ""}`}
              onAnimationEnd={() => setAnimacoes(prev => ({ ...prev, [h.id]: "" }))}
            >
              <img src={h.img} className="habito-img" alt={h.texto}/>
              <span className="habito-texto">{h.texto}</span>
            </div>
          ))}
        </div>
      </div>

      {/* BOTÃO ENVIAR */}
      <div className="botoes-jogo">
        <button className="botao-enviar-arrasta" onClick={handleEnviar}>ENVIAR</button>
      </div>

      {/* MODAL */}
      {modalAberto && (
        <div className="modalArrasta">
          <div className="modalArrasta-content">
            <button className="fechar-arrastaModal" onClick={() => setModalAberto(false)}>X</button>
            <img src={modalResultado.img} alt="Resultado" className="modal-img"/>
            <h2>{modalResultado.msg}</h2>
            <p>✔ Acertos: {modalResultado.acertos}</p>
            <p>❌ Erros: {modalResultado.erros}</p>
            <p>⏱ Tempo total: {formatarTempo(modalResultado.tempo || 0)}</p>
            <button onClick={reiniciar}>JOGAR NOVAMENTE</button>
          </div>
        </div>
      )}
    </div>
  );
}
