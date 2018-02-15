var request = require('request');
var cheerio = require('cheerio');
var fetchUrl = require("fetch").fetchUrl;
var key = 'Restaurant'
var path = require('path');
var lafourchettediscount = { };
lafourchettediscount[key] = []


function scrap()
{
  const fs =require('fs');
  fs.stat('lafourchette.json', function(err, stat) {
    if (err==null) {
      console.log("IL EXITSTE LE FICHIER");
      var data= fs.readFileSync('lafourchette.json', 'utf8');
      var words=JSON.parse(data);
      //console.log(words);
      var t = 0;
      var find = 0
      for(var i = 0;i<words[key].length;i++)
      {
        var id = words[key][i]['api'].id
        var url = 'https://www.lafourchette.com/reservation/module/date-list/'+id
        request(url, function (error, response,html) {
                if (!error && response.statusCode == 200)
                {
                  var jobj = JSON.parse(html)
                  // Offre ou pas
                  if(jobj.data.bestSaleTypeAvailable!=undefined)
                  {
                    //console.log('https://www.lafourchette.com/reservation/module/date-list/'+words[key][t]['api'].id);
                    find = find + 1
                    //console.log(jobj.data.bestSaleTypeAvailable)
                    var data =
                    {
                      reduction : jobj.data.bestSaleTypeAvailable,
                      lafourchetteapi : words[key][t]
                    }
                    lafourchettediscount[key].push(data)
                  }
                  t = t + 1
                  console.log(t);
                  if(t==words[key].length)
                  {
                    console.log(find);
                    const fs = require('fs');
                    fs.writeFile("lafourchettediscount.json",JSON.stringify(lafourchettediscount,null,4),'utf8',function(err){
                      if (err) {
                          return console.log(err);
                      }
                    });
                  }
                }
              });
            }
          }
    else {
      console.log("NO API CONNECTION");
    }
  });
}

scrap()
