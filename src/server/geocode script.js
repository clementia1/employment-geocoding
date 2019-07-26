const NodeGeocoder = require('node-geocoder');
if(typeof require !== 'undefined') XLSX = require('xlsx');

let options = {
  provider: 'openstreetmap',
 
  // Optional depending on the providers
  httpAdapter: 'https', // Default
  // apiKey: 'YOUR_API_KEY', // for Mapquest, OpenCage, Google Premier
  formatter: null         // 'gpx', 'string', ...
};
 
let geocoder = NodeGeocoder(options); 

let workbook = XLSX.readFile('filterResult_298475076.xls');
let sheet = workbook.Sheets[workbook.SheetNames[0]];
let json = XLSX.utils.sheet_to_json(sheet);

function formatAddress(str) {
	if (str != undefined) {
		let newString = str.replace(/вул\./i, ' вулиця ');
		newString = newString.replace(/(пр-т|пр)(\s|\.)/i, ' проспект ');
		newString = newString.replace(/пров(\s|\.)/i, ' провулок ');
		return newString;
	}
}

json.forEach((item) => {
	let str = item['Фактична адреса ПОУ / Оперативні вакансії'];
	
	setTimeout(function() {
		geocoder.geocode(formatAddress(str))
  			.then(function(res) {
    			console.log(res);
  			})
  			.catch(function(err) {
    			console.log(err);
  			});
	}, 2500);

});
 /* formatAddress(str)
geocoder.geocode('29 champs elysée paris')
  .then(function(res) {
    console.log(res);
  })
  .catch(function(err) {
    console.log(err);
  });
*/
