import { useState, useRef } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import HCaptcha from '@hcaptcha/react-hcaptcha';


export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [captchaToken, setCaptchaToken] = useState(null);

    const captchaRef = useRef();
  

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      setError("Verifica Captcha fallita. Riprova.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Le password non coincidono.");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username
        }
      }
    });

    if (error) {
      setError(error.message);
      captchaRef.current.resetCaptcha()

      
    } else {
      navigate("/login");
      toast.success('Logged In')
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Registrati</h1>
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
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
          placeholder="Password (min. 6 caratteri)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Conferma password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}

         <HCaptcha
        sitekey="496653ac-582a-4208-af60-2206f19e424e"
        onVerify={(token) => setCaptchaToken(token)}
        ref={captchaRef}
        />

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Crea account
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
          Hai già un account?{" "}
          <Link to="/login" className="text-blue-600 underline">Accedi</Link>
        </p>
      </form>
    </div>
  );
}