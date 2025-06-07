const express = require('express');
const router = express.Router();

const Usuario = require('../models/usuario')

router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});


module.exports = router;