import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

const ListaDeCompras = () => {
  const [lista, setLista] = useState(null); 
  const [filter, setFilter] = useState('all');
  const { authData } = useContext(AuthContext);
  const { token } = authData;
  const { id: listaId } = useParams();

  useEffect(() => {
    // Verifica se o usuário esta logado
    if (!token) {
      alert('Você precisa estar logado para acessar esta página.');
      window.location.href = '/login';
    } else {
      fetchLista(); // Busca os dados da lista
    }
  }, [token]);

  useEffect(() => {
    // Configura Socket.io para comuicação em tempo real
    const socket = io(process.env.REACT_APP_API_URL);

    // Entra na sala específica da lista
    socket.emit('join', `lista_${listaId}`);

    // Ouve o evento do item adicionado
    socket.on('item_adicionado', (item) => {
      setLista((prevLista) => ({
        ...prevLista,
        itens: [...prevLista.itens, item],
      }));
    });
    // Ouve o evento do item atualizado
    socket.on('item_atualizado', (itemAtualizado) => {
      setLista((prevLista) => ({
        ...prevLista,
        itens: prevLista.itens.map((item) =>
          item._id === itemAtualizado._id ? itemAtualizado : item
        ),
      }));
    });
    // Ouve o evento do item removido
    socket.on('item_removido', ({ itemId }) => {
      setLista((prevLista) => ({
        ...prevLista,
        itens: prevLista.itens.filter((item) => item._id !== itemId),
      }));
    });

    // Limpa os listeners e deconecta o socket ao desmontar o componente
    return () => {
      socket.emit('leave', `lista_${listaId}`);
      socket.disconnect();
    };
  }, [listaId]);
  // Função para buscar os dados da lista no servidor
  const fetchLista = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/listas/${listaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLista(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  //  Função para adicionar um novo item à lista
  const addItem = async () => {
    const nome = prompt('Digite o nome do item:');
    if (!nome) return;
  
    const newItem = { nome, quantidade: 1, preco: 0, checked: false };
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/listas/${listaId}/itens`, newItem, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // O Socket.IO cuidará de atualizar a lista em tempo real
    } catch (err) {
      console.error(err);
    }
  };
  
  // Função para atualizar um item existente
  const updateItem = async (itemId, updatedItem) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/listas/${listaId}/itens/${itemId}`, updatedItem, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // O Socket.IO atualizará o estado em tempo real
    } catch (err) {
      console.error(err);
    }
  };
  // Função para deletar um item da lista
  const deleteItem = async (itemId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/listas/${listaId}/itens/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // O Socket.IO atualizará o estado em tempo real
    } catch (err) {
      console.error(err);
    }
  };
  // Lida com as alterações nos campos de entrada dos itens
  const handleInputChange = (index, key, value) => {
    const updatedItem = { ...lista.itens[index], [key]: value };

    if (key === 'quantidade' || key === 'preco') {
      updatedItem.total = updatedItem.quantidade * updatedItem.preco;
    }

    updateItem(updatedItem._id, updatedItem);
  };
  // Alterna o estado de 'marcado' de um item
  const toggleChecked = (index) => {
    const updatedItem = { ...lista.itens[index], checked: !lista.itens[index].checked };
    updateItem(updatedItem._id, updatedItem);
  };
  // Obtém os itens filtrados de acordo com o filtro selecionado
  const getFilteredItems = () => {
    if (!lista) return [];
    if (filter === 'checked') {
      return lista.itens.filter(item => item.checked);
    } else if (filter === 'unchecked') {
      return lista.itens.filter(item => !item.checked);
    }
    return lista.itens;
  };
  // Calcula o valor total da lista
  const calculateTotal = () => {
    if (!lista) return 0;
    return lista.itens.reduce((sum, item) => sum + item.total, 0);
  };
  // Exibe uma mensagem de carregamento enquanto a lista não carrega
  if (!lista) {
    return <div>Carregando...</div>;
  }
  // Renderiza a interface lista de compras
  return (
    <div>
      <h2>{lista.nome}</h2>
      <div className="mb-3">
        <button className="btn btn-primary me-3" onClick={addItem}>Adicionar Item</button>
        <select className="form-select w-auto d-inline" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Todos</option>
          <option value="checked">Marcados</option>
          <option value="unchecked">Desmarcados</option>
        </select>
      </div>
      <ul className="list-group">
        {getFilteredItems().map((item, index) => (
          <li key={item._id} className="list-group-item d-flex align-items-center">
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => toggleChecked(index)}
              className="me-3"
            />
            <input
              type="text"
              placeholder="Nome do Produto"
              value={item.nome}
              onChange={(e) => handleInputChange(index, 'nome', e.target.value)}
              className="form-control me-3"
            />
            <input
              type="number"
              min="1"
              value={item.quantidade}
              onChange={(e) => handleInputChange(index, 'quantidade', parseInt(e.target.value))}
              className="form-control me-3"
            />
            <input
              type="number"
              min="0"
              value={item.preco}
              onChange={(e) => handleInputChange(index, 'preco', parseFloat(e.target.value))}
              className="form-control me-3"
            />
            <span className="ms-auto me-3">Total: R${item.total?.toFixed(2) || '0.00'}</span>
            <button className="btn btn-danger" onClick={() => deleteItem(item._id)}>Excluir</button>
          </li>
        ))}
      </ul>
      <h2 className="my-4">Valor Total: R${calculateTotal().toFixed(2)}</h2>
    </div>
  );
};

export default ListaDeCompras;
