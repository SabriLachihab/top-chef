import React, { Component } from 'react';
import logo from './fourchette.jpg';
import './App.css';
import pricefourchette from './deals.json';
import ReactDOM from 'react-dom';
import GoogleMapReact from 'google-map-react';
const data = [ ]
var count = 0
var base = "https://www.lafourchette.com"

const AnyReactComponent = ({ text }) => <div>{text}</div>;


class App extends Component {

  static defaultProps = {
    center: {lat: 59.95, lng: 30.33},
    zoom: 11
  };

  render() {
    for(var i=0;i<pricefourchette['Restaurant'].length;i++)
    {
      var stretoile = ""
      if(pricefourchette['Restaurant'][i].api.michelin.etoile==1)
      {
        stretoile = " étoile"
      }
      else {
        stretoile = " étoiles"
      }
      let Special = []
      for(var j=0;j<pricefourchette['Restaurant'][i].deal.Special.length;j++)
      {
        let special =
        {
          type : "Special",
          name : pricefourchette['Restaurant'][i].api.name,
          reduction : pricefourchette['Restaurant'][i].deal.Special[j].title,
          Info : pricefourchette['Restaurant'][i].deal.Special[j].description,
        }
        Special.push(special)
      }
      let Menu = []
      for(var j=0;j<pricefourchette['Restaurant'][i].deal.Menu.length;j++)
      {
        let menu =
        {
          type : "Menu",
          name : pricefourchette['Restaurant'][i].api.name,
          reduction : pricefourchette['Restaurant'][i].deal.Menu[j].title,
          Info : pricefourchette['Restaurant'][i].deal.Menu[j].description,
        }
        Menu.push(menu)
      }
      var deals =
      {
        Special : Special,
        Menu : Menu,
      }
      var obj =
      {
        name : pricefourchette['Restaurant'][i].api.name,
        stars : pricefourchette['Restaurant'][i].api.michelin.etoile + stretoile ,
        adresss : pricefourchette['Restaurant'][i].api.michelin.address+" , "+pricefourchette['Restaurant'][i].api.michelin.codepostal+" "+pricefourchette['Restaurant'][i].api.michelin.city,
        deals : deals,
        chef : pricefourchette['Restaurant'][i].api.michelin.chef,
        price : pricefourchette['Restaurant'][i].api.michelin.price,
        cooking : pricefourchette['Restaurant'][i].api.michelin.cuisine,
        word_inspecteur : pricefourchette['Restaurant'][i].api.michelin.mot_inspecteur,
        word_chief : pricefourchette['Restaurant'][i].api.michelin.mot_chef,
        id : pricefourchette['Restaurant'][i].api.id,
      }
      data.push(obj)
      if(pricefourchette['Restaurant'][i].deal.Special.length>0)
      {
        count++;
      }
    }
    alert("We found " + count + " special offers in the LaFourchette");

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to LaFourchette v2.0</h1>
        </header>
        <div>
        	<div className='restaurants'>{get_restaurants()}</div>
        </div>
      	<div>
      	//Try Google Maps -> not display the map
      	<GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyAtmBBgB5ebIT98Xf1a3DNTzOl-9_uU-k' }}
        defaultCenter={this.props.center}
        defaultZoom={this.props.zoom}
      	>
	        <AnyReactComponent
	          lat={59.955413}
	          lng={30.337844}
	          text={'Kreyser Avrora'}
	        />
        </GoogleMapReact>
        </div>
      </div>
    );
  }
}

function get_restaurants() {
  let restaurant = data.map(function(row) {
    return (
      <div className='restaurant'>
        <div className='restaurant-name'>
          {row.name}
          <div className='restaurant-adress'>
           {row.adresss}
          </div>
          <div className='restaurant-stars'>
            {row.stars}
          </div>
          <ul className='display-list'>
          {get_star_number(row.stars)}
          </ul>
          <p></p>
          {action_button()}
        </div>
        <div>
           <p>Chief : {row.chef}</p>
        </div>
        <div>
        <p>Cooking Type : {row.cooking}</p>
        </div>
        <div>
        <p>Word of the Inspecteur : {row.word_inspecteur}</p>
        </div>
        <div>
          <p>Word of the Chief : {row.word_chief}</p>
        </div>
        <div>
        <p>Price in restaurant.michelin.fr : {row.price}</p>
        </div>
        <div>
        <p></p>
        <p align="center">Special</p>
        <ul className='display-list'>
          {get_deal_special(row.deals.Special,row.name)}
        </ul>
        <p align="center">Menu</p>
        <ul className='display-list'>
          {get_deal_menu(row.deals.Menu,row.name)}
        </ul>
        </div>
        <br />
      </div>
    );
  });
  return restaurant;
}

function get_star_number(stars) {
  let star = [];
  var number_star = stars[0]
  for(let i = 0; i < number_star ; i++){
    star.push(
      <li className='display-list'>
        <div className='star'></div>
      </li>
    );
  }
  return star;
}

function get_deal_menu(deals,names)
{
  var list = [ ]
  for(var i=0;i<deals.length;i++)
  {
    if(deals[i].name==names)
    {
      list.push
      (
        <li className='display-list'>
          <p1 align="center">{deals[i].reduction}</p1>
          <p1 align="center"> {deals[i].Info}</p1>
          <p></p>
        </li>
      )
    }
  }
  return list;
}

function get_deal_special(deals,names)
{
  var list = [ ]
  for(var i=0;i<deals.length;i++)
  {
    if(deals[i].name == names)
    {
      list.push
      (
        <li className='display-list'>
        <p1 align="center">{deals[i].reduction}</p1>
        <p1 align="center"> {deals[i].Info}</p1>
        <p></p>
        </li>
      )
    }
  }
  return list;
}

function Reservation(pageurl) {
    window.open(base)
}

function action_button()
{
  return <button onClick={Reservation}>Reservation</button>
}


export default App;
