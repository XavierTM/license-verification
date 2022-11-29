

const casual = require('casual');
const { SEXES, LICENSE_CLASSES } = require('./config');




const offenseDB = [
   {
      type: 'Proceed against red traffic light',
      details: 'The driver did not stop on a red traffic light'
   },
   {
      type: 'Double parking',
      details: 'The driver parked besides a car that was already parked at the side of the road'
   },
   {
      type: 'No Safety belt',
      details: 'The driver did not put on a safety belt while driving'
   },
   {
      type: 'Fail to produce insurance',
      details: 'The driver failed to provide insurance documents'
   },
   {
      type: 'No headlights',
      details: 'The driver drove a car with non-working headlight(s)'
   },
   {
      type: 'Speeding',
      details: 'The driver did not pay attention to a speed limit'
   },
]


const surnames = [
   "Moyo",
   "Ndlovu",
   "Ncube",
   "Sibanda",
   "Dube",
   "Ngwenya",
   "Mpofu",
   "Mubaiwa",
   "Mapuranga",
   "Mutasa",
   "Taruvinga",
   "Ndoro",
   "Sigauke",
   "Marufu",
   "Mapfumo",
   "Mahachi",
   "Hove",
   "Shumba"
]

function createFakeOffensesData(license_no, count=10, after=0) {

   const offenses = [];

   for (let i = 0; i < count; i++) {

      const { type, details } = casual.random_element(offenseDB);

      offenses.push({
         type,
         details,
         driver: license_no,
         createdAt: fakeTimestamp(after)
      })
   }

   return offenses;
}

function fakeTimestamp(after=0) {
   const now = Date.now();
   return casual.integer(after, now);
}


const YEAR_2K_TIMESTAMP = 971118458000;
const YEAR_MILLIS = 365 * 24 * 3600 * 1000;


function createFakeDriverData() {

   const createdAt = fakeTimestamp(YEAR_2K_TIMESTAMP);
   const dob = createdAt - casual.integer(18 * YEAR_MILLIS, 30 * YEAR_MILLIS); // make sure the person got their license between the age of 18 and 30;

   return {
      name: casual.first_name,
      surname: casual.random_element(surnames),
      dob,
      national_id_no: fakeIDNumber(),
      sex: casual.random_element(SEXES),
      license_no: fakeLicenseNo(),
      createdAt,
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
   fakeLicenseNo
}