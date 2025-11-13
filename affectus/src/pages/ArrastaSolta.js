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
import ruimGif from '../assets/ARRASTA/BRONZE.png';
import bomGif from '../assets/ARRASTA/PRATA.png';
import otimoGif from '../assets/ARRASTA/OURO.png';
import errouGif from '../assets/ARRASTA/ERROU.png';
import popSound from '../assets/ARRASTA/DROPA.mp3';
import beepAcerto from '../assets/ARRASTA/ACERTA.mp3';
import beepErro from '../assets/ARRASTA/ERRA.mp3';

// 🏅 NOVO — IMAGEM DA CONQUISTA
import CONQUISTA_HABITO from '../assets/ARRASTA/REI.png';

// LISTA DE HÁBITOS — COM PROPRIEDADE "correto" PARA SABER QUAL É O DESTINO
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
  { id: 12, img: FUMAR, texto: "Cigarro não estraga os dentes", correto: false },
  { id: 13, img: SUJO, texto: "Não usar fio dental", correto: false },
  { id: 14, img: naoIr, texto: "Não ir ao dentista", correto: false },
];

// FUNÇÃO QUE EMBARALHA OS HÁBITOS AO COMEÇAR O JOGO
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

export default function ArrastaSolta() {
  // ESTADOS GERAIS DO JOGO
  const [segundos, setSegundos] = useState(0);
  const [habitos, setHabitos] = useState(shuffle([...HABITOS]));
  const [certos, setCertos] = useState([]);
  const [errados, setErrados] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalResultado, setModalResultado] = useState({ msg: "", img: "" });
  const [sonsAtivos, setSonsAtivos] = useState(true);
  const [animacoes, setAnimacoes] = useState({});
  const [mostrarConquista, setMostrarConquista] = useState(false); // 🏅 NOVO

  // REFERÊNCIAS PARA OS ÁUDIOS
  const audioPop = useRef(null);
  const audioAcerto = useRef(null);
  const audioErro = useRef(null);

  // USEEFFECT PARA INICIALIZAR OS SONS
  useEffect(() => {
    audioPop.current = new Audio(popSound);
    audioAcerto.current = new Audio(beepAcerto);
    audioErro.current = new Audio(beepErro);
  }, []);

  // USEEFFECT PARA CONTAR O TEMPO DO JOGO
  useEffect(() => {
    const intervalo = setInterval(() => setSegundos(s => s + 1), 1000);
    return () => clearInterval(intervalo);
  }, []);

  // FORMATA O TEMPO EM MINUTOS E SEGUNDOS (MM:SS)
  const formatarTempo = (s) => {
    const minutos = Math.floor(s / 60);
    const segundosRestantes = s % 60;
    return `${String(minutos).padStart(2, "0")}:${String(segundosRestantes).padStart(2, "0")}`;
  };

  // FUNÇÃO DE ARRASTAR — SALVA O ID DO HÁBITO ARRASTADO
  const arrastar = (e, habito) => e.dataTransfer.setData("habitoId", habito.id);

  // FUNÇÃO DE SOLTAR — MOVE O HÁBITO PARA O DESTINO CERTO/ERRADO
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

  // PERMITE SOLTAR ELEMENTOS SOBRE AS ÁREAS DE DESTINO
  const permitirSoltar = (e) => e.preventDefault();

  // REINICIA TODO O JOGO AO CLICAR NO BOTÃO
  const reiniciar = () => {
    setHabitos(shuffle([...HABITOS]));
    setCertos([]);
    setErrados([]);
    setSegundos(0);
    setModalAberto(false);
    setModalResultado({ msg: "", img: "" });
    setAnimacoes({});
    setMostrarConquista(false);
  };

  // DEFINE A MENSAGEM E A IMAGEM DE RESULTADO BASEADA NA PONTUAÇÃO
  const getResultadoPorPontuacao = (score) => {
    if (score >= 1 && score <= 5) return { msg: "OK, você precisa se dedicar mais!", img: ruimGif };
    if (score >= 6 && score <= 9) return { msg: "Muito bem, está indo no caminho certo!", img: bomGif };
    if (score >= 10) return { msg: "Excelente, estou orgulhoso de você!", img: otimoGif };
    return { msg: `Você acertou ${score} hábitos. Tente novamente!`, img: errouGif };
  };

  // ENVIA OS RESULTADOS — CONTA ACERTOS, TOCA SONS E MOSTRA CONQUISTA FINAL
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

    // MOSTRA MODAL OU CONQUISTA FINAL DEPENDENDO DOS ACERTOS
    setTimeout(() => {
      const resultado = getResultadoPorPontuacao(totalAcertos);

      // 🏅 SE ACERTAR TODOS OS HÁBITOS, MOSTRA CONQUISTA ANTES DO MODAL
      if (totalAcertos === HABITOS.length) {
        setMostrarConquista(true);
        setTimeout(() => setMostrarConquista(false), 2500);
        setTimeout(() => {
          setModalResultado({
            msg: resultado.msg,
            img: resultado.img,
            acertos: totalAcertos,
            erros: totalErros,
            tempo: segundos
          });
          setModalAberto(true);
        }, 2600);
      } else {
        setModalResultado({
          msg: resultado.msg,
          img: resultado.img,
          acertos: totalAcertos,
          erros: totalErros,
          tempo: segundos
        });
        setModalAberto(true);
      }
    }, delay + 500);
  };

  // JSX DO COMPONENTE (INTERFACE VISUAL DO JOGO)
  return (
    <div className="arrastaSolta-container">
      {/* CABEÇALHO COM BOTÕES E TEMPO */}
      <header className="arrastaSolta-header">
        <div className="header-botoes">
          <button className="botao-sair-arrasta" onClick={() => window.location.href = "/"}> ⮜ </button>
          <button className="botao-reinicia-arrasta" onClick={reiniciar}> 🗘 </button>
        </div>

        <span className="arrastaSolta-tempo">⏱ {formatarTempo(segundos)}</span>

        <button className="musicaAS-btn" onClick={() => setSonsAtivos(!sonsAtivos)}>
          {sonsAtivos ? "♫" : "🔇"}
        </button>
      </header>

      {/* LISTA DE HÁBITOS PARA ARRASTAR */}
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

      {/* ÁREAS DE DESTINO — CERTO E ERRADO */}
      <div className="campos-destino">
        <div
          className="campo-destino-certos"
          onDrop={(e) => soltar(e, "certos")}
          onDragOver={permitirSoltar}
        >
          <h3>CERTO</h3>
          {certos.map(h => (
            <div key={h.id} className={`habito-solto ${animacoes[h.id] || ""}`}>
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
            <div key={h.id} className={`habito-solto ${animacoes[h.id] || ""}`}>
              <img src={h.img} className="habito-img" alt={h.texto}/>
              <span className="habito-texto">{h.texto}</span>
            </div>
          ))}
        </div>
      </div>

      {/* BOTÃO PARA FINALIZAR O JOGO */}
      <div className="botoes-jogo">
        <button className="botao-enviar-arrasta" onClick={handleEnviar}>ENVIAR</button>
      </div>

      {/* MODAL DE RESULTADO FINAL */}
      {modalAberto && (
        <div className="modalArrasta">
          <div className="modalArrasta-content">
            <img src={modalResultado.img} alt="Resultado" className="modal-img"/>
            <h2>{modalResultado.msg}</h2>
            <p>Acertos: {modalResultado.acertos}</p>
            <p>Erros: {modalResultado.erros}</p>
            <p>⏱ Tempo total: {formatarTempo(modalResultado.tempo || 0)}</p>
            <button onClick={reiniciar}>JOGAR NOVAMENTE</button>
          </div>
        </div>
      )}

      {/* POP-UP DA CONQUISTA FINAL */}
      {mostrarConquista && (
        <div className="arrasta-conquista-pop">
          <img src={CONQUISTA_HABITO} alt="Conquista" className="arrasta-conquista-img" />
          <p className="arrasta-conquista-texto">🏆 Conquista desbloqueada: Mestre dos Hábitos!</p>
        </div>
      )}
    </div>
  );
}
