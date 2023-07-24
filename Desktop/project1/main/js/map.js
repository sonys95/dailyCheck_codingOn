// Google Maps API 키
const googleMapsApiKey = "AIzaSyCJy8gkdc-4xxx7vTH26W_ntzA-h-1ZzqE"; // 여기에 실제 Google Maps API 키를 넣으세요.

// OpenWeatherMap API 키
const openWeatherMapApiKey = "2a6604feb5f6a784be51361199f6c5cc"; // 여기에 실제 OpenWeatherMap API 키를 넣으세요.

// 지도를 표시하는 함수
function initMap(latitude, longitude) {
  const mapOptions = {
    center: { lat: latitude, lng: longitude },
    zoom: 15, // 지도를 더 확대해서 보여줄 수 있습니다.
  };
  const mapElement = document.getElementById("map");
  const map = new google.maps.Map(mapElement, mapOptions);

  // 현재 위치에 핀을 찍어줍니다.
  const marker = new google.maps.Marker({
    position: { lat: latitude, lng: longitude },
    map: map,
  });

  // 날씨 정보 가져오기
  getWeatherInfo(latitude, longitude);
}

// 날씨 정보를 가져오는 함수
function getWeatherInfo(latitude, longitude) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${openWeatherMapApiKey}`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("날씨 정보를 가져오는 데 문제가 발생했습니다.");
      }
      return response.json();
    })
    .then((data) => {
      const cityName = data.name;
      const weatherDescription = data.weather[0].description;
      const weatherIconCode = data.weather[0].icon;
      const temperature = data.main.temp;
      const weatherDescriptionElement =
        document.getElementById("weatherDescription");
      const weatherIconElement = document.getElementById("weatherIcon");

      weatherDescriptionElement.innerHTML = `도시: ${cityName}<br> 날씨: ${weatherDescription}<br> 온도: ${temperature}°C`;
      weatherIconElement.src = `http://openweathermap.org/img/wn/${weatherIconCode}.png`;
      weatherIconElement.alt = "날씨 이미지";
    })
    .catch((error) => {
      console.error("날씨 정보를 가져오는 중 오류가 발생했습니다:", error);
      const weatherDescriptionElement =
        document.getElementById("weatherDescription");
      weatherDescriptionElement.innerHTML =
        "날씨 정보를 가져오는 중 오류가 발생했습니다. 다시 시도해주세요.";
    });
}

// 위치 정보를 가져오는 함수
function getGeolocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        initMap(latitude, longitude);
      },
      (error) => {
        console.error("위치 정보를 가져오는 중 오류가 발생했습니다:", error);
        const weatherDescriptionElement =
          document.getElementById("weatherDescription");
        weatherDescriptionElement.innerHTML =
          "위치 정보를 가져오는 중 오류가 발생했습니다. 위치 정보를 제공했는지 확인해주세요.";
      }
    );
  } else {
    console.error("브라우저에서 위치 정보를 지원하지 않습니다.");
    const weatherDescriptionElement =
      document.getElementById("weatherDescription");
    weatherDescriptionElement.innerHTML =
      "브라우저에서 위치 정보를 지원하지 않습니다.";
  }
}

// 페이지 로드 시 위치 정보를 가져오도록 호출
getGeolocation();
