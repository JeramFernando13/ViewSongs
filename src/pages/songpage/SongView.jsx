

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../supabase/supabaseClient";

const fonts = [
  { label: "Sans", className: "font-sans" },
  { label: "Serif", className: "font-serif" },
  { label: "Mono", className: "font-mono" },
  { label: "Handwriting", className: "font-handwriting" }, // definire in tailwind.config.js
  { label: "Rounded", className: "rounded-font" },        // definire in tailwind.config.js
  { label: "Condensed", className: "condensed-font" },    // definire in tailwind.config.js
];

// Funzione per determinare se una riga è solo accordi (es. solo lettere, numeri, #, b, m, -, /, spazi)
function isChordLine(line) {
  const tokens = line.trim().split(/\s+/); // separa per spazi
  return (
    tokens.length > 0 &&
    tokens.every((token) =>
      /^[A-G][#b]?m?(maj7|7|6|9|sus4|sus2|dim|aug|add9)?$/.test(token)
    )
  );
}

// Funzione per evidenziare accordi tra quadre []
function highlightChords(line) {
  // dividi per accordi in quadre, mantieni il resto come testo
  const regex = /\[([^\]]+)\]/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: line.substring(lastIndex, match.index), chord: false });
    }
    parts.push({ text: match[1], chord: true });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < line.length) {
    parts.push({ text: line.substring(lastIndex), chord: false });
  }

  return parts;
}

// Nuova funzione per rilevare intestazioni di sezione
function isSectionHeader(line) {
  const sections = ["Chorus:", "Verse:", "Bridge:", "Intro:", "Outro:", "Pre-Chorus:", "Interlude:", "2nd Interlude:","Verse1:", "Verse2:", "Verse3:", "Chorus1:", "Chorus2:"  ];
  return sections.some((sec) => line.trim().startsWith(sec));
}

export default function SongView() {
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [fontClass, setFontClass] = useState(fonts[0].className);
  const [filter, setFilter] = useState("both"); // 'both', 'chords', 'lyrics'

  useEffect(() => {
    async function fetchSong() {
      const { data, error } = await supabase
        .from("songs")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        setError("Errore nel caricamento della canzone.");
      } else {
        setSong(data);
      }
    }
    fetchSong();
  }, [id]);

  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!song) return <div className="p-6">Caricamento...</div>;

  // Prepariamo il contenuto diviso in righe
  const lines = song.lyrics.split("\n");

  return (
    <div className={`p-6 min-h-screen ${fontClass} bg-white`}>
      <h1 className="text-3xl font-bold mb-6">{song.title}</h1>

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <label>
          <span className="mr-2 font-semibold">Visualizza:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="both">Testo e accordi</option>
            <option value="chords">Solo accordi</option>
            <option value="lyrics">Solo testo</option>
          </select>
        </label>

        <label>
          <span className="mr-2 font-semibold">Font:</span>
          <select
            value={fontClass}
            onChange={(e) => setFontClass(e.target.value)}
            className="border rounded px-2 py-1"
          >
            {fonts.map(({ label, className }) => (
              <option key={className} value={className}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <button onClick={() => navigate(`/songs/${song.id}/edit`)} type="button">Edit</button>
      </div>

      <div className="whitespace-pre-wrap text-lg leading-relaxed">
        {lines.map((line, idx) => {
          const chordOnlyLine = isChordLine(line);
          const parts = highlightChords(line);
          const isSection = isSectionHeader(line);

          // Logica di filtro
          if (filter === "lyrics" && chordOnlyLine) return null;
          if (filter === "chords" && !chordOnlyLine && !parts.some((p) => p.chord) && !isSection ) return null;

          // Render linea con accordi evidenziati e intestazioni di sezione
          return (
            <p
              key={idx}
              className={`${chordOnlyLine ? "text-blue-600 font-semibold font-mono" : ""} ${
                isSection ? "font-bold text-indigo-700 mt-4" : ""
              }`}>

              {parts.map((part, i) =>
                part.chord ? (
                  <span key={i} className="text-blue-600 font-semibold">
                    {part.text}
                  </span>
                ) : (
                  <span key={i}>{part.text}</span>
                )
              )}
            </p>
          );
        })}
      </div>
    </div>
  );
}