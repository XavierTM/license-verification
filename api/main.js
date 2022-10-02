console.clear();


const express = require('express');
const dotenv = require('dotenv');
const { init: dbInit, Driver, Offense } = require('./db');
const Joi = require('@xavisoft/joi');
const morgan = require('morgan');
const cors  = require('cors');

dotenv.config();


const app = express();

// middlewares
app.use(cors({
   origin: '*'
}));

app.use(morgan('dev'));
app.use(express.static('static'))
app.use(express.json());

// routes
app.get('/api/license', async (req, res) => {

   try {

      // validation
      const schema = {
         query: Joi.object({
            license_no: Joi.string(),
            national_id_no: Joi.string(),
         }).min(1)
      }

      const { query } = req;

      const error = Joi.getError({ query});
      if (error)
         return res.status(400).send(error);

      // retriveing
      let driver = await Driver.findOne({ 
         where: { ...query },
         include: {
            model: Offense,
            attributes: [ 'id', 'type', 'details', 'createdAt']
         }
      });

      if (!driver)
         return res.sendStatus(404);

      // formatting
      driver = driver.dataValues;
      driver.offenses = driver.Offenses.map(offense => offense.dataValues);
      delete driver.Offenses;

      res.send(driver);

   } catch (err) {
      res.sendStatus(500);
      console.error(err);
   }
});



const PORT = process.env.PORT;

const server = app.listen(PORT, async () => {
   console.log('Server started at PORT', PORT);
   dbInit();
});


module.exports = server;