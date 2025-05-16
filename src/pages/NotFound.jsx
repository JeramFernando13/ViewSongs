import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-4xl font-bold text-red-600">404</h1>
      <p className="mt-2 text-gray-700">Pagina non trovata.</p>
      <Link to="/" className="text-blue-600 underline mt-4 block">Torna alla home</Link>
    </div>
  );
}