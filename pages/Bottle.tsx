// components/WineBottle.tsx
import s from "../styles/Bottle.module.scss";

const WineBottle = () => {
  return (
    <div className={s.wineBottle}>
      <div className={s.neck}></div>

      <div className={s.ring}></div>

      <div className={s.body}></div>
    </div>
  );
};

export default WineBottle;