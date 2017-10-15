
/*
 * GET SITE PAGES
 */

var TITLE = 'Apeiron';
var path = require("path");
var utils = require('./utils');
var CHAPTERS = require('./components/story/config/chapters.js');


/*
 * MAIN APP PAGES
 */
 exports.index = function(req, res){
 	res.sendFile(path.join(__dirname, '..', '/public/index.html'));
 }

 exports.interceptIndex = function(req, res){
 	// Block the user from accessing invalid page routes
 	var chapterInput = req.params.chapter,
 		maxChapter = CHAPTERS.go[CHAPTERS.go.length-1];

 	// Invalid Chapter count
 	if(!chapterInput || chapterInput <= 0 || chapterInput > maxChapter){
 		res.redirect(['/go', maxChapter.chapter, maxChapter.parts].join('/'));
 		return;
 	}

 	var partInput = req.params.part,
 		maxPart = utils.findWithAttr(CHAPTERS.go, 'chapter', chapterInput);

 	// Invalid Part count
 	if(!partInput || partInput <= 0 || partInput > maxPart.parts){
 		res.redirect(['/go', maxPart.chapter, maxPart.part].join('/'));
 		return;
 	}

 	res.sendFile(path.join(__dirname, '..', '/public/index.html'));
 }

 exports.pending = function(req, res){
 	res.sendStatus(200);
 }

 exports.viewRender = function(req, res){
 	res.render(path.join(__dirname, '..', '/public/components/'+req.params.view+'/views/index'));
 }

  exports.subviewRender = function(req, res){
 	res.render(path.join(__dirname, '..', '/public/components/'+req.params.view+'/views/'+req.params.subview));
 }

 exports.aboutRender = function(req, res){
 	res.render(path.join(__dirname, '..', '/public/components/about/views/'+req.params.view));
 }