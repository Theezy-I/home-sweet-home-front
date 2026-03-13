import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { Link } from 'react-router-dom';

function MeusAnuncios() {
  const [imoveis, setImoveis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMeusImoveis() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from('imoveis')
          .select('*')
          .eq('dono_id', user.id) 
          .order('id', { ascending: false });

        if (!error) setImoveis(data);
      }
      setLoading(false);
    }
    fetchMeusImoveis();
  }, []);

  // ESSA É A ÚNICA QUE PRECISA EXISTIR:
  const handleExcluir = async (id, nomeImagem) => {
    if (window.confirm("Deseja mesmo remover este anúncio e a foto dele do servidor do Filipe?")) {
      
      // 1. DELETA LÁ (Banco de Dados)
      const { error: dbError } = await supabase
        .from('imoveis')
        .delete()
        .eq('id', id);
      
      // 2. DELETA CÁ (Storage)
      if (nomeImagem && nomeImagem !== 'sem-foto.png') {
        await supabase.storage
          .from('imoveis-imagens')
          .remove([nomeImagem]);
      }

      if (!dbError) {
        // Remove da tela na hora
        setImoveis(imoveis.filter(imovel => imovel.id !== id));
        alert("Sucesso! Anúncio e imagem apagados.");
      } else {
        alert("Erro ao excluir: " + dbError.message);
      }
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-danger"></div></div>;

  return (
    <div className="container mt-5">
      <h2 className="fw-bold mb-4">Meus Anúncios</h2>
      {imoveis.length === 0 ? (
        <p className="text-muted">Você ainda não anunciou nada. <Link to="/cadastrar-imovel">Anunciar agora!</Link></p>
      ) : (
        <div className="row">
          {imoveis.map(imovel => (
            <div key={imovel.id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm border-0">
                <img src={`https://drlnbbodugxkndtpomfa.supabase.co/storage/v1/object/public/imoveis-imagens/${imovel.imagem}`} className="card-img-top" alt={imovel.titulo} style={{ height: '200px', objectFit: 'cover' }} />
                <div className="card-body">
                  <h5 className="card-title fw-bold">{imovel.titulo}</h5>
                  <button onClick={() => handleExcluir(imovel.id, imovel.imagem)} className="btn btn-outline-danger w-100">Excluir Anúncio</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MeusAnuncios;