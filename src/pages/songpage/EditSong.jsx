import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabase/supabaseClient";

export default function EditSong() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSong = async () => {
      const { data, error } = await supabase
        .from("songs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setError("Errore nel caricamento della canzone.");
      } else {
        setTitle(data.title);
        setLyrics(data.lyrics);
      }
    };

    fetchSong();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from("songs")
      .update({ title, lyrics })
      .eq("id", id);

    if (error) {
      setError("Errore durante il salvataggio.");
    } else {
      navigate("/songs");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Song</h1>
        <button onClick={() => navigate(`/songs/${id}`)} className="mx-2 test-blue-500 px-4 py-2  hover:test-blue-900">View Song</button>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titolo"
          className="w-full border px-3 py-2 rounded"
          required
        />
        <textarea
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          placeholder="Testo con accordi"
          className="w-full h-60 border px-3 py-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
        >
          Salva modifiche
        </button>
      </form>
    </div>
  );
}