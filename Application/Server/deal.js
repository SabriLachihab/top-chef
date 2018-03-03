var request = require('request');
var cheerio = require('cheerio');
var fetchUrl = require("fetch").fetchUrl;
var fs = require('fs');
var deals = {}
deals['Restaurant']=[]


function get_deals(id,api,callback)
{
  var url = "https://m.lafourchette.com/api/restaurant/"+id+"/sale-type"
  var data = {}
  data['Special'] = [ ]
  data['Menu'] = [ ]
  var finddeal = false
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
              if(element.is_special_offer == true && element.is_menu == true)
              {
                var info =
                {
                  title : element.title,
                  exclusions : element.exclusions,
                  description : element.description,
                }
                data['Special'].push(info)
                finddeal = true
              }
              else if (element.is_menu === true)
              {
                var info =
                {
                  title : element.title,
                  exclusions : element.exclusions,
                  description : element.description,
                }
                data['Menu'].push(info)
                finddeal = true
              }
            })
            if(finddeal==true)
            {
              var dealpromo =
              {
                deal : data,
                api : api
              }
              callback(dealpromo)
            }
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

function find_deals()
{
  if(!fs.existsSync('deals.json'))
  {
    if(fs.existsSync('restaurant_lafourchette.json'))
  	{
      console.log("The file doesn't exist");
    	console.log("Start the scrapping so please don't touch the terminal command")
      var jsonobj = JSON.parse(fs.readFileSync('restaurant_lafourchette.json', 'utf8'));
      var total = jsonobj['Restaurant'].length;
      jsonobj['Restaurant'].forEach(function(restaurant)
      {
        get_deals(restaurant.id,restaurant,function(data)
        {
          deals['Restaurant'].push(data);
          fs.writeFile('deals.json', JSON.stringify(deals, null, 4), 'utf8', function(error){
          if(error)
          {
            return console.log(error);
          }
            else{
              console.log("we found "+ deals['Restaurant'].length +" restaurants with stars and deals in France");
            }
            })
        fs.writeFile('./../app/src/deals.json', JSON.stringify(deals, null, 4), 'utf8', function(error){
        if(error)
        {
          return console.log(error);
        }
          else{
          }
          })
          });
      });
    }
    else
    {
      console.log("WARNING : The File don't Exist");
      console.log("Please excute this command line : "+" node lafourchette.js");
      console.log("THANKS YOU");
    }
  }
  else {
    console.log("WARNING : The File Exist");
    console.log("Please excute this command line : "+" npm start in app folder to show the offers");
    console.log("THANKS YOU");
  }
}

find_deals()
