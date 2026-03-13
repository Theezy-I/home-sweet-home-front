import { useState } from 'react';
import { supabase } from './supabase';
import { useNavigate } from 'react-router-dom';

function CadastrarImovel() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [cidade, setCidade] = useState('');
  const [preco, setPreco] = useState('');
  const [imagem, setImagem] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Pega o usuário logado de verdade
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sessão expirada. Faça login novamente!");

      let nomeArquivoImagem = 'sem-foto.png';

      // 2. Upload da Imagem Real
      if (imagem) {
        const extensao = imagem.name.split('.').pop();
        nomeArquivoImagem = `${Date.now()}.${extensao}`;

        const { error: uploadError } = await supabase.storage
          .from('imoveis-imagens')
          .upload(nomeArquivoImagem, imagem);

        if (uploadError) throw uploadError;
      }

      // 3. Salvar no Banco (SEM GAMBIARRA AGORA!)
      const { error: dbError } = await supabase
        .from('imoveis')
        .insert([
          {
            titulo: titulo,
            descricao: descricao,
            cidade: cidade,
            preco_diaria: preco,
            dono_id: user.id, // <--- O ID REAL COM LETRAS E NÚMEROS AGORA FUNCIONA!
            imagem: nomeArquivoImagem
          }
        ]);

      if (dbError) throw dbError;

      alert("Imóvel anunciado com sucesso!");
      navigate('/');
    } catch (error) {
      alert("Erro no processo: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm border-0 p-4">
            <h2 className="text-danger fw-bold mb-4">Anuncie seu espaço</h2>
            <form onSubmit={handleCadastro}>
              <div className="mb-3">
                <label className="form-label fw-bold">Título</label>
                <input type="text" className="form-control" onChange={(e) => setTitulo(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Descrição</label>
                <textarea className="form-control" rows="3" onChange={(e) => setDescricao(e.target.value)} required></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Foto Real</label>
                <input type="file" className="form-control" accept="image/*" onChange={(e) => setImagem(e.target.files[0])} required />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Cidade</label>
                  <input type="text" className="form-control" onChange={(e) => setCidade(e.target.value)} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Preço</label>
                  <input type="number" step="0.01" className="form-control" onChange={(e) => setPreco(e.target.value)} required />
                </div>
              </div>
              <button type="submit" className="btn btn-success w-100 fw-bold mt-3" disabled={loading}>
                {loading ? "Processando..." : "Publicar Anúncio Oficial"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CadastrarImovel;