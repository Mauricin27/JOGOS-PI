import React, { useState, useEffect, useRef, useCallback } from "react";
import "../styles/JogoDePares.css";

// Imagens
import img1 from "../assets/JODOPARES/1.png";
import img2 from "../assets/JODOPARES/2.png";
import img3 from "../assets/JODOPARES/3.png";
import img4 from "../assets/JODOPARES/4.png";
import img5 from "../assets/JODOPARES/5.png";
import img6 from "../assets/JODOPARES/6.png";
import img7 from "../assets/JODOPARES/7.png";
import img8 from "../assets/JODOPARES/8.png";
import img9 from "../assets/JODOPARES/9.png";
import img10 from "../assets/JODOPARES/10.png";

// Sons
import somFumaca from "../assets/JODOPARES/FORMOU.mp3";
import somVitoria from "../assets/JODOPARES/1.mp3";
import somBeep from "../assets/JODOPARES/MOVER.mp3";

// Cores
const cores = {
  1: "#85c1e9", // azul claro
  2: "#82e0aa", // verde claro
  3: "#f9e79f", // amarelo claro
  4: "#f1948a", // vermelho claro
  5: "#85c1e9", // azul claro
  6: "#82e0aa", // verde claro
  7: "#f9e79f", // amarelo claro
  8: "#f1948a", // vermelho claro
  9: "#85c1e9", // azul claro
  10: "#82e0aa", // verde claro
  11: "#f9e79f"  // amarelo claro
};



// Etapas: número de trios por etapa
const niveis = [4, 6, 8, 10];

// Imagens por nível
const imagensPorNivel = [
  [img1, img2, img3, img4],
  [img1, img2, img3, img4, img5, img6],
  [img1, img2, img3, img4, img5, img6, img7, img8],
  [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10]
];

// Função para embaralhar
function embaralharArray(array) {
  return array
    .map(item => ({ ...item, rand: Math.random() }))
    .sort((a, b) => a.rand - b.rand)
    .map(item => { delete item.rand; return item; });
}

// Função para calcular linhas e colunas ideais
function calcularGrade(totalQuadrados) {
  let melhorDiff = Infinity;
  let melhorLinhas = 1;
  let melhorColunas = totalQuadrados;

  for (let i = 1; i <= totalQuadrados; i++) {
    if (totalQuadrados % i === 0) {
      const linhas = i;
      const colunas = totalQuadrados / i;
      const diff = Math.abs(linhas - colunas);
      if (diff < melhorDiff) {
        melhorDiff = diff;
        melhorLinhas = linhas;
        melhorColunas = colunas;
      }
    }
  }
  return { linhas: melhorLinhas, colunas: melhorColunas };
}

