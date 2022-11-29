
const server = require('../main');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { init: dbInit, Driver, Offense, User } = require('../db');
const Joi = require('@xavisoft/joi');
const { SEXES, LICENSE_CLASSES } = require('../config');
const { createFakeDriverData, createFakeOffensesData } = require('../utils');
const fs = require('fs/promises');
const casual = require('casual');

chai.use(chaiHttp);
const { assert } = chai;

const requester = chai.request(server).keepOpen();


suite("Tests", function() {

   let license_no, national_id_no;
   let officerUsername;
   let officerPassword;

   this.beforeAll(async () => {
      await dbInit();

      const driverData = createFakeDriverData();
      const driver = await Driver.create(driverData);

      license_no = driver.license_no;
      national_id_no = driver.national_id_no;

      const offenseData = createFakeOffensesData(license_no);

      await Offense.bulkCreate(offenseData);

   });

   this.afterAll(async () => {
      await dbInit();
      server.close();
   });

   test(`Sending a license_no parameter should return license info`, async () => {

      const res = await requester.get(`/api/license?license_no=${license_no}`);

      assert.equal(res.status, 200);
      assert.isObject(res.body);

      const schema = {
         name: Joi.string().required(),
         surname: Joi.string().required(),
         dob: Joi.date().required(),
         national_id_no: Joi.string().required(),
         sex: Joi.valid(...SEXES).required(),
         license_no: Joi.string().required(),
         createdAt: Joi.date().required(),
         class: Joi.valid(...LICENSE_CLASSES).required(),
         offenses: Joi.array().items({
            id: Joi.number().integer(),
            type: Joi.string().required(),
            details: Joi.string().required(),
            createdAt: Joi.date().required(),
         }).required(),
      }

      const error = Joi.getError(res.body, schema);
      assert.equal(error, null);

   });

   test(`Sending a national_id_no parameter should return license info`, async () => {

      const res = await requester.get(`/api/license?national_id_no=${national_id_no}`);

      assert.equal(res.status, 200);
      assert.isObject(res.body);

      const schema = {
         name: Joi.string().required(),
         surname: Joi.string().required(),
         dob: Joi.date().required(),
         national_id_no: Joi.string().required(),
         sex: Joi.valid(...SEXES).required(),
         license_no: Joi.string().required(),
         createdAt: Joi.date().required(),
         class: Joi.valid(...LICENSE_CLASSES).required(),
         offenses: Joi.array().items({
            id: Joi.number().integer(),
            type: Joi.string().required(),
            details: Joi.string().required(),
            createdAt: Joi.date().required(),
         }).required(),
      }

      const error = Joi.getError(res.body, schema);
      assert.equal(error, null);

   });

   test('POST /api/drivers should save a driver into the database', async () => {

      const driver = createFakeDriverData();
      delete driver.license_no;
      delete driver.createdAt;

      driver.image = await fs.readFile(`${__dirname}/assets/base64`, 'utf-8');

      const res = await requester.post('/api/drivers').send(driver);

      // check db
      const { license_no } = res.body;
      const dbDriver = await Driver.findOne({ where: { license_no }});
      assert.isObject(dbDriver);

      // check image
      const imagePath = `${__dirname}/../static/img/drivers/${license_no}.jpg`;
      await fs.access(imagePath, fs.constants.F_OK);

      // delete image
      await fs.unlink(imagePath);
      
   });

   test('POST /api/drivers/:license_no/offenses should add offense to the database', async () => {

      const [ offense ] = createFakeOffensesData(undefined, 1);

      delete offense.createdAt;

      const res = await requester.post(`/api/drivers/${license_no}/offenses`).send(offense);

      assert.equal(res.status, 200);
      assert.isNumber(res.body.id);

      // check db
      const { id } = res.body;

      const dbOffense = await Offense.findOne({ where: {
         driver: license_no,
         id
      }});

      assert.isObject(dbOffense);
      assert.equal(offense.details, dbOffense.details);

   });

   test('PATCH /api/drivers/:license_no should update class', async () => {

      const payload = {
         class: casual.integer(1, 4)
      };

      const res = await requester.patch(`/api/drivers/${license_no}`).send(payload);

      assert.equal(res.status, 200);
      
      // check db
      const dbDriver = await Driver.findByPk(license_no);
      assert.isObject(dbDriver);
      assert.equal(dbDriver.class, payload.class);
   });

   test('GET /api/drivers should get all drivers', async () => {

      const res = await requester.get('/api/drivers').send();
      assert.equal(res.status, 200);
      assert.isArray(res.body);

      const driverCount = await Driver.count();
      assert.equal(res.body.length, driverCount)
   });

   test('POST /api/users should should save a user in the database, and login shoud work afterwards', async () => {
      
      const payload = {
         username: casual.username,
         password: casual.password,
      }

      const res = await requester.post('/api/users').send(payload);
      assert.equal(res.status, 200);

      // check db
      const dbUser = await User.findOne({ where: { username: payload.username.toLowerCase() }});
      assert.isObject(dbUser);
      
      officerUsername = payload.username;
      officerPassword = payload.password;

   });

   test('POST /api/login should work', async () => {

      const payload = {
         username: officerUsername,
         password: officerPassword,
         type: 'officer'
      }
      const res = await requester.post('/api/login').send(payload);
      assert.equal(res.status, 200);
   });

   test('GET /api/users should return all officers', async () => {
      const res = await requester.get('/api/users').send();
      assert.equal(res.status, 200);
      assert.isArray(res.body);
   });
   
});






