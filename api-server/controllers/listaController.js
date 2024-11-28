const mongoose = require('mongoose');
const Lista = require('../models/Lista');

// Busca as listas do usuário
exports.getListas = async (req, res) => {
  try {
    const listas = await Lista.find({ usuarioId: req.user.id });
    res.json(listas);
  } catch (err) {
    res.status(500).send('Erro no servidor ao obter listas (api)');
  }
};

// Cria uma nova lista
exports.createLista = async (req, res) => {
  const { nome } = req.body;

  try {
    const newLista = new Lista({
      nome,
      usuarioId: req.user.id,
      itens: [],
    });

    const lista = await newLista.save();

    // Novo evento de lista para a sala conectada do usuário
    req.io.to(`user_${req.user.id}`).emit('lista_nova', lista);

    res.json(lista);
  } catch (err) {
    res.status(500).send('Erro no servidor ao criar lista');
  }
};

// Atualiza a lista
exports.updateLista = async (req, res) => {
  const { nome } = req.body;

  try {
    let lista = await Lista.findById(req.params.id);
    if (!lista) return res.status(404).json({ msg: 'Lista não encontrada' });

    if (lista.usuarioId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Não autorizado' });
    }

    lista.nome = nome || lista.nome;
    lista = await lista.save();

    // Novo evento de atualização de lista
    req.io.to(`user_${req.user.id}`).emit('lista_atualizada', lista);

    res.json(lista);
  } catch (err) {
    res.status(500).send('Erro no servidor ao atualizar lista');
  }
};

// Deleta a lista
exports.deleteLista = async (req, res) => {
  try {
    console.log('Usuário solicitando exclusão:', req.user.id);
    console.log('ID da lista a ser excluída:', req.params.id);

    let lista = await Lista.findById(req.params.id);
    if (!lista) return res.status(404).json({ msg: 'Lista não encontrada' });

    if (lista.usuarioId.toString() !== req.user.id.toString()) {
      return res.status(401).json({ msg: 'Não autorizado' });
    }

    await Lista.findByIdAndDelete(req.params.id);

    // Novo evento ao deletar a lista
    req.io.to(`user_${req.user.id}`).emit('lista_removida', { id: req.params.id });

    res.json({ msg: 'Lista removida com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar lista:', err);
    res.status(500).send('Erro  ao deletar a lista no servidor (api)');
  }
};

// Busca a lista espacifica
exports.getListaById = async (req, res) => {
  try {
    const lista = await Lista.findById(req.params.id);
    if (!lista) return res.status(404).json({ msg: 'Lista não encontrada' });

    if (lista.usuarioId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Não autorizado' });
    }

    res.json(lista);
  } catch (err) {
    res.status(500).send('Erro no servidor ao obter listas (api)');
  }
};

// Adiciona item a lista
exports.addItem = async (req, res) => {
  const { nome, quantidade, preco, checked } = req.body;

  try {
    let lista = await Lista.findById(req.params.id);
    if (!lista) return res.status(404).json({ msg: 'Lista não encontrada' });

    if (lista.usuarioId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Não autorizado' });
    }

    if (!nome) {
      return res.status(400).json({ msg: 'O campo nome é obrigatório' });
    }

    const total = quantidade * preco;
    const newItem = {
      _id: new mongoose.Types.ObjectId(),
      nome,
      quantidade,
      preco,
      total,
      checked,
    };

    lista.itens.push(newItem);
    await lista.save();

    // Novo evento de item adicionado
    req.io.to(`lista_${lista._id}`).emit('item_adicionado', newItem);

    res.json(newItem);
  } catch (err) {
      console.error('Erro ao adicionar item:', err);
      res.status(500).send('Erro no servidor ao add item (api)');
    }
    
  
};


// Atualiza o item da lista
exports.updateItem = async (req, res) => {
  const { nome, quantidade, preco, checked } = req.body;

  try {
    let lista = await Lista.findById(req.params.id);
    if (!lista) return res.status(404).json({ msg: 'Lista não encontrada' });

    if (lista.usuarioId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Não autorizado' });
    }

    const item = lista.itens.id(req.params.itemId);
    if (!item) return res.status(404).json({ msg: 'Item não encontrado' });

    item.nome = nome !== undefined ? nome : item.nome;
    item.quantidade = quantidade !== undefined ? quantidade : item.quantidade;
    item.preco = preco !== undefined ? preco : item.preco;
    item.total = item.quantidade * item.preco;
    item.checked = checked !== undefined ? checked : item.checked;

    await lista.save();

    // Novo evento de item atualizado
    req.io.to(`lista_${lista._id}`).emit('item_atualizado', item);

    res.json(item);
  } catch (err) {
    res.status(500).send('Erro no servidor ao atualizar item da lista (api)');
  }
};

// Deleta item da lista
exports.deleteItem = async (req, res) => {
  try {
    console.log('Usuário solicitando exclusão:', req.user.id);
    console.log('ID da lista:', req.params.id);
    console.log('ID do item a ser excluído:', req.params.itemId);

    let lista = await Lista.findById(req.params.id);
    if (!lista) return res.status(404).json({ msg: 'Lista não encontrada' });

    if (lista.usuarioId.toString() !== req.user.id.toString()) {
      return res.status(401).json({ msg: 'Não autorizado' });
    }

    // Encontrar o item
    const item = lista.itens.id(req.params.itemId);
    if (!item) return res.status(404).json({ msg: 'Item não encontrado' });

    // Remover o item usando o método pull
    lista.itens.pull(item);

    await lista.save();

    // Emitir novo evento de item removido
    req.io.to(`lista_${lista._id}`).emit('item_removido', { itemId: req.params.itemId });

    res.json({ msg: 'Item removido com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar item:', err);
    res.status(500).send('Erro no servidor');
  }
};