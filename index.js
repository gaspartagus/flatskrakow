// "ul. Spokojna",




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

// flats  = database.ref('flats');


var request = require('request');
const cheerio = require('cheerio')
var lzstring = require("lz-string");

var log = console.log;




var rootUrl = "https://www.gumtree.pl";
var rootGratka = "http://dom.gratka.pl";

var gumtreeUrls = [
	'https://www.gumtree.pl/s-pokoje-do-wynajecia/krakow/v1c9000l3200208p1?fr=ownr',
	"https://www.gumtree.pl/s-pokoje-do-wynajecia/krakow/page-2/v1c9000l3200208p2?fr=ownr",
	"https://www.gumtree.pl/s-pokoje-do-wynajecia/krakow/page-3/v1c9000l3200208p2?fr=ownr",
	"https://www.gumtree.pl/s-pokoje-do-wynajecia/krakow/page-4/v1c9000l3200208p2?fr=ownr",
	"https://www.gumtree.pl/s-pokoje-do-wynajecia/krakow/page-5/v1c9000l3200208p2?fr=ownr",
	// "https://www.gumtree.pl/s-pokoje-do-wynajecia/krakow/page-6/v1c9000l3200208p2?fr=ownr",
	// "https://www.gumtree.pl/s-pokoje-do-wynajecia/krakow/page-7/v1c9000l3200208p2?fr=ownr",
	// "https://www.gumtree.pl/s-pokoje-do-wynajecia/krakow/page-8/v1c9000l3200208p8?fr=ownr",
	// "https://www.gumtree.pl/s-pokoje-do-wynajecia/krakow/page-9/v1c9000l3200208p8?fr=ownr",

	'https://www.gumtree.pl/s-mieszkania-i-domy-do-wynajecia/krakow/v1c9008l3200208p1?fr=ownr',
	"https://www.gumtree.pl/s-mieszkania-i-domy-do-wynajecia/krakow/page-2/v1c9008l3200208p1?fr=ownr",
	"https://www.gumtree.pl/s-mieszkania-i-domy-do-wynajecia/krakow/page-3/v1c9008l3200208p1?fr=ownr",
	"https://www.gumtree.pl/s-mieszkania-i-domy-do-wynajecia/krakow/page-4/v1c9008l3200208p1?fr=ownr",
	// "https://www.gumtree.pl/s-mieszkania-i-domy-do-wynajecia/krakow/page-5/v1c9008l3200208p1?fr=ownr",
	// "https://www.gumtree.pl/s-mieszkania-i-domy-do-wynajecia/krakow/page-6/v1c9008l3200208p1?fr=ownr",
	// "https://www.gumtree.pl/s-mieszkania-i-domy-do-wynajecia/krakow/page-7/v1c9008l3200208p7?fr=ownr",
	// "https://www.gumtree.pl/s-mieszkania-i-domy-do-wynajecia/krakow/page-8/v1c9008l3200208p1?fr=ownr",
];

var otodomUrls = [
	"https://www.otodom.pl/wynajem/mieszkanie/krakow/?search%5Bdescription%5D=1&search%5Bprivate_business%5D=private&search%5Bcreated_since%5D=3&search%5Bdist%5D=0&search%5Bsubregion_id%5D=410&search%5Bcity_id%5D=38&nrAdsPerPage=72",

	"https://www.otodom.pl/wynajem/pokoj/krakow/?search%5Bdescription%5D=1&search%5Bprivate_business%5D=private&search%5Bcreated_since%5D=3&search%5Bdist%5D=0&search%5Bsubregion_id%5D=410&search%5Bcity_id%5D=38&nrAdsPerPage=72",
];

var gratkaUrls = [
	"http://dom.gratka.pl/mieszkania-do-wynajecia/lista/,krakow,3d,d_0,on,od,sr,zi.html",
	"http://dom.gratka.pl/pokoje-do-wynajecia/lista/,krakow,3d,on,od,zi.html",
];

var olxUrl = [
	"https://www.olx.pl/nieruchomosci/mieszkania/wynajem/krakow/?search%5Bprivate_business%5D=private"
];

var streets = {};

