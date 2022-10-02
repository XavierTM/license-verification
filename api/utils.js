

const casual = require('casual');
const { SEXES, LICENSE_CLASSES } = require('./config');

function createFakeOffensesData(license_no, count=10) {

   const offenses = [];

   for (let i = 0; i < count; i++) {
      offenses.push({
         type: casual.word,
         details: casual.catch_phrase,
         driver: license_no
      })
   }

   return offenses;
}


function createFakeDriverData() {
   return {
      name: casual.first_name,
      surname: casual.last_name,
      dob: casual.date(),
      national_id_no: fakeIDNumber(),
      sex: casual.random_element(SEXES),
      license_no: fakeLicenseNo(),
      date_issued: casual.date(),
      class: casual.random_element(LICENSE_CLASSES),
   }
}


function fakeIDNumber() {
   const firstNum = casual.integer(10, 99);
   const midNum = casual.integer(10000, 99999);
   const letter = casual.letter.toUpperCase();
   const lastNum = casual.integer(10, 99);

   return `${firstNum}-${midNum}${letter}${lastNum}`;
}

function fakeLicenseNo() {
   const num = casual.integer(10000, 99999);
   const letter = casual.letter.toUpperCase();
   return `${num}${letter}`;
}



module.exports = {
   createFakeDriverData,
   createFakeOffensesData,
}