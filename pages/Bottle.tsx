// components/WineBottle.tsx
import s from "../styles/Bottle.module.scss";

export default function WineBottle() {
  return (
    <div
      className={s.wineBottle}
    >
      {/* Szyja */}
      <div className={s.neck}></div>

      {/* Krążek */}
      <div className={s.ring}></div>

      {/* Korpus */}
      <div className={s.body}></div>
    </div>
  );
}
