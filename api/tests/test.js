
const server = require('../main');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { init: dbInit, Driver, Offense } = require('../db');
const Joi = require('@xavisoft/joi');
const { SEXES, LICENSE_CLASSES } = require('../config');
const { createFakeDriverData, createFakeOffensesData } = require('../utils');

chai.use(chaiHttp);
const { assert } = chai;

const requester = chai.request(server).keepOpen();


suite("Tests", function() {

   let license_no, national_id_no;

   this.beforeAll(async () => {
      await dbInit();

      const driverData = createFakeDriverData();
      const driver = await Driver.create(driverData);

      license_no = driver.license_no;
      national_id_no = driver.national_id_no;

      const offenseData = createFakeOffensesData(license_no);

      await Offense.bulkCreate(offenseData);

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
   
});






