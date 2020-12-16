const provider = "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png";
const copyright =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>';
let map, layergroup;
const _APIKEY = "ce98d963-026e-4bfa-9ef0-2e8bc2f99c38";
var SelectedCountry = ``;
var SelectedState = ``;
var SelectedCity = ``;

const loadMap = function() {
    console.log("init initiated!");
    map = L.map("mapid").setView([51.0410 , 3.3986], 10);
    L.tileLayer(provider,{attribution: copyright}).addTo(map);
    if (document.querySelector(".js-country")){
        layergroup = L.layerGroup().addTo(map);
        addEventToCountry();
      } 
};

const addEventToCountry = function(){
    const landen = document.querySelectorAll(".js-country_wrapper");
    for(const land of landen){
      land.addEventListener("click",function(){
        const land_naam = this.querySelector('.js-country_name').innerHTML;
        console.log(land_naam);
        document.querySelector(".js-countries").innerHTML = `<option value="${land_naam}">${land_naam}</option>`;
        SelectedCountry = land_naam;
        getStates(land_naam);
      });
    };
};
  
const showCountry = async function(queryResponse){
    const dropdownPlaceholder = document.querySelector(".js-countries");    
    const arrCities = queryResponse.data;
    let html_dropdown = `<option value="">Select a country</option>`;
    for(let i = 0; i<arrCities.length; i += 1){
        try
        {
            html_dropdown += `<option value="${arrCities[i].country}">${arrCities[i].country} </option>`;
        }
        catch
        {
            console.log("error showcountry")
        }
    }
    dropdownPlaceholder.innerHTML = html_dropdown;
    loadMap();
};



const GetFlag = async(land) =>{
    const country_data = await fetch(`https://restcountries.eu/rest/v2/name/${land}?fullText=true`)
        .then((r) => r.json())
        .catch((err) => console.error('error flag'));
    let vlag = (country_data[0].flag);
    console.log(vlag);
    return vlag;    
};

let getStates = async(land)=>{
    const data_state = await fetch(`http://api.airvisual.com/v2/states?country=${land}&key=${_APIKEY}`)
        .then((r) => r.json())
        .catch((err) => console.error('error coords'));
    console.log(data_state);
    const statePlaceholder = document.querySelector(".js-states");
    let html = `<option value="">Select a state</option>`;
    for(let i = 0; i<data_state.data.length; i += 1){
        try
        {
            html += `<option value="${data_state.data[i].state}">${data_state.data[i].state}</option>`;  
        }
        catch
        {
            console.log("error getstates")
        }
    }

    window.scrollTo(0,0);
    statePlaceholder.innerHTML = html;  
    let img = await GetFlag(land);
    document.querySelector('.js-vlag').innerHTML =`<p>Overzicht: </p><img src="${img}" class="c-logo" alt="flag of ${img}">`; 
}

let getCities = async(country,state)=>{
    const data_city = await fetch(`http://api.airvisual.com/v2/cities?state=${state}&country=${country}&key=${_APIKEY}`)
        .then((r) => r.json())
        .catch((err) => console.error('error city'));
    console.log(data_city);
    const cityPlaceholder = document.querySelector(".js-cities");
    let html = `<option value="">Select a city</option>`;
    for(let i = 0; i<data_city.data.length; i += 1){
        try
        {
            html += `<option value="${data_city.data[i].city}">${data_city.data[i].city}</option>`;  
        }
        catch
        {
            console.log("error getstates")
        }
    } 
    window.scrollTo(0,0);
    cityPlaceholder.innerHTML = html;
}

let marker;

