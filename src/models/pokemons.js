const validTypes = ['Plante','Poison','Feu','Eau','Insecte','Vol','Normal','Electrik','Fée']

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Pokemon', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique:{
            msg: 'le nom du pokemon est deja pris'
          },
          validate:{
            notEmpty:{msg:"le champ ne doit pas etre vide"},
            notNull: {msg:"nom est requis"}
          }
        },
        hp: {
          type: DataTypes.INTEGER,
          allowNull: false,
          Validate:{
            isInt : {msg:"les point de vies sont des entiers"},
            notNull: {msg:"point de vies requis"},
            min:{
              args: [0],
              msg: `le point de vies doit etre superieur ou egale à 0`
            },
            max:{
              args: [999],
              msg: `le point de vies doit etre inferieur ou egale à 999`
            }
            
          }
        },
        cp: {
          type: DataTypes.INTEGER,
          allowNull: false,
          Validate:{
            isInt : {msg:"les point de vies sont des entiers"},
            notNull: {msg:"point de degats est requis"},
            min:{
              args: [0],
              msg: `le point de degats doit etre inferieur ou egale à 0`
            },
            max:{
              args: [99],
              msg: `le point de degats doit etre inferieur ou egale à 99`
            }
          }
        },
        picture: {
          type: DataTypes.STRING,
          allowNull: false,
          validate:{
            isUrl : {msg:"veuillez entrer une adresse url valide pour l'image"},
            notNull: {msg:"url est requis"}

          }
        },
        types: {
          type: DataTypes.STRING,
          allowNull: false,
          get(){
            return this.getDataValue('types').split(',');
          },
          set(types){
            this.setDataValue('types', types.join())
          },
          //implementer notre propre validateur
          validate:{
            isTypeValid(value){
              if(!value){
                throw new Error("un pokemon doit au moins avoir un type")
              }
              if(value.split(',').length > 3 ){
                throw new Error("un pokemon ne doit pas voir plus de 3 types")
              }
              value.split(',').forEach(type => {
                if(!validTypes.includes(type)){
                  throw new Error(`chaque type doit appartenir à la liste suivante: " ${validTypes}`)
                }
              })
            }
          }
        }
      }, {
        timestamps: true,
        createdAt: 'created',
        updatedAt: false
      })
}