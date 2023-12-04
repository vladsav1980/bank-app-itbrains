import "./index.css";

export default function Box({ children, type, onClick }) {
  return (
    <div onClick={onClick} className="box">
      {children}
    </div>
  );
}
