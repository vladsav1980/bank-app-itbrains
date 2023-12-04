import "./index.css";

export default function Button({ children, type, onClick }) {
  return (
    <div onClick={onClick} className={`button ${type}`}>
      {children}
    </div>
  );
}
