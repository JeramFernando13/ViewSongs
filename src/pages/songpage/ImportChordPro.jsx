import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase/supabaseClient";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ImportChordPro() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

   

    try {
      const text = await file.text();
      console.log("Contenuto del file:", text);
      parseChordPro(text);
    } catch (err) {
      setError("Errore nella lettura del file.");
    }
  };

  const parseChordPro = (text) => {
    const lines = text.split("\n");

    let title = "Untitled";
    const lyrics = [];

    for (let line of lines) {
      if (line.startsWith("{title:")) {
        title = line.match(/{title:(.*?)}/i)?.[1].trim() || title;
      } else {
        lyrics.push(line);
      }
    }

    const parsedLyrics = lyrics.join("\n");
    saveToSupabase(title, parsedLyrics);
  };

  const saveToSupabase = async (title, lyrics) => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      setError("Errore nel recupero utente.");
      toast.error(userError.message || "Errore autenticazione.");
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
      setError("Errore nel salvataggio su Supabase.");
      toast.error(error.message || "Errore durante il salvataggio.");
    } else {
      navigate("/songs");
      toast.success(`"${title}" importata con successo`);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Importa file ChordPro</h1>
      <input
        type="file"
        accept=".chordpro,.CHORDPRO,.cho,.CHO,.chopro,.txt,.rtf"
        onChange={handleFileUpload}
        className="border rounded px-4 py-2"
      />
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}