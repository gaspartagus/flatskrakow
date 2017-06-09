
var firebase = require("firebase-admin");

var serviceAccount = require("./service-key.json");
var centreville = require("./centreville.json");

// console.log(centreville)
var app = firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://gumtree-hacker.firebaseio.com"
});



console.log(app.name);  // "[DEFAULT]"

database = firebase.database();

flats  = database.ref('flats');


var request = require('request');
var s = "Rynek Główny";
// request(queryMapsUrl(s),function (error, response, body) {
// 	console.log(body)

// })

firebase.database().ref('/streets/' + streetKey(s) ).once('value').then(function(snapshot) {
  console.log(snapshot.val())
  // ...
});


function queryMapsUrl(ul){
	return "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + encodeURIComponent(ul.replace(" ","+")) + "+Krakow&key=AIzaSyBG0dOVS_ZhMTnoprt3-pxQUVlpgalraqM"
}
function streetKey(s){
	return s.replace(/\.|#|$|\/|\[|\]/g,"")
}