let getInfoCity = async(SelectedCountry,SelectedState,SelectedCity)=>{
    const info_city = await fetch(`http://api.airvisual.com/v2/city?city=${SelectedCity}&state=${SelectedState}&country=${SelectedCountry}&key=${_APIKEY}`)
        .then((r) => r.json())
        .catch((err) => console.error('error '));
    console.log(info_city);

    let long = info_city.data.location.coordinates[0];
    let lat = info_city.data.location.coordinates[1];
    let pollution = info_city.data.current.pollution.aqius;
    console.log(pollution);
    const pollutionPlaceholder = document.querySelector(".js-airqual");
    const statePlaceholder = document.querySelector(".js-state");
    const warningPlaceholder = document.querySelector(".js-warnings");
    const achtergrondKleur = document.querySelector(".js-pollution");
    if(pollution != undefined){
        pollutionPlaceholder.innerHTML = (`Pollution: ${pollution}`);
        if(pollution <= 50){
            statePlaceholder.innerHTML = 'Good';
            warningPlaceholder.innerHTML = 'None';
            achtergrondKleur.style.backgroundColor = "var(--global-color-good)";
            achtergrondKleur.style.color = "white";
        }
        if(pollution > 50 && pollution <= 100){
            statePlaceholder.innerHTML = 'Moderate';
            warningPlaceholder.innerHTML = 'Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion.';
            achtergrondKleur.style.backgroundColor = "var(--global-color-medium)";
            achtergrondKleur.style.color = "black";
        }
        if(pollution > 100 && pollution <= 150){
            statePlaceholder.innerHTML = 'Unhealthy for sensitive groups';
            warningPlaceholder.innerHTML = 'Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion.';
            achtergrondKleur.style.backgroundColor = "var(--global-color-bad)";
            achtergrondKleur.style.color = "black";
        }
        if(pollution > 105 && pollution <= 200){
            statePlaceholder.innerHTML = 'Unhealthy';
            warningPlaceholder.innerHTML = 'Active children and adults, and people with respiratory disease, such as asthma, should avoid prolonged outdoor exertion; everyone else, especially children, should limit prolonged outdoor exertion';
            achtergrondKleur.style.backgroundColor = "var(--global-color-very-bad)";
            achtergrondKleur.style.color = "black";
        }
        if(pollution > 200 && pollution <= 300){
            statePlaceholder.innerHTML = 'Very Unhealthy';
            warningPlaceholder.innerHTML = 'Active children and adults, and people with respiratory disease, such as asthma, should avoid all outdoor exertion; everyone else, especially children, should limit outdoor exertion.';
            achtergrondKleur.style.backgroundColor = "var(--global-color-extremly-bad)";
            achtergrondKleur.style.color = "white";
        }
        if(pollution > 300){
            statePlaceholder.innerHTML = 'Hazardous';
            warningPlaceholder.innerHTML = 'Everyone should avoid all outdoor exertion';
            achtergrondKleur.style.backgroundColor = "var(--global-color-mega-bad)";
            achtergrondKleur.style.color = "white";
        }
    }
    else{
        pollutionPlaceholder.innerHTML = "No data was found";
    }

    if(marker != undefined){
        map.removeLayer(marker);
    };
    marker = L.marker([lat,long]).addTo(map)
        .bindPopup(`${SelectedCity}<br>${SelectedCountry}`)
        .openPopup();
}

let loadAPI = async() =>{
    const data = await fetch( `http://api.airvisual.com/v2/countries?key=${_APIKEY}`)
        .then((r) => r.json())
        .catch((err) => console.error('error api'));
    console.log(data);
    setTimeout(showCountry(data),3000);
};

function loading(){
    document.querySelector(".grid-container").style.visibility = 'visible';
    document.querySelector(".c-header").style.visibility = 'visible';
    document.querySelector(".backdrop").style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    // API laden
    document.querySelector(".grid-container").style.visibility = 'hidden';
    document.querySelector(".c-header").style.visibility = 'hidden';
    setTimeout(loading,3300); //micro interaction 
    loadAPI();
    GetFlag();

    document.querySelector(".js-countries").addEventListener("change",function(){
        SelectedCountry = document.querySelector(".js-countries").value;
        document.querySelector(".js-vlag").innerHTML = ``;
        document.querySelector(".js-cities").innerHTML = `<option value="">Select a city</option>`;
        getStates(SelectedCountry);
    });
    document.querySelector(".js-states").addEventListener("change",function(){
        SelectedState = document.querySelector(".js-states").value;
        getCities(SelectedCountry,SelectedState);
    });

    document.querySelector(".js-cities").addEventListener("change",function(){
        SelectedCity = document.querySelector(".js-cities").value;
        getInfoCity(SelectedCountry,SelectedState,SelectedCity);
    });
});
