const express = require('express')
const { findAllPokemons, findPokemonsByPk, updatePokemon, deletePokemon, createPokemon } = require('../controllers/pokemon.controller')
const auth = require('../auth/auth')
const router = express.Router()
  

router.get('/',auth, findAllPokemons)
router.post('/',auth, createPokemon)
router.get('/:id',auth, findPokemonsByPk)
router.put('/:id',auth, updatePokemon)
router.delete('/:id',auth, deletePokemon)
module.exports = router