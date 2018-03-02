import React, { Component } from 'react';
import logo from './fourchette.jpg';
import './App.css';
import ReactTable from 'react-table'
import pricefourchette from './deals.json'
import ReactDOM from 'react-dom';
const data = [ ]
var bar = [ ]
var count = 0
var i = 0
var base = "https://www.lafourchette.com"
var pageurl = ""


function handleClick() {
 alert('go to ');
}

class App extends Component {
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
    console.log(data)


  const columns = [{
    accessor: 'name' // String-based value accessors!
  }, {
    accessor: 'stars',
  },
  {
    accessor : 'adresss'
  },
  {
    accessor : 'type',
  }
  ,{
    accessor : 'reduction',

  },
  {
    accessor : 'Info',

  },{
    id: 'button',
  accessor: 'link',
  Cell: ({value}) => (<button onClick={(e) => console.log(value.na)}>Reservation</button>)
}]

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to LaFourchette v2.0</h1>
        </header>
        <div className='restaurants'>{get_restaurants()}</div>
        </div>
    );
  }
}

function get_restaurants() {
  let rows = data.map(function(row) {
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
          {action_button(row.name,row.id)}
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
  return rows;
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

function action_button(name,id)
{
  return <button onClick={Reservation}>Reservation</button>
}


export default App;
