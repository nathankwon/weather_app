// initial icon before user allows location
document.addEventListener("DOMContentLoaded", function(event) {
  function initialIcon(iconID){
    const skycons = new Skycons({color: "white"})
    skycons.play();
    return skycons.set(iconID, Skycons.PARTLY_CLOUDY_NIGHT);
  }

  initialIcon(document.querySelector(".icon"))
});

window.addEventListener('load', ()=> {
  let long;
  let lat;
  let temperatureDescription = document.querySelector('.temperature-description')
  let temperatureDegree = document.querySelector('.temperature-degree')
  let locationTimezone = document.querySelector('.location-timezone')
  let temperatureSection = document.querySelector('.degree-section')
  let temperatureSpan = document.querySelector('.temperature span')

  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(position => {
      long = position.coords.longitude;
      lat = position.coords.latitude;

      const proxy = 'https://cors-anywhere.herokuapp.com/'
      const api = `${proxy}https://api.darksky.net/forecast/5df9b4db1ede3abb7a4ec5dcf79a125e/${lat},${long}`

      fetch(api)
        .then(response =>{
          return response.json();
        })
        .then(data => {
          const {temperature, summary, icon} = data.currently;
          let celsius = (temperature - 32) * (5/9)

          // Set DOM elements from the api
          temperatureDescription.textContent = summary;
          temperatureDegree.textContent = Math.floor(celsius * 100) / 100;
          locationTimezone.textContent = data.timezone;
          temperatureSpan.textContent = "C";


          // Set icons
          setIcons(icon, document.querySelector(".icon"));

          // change temp between celsius/fahrenheit
            temperatureSection.addEventListener('click', () => {
              if(temperatureSpan.textContent === "F"){
                temperatureSpan.textContent = "C"
                temperatureDegree.textContent = Math.floor(celsius * 100) / 100;
              } else {
                temperatureSpan.textContent = "F"
                temperatureDegree.textContent = temperature;
              }
            })
        })
    })
  } else {
    alert("You have not enabled shared location. Please allow your location.")
  }

  navigator.geolocation.getCurrentPosition(function(position) {
    //  Location allowed
  }, function() {
    temperatureDescription.textContent = "To use this service, please allow your location."
  });

  function setIcons(icon, iconID){
    const skycons = new Skycons({color: "white"})
    // replace - with _
    const currentIcon = icon.replace(/-/g, "_").toUpperCase();
    skycons.play();
    return skycons.set(iconID, Skycons[currentIcon]);
  }
});
