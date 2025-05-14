import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabaseClient";

export default function SongDetail() {
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSong = async () => {
      const { data, error } = await supabase
        .from("songs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setSong(data);
      }
    };

    fetchSong();
  }, [id]);

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  if (!song) {
    return <div className="p-6">Caricamento...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">{song.title}</h1>
      <pre className="whitespace-pre-wrap">{song.lyrics}</pre>
    </div>
  );
}