function getStreets(){
return new Promise((res,rjt)=>{
	
	database.ref("streets").once('value')
	.then(function(snapshot) {
		streets = snapshot.val()
		log("streets loaded")
		res();
	})
})
}

function update(){
	var proms1 = gumtreeUrls.map(l=>{
		return getListAsync(l,"gumtree")
	})
	var proms2 = otodomUrls.map(l=>{
		getListAsync(l,"otodom")
	})
	var proms3 = gratkaUrls.map(l=>{
		getListAsync(l,"gratka")
	})
	var proms4 = olxUrl.map(l=>{
		return getListAsync(l,"olx")
	})
	return Promise.all(proms1.concat(proms2,proms3,proms4))
	var obj = {
		timestamp: Date.now(),
		date: new Date() + ""
	}
	log("Update started on "+obj.date)
	// removeOld();
	// database.ref('lastupdate').set(obj)
}

// .then(fillStreets)

var count = 0;
var smalls = {};

// function getList(urlz,website){ 
// 	// log(urlz)
// 	request(urlz, function (error, response, body) {
// 		// log(error,response,body)
// 		const $ = cheerio.load(body)

// 		if(website == "gumtree"){

// 			var links = $('.href-link');

// 			links.each((i,e) =>{
// 		 		getFlat(rootUrl+e.attribs.href,website)
// 			})
// 		} else if(website == "otodom"){
// 			var links = $('.offer-item')

// 			count += links.length;

// 			links.each((i,e) =>{

// 		 		getOtodom($(e).attr("data-url"),$(e).attr("data-item-id"))
// 			})
// 		} else if(website == "gratka"){

// 			var links = $('li.linkDoKarty > a')

// 			links.each((i,e) =>{

// 		 		getGratka(rootGratka + $(e).attr("href"))
// 			})
// 		} else if(website == "olx"){

// 			var links = $('.detailsLink')

// 			count += links.length;

// 			links.each((i,e) =>{

// 		 		getOlx(rootGratka + $(e).attr("href"))
// 			})
// 		}
// 	})
// }

// getList(gratkaUrls[0],"gratka")
// var maison = 'https://www.gumtree.pl/a-mieszkania-i-domy-do-wynajecia/krakow/2+pokojowe-54-m2-olsza-do-wynajecia/1001999439920911108367709';
var krakow = {
	lat: 50.0646501,
	lng: 19.9449799
};

function searchStreet(description){

	var rues = [];
	centreville.forEach((s,i)=>{

		var short = s.split(" ").pop();
		if( short == undefined ) short = s;
		if(short.length > 5) {

			var index = description.search(short);

			if (index > -1 ){
				var obj = { index : index };

				if(streets[streetKey(s)]){
					obj = Object.assign(obj,streets[streetKey(s)]);
					rues.push(obj)
				}
			}
		}

	})
	rues = rues.sort((a,b) => {
		if(a.index > b.index) return -1;
		if(a.index < b.index) return 1;
		if(a.index == b.index) return 0;
		return 0;
	})
	return rues.pop()
}
function isPosValid(p){
	if(p.website == "olx") return false;
	if(p.website == "gumtree"){
		// log(n2(p,krakow),p.lat)
		if(n2(p,krakow) < 0.0000003 || !p.lat){
			return false;
		}
	}
	return true;

}

function getListAsync(urlz,website){
return new Promise((resolve,reject) => {

	request(urlz, function (error, response, body) {
		// log(error,response,body)
		const $ = cheerio.load(body)

		if(website == "gumtree"){

			var links = $('.href-link');

			var promesses = Array.from(links.map((i,e) => {
				var url = rootUrl+e.attribs.href
		 		return getGumtree(url)
			}))
			Promise.all(promesses)
			.then(resolve)

		} else if(website == "otodom"){

			var links = $('.offer-item')

			var promesses = Array.from(links.map((i,e) => {
				var url = $(e).attr("data-url")
				var id = $(e).attr("data-item-id")
		 		return getOtodom(url,id)
			}))
			Promise.all(promesses)
			.then(resolve)

		} else if(website == "gratka"){

			var links = $('li.linkDoKarty > a')

			var promesses = Array.from(links.map((i,e) => {
				var url = rootGratka + $(e).attr("href");
		 		return getGratka(url)
			}))
			Promise.all(promesses)
			.then(resolve)

		} else if(website == "olx"){

			var links = $('.detailsLink')

			var promesses = Array.from(links.map((i,e) => {
				var url = $(e).attr("href");

				if(url.split(".")[1] == "otodom"){
					var id = url.split("-ID")[1].split(".")[0];
					return getOtodom(url,id)
				} else {
		 			return getOlx(url)
				}
			}))
			Promise.all(promesses)
			.then(resolve)

		}
	})
})
}

