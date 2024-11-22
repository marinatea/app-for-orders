// components/WineBottle.tsx

export default function WineBottle() {
  return (
    <div className="wine-bottle">
      <div className="neck"></div>
      <div className="body"></div>
      <style jsx>{`
        .wine-bottle {
          position: fixed;
          bottom: -5vh; /* Przesunięcie od dołu ekranu */
          right: 5vw; /* Przesunięcie od prawej krawędzi ekranu */
          width: 19rem; /* Szerokość na górze butelki */
          height: 70vh; /* Wysokość butelki */
          background-color: rgba(0, 86, 77, 0.28); /* Kolor butelki z przezroczystością 28% */
          border-radius: 35% 35% 10% 10%;
          z-index: -1;
        }

        .neck {
          position: absolute;
          top: -40%; /* Wysokość szyjki butelki */
          left: 50%;
          width: 5rem; /* Szerokość szyjki */
          height: 40%; /* Wysokość szyjki */
          background-color: rgba(0, 86, 77, 0.28); /* Kolor butelki z przezroczystością 28% */
          border-radius: 20px 20px 0px 0px;
          transform: translateX(-50%);
        }
      `}</style>
    </div>
  );
}
