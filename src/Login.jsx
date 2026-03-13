import { useState } from 'react';
import { supabase } from './supabase';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // Usa a ponte do Supabase para autenticar
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: senha,
    });

    if (error) {
      alert("Erro ao entrar: " + error.message);
    } else {
      // Se der certo, volta para a Home
      navigate('/');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card shadow-sm p-4 border-0">
            <h2 className="text-center mb-4 text-danger fw-bold">Entrar</h2>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label">E-mail</label>
                <input 
                  type="email" 
                  className="form-control" 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Senha</label>
                <input 
                  type="password" 
                  className="form-control" 
                  onChange={(e) => setSenha(e.target.value)} 
                  required 
                />
              </div>
              <button type="submit" className="btn btn-danger w-100 fw-bold">Entrar</button>
            </form>
            <p className="mt-3 text-center">
              Não tem conta? <Link to="/cadastro" className="text-danger">Cadastre-se</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;