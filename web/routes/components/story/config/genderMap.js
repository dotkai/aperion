/*
 * Converts Gender Excel to JSON
 */

 var XLSX = require('xlsx'),
 	path = require('path');
 var workbook = XLSX.readFile(path.join(__dirname, 'characterTable.xlsx')),
 	first_sheet_name = workbook.SheetNames[1],
 	worksheet = workbook.Sheets[first_sheet_name];

module.exports = convertRowsToJson();

function convertRowsToJson(){
	var irow = 2,
		hasRow = val('A', irow),
		masterList = {},
		chars;

	while(hasRow){
		
		masterList[hasRow] = [val('B', irow), val('C', irow), val('D', irow)];
		
		// Get the first column of the next row
		irow++;
		hasRow = val('A', irow);
	}

	return masterList;

	function cell(col, i){
		return worksheet[col+i];
	}

	function val(col, i){
		return cell(col, i)? cell(col, i).v : undefined;
	}
}
