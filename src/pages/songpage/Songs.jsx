import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Songs(){
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState (true);
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [openMenuId, setOpenMenuId] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [songToDelete, setSongToDelete] = useState(null);

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

    const handleDelete = async () => {
      if (!songToDelete) return;

      const { error } = await supabase
        .from('songs')
        .delete()
        .eq('id', songToDelete.id);

      if (error) {
        toast.error("Errore durante l'eliminazione:", error.message);
      } else {
        setSongs(songs.filter((song) => song.id !== songToDelete.id));
        toast.success('Song deleted Successully! ')
      }

      setIsDeleteDialogOpen(false);
      setSongToDelete(null);
    };

    if (authLoading) return <p>Caricamento...</p>;
    if (!user) return null;

    return(
        <>
            <div className="p-6">
                 <div className="flex items-center gap-4 mb-4">
                    <h1 className="text-2xl font-bold">Your Songs</h1>
                    
                </div>
                {loading && <p>Loading...</p>}
                {!loading && songs.length === 0 && <p>No Song Found</p>}
                <ul className="space-y-2">
                    {songs.map((song) => (
                      <li key={song.id} className="border p-4 rounded bg-white shadow relative">
                            <Link to={`/songs/${song.id}`}>
                        <div className="flex justify-between items-start">
                          <div>
                              <h2 className="text-xl font-semibold hover:underline">{song.title}</h2>
                              <pre className="text-sm text-gray-600 mt-1 whitespace-pre-wrap line-clamp-2">
                                {song.lyrics}
                              </pre>
                          </div>
                          <div className="relative">
                            <button
                              onClick={() => setOpenMenuId(openMenuId === song.id ? null : song.id)}
                              className="text-gray-500 hover:text-black"
                              >
                              ⋮
                            </button>
                            {openMenuId === song.id && (
                              
                              <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-10">
                                <button
                                  onClick={() => navigate(`/songs/${song.id}`)}
                                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                                  View Song
                                </button>
                                <button
                                  onClick={() => navigate(`/songs/${song.id}/edit`)}
                                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                  >
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    setSongToDelete(song);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
                                  >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                            </Link>
                    </li>
                    ))}
                </ul>
            </div>
            <Dialog open={isDeleteDialogOpen} handler={() => setIsDeleteDialogOpen(false)}>
              <DialogHeader className="text-red-500 hover:text-red-700">Confim deletion</DialogHeader>
              <DialogBody>
                This Song will be deleted, Are you Sure?
              </DialogBody>
              <DialogFooter>
                <Button variant="text" color="gray" className="mx-2" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="gradient" className="mx-2 text-red-500 hover:text-red-700" onClick={handleDelete}>
                  Delete
                </Button>
              </DialogFooter>
            </Dialog>
        </>
    )
}