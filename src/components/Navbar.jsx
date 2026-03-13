import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase'; // <-- CORRIGIDO AQUI!

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Mantive a sua lógica original de monitorar a sessão
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top py-2 shadow-sm">
      <div className="container">
        {/* LOGO COM LINK */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img 
            src="/logo.png"
            alt="Home Sweet Home" 
            height="45" 
            className="d-inline-block align-top me-2"
            style={{ borderRadius: '8px' }}
          />
          <span className="fw-bold fs-4" style={{ color: '#E31C5F', letterSpacing: '-1px' }}>
            Home Sweet Home
          </span>
        </Link>

        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {!user ? (
              <li className="nav-item">
                <Link className="btn btn-danger rounded-pill px-4 fw-bold" to="/login">Entrar</Link>
              </li>
            ) : (
              <>
                <li className="nav-item me-3">
                  <span className="text-muted small">Olá, <strong className="text-dark">{user.user_metadata?.nome || 'theezy'}</strong></span>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-bold text-dark px-3" to="/meus-anuncios">Meu Painel</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-outline-dark rounded-pill px-4 mx-2 fw-bold" to="/cadastrar-imovel">
                    Anunciar
                  </Link>
                </li>
                <li className="nav-item">
                  <button onClick={handleLogout} className="btn btn-danger rounded-pill px-4 fw-bold">
                    Sair
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;