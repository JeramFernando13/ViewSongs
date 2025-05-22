import { useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useRef } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [captchaToken, setCaptchaToken] = useState(null);
  
  const captchaRef = useRef();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!captchaToken) {
      setError("Verifica Captcha fallita. Riprova.");
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      captchaRef.current.resetCaptcha()
    } else {
      navigate("/"); // o "/songs"
      toast.success('Logged In')
    }
  };


  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required/>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <HCaptcha
        sitekey="496653ac-582a-4208-af60-2206f19e424e"
        onVerify={(token) => setCaptchaToken(token)}
        ref={captchaRef}
        />
        
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Accedi
        </button>

        <button
            type="button"
            onClick={async () => {
                const { error } = await supabase.auth.signInWithOAuth({
                provider: 'github',
                });
                if (error) console.error(error.message);
                else toast.success('Logged In')
            }}
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-900">
            Accedi con GitHub
        </button>

        <p className="text-sm text-center">
          Non hai un account?{" "}
          <Link to="/register" className="text-blue-600 underline">Registrati</Link>
        </p>
      </form>
    </div>
  );
}