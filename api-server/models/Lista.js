const mongoose = require('mongoose');

// Cria um esquema de item no banco
const ItemSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  quantidade: { type: Number, default: 1 },
  preco: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  checked: { type: Boolean, default: false },
});
// Cria um esquema de lista no banco
const ListaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itens: [ItemSchema],
});

module.exports = mongoose.model('Lista', ListaSchema);
