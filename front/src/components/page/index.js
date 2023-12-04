import StatusBar from "../status";
import "./index.css";

export default function Page({ children, style }) {
  return (
    <div className="page" style={style}>
      <StatusBar />
      {children}
      <div className="home-indicator"></div>
    </div>
  );
}
