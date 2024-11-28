import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const MinhasListas = () => {
  // Estados para armazenar listas do usuário, nome da nova lista
  const [listas, setListas] = useState([]);
  const [nomeLista, setNomeLista] = useState('');
  const { authData } = useContext(AuthContext);
  const { token, userName } = authData;

  useEffect(() => {
    // Verifica se o usuário esta logado
    if (!token) {
      alert('Você precisa estar logado para acessar esta página.');
      window.location.href = '/login';
    } else {
      fetchListas(); // Bsca as listas do usuário
    }
  }, [token]);
  // Função para buscar as listas do usuário no servidor
  const fetchListas = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/listas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListas(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  // Função para criar uma nova lista
  const criarLista = async () => {
    if (nomeLista.trim() === '') {
      alert('O nome da lista não pode estar vazio.');
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/listas`,
        { nome: nomeLista },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNomeLista('');
      setListas((prevListas) => [...prevListas, res.data]);
    } catch (err) {
      console.error(err);
    }
  };
  // Função para deletar uma lista existente
  const deletarLista = async (id) => {
    if (window.confirm('Você tem certeza que deseja deletar esta lista?')) {
      try {
        console.log('Deletando lista com ID:', id);
        await axios.delete(`${process.env.REACT_APP_API_URL}/listas/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Atualizar o estado 'listas' removendo a lista deletada
        setListas((prevListas) => prevListas.filter((lista) => lista._id !== id));
      } catch (err) {
        console.error(err.response ? err.response.data : err.message);
      }
    }
  };

  return (
    <div>
      <h2>Minhas Listas</h2>
      <div className="mb-3">
        <input
          type="text"
          placeholder="Nome da Nova Lista"
          value={nomeLista}
          onChange={(e) => setNomeLista(e.target.value)}
          className="form-control"
        />
        <button className="btn btn-primary mt-2" onClick={criarLista}>
          Criar Lista
        </button>
      </div>
      <ul className="list-group">
        {listas.map((lista) => (
          <li
            key={lista._id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <Link to={`/lista/${lista._id}`}>{lista.nome}</Link>
            <button className="btn btn-danger" onClick={() => deletarLista(lista._id)}>
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MinhasListas;
