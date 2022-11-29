const { Model, DataTypes, Sequelize } = require("sequelize");
const { LICENSE_CLASSES, SEXES } = require("../config");

class Driver extends Model {
   static init(sequelize) {
      super.init({
         name: {
            type: DataTypes.STRING,
            allowNull: false,
         },
         surname: {
            type: DataTypes.STRING,
            allowNull: false,
         },
         sex: {
            type: DataTypes.ENUM(...SEXES),
            allowNull: false,
         },
         dob: {
            type: DataTypes.DATE,
            allowNull: false,
         },
         national_id_no: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
         },
         license_no: {
            type: DataTypes.STRING,
            primaryKey: true,
         },
         class: {
            type: DataTypes.ENUM(...LICENSE_CLASSES),
            allowNull: false,
         }
      }, { sequelize, updatedAt: false });
   }
}

class Offense extends Model {
   static init(sequelize) {
      super.init({
         type: {
            type: DataTypes.STRING,
            allowNull: false,
         },
         details: {
            type: DataTypes.TEXT,
            allowNull: false,
         },
      }, { sequelize, updatedAt: false });
   }
}

class User extends Model {
   static init(sequelize) {
      super.init({
         username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
         },
         password: {
            type: DataTypes.STRING,
            allowNull: false,
         },
         type: {
            type: DataTypes.ENUM('officer', 'admin'),
            defaultValue: 'officer',
            allowNull: false
         }
      }, { sequelize });
   }
}


const dialect = `sqlite::${__dirname}/db.sqlite`;
const sequelize = new Sequelize(dialect, { logging: false, dialect: 'sqlite' });

async function init() {

   Driver.init(sequelize);
   Offense.init(sequelize);
   User.init(sequelize);

   Driver.hasMany(Offense, {
      foreignKey: {
         name: 'driver',
         allowNull: false,
      },
      onDelete: 'CASCADE'
   });

   const force = process.env.NODE_ENV !== 'production';
   await sequelize.sync({ force });

   try {

      await User.create({
         username: 'admin',
         password: 'admin',
         type: 'admin',
      });

      const json = await require('fs').promises.readFile(`${__dirname}/data.json`, { encoding: 'utf8' });
      const drivers = JSON.parse(json);
      const offenses = drivers.reduce((prev, driver) => {
         prev.push(...driver.Offenses);
         return prev;
      }, []);
   
      await Driver.bulkCreate(drivers);
      await Offense.bulkCreate(offenses);
      
   } catch (err) {
      console.log(String(err));
   }
   


}


module.exports = {
   Driver,
   Offense,
   User,
   init
}