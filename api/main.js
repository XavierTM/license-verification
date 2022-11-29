console.clear();


const express = require('express');
const dotenv = require('dotenv');
const { init: dbInit, Driver, Offense, User } = require('./db');
const Joi = require('@xavisoft/joi');
const morgan = require('morgan');
const cors  = require('cors');
const status_500 = require('./status_500');
const { fakeLicenseNo } = require('./utils');
const { SEXES } = require('./config');
const fs = require('fs/promises');

dotenv.config();


const app = express();

// middlewares
app.use(cors({
   origin: '*'
}));

app.use(morgan('dev'));
app.use(express.static('static'))
app.use(express.json({ limit: '10mb' }));

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

      const error = Joi.getError({ query }, schema);
      if (error)
         return res.status(400).send(error);

      // retriveing
      let driver = await Driver.findOne({ 
         where: { ...query },
         include: {
            model: Offense,
            attributes: [ 'id', 'type', 'details', 'createdAt'],
            order: [ [ 'createdAt', 'ASC' ] ]
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
      status_500(err, res);
   }
});

app.get('/api/drivers', async (req, res) => {

   try {

      // retrieve drivers
      const drivers = await Driver.findAll();
      res.send(drivers);

   } catch (err) {
      status_500(err, res);
   }
});

app.post('/api/drivers', async (req, res) => {

   try {

      // validation
      const schema = {
         national_id_no: Joi.string().required(),
         name: Joi.string().required(),
         surname: Joi.string().required(),
         sex: Joi.valid(...SEXES).required(),
         image: Joi.string().base64().required(),
         dob: Joi.date().required(),
         class: Joi.number().integer().required(),
      }

      const error = Joi.getError(req.body, schema);
      if (error)
         return res.status(400).send(error);

      // save data
      /// create license_no
      const license_no = fakeLicenseNo();

      /// save to db
      await Driver.create({ ...req.body, license_no });

      /// save file to disk
      const imagePath = `${__dirname}/static/img/drivers/${license_no}.jpg`;
      await fs.writeFile(imagePath, req.body.image, 'base64');

      // send response
      res.send({ license_no });

      

   } catch (err) {
      status_500(err, res);
   }

});

app.patch('/api/drivers/:license_no', async (req, res) => {

   try {

      // validation
      const schema = {
         class: Joi.number().integer().required()
      }

      const error = Joi.getError(req.body, schema);
      if (error)
         return res.status(400).send(error);

      // update
      await Driver.update(req.body, {
         where: {
            license_no: req.params.license_no
         }
      });

      res.send();

   } catch (err) {
      status_500(err, res);
   }
});

app.post('/api/drivers/:license_no/offenses', async (req, res) => {
   try {

      // validation
      const schema = {
         type: Joi.string().required(),
         details: Joi.string().required(),
      }

      const error = Joi.getError(req.body, schema);
      if (error)
         return res.status(400).send(error);

      // save to db
      const offense = await Offense.create({
         ...req.body,
         driver: req.params.license_no
      });

      // response
      const { id } = offense;
      res.send({ id });

   } catch (err) {
      status_500(err, res);
   }
});


app.post('/api/users', async (req, res) => {

   try {

      const schema = {
         username: Joi.string().required(),
         password: Joi.string().required(),
      }

      const error = Joi.getError(req.body, schema);
      if (error)
         return res.status(400).send(error);

      const password = req.body.password;
      const username = req.body.username.toLowerCase();

      const { id, createdAt } = await User.create({ username, password });
      res.send({ id, createdAt });

   } catch (err) {

      status_500(err, res);
   }
});


app.post('/api/login', async (req, res) => {

   try {

      const schema = {
         username: Joi.string().required(),
         password: Joi.string().required(),
         type: Joi.string().required(),
      }


      const error = Joi.getError(req.body, schema);
      if (error)
         return res.status(400).send(error);


      const { password, type } = req.body;
      const username = req.body.username.toLowerCase();

      const user = await User.findOne({ where: {
         username,
         password,
         type,
      } });

      if (!user)
         res.status(400).send('Invalid credentials');

      res.send();

   } catch (err) {
      status_500(err, res);
   }

});


app.get('/api/users', async (req, res) => {
   
   try {

      const users = await User.findAll({
         where: {
            type: 'officer'
         },
         attributes: [ 'id', 'username', 'createdAt' ]
      });

      res.send(users);

   } catch (err) {
      status_500(err, res);
   }
})



const PORT = process.env.PORT;

const server = app.listen(PORT, async () => {
   console.log('Server started at PORT', PORT);
   dbInit();
});


module.exports = server;