export default function JogoDeTrio() {
  const [quadrados, setQuadrados] = useState([]);
  const [triosEncontrados, setTriosEncontrados] = useState(0);
  const [nivelAtual, setNivelAtual] = useState(0);
  const [somLigado, setSomLigado] = useState(true);
  const [vitoria, setVitoria] = useState(false);
  const [modalProximoNivel, setModalProximoNivel] = useState(false);
  const [selecionado, setSelecionado] = useState(null);
  const animandoRef = useRef(false);
  const [grade, setGrade] = useState({ linhas: 0, colunas: 0 });

  // Função corrigida com useCallback
  const iniciarNivel = useCallback((nivel) => {
    const numTrios = niveis[nivel];
    const imagens = imagensPorNivel[nivel];

    let triplos = [];
    let index = 0;
    for (let i = 0; i < numTrios; i++) {
      triplos.push({ idImagem: index + 1, img: imagens[index] });
      triplos.push({ idImagem: index + 1, img: imagens[index] });
      triplos.push({ idImagem: index + 1, img: imagens[index] });
      index = (index + 1) % imagens.length;
    }

    const { linhas, colunas } = calcularGrade(triplos.length);
    setGrade({ linhas, colunas });

    let embaralhados;
    do {
      embaralhados = embaralharArray(triplos).map((item, i) => ({
        ...item,
        id: i,
        combinado: false,
        removendo: false,
        destacando: false
      }));
    } while (temTrioHorizontal(embaralhados, colunas));

    setQuadrados(embaralhados);
    setTriosEncontrados(0);
    setVitoria(false);
    setSelecionado(null);
    setModalProximoNivel(false);
  }, []);

  useEffect(() => {
    iniciarNivel(nivelAtual);
  }, [nivelAtual, iniciarNivel]);

  function temTrioHorizontal(array, colunas) {
    for (let i = 0; i < array.length; i++) {
      if (i % colunas > colunas - 3) continue;
      if (
        array[i].idImagem === array[i + 1]?.idImagem &&
        array[i].idImagem === array[i + 2]?.idImagem
      ) return true;
    }
    return false;
  }

  function moverDirecao(direcao) {
    if (selecionado === null) return;
    const { colunas } = grade;
    const lin = Math.floor(selecionado / colunas);
    const col = selecionado % colunas;
    let destino = null;

    switch (direcao) {
      case "esquerda": if (col > 0) destino = selecionado - 1; break;
      case "direita": if (col < colunas - 1) destino = selecionado + 1; break;
      case "cima": if (lin > 0) destino = selecionado - colunas; break;
      case "baixo": if (lin < grade.linhas - 1) destino = selecionado + colunas; break;
      default: return;
    }

    if (destino !== null) {
      const novos = [...quadrados];
      [novos[selecionado], novos[destino]] = [novos[destino], novos[selecionado]];
      setQuadrados(novos);
      setSelecionado(destino);

      if (somLigado) new Audio(somBeep).play();
      detectarTodosTrios(novos);
    }
  }

  function detectarTodosTrios(array) {
    if (animandoRef.current) return;

    let trios = [];
    const { colunas } = grade;
    for (let i = 0; i < array.length; i++) {
      if (i % colunas > colunas - 3) continue;
      if (
        !array[i].combinado &&
        array[i].idImagem !== 0 &&
        array[i].idImagem === array[i + 1]?.idImagem &&
        array[i].idImagem === array[i + 2]?.idImagem
      ) trios.push([i, i + 1, i + 2]);
    }

    if (trios.length === 0) return;
    animandoRef.current = true;

    const trioAtual = trios[0];
    const novos = [...array];
    trioAtual.forEach(i => novos[i].destacando = true);
    setQuadrados(novos);

    setTimeout(() => {
      const comRemocao = [...novos];
      trioAtual.forEach(i => { comRemocao[i].destacando = false; comRemocao[i].removendo = true; });
      setQuadrados(comRemocao);

      if (somLigado) new Audio(somFumaca).play();

      setTimeout(() => {
        const atualizados = [...comRemocao];
        trioAtual.forEach(i => { atualizados[i].combinado = true; atualizados[i].removendo = false; });
        setQuadrados(atualizados);

        setTriosEncontrados(prev => {
          const novo = prev + 1;

          if (novo >= niveis[nivelAtual]) {
            if (nivelAtual + 1 < niveis.length) {
              setTimeout(() => setModalProximoNivel(true), 800);
            } else {
              setTimeout(() => {
                setVitoria(true);
                if (somLigado) new Audio(somVitoria).play();
              }, 800);
            }
          }

          animandoRef.current = false;
          setTimeout(() => detectarTodosTrios(atualizados), 50);
          return novo;
        });
      }, 1000);
    }, 1600);
  }

  function avancarNivel() {
    setModalProximoNivel(false);
    setNivelAtual(prev => prev + 1);
  }

  return (
    <div className="jogo-montar-pares">
      <header className="header-montar-pares">
        <div className="logo-montar-pares">Logo</div>
        <div className="contador-mostrar-pares">{triosEncontrados} / {niveis[nivelAtual]} trios</div>
        <button onClick={() => setSomLigado(!somLigado)}>
          {somLigado ? "🔊" : "🔇"}
        </button>
      </header>

      <div
        className="tabuleiro-montar-pares"
        style={{ gridTemplateColumns: `repeat(${grade.colunas}, 100px)` }}
      >
        {quadrados.map((q, indice) => (
          <div
            key={q.id}
            className={`quadrado 
              ${q.combinado ? "combinado" : ""} 
              ${selecionado === indice ? "selecionado" : ""} 
              ${q.removendo ? "removendo" : ""} 
              ${q.destacando ? "destacando" : ""}`}
            style={{ backgroundColor: !q.combinado ? cores[q.idImagem] : "#dcdde1" }}
            onClick={() => !q.combinado && setSelecionado(indice)}
          >
            {!q.combinado && !q.removendo && <img src={q.img} alt="" />}
          </div>
        ))}
      </div>

      <div className="controles-formar-pares">
        <button onClick={() => moverDirecao("esquerda")}>←</button>
        <button onClick={() => moverDirecao("cima")}>↑</button>
        <button onClick={() => moverDirecao("direita")}>→</button>
        <button onClick={() => moverDirecao("baixo")}>↓</button>
      </div>

      <footer className="rodape-mostrar-pares">
        <button onClick={() => iniciarNivel(nivelAtual)}>REINICIAR</button>
        <button onClick={() => (window.location.href = "/")}>SAIR</button>
      </footer>

      {modalProximoNivel && (
        <div className="modal-vitoria-etapas">
          <div className="modal-container-etapas">
            <h2>🎉 Nível {nivelAtual + 1} concluído!</h2>
            <button onClick={avancarNivel}>Próximo Nível</button>
          </div>
        </div>
      )}

      {vitoria && !modalProximoNivel && (
        <div className="modal-vitoria-final-pares">
          <div className="modal-container-final-pares">
            <h2>🏆 Parabéns! Você venceu todos os níveis!</h2>
            <button onClick={() => { setNivelAtual(0); iniciarNivel(0); }}>JOGAR NOVAMENTE</button>
          </div>
        </div>
      )}
    </div>
  );
}
