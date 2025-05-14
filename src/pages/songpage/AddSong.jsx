import { useState } from "react";
import { supabase } from "../../supabase/supabaseClient";
import { useNavigate } from "react-router";

export default function AddSong() {
  const [title, setTitle] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Devi essere loggato per salvare una canzone.");
      return;
    }

    const { error } = await supabase.from("songs").insert([
      {
        title,
        lyrics,
        user_id: user.id,
      },
    ]);

    if (error) {
      setError(error.message);
    } else {
      navigate("/songs");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center my-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 drop-shadow-lg">
        Aggiungi una nuova canzone
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Titolo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <textarea
          placeholder="Testo con accordi"
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          className="w-full h-60 border px-3 py-2 rounded"
          required
        ></textarea>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Salva canzone
        </button>
      </form>
    </div>
  );
}