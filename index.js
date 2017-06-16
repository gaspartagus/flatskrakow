/* var express = require('express')
	, app = express()
	, http = require('http').Server(app)
	, io = require('socket.io')(http);

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

// app.get('/', function(request, response) {
//   response.send('Hello World!')
// })

// io.configure(function () {
//   io.set("transports", ["xhr-polling"]);
//   io.set("polling duration", 10);
// });

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
  	console.log(msg)
    io.emit('chat message', msg);
  });
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
*/

// var express = require('express')
// 	, app = express()
// 	// , fs = require('fs')
	// , eyes = require('eyes')
	// , multer  = require('multer')
	// , pg = require('pg')
	// , sql = require('sql')
	// , bodyParser = require('body-parser')
	// , ejs = require('ejs')
	// , $ = require('jquery')(require("jsdom").jsdom().parentWindow);
	// , google = require('googleapis'
	// , OAuth2 = google.auth.OAuth2;
// ;





var firebase = require("firebase-admin");

var serviceAccount = require("./service-key.json");
var centreville = require("./centreville.json");
var krowodrza = require("./krowodrza.json");
var nowahuta = require("./nowahuta.json");
var podgorze = require("./podgorze.json");
centreville = centreville
.concat(krowodrza
.concat(nowahuta
.concat(podgorze)));

// console.log(centreville)
var app = firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://gumtree-hacker.firebaseio.com"
});



console.log(app.name);  // "[DEFAULT]"

database = firebase.database();

flats  = database.ref('flats');


var request = require('request');
const cheerio = require('cheerio')

var log = console.log;




var rootUrl = "https://www.gumtree.pl";

var queryUrls = [
	'https://www.gumtree.pl/s-pokoje-do-wynajecia/krakow/v1c9000l3200208p1?fr=ownr',
	"https://www.gumtree.pl/s-pokoje-do-wynajecia/krakow/page-2/v1c9000l3200208p2?fr=ownr",
	"https://www.gumtree.pl/s-pokoje-do-wynajecia/krakow/page-3/v1c9000l3200208p2?fr=ownr",
	"https://www.gumtree.pl/s-pokoje-do-wynajecia/krakow/page-4/v1c9000l3200208p2?fr=ownr",
	"https://www.gumtree.pl/s-pokoje-do-wynajecia/krakow/page-5/v1c9000l3200208p2?fr=ownr",
	"https://www.gumtree.pl/s-pokoje-do-wynajecia/krakow/page-6/v1c9000l3200208p2?fr=ownr",
	"https://www.gumtree.pl/s-pokoje-do-wynajecia/krakow/page-7/v1c9000l3200208p2?fr=ownr",
	"https://www.gumtree.pl/s-pokoje-do-wynajecia/krakow/page-8/v1c9000l3200208p2?fr=ownr",
	"https://www.gumtree.pl/s-pokoje-do-wynajecia/krakow/page-9/v1c9000l3200208p2?fr=ownr",

	'https://www.gumtree.pl/s-mieszkania-i-domy-do-wynajecia/krakow/v1c9008l3200208p1?fr=ownr',
	"https://www.gumtree.pl/s-mieszkania-i-domy-do-wynajecia/krakow/page-2/v1c9008l3200208p1?fr=ownr",
	"https://www.gumtree.pl/s-mieszkania-i-domy-do-wynajecia/krakow/page-3/v1c9008l3200208p1?fr=ownr",
	"https://www.gumtree.pl/s-mieszkania-i-domy-do-wynajecia/krakow/page-4/v1c9008l3200208p1?fr=ownr",
	"https://www.gumtree.pl/s-mieszkania-i-domy-do-wynajecia/krakow/page-5/v1c9008l3200208p1?fr=ownr",
	"https://www.gumtree.pl/s-mieszkania-i-domy-do-wynajecia/krakow/page-6/v1c9008l3200208p1?fr=ownr",
	"https://www.gumtree.pl/s-mieszkania-i-domy-do-wynajecia/krakow/page-7/v1c9008l3200208p1?fr=ownr",
	"https://www.gumtree.pl/s-mieszkania-i-domy-do-wynajecia/krakow/page-8/v1c9008l3200208p1?fr=ownr",
	"https://www.gumtree.pl/s-mieszkania-i-domy-do-wynajecia/krakow/page-9/v1c9008l3200208p1?fr=ownr"
]




function getList(urlz){ 
request(urlz, function (error, response, body) {
		// console.log('error:', error); // Print the error if one occurred 
		// console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
		// console.log('body:', body); // Print the HTML for the Google homepage. 

	const $ = cheerio.load(body)

	$('.href-link').each((i,e) =>{
		// log(rootUrl+e.attribs.href)
 		getFlat(rootUrl+e.attribs.href)
	})
})
}

// var maison = 'https://www.gumtree.pl/a-mieszkania-i-domy-do-wynajecia/krakow/2+pokojowe-54-m2-olsza-do-wynajecia/1001999439920911108367709';
var krakow = [50.0646501,19.9449799];

