
var request = require('request');
var express = require('express');
var app = express();
var log = console.log;

app.set('port', (process.env.PORT || 5000))

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  //res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
}

app.use( allowCrossDomain );


app.get('/translate', function(req, resq) {
    // translate("Hello")
    // completeText()
    // .then(e=>{
    //     resq.send(texte);
    // })

    completeActions()
    .then(e=>{
        resq.send(actions);
    })

    // res.send(text)
 
});



app.listen(app.get('port'), function () {
  console.log('Example app listening on port '+app.get('port'))
})



function translate(obj,key){
return new Promise((resx,rejx)=>{
  var txt = obj[key].en;
  if(txt == ""){
      obj[key].pl = "";
      resx(true);
      return true;
  }
  else if(txt == undefined) {
    resx(true);
    return true;
  }

  var phrases = txt.split(". ");

  for(var i = 0; i < phrases.length-1; i++)
  {
    if(phrases[i].slice(-1) != ".") phrases[i] += ".";
  }

  var proms = phrases.map(p=>{
    return googletranslate(p)
  })

  Promise.all(proms)
  .then(phr=>{
    var trtxt = phr.join(" ");
    obj[key].pl = trtxt;
    resx(trtxt)
  })

})
}

function googletranslate(txt){
  return new Promise((resx,rejx)=>{
  // log(url)

      var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=pl&dt=t&q=" + encodeURI(txt);

      // request(url, function (error, response, body) {
      //     var trans = JSON.parse(body)
      //     var trtxt = trans[0][0][0];
      //     // console.log(body,trans,trtxt)

      //     trtxt = trtxt.replace("<b> ","<b>").replace(" </ b>","</b>")

      //     resx(trtxt)
      // })

      resx(txt);
  })
}

var texte;
function completeText(){
texte = text;
return new Promise((resolve,reject)=>{
    var arr = [];
    for( key in texte ){
        console.log(key)
        var pr = translate(texte[key].en,key)
        arr.push(pr)
    }
    Promise.all(arr)
    .then(resolve)
})
}

function completeAction(action){
// texte = text;
return new Promise((resolve,reject)=>{
    var arr = [];
    for( key in action ){
        // console.log(action[key].en)
        if(action[key].en != undefined){
            var pr = translate(action,key)
            .then(e=>{
                // log(e.key)
                // actions[e.key].pl = e.txt;
                return e;
            })
            arr.push(pr)
            
        }
    }
    Promise.all(arr)
    .then(resolve)
})
}

function completeActions(){
  var proms = [];
  for( var key in actions) {
      // console.log(a)
    if(key)
    proms.push( completeAction(actions[key]) )

  }
  return Promise.all(proms)
  // .then(y=>{
  //     console.log("whouhou")
  //     return y;
  // })
}


var text = {}

actions = [
  {
    "id": "facebook_page",
    "level": "easy",
    "category": "social",
    "qualitative": true,
    "impact": "big",
    "title": {
      "en": "Liking the Climate-Lab facebook page",
      "fr": "Aller sur la page facebook Climate-Lab",
      "pl": "Kochanie na facebooku na stronie Climate-Lab"
    },
    "icon": "fb",
    "color": "#303F9F",
    "description": {
      "en": "Liking the <b>Climate-Lab facebook page</b> and sharing it to your friends",
      "fr": "Partager la <b>page facebook Climate-Lab</b> avec ses amis",
      "pl": "Zachęcamy do <b>strony facebook-klimat-Lab</b> i dziel się nią z przyjaciółmi"
    },
    "explanation": {
      "en": "",
      "fr": "",
      "pl": ""
    },
    "sources": []
  },
  {
    "id": "political_action",
    "level": "easy",
    "category": "social",
    "qualitative": true,
    "impact": "big",
    "title": {
      "en": "Voting Sustainable Development",
      "fr": "Voter Développement Durable",
      "pl": "Głosowanie zrównoważonego rozwoju"
    },
    "icon": "voting1",
    "color": "#ef435b",
    "description": {
      "en": "<b>Voting for a candidate</b> who supports the <b>energy transition</b> and sustainable development",
      "fr": "<b>Voter pour un candidat</b> qui soutient la <b>transition énergétique</b> et le développement durable",
      "pl": "<B> Głosowanie na kandydata </ ​​b>, który wspiera przejście na energię i zrównoważony rozwój"
    },
    "explanation": {
      "en": "",
      "fr": "",
      "pl": ""
    },
    "sources": []
  }
]


completeActions()
.then(e=>{
    log(actions)
})



