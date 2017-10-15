/*
 * Converts Character Excel to JSON
 */

 var XLSX = require('xlsx'),
 	path = require('path');
 var workbook = XLSX.readFile(path.join(__dirname, 'characterTable.xlsx')),
 	first_sheet_name = workbook.SheetNames[0],
 	worksheet = workbook.Sheets[first_sheet_name],
 	columns = getColumnRange();

module.exports = convertRowsToJson();

function getColumnRange(){
	var A = 'A'.charCodeAt(0),
		Z = 'Z'.charCodeAt(0),
		offSet = 0,
		cols = {};

	var hasCell = val(A);

	while(hasCell){
		cols[String.fromCharCode(A+offSet)] = hasCell;
		offSet++;
		hasCell = val(A+offSet);
	}

	return cols;


	function cell(i){
		return worksheet[String.fromCharCode(i)+'1'];
	}

	function val(i){
		return cell(i)? cell(i).v : undefined;
	}
}

function convertRowsToJson(){
	var irow = 2,
		hasRow = val('A', irow),
		masterList = {},
		chars;

	while(hasRow){
		// Extract column values for this row
		chars = {};
		for(var key in columns){
			chars[columns[key]] = val(key, irow);
		}

		masterList[hasRow] = chars;
		
		// Get the first column of the second row
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
