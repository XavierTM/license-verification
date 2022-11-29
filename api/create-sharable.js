console.clear();


const fs = require('fs').promises;
const qrcode = require('qrcode');

(async () => {

   // get data
   const dataSourcePath = 'db/data.json';
   const json = await fs.readFile(dataSourcePath, { encoding: 'utf8' });
   const drivers = JSON.parse(json);

   // make sharable folder if not available
   await mkDirIfNotExisting('sharable');

   // copy json data to sharable
   const dataPath = 'sharable/data,json';
   await fs.copyFile(dataSourcePath, dataPath);

   // create subfolders
   
   for (let i in drivers) {
      const driver = drivers[i];

      const folderName = `${driver.name} ${driver.surname} (${driver.license_no})`;
      const folderPath = `sharable/${folderName}`;

      await mkDirIfNotExisting(folderPath);

      const qrPath = `${folderPath}/qrcode.jpg`;
      const qrText = driver.license_no + spaces(100);

      await qrcode.toFile(qrPath, qrText);

      const driverSourceImagePath = `static/img/drivers/${driver.license_no}.jpg`;
      const driverImagePath = `${folderPath}/photo.jpg`;
      await fs.copyFile(driverSourceImagePath, driverImagePath);

   }
})();


async function mkDirIfNotExisting(path) {
   try {
      await fs.mkdir(path);
   } catch {};
}

function spaces(count=0) {
   let str = '';

   for (let i = 0; i < count; i++) {
      str = str + ' ';
   }
   return str;
}