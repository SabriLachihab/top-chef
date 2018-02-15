var request = require('request');
var cheerio = require('cheerio');
var fetchUrl = require("fetch").fetchUrl;
var lienrestaurant = [ ]
var codepostal = [ ]
var x = true;
var o = {}
var key = 'Restaurant'
o[key] = []
var allfourchetterestaurant = {}
allfourchetterestaurant[key]= []
var path = require('path');
var p = 0;
var lafourchette = {}
lafourchette[key] = []


function scrap()
{
  const fs =require('fs');
  fs.stat('restaurant_michelin.json', function(err, stat) {
    if (err==null) {
      console.log("IL EXITSTE LE FICHIER");
      findresto_fourchette()
    }
    else
    {
      for(var j=1;j<80;j++)
      {
          fetchUrl('https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page-'+j, function(error, meta, body){
              var $ = cheerio.load(body);
              $('.poi-card-link').each(function(i, element)
              {
                  lienrestaurant.push(element.attribs['href'].trim());
                  fetchUrl("https://restaurant.michelin.fr"+element.attribs['href'].trim(), function(errorr, metaa, bodyy){
                      var $ = cheerio.load(bodyy);
                      if(($('.poi_intro-display-title')[0])!=undefined)
                      {
                        var name = ($('.poi_intro-display-title')[0].children[0].data.trim())
                        var postal = ""
                        if(($('.postal-code')[0])!=undefined)
                        {
                            postal = ($('.postal-code')[0].children[0].data);
                        }
                        //console.log(codepostal.length)
                        console.log(p+"  =  "+"name : "+name+" , code postal : "+postal);

                        var textetoile = ""
                        if($('.michelin-poi-distinctions-list')!=undefined)
                        {
                          textetoile = $('.michelin-poi-distinctions-list').text()
                        }
                        var etoile = ""
                        if(textetoile.startsWith('1'))
                        {
                          etoile = "1"
                        }
                        else if(textetoile.startsWith('2')){
                          etoile = "2"
                        }
                        else if(textetoile.startsWith('3'))
                        {
                          etoile = "3"
                        }
                        var price = ""
                        if($('.poi_intro-display-prices').text()!=undefined)
                        {
                          price =  $('.poi_intro-display-prices').text().trim();
                        }
                        var chef  = ""
                        if($('.field__item even').text()!=undefined)
                        {
                          chef = $('.field__item even').text()
                        }
                        var cuisine = ""
                        if($('.node_poi-cooking-types').text()!=undefined)
                        {
                          cuisine = $('.node_poi-cooking-types').text().trim();
                        }
                        var city = ""
                        if($('.locality')[0]!=undefined)
                        {
                          city = $('.locality')[0].children[0].data.trim()
                        }
                        var address = ""
                        if($('.thoroughfare')[0]!=undefined)
                        {
                          address = $('.thoroughfare')[0].children[0].data.trim()
                        }
                        p = p + 1;
                        var data =
                        {
                            name : name ,
                            etoile : etoile ,
                            cuisine : cuisine,
                            chef : chef,
                            price : price,
                            address : address,
                            codepostal : postal ,
                            city : city
                        };
                        o[key].push(data)
                      }
                      if(o[key].length==615)
                      {
                          console.log(o);
                          const fs = require('fs');
                          fs.writeFile("restaurant_michelin.json",JSON.stringify(o, null, 4),'utf8',function(err){
                            if (err) {
                                return console.log(err);
                            }
                          });
                          console.log("ECRITURE DU FICHIER REUSSIT");
                      }
                  });
              });
          });
        }
    }
  });
}

String.prototype.sansAccent = function(){
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

function findpostalcode(namerestaurant,postal,jsonfile)
{
  var postal_code = 0
  for (var i = 0 ; i< jsonfile[key].length ; i++)
  {
    if(namerestaurant.includes(jsonfile[key][i]['name'].toUpperCase()))
    {
      if( jsonfile[key][i].codepostal==postal)
      {
        postal_code = jsonfile[key][i].codepostal
      }
    }
  }
  return postal_code
}

function michelinresto(namerestaurant,postal,jsonfile)
{
  var index = 0
  for (var i = 0 ; i< jsonfile[key].length ; i++)
  {
    if(namerestaurant.includes(jsonfile[key][i]['name'].toUpperCase()))
    {
      if( jsonfile[key][i].codepostal==postal)
      {
        index = i
      }
    }
  }
  return index
}

scrap()

function findresto_fourchette()
{
  const fs =require('fs');
  var data=fs.readFileSync('restaurant_michelin.json', 'utf8');
  var words=JSON.parse(data);
  var t = 0;
  //console.log(words[key][0]);
  for(var i = 0;i<words[key].length;i++)
  {
    var str = words[key][i]['name']
    str = str.sansAccent();
    //console.log(str);
    var newname = 'https://m.lafourchette.com/api/restaurant-prediction?name='+str
    //console.log(newname);
    request("https://m.lafourchette.com/api/restaurant-prediction?name="+ str, function (error, response,html)
    {
      if (!error && response.statusCode == 200)
      {
          //var $ = cheerio.load(html);
          //console.log(html);
          var jobj = JSON.parse(html)
          for(var j=0;j<jobj.length;j++)
          {
            //console.log(jobj[j].address.postal_code)
            //console.log(i);
            allfourchetterestaurant[key].push(jobj[j])
            //console.log(allfourchetterestaurant[key].length);
          }
      }
      t= t+1
      console.log(t);
      if(t==words[key].length)
      {
        var u = 0
        console.log(allfourchetterestaurant);
        for(var l=0;l<allfourchetterestaurant[key].length;l++)
        {
            var restoname = allfourchetterestaurant[key][l].name.toUpperCase();
            if(findpostalcode(restoname,allfourchetterestaurant[key][l].address.postal_code,words)!=0)
            {
              u = u+1
              console.log(restoname)
              var data =
              {
                api : allfourchetterestaurant[key][l],
                michelin : words[key][michelinresto(restoname,allfourchetterestaurant[key][l].address.postal_code,words)]
              }
              lafourchette[key].push(data)
            }
        }
        //console.log(u)
        const fs = require('fs');
        fs.writeFile("lafourchette.json",JSON.stringify(lafourchette, null, 4),'utf8',function(err){
          if (err) {
              return console.log(err);
          }
        });
        console.log("ECRITURE DU FICHIER REUSSIT");
      }
    });
  }
}
