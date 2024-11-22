// components/WineBottle.tsx
import s from "../styles/Bottle.module.scss";

export default function WineBottle() {
  return (
    <div className={s.wineBottle}>
      <div className={s.neck}></div>
      <div className={s.body}></div>
    </div>
  );
}
