
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
    completeText()
    .then(e=>{
        resq.send(texte);
    })

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
var txt = obj[key].en;
if(txt == ""){
    obj[key].pl = "";
    return true;
}
else if(txt == undefined) return true;
return new Promise((resx,rejx)=>{
// log(url)

    var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=pl&dt=t&q=" + encodeURI(txt);

    // request(url, function (error, response, body) {
    //     var trans = JSON.parse(body)
    //     var trtxt = trans[0][0][0];
    //     // console.log(body,trans,trtxt)

    //     trtxt = trtxt.replace("<b> ","<b>").replace(" </ b>","</b>")
    //     // texte[key].pl = trtxt;
            // obj[key].pl = trtxt;
    //     resx(trtxt)
    // })

    obj[key].pl = txt;
    resx({txt, key})
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
        if(action[key].en){
            var pr = translate(action,key)
            .then(e=>{
                log(e.key)
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
    var arr = actions.map(a=>{
        // console.log(a)
        return completeAction(a)
    })
    Promise.all(arr)
    .then(y=>{
        console.log("whouhou")
        return y;
    })
}


var text = {}

var actions = [
  {
    id: "heating_system",
    level: "invest",
    category: "house",
    title: {
      en: "Heating system",
      fr: "Système de chauffage",
    },
    icon: 'air',
    description: {
      en: "Upgrade your house's <b>heating and ventilating</b> system.",
      fr: "Moderniser le circuit de <b>chauffage et de ventilation</b>",
    },
    explanation: {
      en: "Upgrading your house heater to a modern technology or refurbishing the insulation and ventilation can <b>divide by two or three</b> the required heating energy, in houses which were not built with the modern energy standards.<br> For instance changing your boiler to a <b>condensation boiler</b> doubles its efficiency, installing a <b>ground heat source</b> allows to use a renewable energy source for heating and cooling.<br><i>Divides by two the heating energy</i>",
      fr: "Remplacer votre système de chauffage par une technologie moderne, ou refaire l'isolation et la ventilation de votre maison peut <b>diviser par deux ou trois</b> la dépense d’énergie dans les maisons qui ne sont pas construites aux normes énergétiques modernes. <br> Par exemple remplacer votre chaudière classique par une <b>chaudière à condensation</b> double son efficacité, ou encore installer une <b>pompe à chaleur géothermique</b> permet d'utiliser une source d’énergie complètement renouvelable pour le chauffage et la climatisation.",
    },
    sources: [{i: "tabula"}]
  },
  {
    id: "renewable",
    level: "invest",
    category: "house",
    title: {
      en: "Green electricity tariff",
      fr: "Électricité Renouvelable",
    },
    icon: 'electricity',
    description: {
      en: "Buy your electricity on <b>green tariff</b> : 100% from renewable sources",
      fr: "Acheter son électricité <b>100% renouvelable</b>",
    },
    explanation: {
      en: "The carbon footprint of a 100% green tariff isn't zero but is far lower than regular production system. Here the value of this action is calculated from the difference between your country's electricity production system and an average between hydroelectric, solar and wind power. Renewable sources still emit some greenhouse gases because of the impact of the facility production phase.",
      fr: "L'empreinte carbone de l’électricité renouvelable n'est pas nulle mais elle est bien inférieure à celle du système de production classique. Ici, la valeur de cette action est calculée à partir de la différence entre le système de production d'électricité de votre pays et une moyenne entre les sources hydroélectrique, solaire et éolienne. Les énergies renouvelables émettent tout de meme des gaz à effet de serre à cause de l'impact de la phase de production de l'installation.",
    },
    sources: [{i:"renewable"},{i:"mixeurope"}]
  },
  { 
    id: "thermostat",
    level: "effort",
    category: "house",
    title: {
      en: "Turning down the thermostat",
      fr: "Baisser le thermostat",
    },
    icon: 'thermostat',
    description: {
      en: "Turning down the thermostat from <b>20 to 18 degrees</b>",
      fr: "Baisser le thermostat de <b>20 à 18 degrés</b>",
    },
    explanation: {
      en: "The warmer is the house heated, the more the heat leaks out through the existing breaches. A UK households study shows that lowering the thermostat by two degrees saves - in the UK - 20% of the heating energy. For lack of europe-scale data, this proportion should be trusted only in countries with a similar climate.",
      fr: "Plus on monte le thermostat, plus la chaleur s’échappe à travers les brèches de l’isolation. Une étude Anglaise montre que baisser le thermostat de deux degrés permet d'économiser - au Royaume-Uni - 20% de l'énergie de chauffage. Ce pourcentage est valable dans la plupart des pays d’Europe, qui ont un climat similaire.",
    },
    sources: [{i:"ukhouses"}]
  },
  { 
    id: "towel",
    level: "easy",
    category: "house",
    title: {
      en: "Air drying the laundry",
      fr: "Étendre son linge",
    },
    icon: 'towel',
    description: {
      en: "<b>Air drying</b> the laundry instead of using the tumble drier",
      fr: "<b>Étendre le linge</b> plutôt qu'utiliser un sèche linge",
    },
    explanation: {
      en: "Tumble driers are energy thirsty items, more than the washing machine itself. Find some time and room to hang your laundry and spare a significant amount of carbon and money",
      fr: "Le sèche linge est un appareil gourmand en électricité, plus que la machine à laver elle-même. Prendre le temps d’étendre votre linge permet d’éviter une émission importante de gaz à effet de serre et d’économiser le prix de l’électricité.",
    },
    sources: [{i:"ukhouses"}]
  },
  { 
    id: "sweater",
    level: "easy",
    category: "house",
    title: {
      en: "Wearing a thick jumper",
      fr: "Porter un gros pull",
    },
    icon: 'sweater',
    description: {
      en: "Wearing a <b>thick jumper</b> during the winter",
      fr: "Porter un <b>gros pull</b> en hiver",
    },
    explanation: {
      en: "It has been shown that wearing a warm jumper in the winter provides incentive to lower the heating temperature by an average of one degree",
      fr: "Il a été démontré que porter un pull chaud en hiver incite à baisser la température du thermostat d’en moyenne un degré.",
    },
    sources: [{i:"ukhouses"}]
  },
  { 
    id: "dishwasher",
    level: "easy",
    category: "house",
    title: {
      en: "Dishwasher on Eco setting",
      fr: "Lave-vaisselle en mode éco",
    },
    icon: 'dishwasher',
    description: {
      en: "Always use the dishwasher on eco settings",
      fr: "Toujours utiliser le lave-vaisselle en mode éco",
    },
    explanation: {
      en: "Modern dishwashers (A+, A++, A+++) clean just as well in eco mode, and use significantly less energy",
      fr: "Les lave-vaisselles modernes (A+, A++, A+++) lavent aussi bien en mode éco et utilisent beaucoup moins d’énergie.",
    },
    sources: [{i:"ukhouses"}]
  },
  { 
    id: "efficient_shower",
    level: "easy",
    category: "house",
    title: {
      en: "Water saving shower head",
      fr: "Pomme de douche à économie d'eau",
    },
    icon: 'shower-1',
    description: {
      en: 'Install a water saving <b>shower head</b>.<br><br>',
      fr: "Installer une <b>pomme de douche</b> à economie d'eau",
    },
    explanation: {
      en: 'For a more accurate comparison, choose your water boiler type : <i><select class="fuel-select water_boiler"><option value="Electricity">Electric</option><option value="Gas" selected>Gas</option></select></i><br>Efficient shower heads reduce the amount of water used during a shower, while maintaining a steady flow. They cost around twenty euros and can reduce by 40-50% the use of water.',
      fr: 'Pour une comparaison plus précise, sélectionnez votre type de chauffe-eau: <i><select class="fuel-select water_boiler"><option value="Electricity" selected>Electrique</option><option value="Gas">Gas</option></select></i><br> Les pommeaux de douche à économie d’eau coûtent environ vingt euros et peuvent réduire de 40-50% la consommation d\'eau.'
    },
    sources: [{i:"ukhouses"}]
  },
  { 
    id: "shower_length",
    level: "easy",
    category: "house",
    title: {
      en: "Shorter showers",
      fr: "Douches plus rapides",
    },
    icon: 'shower',
    description: {
      en: 'Four times a week, take showers lasting 5 minutes instead of 7 minutes.',
      fr: "Prendre une douche de <b>5 minutes au lieu de 7</b>, quatre fois par semaine",
    },
    explanation: {
      en: 'For a more accurate comparison, choose your water boiler type : <i><select class="fuel-select water_boiler"><option value="Electricity" selected>Electric</option><option value="Gas">Gas</option></select></i><br>A quicker shower is less hot water spent and less electricity or gas used.',
      fr: 'Pour une comparaison plus précise, sélectionnez votre type de chauffe-eau: <i><select class="fuel-select water_boiler"><option value="Electricity" selected>Electrique</option><option value="Gas">Gas</option></select></i><br> Une douche plus rapide, c’est moins de consommation d’eau chaude et moins de gaz ou d’électricité pour la chauffer.',
    },
    sources: [{i:"ukhouses"}]
  },
  { 
    id: "defrost",
    level: "easy",
    category: "house",
    title: {
      en: "Defrosting the freezer",
      fr: "Dégivrer le congélateur",
    },
    icon: 'refrigerator',
    description: {
      en: "Regularly defrost the freezer",
      fr: "Régulièrement dégivrer le <b>congélateur</b>",
    },
    explanation: {
      en: "Removing the frost in the freezer increases the cold flow and the efficiency of the cooling system.",
      fr: "Dégivrer le congélateur facilite le flux de froid et augmente l'efficacité du système de refroidissement.",
    },
    sources: [{i:"ukhouses"}]
  },
  { 
    id: "saucepan",
    level: "easy",
    category: "house",
    title: {
      en: "Lids on saucepans",
      fr: "Mettre un couvercle",
    },
    icon: 'pot',
    description: {
      en: "Put lids on saucepans and lower the fire to the simmering state",
      fr: "Mettre des <b>couvercles</b> sur les poeles et mijoter plutôt que bouillir",
    },
    explanation: {
      en: "",
      fr: "",
    },
    sources: [{i:"ukhouses"}]
  }
]

