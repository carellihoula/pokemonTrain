const { ValidationError, UniqueConstraintError } = require('sequelize');
const {Pokemon} = require('../db/sequelize'); 
const { Op } = require("sequelize");
const auth = require('../auth/auth')

module.exports.findAllPokemons = (req, res) =>{
    if(req.query.name){
        const name = req.query.name
        return Pokemon.findAll({
            where:{
                name: {
                    [Op.eq] : name
                }
            }
        }).then((pokemons) =>{
            if(pokemons === null){
                const message = 'pas de pokemons a ce nom'
                return res.status(404).json({message})
            }
            const message = `nous avons retrouvés ${pokemons.length} correspond au nom ${name}`
            res.status(200).json({message, data: pokemons})
        })
    }
    Pokemon.findAll()
    .then((pokemons)=>{
        const message = "vos pokemons ont été récupérés avec sucess"
        res.status(200).json({message,pokemons})
    })
    .catch((err) => {
        const message = 'la liste des pokemons n\'a pas pu etre récupéré. Reessayez dans quelques instants'
        res.status(500).json({message, data: err})
    })
}

module.exports.findPokemonsByPk = (auth, req, res) => {
    const id = parseInt(req.params.id)
    Pokemon.findByPk(id)
    .then((pokemon)=>{
        if(pokemon === null){
            const message = "le pokemon demandé n'existe pas. reessayez avec un autre identifiant"
            res.status(404).json({message})
        }
        const message = `le pokemon ${pokemon.name} a été récupéré avec sucess`
        res.status(200).json({message,pokemon})
    })
    .catch((err) => res.status(500).json({message:"pokemon introuvable", data:err}))
}

module.exports.createPokemon = (auth, req, res) => {
    Pokemon.create(req.body)
    .then(pokemon => {
        const message = `votre pokemon ${req.body.name} a été créé avec sucess`
        res.status(200).json({message, pokemon})
    })
    .catch((error)=>{
        if(error instanceof ValidationError){
            return res.status(400).json({message:error.message, data: error})
        }
        if(error instanceof UniqueConstraintError){
            return res.status(400).json({message:error.message, data: error})
        }
        const message = "le pokemon n'a pas pu etre ajouté"
        res.status(500).json({message, data:error})
    })
}

module.exports.updatePokemon = (auth, req, res) => {
    const id = parseInt(req.params.id)
    Pokemon.update(req.body,{
        where: {
            id: id
          }
    })
    .then(_ =>{ 
        return Pokemon.findByPk(id)
    .then((pokemon)=>{
        if(pokemon === null){
            const message = "le pokemon n'existe pas"
            return res.status(404).json({message})
        }
        const message = `votre pokemon ${pokemon.name} a été mis a jour`
        res.status(200).json({message, data:pokemon})
    })
  })
    .catch(error => {
        if(error instanceof ValidationError){
            return res.status(400).json({message:error.message})
        }
        if(error instanceof UniqueConstraintError){
            return res.status(400).json({message:error.message, data: error})
        }
        const message = "pokemon n'a pas pu etre modifié "
        res.status(500).json({message, data:error})
    })
}

module.exports.deletePokemon = (auth, req, res) => {
    const id = parseInt(req.params.id)
    Pokemon.findByPk(id)
    .then(pokemon=>{
        if(pokemon === null){
            const message = "le pokemon n'existe pas"
            return res.status(404).json({message})
        }
        const pokemonDeleted = pokemon
        return Pokemon.destroy({
            where:{id: pokemon.id}
        })
        .then(_ => {
            const message = `le pokemon ${pokemon.name} a été supprimé`
            res.status(200).json({message, data: pokemonDeleted})
        })
    })
    .catch(error => {
        const message = "le pokemon n'a pas pu etre supprimé"
        res.status(400).json({message, data: error})
    })

}