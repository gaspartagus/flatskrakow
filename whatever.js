
// var firebase = require("firebase-admin");

// var serviceAccount = require("./service-key.json");
// var centreville = require("./centreville.json");

// // console.log(centreville)
// var app = firebase.initializeApp({
//   credential: firebase.credential.cert(serviceAccount),
//   databaseURL: "https://gumtree-hacker.firebaseio.com"
// });



// console.log(app.name);  // "[DEFAULT]"

// database = firebase.database();

// flats  = database.ref('flats');


var request = require('request');
var s = "Rynek Główny";
var url = "https://www.gumtree.pl/a-pokoje-do-wynajecia/krakow/room-for-rent-23-m-for-1-or-2-people/1001234801470910507956409";
// url = "https://www.google.pl/search?q=vd&oq=vd&aqs=chrome..69i57j69i61j69i60l3j69i65.367j0j4&sourceid=chrome&ie=UTF-8"
console.log("request boy",url)
request(url,function (err, res, body) {
	console.log("c'mon")
	console.log(err,res)

})

// firebase.database().ref('/streets/' + streetKey(s) ).once('value').then(function(snapshot) {
//   console.log(snapshot.val())
//   // ...
// });


function queryMapsUrl(ul){
	return "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + encodeURIComponent(ul.replace(" ","+")) + "+Krakow&key=AIzaSyBG0dOVS_ZhMTnoprt3-pxQUVlpgalraqM"
}
function streetKey(s){
	return s.replace(/\.|#|$|\/|\[|\]/g,"")
}