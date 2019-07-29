const fs = require('fs');
const NodeGeocoder = require('node-geocoder');
if (typeof require !== 'undefined') XLSX = require('xlsx');

let options = {
	provider: 'openstreetmap',

	// Optional depending on the providers
	httpAdapter: 'https', // Default
	// apiKey: 'YOUR_API_KEY', // for Mapquest, OpenCage, Google Premier
	formatter: null // 'gpx', 'string', ...
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
		newString = newString.replace(/Харківська область, Харків, НОВОБАВАРСЬКИЙ/i, 'Харків');
		newString = newString.replace(/Харківська область, Харків, ІНДУСТРІАЛЬНИЙ/i, 'Харків');
		newString = newString.replace(/Харківська область, Харків, Київський/i, 'Харків');
		newString = newString.replace(/Харківська область, Харків, ОСНОВ'ЯНСЬКИЙ/i, 'Харків');
		newString = newString.replace(/Харківська область, Харків, НЕМИШЛЯНСЬКИЙ/i, 'Харків');
		newString = newString.replace(/Харківська область, Харків, ХОЛОДНОГІРСЬКИЙ/i, 'Харків');
		newString = newString.replace(/Харківська область, Харків, ШЕВЧЕНКІВСЬКИЙ/i, 'Харків');
		newString = newString.replace(/(проспект).+(Московський)/i, 'Московський проспект');
		newString = newString.replace(/(вулиця).+(Ярослава).+(Мудрого)/i, 'Ярослава Мудрого вулиця');
		return newString;
	}
}

// console.log(formatAddress('Харківська область, Харків, ІНДУСТРІАЛЬНИЙ, пр-т Московський, 275')); 
/*
async function geocode() {
	try {
		let jobData = json.map(async function (item) {
			let str = item['Фактична адреса ПОУ / Оперативні вакансії'];
			let elem = await geocoder.geocode(formatAddress(str));
			item['latitude'] = elem[0].latitude;
			item['longitude'] = elem[0].longitude;
			console.log(item);
			return item
		});
		let result = await Promise.all(jobData);
		fs.writeFile('jsonData.json', JSON.stringify(result), 'utf8');
		console.log(jobData);
	} catch (err) {
		return err;
	}
}
*/
async function geocode() {
	let jobData = await Promise.all(json.map(async (item) => {
      	try {      			
				let str = item['Фактична адреса ПОУ / Оперативні вакансії'];
					let elem = await geocoder.geocode(formatAddress(str));
					if (elem[0] != undefined) {
						item['latitude'] = elem[0].latitude;
						item['longitude'] = elem[0].longitude;
					}
					return item
      	} catch(err) {
         	throw err;
      	}
  	}));
  	let formatData = jobData.filter(item => {
			return item.hasOwnProperty('latitude') == true
  	});
  	fs.writeFileSync('jsonData.json', JSON.stringify(formatData, null, 4), 'utf8');
	console.log(jobData);
}



geocode();
