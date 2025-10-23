import React from "react";

export default function Menina() {
  return (

   <svg
  width="500"
  height="500"
  viewBox="0 0 500 500"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <defs>
    {/* Gradiente do corpo */}
    <radialGradient id="corpoGradiente" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stopColor="#4B0082" />
      <stop offset="100%" stopColor="#2E003E" />
    </radialGradient>

    {/* Gradiente olhos */}
    <radialGradient id="olhoGradiente">
      <stop offset="0%" stopColor="#FFD700" />
      <stop offset="100%" stopColor="#FFA500" />
    </radialGradient>

    {/* Gradiente boca */}
    <linearGradient id="bocaGradiente" x1="2" y1="1" x2="2" y2="3">
      <stop offset="0%" stopColor="#FF0000" />
      <stop offset="100%" stopColor="#8B0000" />
    </linearGradient>
  </defs>

  {/* Corpo principal */}
  <ellipse cx="250" cy="300" rx="120" ry="160" fill="url(#corpoGradiente)" />

  {/* Cabeça e chifres */}
  <path d="M180 160 C150 100, 350 100, 320 160" fill="url(#corpoGradiente)" />
  <path d="M180 160 C160 60, 200 80, 180 160 Z" fill="#3A0030" />
  <path d="M320 160 C340 60, 300 80, 320 160 Z" fill="#3A0030" />

  {/* Olhos grandes fixos */}
  <ellipse cx="200" cy="180" rx="18" ry="28" fill="url(#olhoGradiente)" />
  <ellipse cx="300" cy="180" rx="18" ry="28" fill="url(#olhoGradiente)" />

  {/* Pupilas estáticas */}
  <circle cx="200" cy="180" r="12" fill="#000" />
  <circle cx="300" cy="180" r="12" fill="#000" />

  {/* Brilho nos olhos */}
  <circle cx="195" cy="175" r="5" fill="#fff" />
  <circle cx="295" cy="175" r="5" fill="#fff" />

  {/* Boca apenas vermelha */}
  <path
    d="M190 250 Q250 350 310 250 Q250 320 190 250 Z"
    fill="url(#bocaGradiente)"
  >
    <animate
      attributeName="d"
      values="
        M190 250 Q250 350 310 250 Q250 320 190 250 Z;
        M190 250 Q250 340 310 250 Q250 320 190 250 Z;
        M190 250 Q250 350 310 250 Q250 320 190 250 Z
      "
      dur="2s"
      repeatCount="indefinite"
    />
  </path>

  {/* Garras */}
  <path d="M150 400 L140 430 L160 420 Z" fill="#2E003E" />
  <path d="M350 400 L340 430 L360 420 Z" fill="#2E003E" />
</svg>



  );
}
