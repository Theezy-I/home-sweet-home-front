import { useState } from 'react';
import { supabase } from './supabase';
import { Link, useNavigate } from 'react-router-dom';

function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: { nome: nome } // Salva o nome para a Navbar mostrar
      }
    });

    if (error) {
      alert("Erro ao cadastrar: " + error.message);
    } else {
      alert("Cadastro realizado! Verifique seu e-mail ou faça login.");
      navigate('/login');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card shadow-sm p-4 border-0">
            <h2 className="text-center mb-4 text-danger fw-bold">Criar Conta</h2>
            <form onSubmit={handleCadastro}>
              <div className="mb-3">
                <label className="form-label">Nome Completo</label>
                <input type="text" className="form-control" onChange={(e) => setNome(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">E-mail</label>
                <input type="email" className="form-control" onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Senha</label>
                <input type="password" className="form-control" onChange={(e) => setSenha(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-danger w-100 fw-bold">Cadastrar</button>
            </form>
            <p className="mt-3 text-center">
              Já tem conta? <Link to="/login" className="text-danger">Faça Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;