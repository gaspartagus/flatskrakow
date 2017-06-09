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
	'https://www.gumtree.pl/s-pokoje-do-wynajecia/krakow/v1c9000l3200208p1?pr=,1300&fr=ownr',
	"https://www.gumtree.pl/s-pokoje-do-wynajecia/krakow/page-2/v1c9000l3200208p2?pr=,1300&fr=ownr",
	"https://www.gumtree.pl/s-pokoje-do-wynajecia/krakow/page-3/v1c9000l3200208p2?pr=,1300&fr=ownr",
	"https://www.gumtree.pl/s-pokoje-do-wynajecia/krakow/page-4/v1c9000l3200208p2?pr=,1300&fr=ownr",
	"https://www.gumtree.pl/s-pokoje-do-wynajecia/krakow/page-5/v1c9000l3200208p2?pr=,1300&fr=ownr",

	'https://www.gumtree.pl/s-mieszkania-i-domy-do-wynajecia/krakow/v1c9008l3200208p1?fr=ownr&pr=,1300',
	"https://www.gumtree.pl/s-pokoje-do-wynajecia/krakow/page-2/v1c9008l3200208p1?pr=,1300&fr=ownr",
	"https://www.gumtree.pl/s-pokoje-do-wynajecia/krakow/page-3/v1c9008l3200208p1?pr=,1300&fr=ownr",
	"https://www.gumtree.pl/s-pokoje-do-wynajecia/krakow/page-4/v1c9008l3200208p1?pr=,1300&fr=ownr",
	"https://www.gumtree.pl/s-pokoje-do-wynajecia/krakow/page-5/v1c9008l3200208p1?pr=,1300&fr=ownr"
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

var maison = 'https://www.gumtree.pl/a-mieszkania-i-domy-do-wynajecia/krakow/2+pokojowe-54-m2-olsza-do-wynajecia/1001999439920911108367709';
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
			if(short <= 4) return true;

			var index = props.title.search(short);
			if(index < 0) index = props.description.search(short);

			if (index > -1 ){
				var obj = { index : index };

				firebase.database()
				.ref('/streets/' + streetKey(s) ).once('value')
				.then(function(snapshot) {

				 	if(!snapshot.val()){
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
							}
						})
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

		database.ref("flats/"+id).update(props)

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
// getFlat(maison)
queryUrls.forEach(l=>{
	getList(l)
})





// require("jsdom").env("", function(err, window) {
	
//     if (err) {
//         console.error(err);
//         return;
//     }
 
//     var $ = require("jquery")(window);

// 	$.ajax(
// 		'https://www.gumtree.pl/s-mieszkania-i-domy-do-wynajecia/krakow/page-3/v1c9008l3200208p3?pr=,1500&nr=2',
// 		{
// 			success: e => { console.log(e) }
// 		}
// 	)

// });

