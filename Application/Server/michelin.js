var request = require('request');
var cheerio = require('cheerio');
var fetchUrl = require("fetch").fetchUrl;
var fs = require('fs');
var url = "https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin"
var total_restaurants = 0
var counter = 0

function get_number_pages(url, callback){
	fetchUrl(url,function(error, meta, body){
		if(!error){
			var $ = cheerio.load(body);
			var total_pages = $('.mr-pager-item').eq(-4).text();
			console.log("We Found "+total_pages+" pages in restaurant.michelin.fr");
			callback(total_pages);
		}
	});
}

function get_url_restaurant_michelin(url, callback)
{
	var lienrestaurant = []
	fetchUrl(url,function(error, meta, body){
	if(!error){
		var $ = cheerio.load(body);
		$('.poi-card-link').each(function(i, element)
		{
			lienrestaurant.push(element.attribs['href'].trim());
			total_restaurants++;
		});
		callback(lienrestaurant)
	}
	})
}

function get_info_restaurant(url,callback)
{
	fetchUrl(url,function(error, meta, body)
	{
		if(!error)
		{
			var $ = cheerio.load(body)
			if(($('.poi_intro-display-title')[0])!=undefined)
			{
				var name = ($('.poi_intro-display-title')[0].children[0].data.trim())
				var postal = ""
				if(($('.postal-code')[0])!=undefined)
				{
						postal = ($('.postal-code')[0].children[0].data);
				}
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
				if($('.field--name-field-chef').children('.field__items').children('.field__item').first().text()!=undefined)
				{
					chef = $('.field--name-field-chef').children('.field__items').children('.field__item').first().text()
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
				var inspecteur = ""
				if($('.field--name-field-insp-word').children('.field__items').children('.field__item').first().text()!=undefined)
				{
					inspecteur = $('.field--name-field-insp-word').children('.field__items').children('.field__item').first().text()
				}
				var motchef = ""
				if($('.field--name-field-chef-word').children('.field__items').children('.field__item').first().text()!=undefined)
				{
					motchef = $('.field--name-field-chef-word').children('.field__items').children('.field__item').first().text()
				}
				var data =
				{
						name : name ,
						etoile : etoile ,
						cuisine : cuisine,
						chef : chef,
						price : price,
						address : address,
						codepostal : postal ,
						city : city ,
						mot_inspecteur : inspecteur,
						mot_chef : motchef
				};
				callback(data)
			}
		}
	})
}

function scrapping_or_not()
{
	if(!fs.existsSync('./restaurant_michelin.json'))
	{
		var jsonobj = { }
		var key = 'Restaurant'
		jsonobj[key] = [ ]
		console.log("The file doesn't exist");
		console.log("Start the scrapping so please don't touch the terminal command")
		get_number_pages(url,function(total_pages)
		{
			for(var i=0;i<=total_pages;i++)
			{
				get_url_restaurant_michelin(url+"/page-"+i,function(list)
				{
					for(var j=0;j<list.length;j++)
					{
						get_info_restaurant("https://restaurant.michelin.fr"+list[j],function(restaurant)
						{
							jsonobj[key].push(restaurant)
							counter++
							console.log("Restaurant : "+restaurant.name+" added ( "+counter+" / "+total_restaurants+" )")
							if(counter==total_restaurants)
							{
								fs.writeFile('restaurant_michelin.json', JSON.stringify(jsonobj, null, 4), 'utf8', function(error){
								if(error)
								{
									return console.log(error);
								}
								else{
									console.log("File was created");
									console.log("we found "+total_restaurants+" restaurants with stars in France");
								}
								})
							}
						});
					}
				});
			}
		});
	}
	else {
		var jsonobj = JSON.parse(fs.readFileSync('restaurant_michelin.json', 'utf8'));
		console.log("The file exist");
		console.log("We found "+ jsonobj['Restaurant'].length + " restaurants in file");
	}
}

scrapping_or_not()
