import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from './supabase'; 

function Detalhes() {
  const { id } = useParams();
  const [imovel, setImovel] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- ESTADOS DE DATAS ---
  const [dataEntrada, setDataEntrada] = useState('');
  const [dataSaida, setDataSaida] = useState('');

  // --- NOVOS ESTADOS: HÓSPEDES ---
  const [adultos, setAdultos] = useState(1);
  const [criancas, setCriancas] = useState(0);
  const [bebes, setBebes] = useState(0);
  const [pets, setPets] = useState(0);
  const [mostrarDropdown, setMostrarDropdown] = useState(false); // Controla se o menu está aberto

  // --- ESTADOS DE PROCESSAMENTO ---
  const [processando, setProcessando] = useState(false);
  const [reservaConfirmada, setReservaConfirmada] = useState(false);

  useEffect(() => {
    async function fetchImovel() {
      const { data, error } = await supabase.from('imoveis').select('*').eq('id', id).single();
      if (!error) setImovel(data);
      setLoading(false);
    }
    fetchImovel();
  }, [id]);

// --- CALCULADORA DE NOITES (DERIVED STATE - PADRÃO SÊNIOR) ---
  let noites = 0;
  if (dataEntrada && dataSaida) {
    const entrada = new Date(dataEntrada);
    const saida = new Date(dataSaida);
    const diferencaTempo = saida.getTime() - entrada.getTime();
    const diferencaDias = Math.ceil(diferencaTempo / (1000 * 3600 * 24));
    noites = diferencaDias > 0 ? diferencaDias : 0;
  }

  // --- NOVA MATEMÁTICA DE PREÇOS (TAXA DE HÓSPEDE EXTRA) ---
  const totalPagantes = adultos + criancas;
  let precoDiariaCalculado = imovel?.preco_diaria || 0;

  // Regra: O preço base cobre 2 pessoas. Acima disso, cobra +20% por pessoa extra.
  if (totalPagantes > 2) {
    const taxaExtraPorPessoa = (imovel?.preco_diaria * 0.20);
    precoDiariaCalculado += taxaExtraPorPessoa * (totalPagantes - 2);
  }

  const valorTotal = noites > 0 ? (precoDiariaCalculado * noites) : precoDiariaCalculado;

  // --- FUNÇÃO PARA FORMATAR O TEXTO DO INPUT ---
  const formatarResumoHospedes = () => {
    let resumo = `${totalPagantes} hóspede${totalPagantes > 1 ? 's' : ''}`;
    if (bebes > 0) resumo += `, ${bebes} bebê${bebes > 1 ? 's' : ''}`;
    if (pets > 0) resumo += `, ${pets} pet${pets > 1 ? 's' : ''}`;
    return resumo;
  };

  const handleReservar = () => {
    if (noites <= 0) {
      alert("Selecione um período válido para continuar.");
      return;
    }
    setProcessando(true);
    setMostrarDropdown(false); // Fecha o menu se estiver aberto
    
    setTimeout(() => {
      setProcessando(false);
      setReservaConfirmada(true);
      alert(`Confirmação de Reserva\n\nEstadia: ${noites} noites\nHóspedes: ${formatarResumoHospedes()}\nValor Total: R$ ${valorTotal.toFixed(2)}\nStatus: Pagamento processado.`);
    }, 2500); 
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-danger"></div></div>;
  if (!imovel) return <div className="container mt-5 text-center"><h2>Imóvel não encontrado.</h2></div>;

  return (
    <div className="container mt-4 mb-5">
      <Link to="/" className="btn btn-outline-secondary mb-4">← Voltar</Link>

      <div className="row">
        {/* COLUNA DA ESQUERDA (MANTIDA IGUAL) */}
        <div className="col-md-8 mb-4">
          <img 
            src={`https://drlnbbodugxkndtpomfa.supabase.co/storage/v1/object/public/imoveis-imagens/${imovel.imagem}`} 
            alt={imovel.titulo} 
            className="img-fluid rounded-4 shadow-sm mb-4" 
            style={{ width: '100%', maxHeight: '450px', objectFit: 'cover' }} 
          />

          <div className="border rounded-4 p-3 d-flex align-items-center justify-content-between mb-4 shadow-sm">
            <div className="d-flex align-items-center">
              <i className="bi bi-award fs-2 text-dark me-3"></i>
              <div>
                <h6 className="fw-bold mb-0">Escolha dos hóspedes</h6>
                <p className="text-muted small mb-0">Uma das acomodações mais amadas, de acordo com os hóspedes</p>
              </div>
            </div>
            <div className="text-center border-start ps-4">
              <h5 className="fw-bold mb-0">4.96</h5>
              <div className="text-dark" style={{ fontSize: '10px' }}>★★★★★</div>
            </div>
            <div className="text-center border-start ps-4">
              <h5 className="fw-bold mb-0">54</h5>
              <p className="text-muted small mb-0">Avaliações</p>
            </div>
          </div>

          {/* PERFIL DO ANFITRIÃO CLICÁVEL (A MÁGICA FOI FEITA AQUI!) */}
          <Link to={`/perfil/${imovel.dono_id}`} className="text-decoration-none text-dark">
            <div className="d-flex align-items-center mb-4 p-3 border rounded-4 shadow-sm" style={{ cursor: 'pointer' }}>
              <img src={`https://ui-avatars.com/api/?name=${imovel.nome_dono || 'A'}&background=random`} alt="Host" className="rounded-circle me-3" style={{ width: '55px', height: '55px' }} />
              <div>
                <h5 className="mb-0 fw-bold">Hospedado por {imovel.nome_dono || 'Anfitrião'}</h5>
                <span className="text-muted small">Superhost · Clique para ver o perfil completo</span>
              </div>
              <i className="bi bi-chevron-right ms-auto fs-4 text-muted"></i>
            </div>
          </Link>

          <hr className="my-4" />

          <div className="mb-4">
            <div className="d-flex align-items-start mb-3">
              <i className="bi bi-trophy fs-4 me-3 mt-1"></i>
              <div>
                <h6 className="fw-bold mb-1">Top 5% das acomodações</h6>
                <p className="text-muted small">Este imóvel é altamente ranqueado com base em avaliações e confiabilidade.</p>
              </div>
            </div>
            <div className="d-flex align-items-start mb-3">
              <i className="bi bi-door-open fs-4 me-3 mt-1"></i>
              <div>
                <h6 className="fw-bold mb-1">Self check-in</h6>
                <p className="text-muted small">Faça o check-in sozinho usando a fechadura digital.</p>
              </div>
            </div>
            <div className="d-flex align-items-start mb-3">
              <i className="bi bi-house-heart fs-4 me-3 mt-1"></i>
              <div>
                <h6 className="fw-bold mb-1">Quarto em unidade residencial</h6>
                <p className="text-muted small">Seu próprio quarto em uma casa, além de acesso a espaços compartilhados.</p>
              </div>
            </div>
          </div>

          <hr className="my-4" />
          <p style={{ whiteSpace: 'pre-line' }} className="fs-5">{imovel.descricao}</p>
        </div>

        {/* COLUNA DA DIREITA (CARD DE RESERVA REFORMULADO) */}
        <div className="col-md-4">
          <div className="card shadow border p-4 sticky-top" style={{ top: '20px', borderRadius: '15px' }}>
            
            {/* VALOR DINÂMICO NO TOPO (Mostra se a diária subiu) */}
            <h4 className="fw-bold mb-4">
              {totalPagantes > 2 && (
                 <span className="text-decoration-line-through text-muted fs-6 me-2">R$ {imovel.preco_diaria}</span>
              )}
              R$ {precoDiariaCalculado.toFixed(2)} <span className="fs-6 fw-normal text-muted">/ noite</span>
            </h4>

            <div className="border rounded-3 mb-3 position-relative">
              <div className="row g-0 border-bottom">
                <div className="col-6 p-2 border-end">
                  <label className="d-block small fw-bold text-uppercase" style={{ fontSize: '10px' }}>Check-in</label>
                  <input type="date" className="form-control border-0 p-0 shadow-none" value={dataEntrada} onChange={(e) => setDataEntrada(e.target.value)} />
                </div>
                <div className="col-6 p-2">
                  <label className="d-block small fw-bold text-uppercase" style={{ fontSize: '10px' }}>Checkout</label>
                  <input type="date" className="form-control border-0 p-0 shadow-none" value={dataSaida} onChange={(e) => setDataSaida(e.target.value)} />
                </div>
              </div>
              
              {/* BOTÃO DE ABRIR HÓSPEDES */}
              <div 
                className="p-2 d-flex justify-content-between align-items-center" 
                style={{ cursor: 'pointer' }}
                onClick={() => setMostrarDropdown(!mostrarDropdown)}
              >
                <div>
                  <label className="d-block small fw-bold text-uppercase" style={{ fontSize: '10px', cursor: 'pointer' }}>Hóspedes</label>
                  <span className="small">{formatarResumoHospedes()}</span>
                </div>
                <i className={`bi bi-chevron-${mostrarDropdown ? 'up' : 'down'}`}></i>
              </div>

              {/* DROPDOWN DE HÓSPEDES (FLUTUANTE) */}
              {mostrarDropdown && (
                <div className="position-absolute w-100 bg-white border rounded-3 shadow-lg p-3" style={{ top: '100%', left: 0, zIndex: 1000, marginTop: '5px' }}>
                  
                  {/* Adultos */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <div className="fw-bold">Adultos</div>
                      <div className="text-muted small">Idade: 13+</div>
                    </div>
                    <div className="d-flex align-items-center">
                      <button className="btn btn-outline-secondary rounded-circle btn-sm" style={{ width: '32px', height: '32px' }} onClick={() => setAdultos(Math.max(1, adultos - 1))} disabled={adultos <= 1}>-</button>
                      <span className="mx-3">{adultos}</span>
                      <button className="btn btn-outline-secondary rounded-circle btn-sm" style={{ width: '32px', height: '32px' }} onClick={() => setAdultos(adultos + 1)}>+</button>
                    </div>
                  </div>

                  {/* Crianças */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <div className="fw-bold">Crianças</div>
                      <div className="text-muted small">Idades: 2–12</div>
                    </div>
                    <div className="d-flex align-items-center">
                      <button className="btn btn-outline-secondary rounded-circle btn-sm" style={{ width: '32px', height: '32px' }} onClick={() => setCriancas(Math.max(0, criancas - 1))} disabled={criancas <= 0}>-</button>
                      <span className="mx-3">{criancas}</span>
                      <button className="btn btn-outline-secondary rounded-circle btn-sm" style={{ width: '32px', height: '32px' }} onClick={() => setCriancas(criancas + 1)}>+</button>
                    </div>
                  </div>

                  {/* Bebês */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <div className="fw-bold">Bebês</div>
                      <div className="text-muted small">Menores de 2</div>
                    </div>
                    <div className="d-flex align-items-center">
                      <button className="btn btn-outline-secondary rounded-circle btn-sm" style={{ width: '32px', height: '32px' }} onClick={() => setBebes(Math.max(0, bebes - 1))} disabled={bebes <= 0}>-</button>
                      <span className="mx-3">{bebes}</span>
                      <button className="btn btn-outline-secondary rounded-circle btn-sm" style={{ width: '32px', height: '32px' }} onClick={() => setBebes(bebes + 1)}>+</button>
                    </div>
                  </div>

                  {/* Pets */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <div className="fw-bold">Pets</div>
                      <a href="#" className="text-muted small text-decoration-underline">Trazendo um animal de serviço?</a>
                    </div>
                    <div className="d-flex align-items-center">
                      <button className="btn btn-outline-secondary rounded-circle btn-sm" style={{ width: '32px', height: '32px' }} onClick={() => setPets(Math.max(0, pets - 1))} disabled={pets <= 0}>-</button>
                      <span className="mx-3">{pets}</span>
                      <button className="btn btn-outline-secondary rounded-circle btn-sm" style={{ width: '32px', height: '32px' }} onClick={() => setPets(pets + 1)}>+</button>
                    </div>
                  </div>

                  <p className="text-muted small mb-3">
                    Este espaço acomoda no máximo 6 hóspedes (não incluindo bebês).
                  </p>
                  
                  <div className="text-end">
                    <button className="btn btn-link text-dark fw-bold text-decoration-underline p-0" onClick={() => setMostrarDropdown(false)}>
                      Fechar
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={handleReservar} 
              className={`btn w-100 fw-bold py-3 mb-3 ${reservaConfirmada ? 'btn-success' : 'btn-danger'}`}
              style={{ backgroundColor: !reservaConfirmada && !processando ? '#E31C5F' : '', border: 'none' }}
              disabled={processando || reservaConfirmada}
            >
              {processando ? (
                <><span className="spinner-border spinner-border-sm me-2"></span>Processando...</>
              ) : reservaConfirmada ? (
                "Reserva Confirmada"
              ) : (
                "Reservar"
              )}
            </button>

            <p className="text-center text-muted small">Você ainda não será cobrado</p>

            {noites > 0 && (
              <div className="mt-3">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-decoration-underline">
                    R$ {precoDiariaCalculado.toFixed(2)} x {noites} noites
                  </span>
                  <span>R$ {valorTotal.toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold fs-5">
                  <span>Total (BRL)</span>
                  <span>R$ {valorTotal.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detalhes;