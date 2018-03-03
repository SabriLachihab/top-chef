var request = require('request');
var cheerio = require('cheerio');
var fetchUrl = require("fetch").fetchUrl;
var fs = require('fs');
var lienfourchette = {}
lienfourchette['Restaurant'] = []

function get_id_restaurant(name,codepostal,michelin,callback)
{
  var str = name.noAccent();
  var url = 'https://m.lafourchette.com/api/restaurant-prediction?name='+str
  //console.log(url);
  request({
		url: url,
		json : true
	},function(error, meta, body)
  {
    if (!error)
    {
      if(body != null)
      {
  			try
        {
					body.forEach(function(element)
          {
						if(element.address.postal_code == codepostal)
            {
							id = element.id;
              var data =
              {
                name : element.name,
                id : id,
                address : element.address,
                michelin : michelin
              }
							callback(data);
						}
  				});
  			}
        catch(error)
        {
  				console.log(error);
  			}
		  }
    }
    else {
      console.log(error);
    }
  })
}

String.prototype.noAccent = function(){
    var accent = [
        /[\300-\306]/g, /[\340-\346]/g, // A, a
        /[\310-\313]/g, /[\350-\353]/g, // E, e
        /[\314-\317]/g, /[\354-\357]/g, // I, i
        /[\322-\330]/g, /[\362-\370]/g, // O, o
        /[\331-\334]/g, /[\371-\374]/g, // U, u
        /[\321]/g, /[\361]/g, // N, n
        /[\307]/g, /[\347]/g, // C, c
    ];
    var noaccent = ['A','a','E','e','I','i','O','o','U','u','N','n','C','c'];
    var str = this;
    for(var i = 0; i < accent.length; i++){
        str = str.replace(accent[i], noaccent[i]);
    }
    return str;
}



function getrestaurant_in_lafourchette()
{
  if(fs.existsSync('restaurant_michelin.json'))
	{
    if(fs.existsSync('restaurant_lafourchette.json'))
    {
      var jsonobj = JSON.parse(fs.readFileSync('restaurant_lafourchette.json', 'utf8'));
      console.log("Display the Json restaurant_lafourchette.json");
      console.log(jsonobj);
      console.log("Please execute the line command : node deal.js");
    }
    else {
    console.log("The file doesn't exist");
  	console.log("Start the scrapping so please don't touch the terminal command")
    var jsonobj = JSON.parse(fs.readFileSync('restaurant_michelin.json', 'utf8'));
    var total = jsonobj['Restaurant'].length;
    jsonobj['Restaurant'].forEach(function(restaurant)
    {
      get_id_restaurant(restaurant.name,restaurant.codepostal,restaurant,function(data)
      {
        lienfourchette['Restaurant'].push(data);
        fs.writeFile('restaurant_lafourchette.json', JSON.stringify(lienfourchette, null, 4), 'utf8', function(error){
        if(error)
        {
          return console.log(error);
        }
          else{
            console.log("we found "+ lienfourchette['Restaurant'].length +" restaurants with stars in France");
          }
          })
      });
    });
  }
  }
  else
  {
    console.log("WARNING : The File don't Exist");
    console.log("Please excute this command line : node michelin.js");
    console.log("THANKS YOU");
  }
}

getrestaurant_in_lafourchette()
