const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const request = require('request');
const cheerio = require('cheerio');
const qs = require('querystring');
const h2p = require('html2plaintext');


var bodyParser = require('body-parser');

var fs = require('fs');

app.listen(port, () => console.log(`Listening on port ${port}`));

app.use(bodyParser.json({limit: '10mb', extended: true}) );
app.use(express.json());

app.use(cors());
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
	next();
});

// API calls
app.get('/api/hello', (req, res) => {
	res.send({ express: 'Hello From Express' });
});

// app.post('/api/updateUsers', (req, res) => {
// 	const { user, action } = req.body;
// 	const { users } = status;
// 	if (action === 'add') {
// 		const currentUser = users.find(e => e.user === user);
// 		if(currentUser) {
// 			currentUser.count += 1;
// 		}
// 		else {
// 			status.users.push({user, count: 1 });
// 		}
// 	}
// 	else if (action === 'remove') {
// 		const currentUser = users.find(e => e.user === user);
// 		if(currentUser) {
// 			if(currentUser.count > 1) {
// 				currentUser.count -= 1; 
// 			}
// 			else {
// 				status.users = users.filter(e => e.user !== currentUser.user);
// 			}
// 		}
// 	}
// 	console.log(status.users);
// });

app.post('/api/bible', (req, res) => {
	let obj = req.body;
	fs.writeFile('test.json', JSON.stringify(obj), function(err) {
		if (err) {
			console.log(err);
		}
	});

	res.send({obj});
});

app.post('/api/currentInfo', (req, res) => {
	let obj = req.body;
	let t = obj.words;
	res.send({t});
});

app.post('/api/getLyrics', (req, res) => {
	search(req.body.name, res);
});

app.post('/api/getHymnal', (req, res) => {
	searchHymnal(req.body.number, res);
});

const hymnURL = 'http://sdahymnals.com/Hymnal/';

function searchHymnal(query, send){
	let url = hymnURL + query;
	let song = {};
	request(url, function(err, res, body){
		if(!err){
			$ = cheerio.load(body);
			$('h1.title').each(function(){
				song.title = $(this).text();
				// Break From Each Loop
				return false;
			});
			$('div.thecontent p').each(function(){
				let text = $(this).text().split('\n');
				song[text[0]] = text.slice(1);
			});
			send.send({song: song});
		}
		else{
			console.log('Error : ', err);
		}
	});
}

const baseURL = 'http://search.azlyrics.com';

function search(query, send){
	let url = baseURL + '/search.php?q=' + qs.escape(query);

	request(url, function(err, res, body){
		if(!err){
			$ = cheerio.load(body);

			$('td.text-left a').each(function(){
				url = $(this).attr('href');

				// Get Lyrics
				lyrics(url, send);

				// Break From Each Loop
				return false;
			});
		}
		else{
			console.log('Error : ', err);
		}
	});
}

function lyrics(url, send){
	console.log('Getting lyrics from: ', url);

	request(url, {ciphers: 'DES-CBC3-SHA'}, function(err, res, body){
		if(!err){
			$ = cheerio.load(body);

			$('div:not([class])').each(function(){
				var lyrics = h2p($(this).html());
				if(lyrics != ''){
					send.send({lyrics: lyrics});
				}
			});
		}
		else{
			console.log('Error in Getting Lyrics : ', err);
		}
	});
}



if (process.env.NODE_ENV === 'production') {
	// Serve any static files
	app.use(express.static(path.join(__dirname, 'client/build')));
	// Handle React routing, return all requests to React app
	app.get('*', function(req, res) {
		res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
	});
}
