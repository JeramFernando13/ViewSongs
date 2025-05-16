import { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router";

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
                 <div className="flex items-center gap-4 mb-4">
                    <h1 className="text-2xl font-bold">Your Songs</h1>
                    <Link to="/songs/new">
                        <button type="button" className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-900">
                            Add Song +
                        </button>
                    </Link>
                </div>
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