function getFlat(url){

		
	request(url, function (error, response, body) {
		$ = cheerio.load(body)
		var props = {};

		var id = url.split("/").pop();

		props.id = id;
		props.href = url;

		$('.attribute').each((i,e)=>{
			var name = $(e).find(".name").text();
			var value = removeUnnecessary($(e).find(".value").text());
			props[name] = value;
			// console.log(name,value);
		})
		props.title = $('.myAdTitle').text()
		props.price = removeUnnecessary($('.vip-title').find('.price').find('.value').text())
		props.pricenumber = parseInt(props.price.replace(/ | |zł/g,"")) || 0
		// console.log(props.pricenumber)
		// if(props.pricenumber == NaN) return false;
		props.description = $('.description').find('.pre').text()
		props.streets = {};

		// log($('.google-maps-link').length)

		if($('.google-maps-link').length){
			var latlong = $('.google-maps-link').attr('data-uri').split("=")[1].split(",");
			// log(parseFloat(latlong[0]),parseFloat(latlong[1]))
			// log(krakow[0],krakow[1])
			// if(Math.abs(parseFloat(latlong[0]) - krakow[0]) > 1 && Math.abs(parseFloat(latlong[1]) - krakow[1]) > 1){
			props.lat = parseFloat(latlong[0])
			props.lng = parseFloat(latlong[1])
			// }
		}

		centreville.forEach((s,i)=>{

			var short = s.split(" ").pop();
			if( short == undefined ) short = s;
			if(short.length <= 4) return true;

			var index = props.title.search(short);
			var found = "title"
			if(index < 0) {
				index = props.description.search(short);
				found = "description";
			}

			if (index > -1 ){
				var obj = { index : index, found : found };

				firebase.database()
				.ref('/streets/' + streetKey(s) ).once('value')
				.then(function(snapshot) {
					var snap = snapshot.val();
				 	if(!snap){
				 		log(s)
				 		request(queryMapsUrl(s),function (error, response, body) {
				 			if(!body) return true;
							var body = JSON.parse(body);
							// console.log(body)
							if(body.results.length){
								// props.streets[i].location = body.results[0].geometry.location;
								
								// obj[ streetKey(s) ] = body.results[0].geometry.location;
								obj = Object.assign(obj,body.results[0].geometry.location)
								database.ref('streets/'+streetKey(s)).update(obj)

								database.ref("flats/"+id+'/streets/'+streetKey(s)).update(obj)
							} else {
								database.ref('streets/'+streetKey(s)).update({google: "notfound"})
							}
						})
				 	} else if(snap.google == "notfound") {
				 		return true;
				 	} else {
				 		obj = Object.assign(obj,snapshot.val());
				 		database.ref("flats/"+id+'/streets/'+streetKey(s)).update(obj)
				 	}
				});

			}

		})
		// .replace(/\t/g,'').replace(/\n/g,'').replace(/ +/g,' ');

		log(id);


		//
		props.description = ""
		database.ref("flats/"+id).update(props)

	})
}

function removeOld(){
	database
	.ref('flats').once('value')
	.then(function(snapshot) {
		var flats = snapshot.val();
		for(var id in flats){
			request(flats[id].href, function (err, red, body) {
				if(!body){
					console.log("F'well")
				}
			})
		}
	})
}

function update(){
	queryUrls.forEach(l=>{
		getList(l)
	})
	var obj = {
		timestamp: Date.now(),
		date: new Date() + ""
	}
	log(obj)
	database.ref('lastupdate').set(obj)
}

function removeUnnecessary(t){
	return t.replace(/\t/g,'').replace(/\n/g,'').replace(/ +/g,' ');
}
function queryMapsUrl(ul){
	return "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + encodeURIComponent(ul.replace(" ","+")) + "+Krakow&key=AIzaSyBG0dOVS_ZhMTnoprt3-pxQUVlpgalraqM"
}
function streetKey(s){
	return s.replace(/\.|#|$|\/|\[|\]/g,"")
}


var express = require('express');
var app = express();


app.set('port', (process.env.PORT || 5000))

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  //res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
}

app.use( allowCrossDomain );

// respond with "hello world" when a GET request is made to the homepage
app.get('/update', function(req, res) {

  	firebase.database()
	.ref('/lastupdate/').once('value')
	.then(function(snapshot) {

		var lastupdate = snapshot.val().timestamp;
		console.log(Date.now(),lastupdate,Date.now()-lastupdate)

		if(Date.now() - lastupdate > 3600000){
			res.send('Update started');
			update();
		} else {
			res.send('Updated less than an hour ago');
		}
	})
 
});

app.get('/remove', function(req, res) {
	res.send('Okay, started removing old stuff');
  	removeOld();
 
});

app.listen(app.get('port'), function () {
  console.log('Example app listening on port '+app.get('port'))
})











// pg.connect(DATABASE_URL, function(err, client) {

