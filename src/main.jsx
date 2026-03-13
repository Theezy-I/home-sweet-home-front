import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Importando as suas telas
import Home from './Home'
import Login from './Login'
import Cadastro from './Cadastro'
import Detalhes from './Detalhes'
import Navbar from './components/Navbar'
import CadastrarImovel from './CadastrarImovel';
import MeusAnuncios from './MeusAnuncios';
import PerfilAnfitriao from './PerfilAnfitriao';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/detalhes/:id" element={<Detalhes />} />
        <Route path="/cadastrar-imovel" element={<CadastrarImovel />} />
        <Route path="/meus-anuncios" element={<MeusAnuncios />} />
        <Route path="/perfil/:donoId" element={<PerfilAnfitriao />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)