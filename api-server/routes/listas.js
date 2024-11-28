const express = require('express');
const router = express.Router();
const listaController = require('../controllers/listaController');
const auth = require('../middlewares/auth');

// Rotas de Listas
router.get('/', auth, listaController.getListas);
router.post('/', auth, listaController.createLista);
router.get('/:id', auth, listaController.getListaById);
router.put('/:id', auth, listaController.updateLista);
router.delete('/:id', auth, listaController.deleteLista);

// Rotas de Itens dentro de uma lista
router.post('/:id/itens', auth, listaController.addItem);
router.put('/:id/itens/:itemId', auth, listaController.updateItem);
router.delete('/:id/itens/:itemId', auth, listaController.deleteItem);

module.exports = router;
