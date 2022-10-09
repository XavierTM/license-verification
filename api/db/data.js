const axios = require("axios");
const casual = require("casual");
const { unlink } = require("fs");
const { createFakeDriverData, createFakeOffensesData } = require("../utils");
const fs = require('fs').promises;



const { NODE_ENV } = process.env;
const data = {};

if (NODE_ENV === 'production') {
   data.drivers = [];
   data.offenses = [];
} else if (NODE_ENV === 'development' || !NODE_ENV) {

   const drivers = [];
   const offenses = [];

   for (let i = 0; i < 10; i++) {
      
      const driver = createFakeDriverData();
      const license_no = driver.license_no;
      const offenseCount = casual.integer(0, 5);
      const driverOffenses = createFakeOffensesData(license_no, offenseCount, driver.createdAt);

      drivers.push(driver);
      offenses.push(...driverOffenses);

   }

   
   data.drivers = drivers;
   data.offenses = offenses;

   const license_numbers = data.drivers.map(driver => driver.license_no);
   generatePictures(license_numbers);

   data.drivers.forEach(driver => {
      console.log(`${driver.license_no} => ${driver.national_id_no}`);
   })
   
}


async function generatePictures(license_numbers) {

   // const basePath = `${__dirname}/../static/img/drivers`;

   // await emptyDir(basePath);

   // for (let i in license_numbers) {
   //    const license_no = license_numbers[i];
   //    await createPicture(basePath, license_no);
   // }
}


async function emptyDir(path) {

   const children = await fs.readdir(path);

   for (let i in children) {
      await fs.unlink(`${path}/${children[i]}`);
   }

}



async function createPicture(basePath,license_no) {
   const response = await axios.get('rs', { responseType: 'arraybuffer', });
   const data = response.data;
   await fs.writeFile(`${basePath}/${license_no}.jpg`, data);
}


module.exports = data;