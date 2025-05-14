import { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";

export default function Songs(){
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState (true);
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    useEffect (() => {
        if (!authLoading && !user) {
            navigate("/");
            return;
        }
        fetchSongs()
    }, [])
    const fetchSongs = async () => {
        setLoading(true) 
        const { data, error} = await supabase
        .from('songs')
        .select('*')
        .order('created_at', { ascending: false })

        if (error) {
            console.error(error)
        } else {
            setSongs(data)
        }
        setLoading(false)
    }

    if (authLoading) return <p>Caricamento...</p>;
    if (!user) return null;

    return(
        <>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Your Songs</h1>
                {loading && <p>Loading...</p>}
                {!loading && songs.length === 0 && <p>No Song Found</p>}
                <ul className="space-y-2">
                    {songs.map((song) => (
                    <li key={song.id} className="border p-4 rounded bg-white shadow">
                        <h2 className="text-xl font-semibold">{song.title}</h2>
                        <pre className="text-sm mt-2 whitespace-pre-wrap">{song.lyrics}</pre>
                    </li>
                    ))}
                </ul>
            </div>
        </>
    )
}