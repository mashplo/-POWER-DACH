import { useNavigate } from "react-router-dom";

export default function Card({ producto }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/proteina/${producto.id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="card rounded-lg shadow-md cursor-pointer hover:shadow-xl transition-shadow duration-300"
    >
      <img src={producto.images[0]} alt={producto.title} className="card-image" />
      <div className="card-content px-5 py-4 flex flex-col gap-2">
        <h2 className="card-title text-lg font-semibold">{producto.title}</h2>
        <p className="card-price text-2xl font-bold text-primary">S/{producto.price}</p>
      </div>
    </div>
  );
}