// 	app.get('/touslesarticles', function(req, res) {
// 	    console.log('GET touslesarticles');
// 		var getArticles = client.query(
// 	       "SELECT * FROM articles",
// 	    	function(err,result){
// 	    		console.log(result.rows)
// 	    		res.json(result.rows)
//     		});
// 	})
// 	app.set('port', (process.env.PORT || 5000))
// 	.use(express.static(__dirname + '/public'))
// 	// .use(multer({
// 	// 	dest: './uploads/'
// 	// }))
// 	app.use( bodyParser.json() );       // to support JSON-encoded bodies
// 	app.use( bodyParser.urlencoded() );

// 	app.get('/upload', function(request, response) {
// 	    console.log('GET upload')
// 		response.render('upload.ejs');
// 	})
// 	app.get('/create', function(request, response) {
// 	    console.log('GET create')
// 		response.render('create.ejs');
// 	})
// 	.get('/folder/:folder', function(req, res) {
// 	    console.log('GET folder '+ req.params.folder);
// 	    console.log('https://googledrive.com/host/'+req.params.folder)
// 	    $.get('https://googledrive.com/host/'+req.params.folder,function(data,err){
// 	    	console.log(data,err);
// 	    });

// 	})
// 	.get('/bestof',function(req,res){
// 		var getBests = client.query(
// 	        "SELECT article_id, count(article_id) as popularity FROM profiles GROUP BY article_id ORDER BY popularity DESC",
// 	    	function(err,result){
// 	    		console.log(result.rows)
// 	    		res.json(result.rows)
//     		});
// 	})







// 	.get('/articles/:tag/:type', function(req, res) {
// 	    console.log('GET articles/'+req.params.tag+'/'+req.params.type)


// 	    var getArticles = client.query(
// 	       "SELECT * FROM articles WHERE tag='"+ req.params.tag +"' AND type='"+ req.params.type +"'",
// 	    	function(err,result){
// 	    		console.log(result.rows)
// 	    		res.json(result.rows)
// 	    	});

// 	})
// 	.get('/articles/:tag', function(req, res) {
// 	    console.log('GET articles/'+req.params.tag)

// 	    var getArticles = client.query(
// 	       "SELECT * FROM articles WHERE tag='"+ req.params.tag +"' ",
// 	    	function(err,result){
// 	    		console.log(result.rows)
// 	    		res.json(result.rows)
//     		});
// 	})
// 	.get('/articles', function(req, res) {
// 	    console.log('GET articles')

// 	    var getArticles = client.query(
// 	       "SELECT * FROM articles",
// 	    	function(err,result){
// 	    		console.log(result.rows)
// 	    		res.json(result.rows)
// 	    	});
// 	})
// 	// app.use(busboy({ immediate: true }));
// 	// // ...
// 	// app.use(function(req, res) {
// 	//   req.busboy.on('file', function(fieldname, file, filename) {
// 	//     console.log(fieldname,file,filename);
// 	//   });
// 	//   console.log('no file')
// 	// });

// 	app.post('/file-upload', function(req, res) {
// 	    // get the temporary location of the file
// 	    console.log('POST file-upload')

// 	    console.log(req.headers)
// 	    console.log(req.files)

// 	    var _id = req.headers._id;


// 	    var tmp_path = req.files.file.path;
// 	    // set where the file should actually exists - in this case it is in the "images" directory
// 	    var target_path = './public/images/uploads/'
// 	    	+ req.headers._id + '_'+ Date.now() + '.' + req.files.file.extension;
// 	    console.log(target_path)
// 	    // move the file from the temporary location to the intended location
// 	    fs.rename(tmp_path, target_path, function(err) {
// 	        if (err) throw err;
// 	        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
// 	        fs.unlink(tmp_path, function() {
// 	            if (err) throw err;
// 	            res.send('File uploaded to: ' + target_path + ' - ' + req.files.file.size + ' bytes');
// 	        });
// 	    });

		
// 		var update = client.query("INSERT INTO articles_medias VALUES (" + _id + ",'" + target_path + "')");





// 	});

// 	app.post('/new-article', function(req, res) {
// 	    // get the temporary location of the file
// 	    console.log('POST new-article')

// 	    console.log(req.body)

		   
		
// 		var update = client.query("INSERT INTO articles (titre,resume,tag,folder,files,type) VALUES ('"
// 			+ req.body.titre +"','"
// 			+ req.body.resume +"','"
// 			+ req.body.tag +"','"
// 			+ req.body.folder +"','"
// 			+ req.body.files +"','"
// 			+ req.body.type
// 			+ "')");

// 	})
// 	.post('/profile',function(req,res){
// 		console.log('POST profile');
// 		console.log(req.body)
// 		var deletion = client.query("DELETE FROM profiles WHERE user_id='"+ req.body.user_id +"'");

// 		var insertionString = "INSERT INTO profiles (article_id, user_id) VALUES ";
// 		for (var i = req.body.favoris.length - 1; i >= 0; i--) {
// 			insertionString += "(" + parseInt(req.body.favoris[i]) + "," + req.body.user_id + "),"
// 		};
// 		console.log(insertionString);
// 		var insertion = client.query(insertionString.slice(0,-1));
// 		res.json({status: 'OK'});
// 	})



// 	app.listen(app.get('port'), function() {
// 	  console.log("Node app is running at localhost:" + app.get('port'))
// 	})

// });


