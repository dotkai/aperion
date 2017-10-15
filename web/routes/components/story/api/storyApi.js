var CHAPTERS = require('../config/chapters.js')
	, CHARACTERS = require('../config/characterDefaults.js')
	, GENDER = require('../config/genderMap.js')
	, pathJoin = require("path");

module.exports = {
	getBlogInfo: getBlogInfo,
	getStory: getStory,
	getChapterData: getChapterData
};


function getBlogInfo(req, res){
	res.send({ 
		chapters: CHAPTERS,
		characters: CHARACTERS,
		genderMap: GENDER
	});
}

function getStory(req, res){
	var path = (req.params.path !== '0')? req.params.path : 'go';
	var chpt = (req.params.chpt !== '-1')? req.params.chpt : getLast(CHAPTERS.go, 'chapter');
	var part = (req.params.part !== '0')? req.params.part : getLast(CHAPTERS.go, 'parts');

	// TO DO: Include language
	res.render(['story', path, 'ch'+chpt, part, 'eng'].join('/'));
}

function getChapterData(req, res){
	var path = (req.params.path !== '0')? req.params.path : 'go';
	var chpt = (req.params.chpt !== '-1')? req.params.chpt : getLast(CHAPTERS.go, 'chapter');
	var part = (req.params.part !== '0')? req.params.part : getLast(CHAPTERS.go, 'parts');

	res.send(require('../../../../public/story/'+path+'/'+chpt+'/'+part+'/ref.json'));
}
