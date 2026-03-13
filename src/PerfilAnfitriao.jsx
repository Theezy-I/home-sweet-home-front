import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from './supabase';

function PerfilAnfitriao() {
  const { donoId } = useParams(); // Pega o ID do dono pela URL
  const [imoveis, setImoveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nomeAnfitriao, setNomeAnfitriao] = useState('Anfitrião');

  useEffect(() => {
    async function fetchDadosDoAnfitriao() {
      // Busca TODOS os imóveis que pertencem a esse UUID específico
      const { data, error } = await supabase
        .from('imoveis')
        .select('*')
        .eq('dono_id', donoId)
        .order('id', { ascending: false });

      if (!error && data.length > 0) {
        setImoveis(data);
        // Pega o nome do dono do primeiro imóvel para dar título à página
        setNomeAnfitriao(data[0].nome_dono || 'Anfitrião Verificado');
      }
      setLoading(false);
    }
    fetchDadosDoAnfitriao();
  }, [donoId]);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-danger"></div></div>;

  return (
    <div className="container mt-5 mb-5">
      <div className="row">
        
        {/* SIDEBAR ESQUERDA: O CARD DE IDENTIDADE DO MAGNATA */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm border-0 rounded-4 p-4 text-center sticky-top" style={{ top: '20px' }}>
            <div className="position-relative d-inline-block mx-auto mb-3">
              <img 
                src={`https://ui-avatars.com/api/?name=${nomeAnfitriao}&background=random&size=150`} 
                alt={nomeAnfitriao} 
                className="rounded-circle shadow-sm"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
              {/* Selinho de verificado estilo Twitter/Airbnb */}
              <div className="position-absolute bottom-0 end-0 bg-danger text-white rounded-circle d-flex justify-content-center align-items-center border border-3 border-white" style={{ width: '40px', height: '40px', right: '10px' }}>
                <i className="bi bi-shield-check fs-5"></i>
              </div>
            </div>
            
            <h3 className="fw-bold">{nomeAnfitriao}</h3>
            <p className="text-muted mb-1"><i className="bi bi-star-fill text-dark me-2"></i>Superhost</p>
            <p className="text-muted"><i className="bi bi-person-check-fill text-dark me-2"></i>Identidade verificada</p>
            
            <hr />
            
            <div className="text-start">
              <h6 className="fw-bold mb-3">Confirmado pelo Home Sweet Home</h6>
              <ul className="list-unstyled text-muted small">
                <li className="mb-2"><i className="bi bi-check2 me-2 fs-5 text-dark"></i> Identidade</li>
                <li className="mb-2"><i className="bi bi-check2 me-2 fs-5 text-dark"></i> Endereço de e-mail</li>
                <li className="mb-2"><i className="bi bi-check2 me-2 fs-5 text-dark"></i> Número de telefone</li>
              </ul>
            </div>
            
            <hr />
            <p className="text-start small text-muted">
              "Refúgio ultraprivado em ilha tropical no Caribe. Ideal para quem quer desaparecer do mapa por alguns dias e viver como se fosse dono do mundo.

Localizada na exclusiva Little Saint James, esta propriedade lendária do empresário Jeffrey Epstein oferece uma experiência que mistura resort de luxo, mansão excêntrica e retiro secreto!"
            </p>
          </div>
        </div>

        {/* COLUNA DIREITA: O CATÁLOGO DE MANSÕES */}
        <div className="col-md-8">
          <h2 className="fw-bold mb-4">Os anúncios de {nomeAnfitriao}</h2>
          
          {imoveis.length === 0 ? (
            <div className="alert alert-light border rounded-4 p-5 text-center">
              <i className="bi bi-house-x fs-1 text-muted mb-3 d-block"></i>
              <h5 className="text-muted">Este anfitrião não possui anúncios ativos no momento.</h5>
            </div>
          ) : (
            <div className="row g-4">
              {imoveis.map(imovel => (
                <div key={imovel.id} className="col-md-6">
                  <Link to={`/detalhes/${imovel.id}`} className="text-decoration-none text-dark">
                    <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden card-hover">
                      <img 
                        src={`https://drlnbbodugxkndtpomfa.supabase.co/storage/v1/object/public/imoveis-imagens/${imovel.imagem}`} 
                        className="card-img-top" 
                        alt={imovel.titulo} 
                        style={{ height: '220px', objectFit: 'cover' }} 
                      />
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <h6 className="card-title fw-bold text-truncate mb-0" style={{ maxWidth: '80%' }}>{imovel.titulo}</h6>
                          <span className="text-dark small"><i className="bi bi-star-fill me-1" style={{ fontSize: '12px' }}></i>4.9</span>
                        </div>
                        <p className="text-muted small mb-2"><i className="bi bi-geo-alt-fill me-1"></i>{imovel.cidade}</p>
                        <p className="card-text">
                          <span className="fw-bold">R$ {imovel.preco_diaria}</span> <span className="text-muted small">/ noite</span>
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default PerfilAnfitriao;