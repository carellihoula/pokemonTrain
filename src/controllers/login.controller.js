const { User } = require("../db/sequelize")
const jwt = require('jsonwebtoken')
const privateKey = require('../auth/private_key')

module.exports.login = (req,res) => {
    User.findOne({
        where :{
            username : req.body.username
        }
    }).then((user) => {
        if(!user){
            const message = `l'utilisateur n'existe pas`
            return res.status(404).json({message})
        }
        bcrypt.compare(req.body.password, user.password)
        .then(isPasswordValid => {
            if(!isPasswordValid){
                const message = `votre password est incorrect`
                return res.status(401).json({message})
            }


            const token  = jwt.sign(
                {UserId: user.id},
                privateKey,
                {expiresIn: '24h'},
                function(err, token) {
                    console.log(token);}
            )
            const message = `vous etes connecté en tant que ${user.username}`
            
            return res.status(200).json({message, data:user, token})
        })
    }).catch((error) => {
        const message = `l'utilisateur n'est pas retrouvé`
        res.status(500).json({message, data: error})
    })
}