function getGumtree(url,website){
return new Promise((res,rej)=>{
	request(url, function (error, response, body) {
		$ = cheerio.load(body)
		var props = {};

		var id = url.split("/").pop();

		props.id = id;
		props.href = url;
		props.website = "gumtree";

		props.date = removeUnnecessary( $('.attribute .value').first().text() )

		props.title = $('.myAdTitle').text()
		props.price = removeUnnecessary($('.vip-title').find('.price').find('.value').text())
		props.pricenumber = parseInt(props.price.replace(/ | |zł/g,"")) || 0

		var description = removeUnnecessary($('.description').find('.pre').text())

		if($('.google-maps-link').length){
			var latlong = $('.google-maps-link').attr('data-uri').split("=")[1].split(",");

			props.lat = parseFloat(latlong[0])
			props.lng = parseFloat(latlong[1])
		}

		if(! isPosValid(props)){
			var rue = searchStreet(props.title + " " + description)
			// console.log(rue)
			if(rue){
				log(rue)
				props.street = rue;
				delete props.lat;
				delete props.lng;
			}
		}
		log(id)
		database.ref("smallz/"+id).update(props)
		smalls[id] = props;
		res();
	})
})
}


function getOtodom(url,id){
return new Promise((res,rej)=>{
	request(url, function (error, response, body) {
		$ = cheerio.load(body)
		var props = {};

		// var id = url.split("/").pop();

		props.id = id;
		props.href = url;
		props.website = "otodom";

		props.title = $('h1').first().text()
		// log($(".box-price-value").first().text())
		props.price = removeUnnecessary($(".box-price-value").first().text())
		props.pricenumber = parseInt(props.price.replace(/ | |zł/g,"")) || 0
		// console.log(props.pricenumber)


		var map = $("#adDetailInlineMap");
		props.lat = parseFloat(map.attr("data-lat"));
		props.lng = parseFloat(map.attr("data-lon"));

		props.refreshed = Date.now();
		props.date = $(".updated .right p:nth-child(2)").text().split(" ")[2].replace(/\./g,"/")

		log(id);

		database.ref("smallz/"+id).update(props)
		smalls[id] = props;
		res();

	})
})
}

function getGratka(url){
return new Promise((res,rej)=>{
	request(url, function (error, response, body) {
		$ = cheerio.load(body)
		var props = {};

		var id = url.split("-")[1];

		props.id = id;
		props.href = url;
		props.website = "gratka";

		props.title = removeUnnecessary($('h1').first().text());
		// log($(".box-price-value").first().text())
		props.price = removeUnnecessary($(".cenaGlowna b").first().text()+" zł")
		props.pricenumber = parseInt(props.price.replace(/ | |zł/g,"")) || 0
		// console.log(props.pricenumber)


		var map = $("#adDetailInlineMap");
		props.lat = parseFloat($(".latitude").text());
		props.lng = parseFloat($(".longitude").text());

		props.refreshed = Date.now();
		d = new Date();
		var jour = d.getDate();
		var mois = d.getMonth()+1;
		var annee = d.getYear()+1900;
		props.date = (jour < 10 ? "0"+jour : jour ) + "/" + (mois < 10 ? "0"+mois : mois ) + "/" + annee;

		log(id);

		database.ref("smallz/"+id).update(props)
		smalls[id] = props;
		res();

	})
})
}

