/*=====================
DEPENDENCIES
=====================*/

var dateContainer = $('#city-date');
var historyContainerEl = $('#search-history');
var searchFormEl = $('#form');
var searchBarEl = $('#search-city');
var todaysTempEl = $('#temp');
var todaysWindEl = $('#wind');
var todaysHumidityEl = $('#humidity')
var todaysUvEl = $('#uv');



/*=====================
DATA
=====================*/
var cityName = '';
var searchHistory = [];
var todaysDateMoment = moment();
var todaysDate = todaysDateMoment.format('MMM Do, YYYY');
var defaultCity = 'New York City';
var lat = 0;
var lon = 0;

var cityName = '';
var apiKey = '76272cbf5adfd2b8a447adeb2a6997c1';


var temperature = '';
var windSpeeds = '';
var humidity = '';
var uvIndex = ''; 
var fiveDatStartDay = todaysDateMoment.day();
var daysOfTheWeek = {
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
  7: 'Sunday'
}


/*=====================
FUNCTIONS
=====================*/

function renderHistory() {
  historyContainerEl.text('')
  for (city of searchHistory) {
    var historyEl = $('<button>')
    historyEl.attr('class',"list-group-item list-group-item-action list-group-item-dark text-center");
    historyEl.attr('value', city).text(city);

    historyContainerEl.append(historyEl);
  };
};

async function getGeoLocation(cityName) {

  var url = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&units=imperial&appid=${apiKey}`;
  
  await fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      lon = data[0].lon;
      lat = data[0].lat;
      dateContainer.text(`${defaultCity} - ${todaysDate}`);
      save(defaultCity)
    })
    .catch((error) => {
      console.log(error);
    })
};

async function getTodaysWeather(cityName) {
  var url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

  await fetch(url)
    .then(function(response) {
      return response.json()
    })
    .then(function(data) {
      console.log(data)
      temperature = data.current.temp;
      windSpeeds = data.current.wind_speed;
      humidity = data.current.humidity;
      uvIndex = data.current.uvi; 

      todaysTempEl.text(temperature);
      todaysWindEl.text(windSpeeds);
      todaysHumidityEl.text(humidity);
      todaysUvEl.text(uvIndex);
    })
};

async function getFiveDayWeather(cityName) {
  var url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${apiKey}`;

  await fetch(url)
    .then(function(response) {
      return response.json()
    })
    .then(function(data) {
      var hourStepSize = 24/3;
      var fiveDayStartDate = moment();
      
      for (var i=0; i<data.list.length; i++) {
        var dayStats = data.list[i*hourStepSize];

        if (i > 0){
          fiveDayStartDate = fiveDayStartDate.add(1,'d') 
        }
        

        $(`#date-${i+1}`).text(fiveDayStartDate.format('MMM Do, YYYY'));
        $(`#day-${i+1}`).text(daysOfTheWeek[(fiveDatStartDay + i - 1) % 7 + 1]);

        $(`#day-${i+1}-stat-1-value`).text(dayStats.main.temp.toString().slice(0,4));
        $(`#day-${i+1}-stat-2-value`).text(dayStats.wind.speed.toString().slice(0,4));
        $(`#day-${i+1}-stat-3-value`).text(dayStats.main.humidity.toString().slice(0,4));

        $(`#day-${i+1}-img`).css({
          'background-image': `url(http://openweathermap.org/img/wn/${dayStats.weather[0].icon}@2x.png)`,
          'opacity': '.6',
          'object-fit': 'contain',
          'vertical-align': 'middle'
        }); 
      }
    })
}

function save (city) {
  // get from local if exits
  if (!searchHistory.includes(city)) {
    searchHistory.push(city);
  }
  localStorage.setItem('Search History',JSON.stringify(searchHistory));
};

function getCityInput () {
  searchFormEl.on('submit', (event) => {
    event.preventDefault(); 
    var cityInput = searchBarEl.val();
    searchBarEl.val('');
    defaultCity = cityInput;
    getGeoLocation(defaultCity);
    getSearchHistory();
    renderHistory();
  });
};

function getSearchHistory() {
  searchHistory = JSON.parse(localStorage.getItem("Search History"));
  if (!searchHistory) {
    searchHistory = [];
  };
};

/*=====================
INITIALIZATION
=====================*/

function init () {
  todaysDate = moment().format('MMM Do, YYYY');
  getCityInput();
  getGeoLocation(defaultCity);
  getTodaysWeather(defaultCity);
  getSearchHistory();
  renderHistory();
  getFiveDayWeather(defaultCity);

  
  // renderTodaysWeather(defaultCity);
  // renderWeeklyWeather(defaultCity);
};

init();

historyContainerEl.on('click', (event) => {
  event.preventDefault();
  defaultCity = event.target.value
  init();
});
