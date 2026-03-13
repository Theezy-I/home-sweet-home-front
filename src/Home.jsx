import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from './supabase';

function Home() {
  const [imoveis, setImoveis] = useState([]);
  const [loading, setLoading] = useState(true);

  // Busca os imóveis assim que a página carrega
  useEffect(() => {
    async function loadImoveis() {
      const { data, error } = await supabase
        .from('imoveis')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error("Erro ao carregar:", error.message);
      } else {
        setImoveis(data);
      }
      setLoading(false);
    }

    loadImoveis();
  }, []);

  return (
    <div className="bg-light min-vh-100">
      {/* Hero Section */}
      <div className="hero text-center bg-danger text-white py-5 mb-4">
        <div className="container">
          <h1 className="display-4 fw-bold">Home Sweet Home</h1>
          <p className="lead">Encontre o lugar perfeito para sua próxima estadia.</p>
        </div>
      </div>

      {/* Container de Imóveis */}
      <div className="container mb-5">
        <div className="row">
          {loading ? (
            <div className="col-12 text-center mt-5">
              <div className="spinner-border text-danger" role="status"></div>
              <p className="text-muted mt-2">Buscando imóveis incríveis...</p>
            </div>
          ) : imoveis.length > 0 ? (
            imoveis.map((imovel) => (
              <div className="col-md-4 mb-4" key={imovel.id}>
                <div className="card h-100 shadow-sm border-0">
                  <img 
                    src={imovel.imagem ? `https://drlnbbodugxkndtpomfa.supabase.co/storage/v1/object/public/imoveis-imagens/${imovel.imagem}` : 'https://via.placeholder.com/400x220'} 
                    className="card-img-top" 
                    alt={imovel.titulo} 
                    style={{ height: '220px', objectFit: 'cover' }} 
                  />
                  <div className="card-body">
                    <h5 className="card-title fw-bold">{imovel.titulo}</h5>
                    <p className="card-text text-muted small">{imovel.cidade}</p>
                    <p className="card-text fw-bold text-danger fs-5">
                      R$ {imovel.preco_diaria} <span className="text-muted fs-6 fw-normal">/ noite</span>
                    </p>
                    <Link to={`/detalhes/${imovel.id}`} className="btn btn-danger w-100">Ver Detalhes</Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center">
              <p className="text-muted">Nenhum imóvel cadastrado ainda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;