function getOlx(url){
return new Promise((res,rej)=>{
	// log(url)
	request(url, function (error, response, body) {
		$ = cheerio.load(body)
		var props = {};

		var id = url.split("-ID")[1].split(".")[0];

		props.id = id;
		props.href = url;
		props.website = "olx";

		props.title = removeUnnecessary($('.offer-titlebox > h1').first().text());
		var description = removeUnnecessary($('.descriptioncontent #textContent p').first().text());
		// log($(".box-price-value").first().text())
		props.price = removeUnnecessary($(".price-label strong").first().text())
		props.pricenumber = parseInt(props.price.replace(/ | |zł/g,"")) || 0
		// console.log(props.pricenumber)

		var rue = searchStreet(props.title + " " + description)
			// console.log(rue)
		if(rue){
			log(rue)
			props.street = rue;
		}


		props.refreshed = Date.now();
		d = new Date();
		var jour = d.getDate();
		var mois = d.getMonth()+1;
		var annee = d.getYear()+1900;
		props.date = (jour < 10 ? "0"+jour : jour ) + "/" + (mois < 10 ? "0"+mois : mois ) + "/" + annee;

		log(id);

		database.ref("smallz/"+id).update(props)
		smalls[id] = props;
		res();

	})
})
}

function fillStreets(){
	var i = 0;
	centreville.forEach(s=>{
		
		if(i>1000) return false;
		var notfound = "";
		if(streets[streetKey(s)]){
			notfound = streets[streetKey(s)].google
		}
		if(!streets[streetKey(s)] || notfound == "no"){
			i++;
			log(streetKey(s))
			request(queryMapsUrl(s),function (error, response, body) {
	 			if(!body) return true;
				var body = JSON.parse(body);
				// console.log(body)
				if(body.results.length){

					log("Found : ",streetKey(s))
					// props.streets[i].location = body.results[0].geometry.location;
					
					// obj[ streetKey(s) ] = body.results[0].geometry.location;
					obj = body.results[0].geometry.location
					database.ref('streets/'+streetKey(s)).update(obj)
				} else {

					log("Not found : ",streetKey(s))
					database.ref('streets/'+streetKey(s)).update({google: "notfound"})
				}
			})
			
		}
	})
}


// getOtodom("https://www.otodom.pl/oferta/mieszkanie-do-wynajecia-2-pokojowe-ID3i9Tu.html","3i9Tu")
function compress(){
return new Promise((resolve,reject)=>{
	
	database
	.ref('smallz').once('value')
	.then(function(snapshot) {
		var flats = snapshot.val();
		var str = JSON.stringify(flats);
		// log(str.length)
		var zstr = lzstring.compressToUTF16(str);
		// log(zstr.length)
		// log(lzstring.decompressFromUTF16(zstr))
		database.ref("compressed").update({ smallz: zstr })
		log("Compressed the database")
		setTimeout(resolve,2000)
	})
})
}

function removeOld(){
return new Promise((resolve,reject)=>{
	database
	.ref('smallz').once('value')
	.then(function(snapshot) {
		var flats = snapshot.val();
		for(var id in flats){
			if(Date.now() - flats[id].refreshed > 1000*3600*24*2){
				log('removed '+id)
				database.ref('smallz').child(id).remove();
			}
		}
		log("Removed old records")
		setTimeout(resolve,2000)
	})
})
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
function n2(a,b){
	return Math.sqrt(Math.pow(a.lat-b.lat,2)+Math.pow(a.lng-b.lng,2))
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
		// console.log(Date.now(),lastupdate,Date.now()-lastupdate)
		// update()
		if(Date.now() - lastupdate > 3600*1000/2){
			res.send('Update started');

			firebase.database().ref('/lastupdate/').update({
				date: new Date() + "",
				timestamp: Date.now()
			})

			getStreets()
			.then(update)
			.then(removeOld)
			.then(compress)
			.then(e=>{
				log("Hourra !")
			})
		}
		else {
			res.send('Updated less than half an hour ago');
			log('Updated less than half an hour ago')
		}
	})
 
});

app.get('/remove', function(req, res) {
	res.send('Okay, started removing old stuff');
  	removeOld();
 
});

app.get('/compress', function(req, res) {
	res.send('Compressing the data');
  	
  	

 
});

app.listen(app.get('port'), function () {
  console.log('Example app listening on port '+app.get('port'))
})




