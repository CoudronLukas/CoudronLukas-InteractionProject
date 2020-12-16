"use strict";

const provider = "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png";
const copyright =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>';
let map, layergroup;
let html_city,html_button,html_country,html_state;

const maakMarker = function(coords,adres,naam){
  console.log(coords);
  // string splitsen in array
  const arr_coor =  coords.split(",");
  layergroup.clearLayers();
  let marker = L.marker(arr_coor).addTo(layergroup);
  marker.bindPopup(`<h3>Naam van de campus ${naam}</h3><em>Adres ${adres}</em>`)
};

/* dit maar dan met landen
const addEventToCampus = function(){
  const campussen = document.querySelectorAll(".c-campus__row");
  for(const campus of campussen){
    campus.addEventListener("click",function(){
      const coords = this.querySelector('.js-coords').innerHTML;
      const naam = this.querySelector('.js-campusnaam').innerHTML;
      const adres = this.querySelector('.js-adres').innerHTML;
      maakMarker(coords,adres,naam);
    });
  };
}; */


const getCoords = async(city,state,country) =>{
    const city_data = await fetch(`http://api.airvisual.com/v2/city?city=${city}&state=${state}&country=${country}&key=04e12735-9a52-4d30-a1ee-fe1f2b3ce6f9`)
        .then((r) => r.json())
        .catch((err) => console.error('error'));
    let coords = (city_data[0]);
    console.log(coords); 
};

const addEventListeners = function(){
    html_button.addEventListener("input", function(){
        getCoords(html_city.value, html_state.value,html_country.value);
    });
};

const addEventToCampus = function(){
  const campussen = document.querySelectorAll(".c-campus__row");
  for(const campus of campussen){
    campus.addEventListener("click",function(){
      const coords = this.querySelector('.js-coords').innerHTML;
      const naam = this.querySelector('.js-campusnaam').innerHTML;
      const adres = this.querySelector('.js-adres').innerHTML;
      maakMarker(coords,adres,naam);
    });
  };
};


const init = function() {
  console.log("init initiated!");
  map = L.map("mapid").setView([51.0410 , 3.3986], 10);
  L.tileLayer(provider,{attribution: copyright}).addTo(map);

  html_city = document.querySelector(".js-city");
  html_state = document.querySelector(".js-state");
  html_country = document.querySelector(".js-country");
  html_button = document.querySelector("input[type=button]");

  addEventListeners();
};

document.addEventListener("DOMContentLoaded", init);
