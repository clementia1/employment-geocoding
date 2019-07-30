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

let workbook = XLSX.readFile('result.xls');
let sheet = workbook.Sheets[workbook.SheetNames[0]];
let json = XLSX.utils.sheet_to_json(sheet);

const ec = (r, c) => {
    return XLSX.utils.encode_cell({r:r,c:c})
}

function delete_row(ws, row_index){
  var variable = XLSX.utils.decode_range(ws["!ref"])
  for(var R = row_index; R < variable.e.r; ++R){
    for(var C = variable.s.c; C <= variable.e.c; ++C){
      ws[ec(R,C)] = ws[ec(R+1,C)];
    }
  }
  variable.e.r--
  ws['!ref'] = XLSX.utils.encode_range(variable.s, variable.e);
}

function removeDuplicates() {
	for (let i = 1; i < json.length - 1; i++) {
			let cell = sheet['H' + i];
			let test = sheet['B' + i];
			let nextCell = sheet['H' + (i + 1)];
			if (cell.v != undefined & nextCell.v != undefined) {
				if (cell.v == nextCell.v) {
				delete_row(sheet, i);
				console.log(test.v, cell.v, nextCell.v, i);
				}
			}
		}
}
/*
console.log(json.length);
removeDuplicates();
json = XLSX.utils.sheet_to_json(sheet);
XLSX.writeFile(workbook, 'result.xls')

removeDuplicates();
json = XLSX.utils.sheet_to_json(sheet);
XLSX.writeFile(workbook, 'result.xls')

removeDuplicates();
json = XLSX.utils.sheet_to_json(sheet);
XLSX.writeFile(workbook, 'result.xls')
removeDuplicates();
json = XLSX.utils.sheet_to_json(sheet);
XLSX.writeFile(workbook, 'result.xls')
removeDuplicates();
json = XLSX.utils.sheet_to_json(sheet);
XLSX.writeFile(workbook, 'result.xls')
*/

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
		newString = newString.replace(/Харківська область, Харків, СЛОБІДСЬКИЙ/i, 'Харків');
		newString = newString.replace(/Харківська область, Харків, Московський/i, 'Харків');
		newString = newString.replace(/(проспект).+(Московський)/i, 'Московський проспект');
		newString = newString.replace(/(вулиця).+(Ярослава).+(Мудрого)/i, 'Ярослава Мудрого вулиця');
		return newString;
	}
}

function sleep (fn, par) {
  return new Promise((resolve) => {
    // wait 3s before calling fn(par)
    setTimeout(() => resolve(fn(par)), 3000)
  })
}

async function geocode() {
	let jobData = await Promise.all(json.map(async (item, i) => {
		console.log(i);
		await new Promise(resolve => setTimeout(resolve, i * 5000))
      	try {      			
				let str = item['Фактична адреса ПОУ / Оперативні вакансії'];
					let elem = await geocoder.geocode(formatAddress(str));
					console.log(elem[0]);
					if (elem[0] != undefined) {
						item['latitude'] = elem[0].latitude;
						item['longitude'] = elem[0].longitude;
					}
					return item
      	} catch(err) {
         	throw err;
      	}
  	}));
  	
 	/*
  	let jobData = json.map((item, i) => {
  		let str = item['Фактична адреса ПОУ / Оперативні вакансії'];
  		console.log(i);
  		setTimeout(function() { 
  			geocoder.geocode(formatAddress(str), function(err, res) {
  				console.log(res[0]);
  				if (res[0] != undefined) {
						item['latitude'] = res[0].latitude;
						item['longitude'] = res[0].longitude;
				}
				return item
			})
		}, i * 5000);
  	});*/
  	
  	let formatData = jobData.filter(item => {
			return item.hasOwnProperty('latitude') == true
  	});
  	fs.writeFileSync('jsonData.json', JSON.stringify(formatData, null, 4), 'utf8');
	console.log(jobData);
}

geocode();
