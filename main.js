document.addEventListener('DOMContentLoaded', function() {

  // Select the open and close buttons
  const openNavMenuButton = document.querySelector('#open-nav-menu');
  const closeNavMenuButton = document.querySelector('#close-nav-menu');

  // Select the navigation menu
  const navMenu = document.querySelector('.wrapper');

  // Function to open the navigation menu
  function openNavMenu() {
      navMenu.classList.add('nav-open'); // Assuming 'nav-open' is the class that shows the menu
  }

  // Function to close the navigation menu
  function closeNavMenu() {
      navMenu.classList.remove('nav-open'); // Assuming 'nav-open' is the class that shows the menu
  }

  // Add event listeners to the open and close buttons
  openNavMenuButton.addEventListener('click', openNavMenu);
  closeNavMenuButton.addEventListener('click', closeNavMenu);

  // Digital clock functionality
  function digitalClock() {
     const time = new Date();
     let hours = time.getHours();
     let minutes = time.getMinutes();
     let seconds = time.getSeconds();
 
     hours = (hours < 10) ? "0" + hours : hours;
     minutes = (minutes < 10 ) ? "0" + minutes : minutes;
     seconds = (seconds < 10 ) ? "0" + seconds : seconds;
 
     document.querySelector('.time-number[data-time="hours"]').textContent = hours;
     document.querySelector('.time-number[data-time="minutes"]').textContent = minutes;
     document.querySelector('.time-number[data-time="seconds"]').textContent = seconds;

    // Update greeting based on the time of day
    const greetingElement = document.getElementById('greeting');
    let greeting;

    if (hours < 12) {
        greeting = 'Good Morning!';
    } else if (hours < 18) {
        greeting = 'Good Afternoon!';
    } else {
        greeting = 'Good Evening!';
    }

    greetingElement.textContent = greeting;
}
  
  digitalClock();
  setInterval(digitalClock, 1000);
 
  // Weather API functionality
  const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather';
  const apiKey = 'c7f7832141ea42bb815834cb6c1fd2aa';

  // Utility function to convert Celsius to Fahrenheit
  function convertCelsiusToFahr(celsius) {
  return (celsius * 9/5) + 32;
}
  // Function to fetch the weather data
  async function fetchWeather(city) {
     try {
       const response = await fetch(`${weatherApiUrl}?q=${city}&appid=${apiKey}&units=metric`);
       if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
       }
       const data = await response.json();
       localStorage.setItem('weatherData', JSON.stringify(data));
       return data;
     } catch (error) {
       console.error('Error fetching weather data:', error);
       return null;
     }
  }
  //Function to update weather information
  async function updateWeather() {
     const city = 'Nairobi'; 
     const weatherData = await fetchWeather(city);
     if (weatherData) {
       const temperature = weatherData.main.temp;
       const description = weatherData.weather[0].description;
       const unit = getSelectedUnit();
       displayTemperature(temperature, description, unit, city);
     }
  }
 //Function to display temperature
  function displayTemperature(temperature, description, unit, city) {
    let convertedTemperature = temperature;
    if (unit === 'F') {
        convertedTemperature = convertCelsiusToFahr(temperature);
    }
    document.getElementById('weather').textContent = `The weather in ${city} is ${description}, with temperatures of ${convertedTemperature.toFixed(0)} °${unit}`;
}
 // Function to get the selected temperature unit
function getSelectedUnit() {
  return document.querySelector('input[name="temperature"]:checked').value;
}
  // Update weather information on page load
  updateWeather();
 
  // Add event listener for temperature unit radio buttons
   document.querySelectorAll('input[name="temperature"]').forEach(radio => {
    radio.addEventListener('change', () => {
        const weatherData = JSON.parse(localStorage.getItem('weatherData')); // Assuming weather data is stored in localStorage
        if (weatherData) {
            const unit = getSelectedUnit();
            displayTemperature(weatherData.main.temp, weatherData.weather[0].description, unit, 'Nairobi');
        }
    });
});
  

  // Function to fetch gallery images and add them to the thumbnails
  async function fetchGalleryImages() {
      try {
          // Fetch the gallery.json file
          const response = await fetch('./assets/json/gallery.json');
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          // Parse the JSON data
          const galleryData = await response.json();
          // Select the thumbnails div
          const thumbnailsDiv = document.querySelector('.thumbnails');
          // Select the main gallery image
          const mainGalleryImage = document.querySelector('#gallery img');
          // Loop through the gallery data and create img elements
          galleryData.forEach(image => {
              // Create a new img element
              const imgElement = document.createElement('img');
              // Set the src and alt attributes
              imgElement.src = image.src;
              imgElement.alt = image.alt;
              // Add click event listener to change the main gallery image
              imgElement.addEventListener('click', function() {
                  mainGalleryImage.src = this.src; // Change the main gallery image source to the clicked thumbnail's source
              });
              // Append the img element to the thumbnails div
              thumbnailsDiv.appendChild(imgElement);
          });
      } catch (error) {
          console.error('Error fetching gallery images:', error);
      }
  }
  // Call the function to fetch and display the gallery images
  fetchGalleryImages();

    // Function to fetch products and display them based on the selected category
    async function fetchAndDisplayProducts() {
        try {
            // Fetch the products.json file
            const response = await fetch('./assets/json/products.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // Parse the JSON data
            const productsData = await response.json();
            // Select the products area div
            const productsAreaDiv = document.querySelector('.products-area');
            // Clear any existing products
            productsAreaDiv.innerHTML = '';
            // Get the selected category
            const selectedCategory = document.querySelector('input[name="products"]:checked').id;
            // Filter products based on the selected category
            let filteredProducts = [];
            if (selectedCategory === 'all') {
                filteredProducts = productsData;
            } else if (selectedCategory === 'paid') {
                filteredProducts = productsData.filter(product => product.price > 0);
            } else if (selectedCategory === 'free') {
                filteredProducts = productsData.filter(product => product.price === 0);
            }
            // Loop through the filtered products and create HTML elements
            filteredProducts.forEach(product => {
                // Create a new div element for the product
                const productDiv = document.createElement('div');
                productDiv.className = 'product-item';
                // Set the inner HTML of the product div
                productDiv.innerHTML = `
                    <img src="${product.image}" alt="${product.title}">
                    <div class="product-details">
                        <h3 class="product-title">${product.title}</h3>
                        <p class="product-author">${product.author}</p>
                        <p class="price-title">Price:</p>
                        <p class="product-price">$${product.price.toFixed(2)}</p>
                    </div>
                `;
                // Append the product div to the products area div
                productsAreaDiv.appendChild(productDiv);
            });
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    // Add event listener to the product category radio buttons to update the displayed products
    document.querySelectorAll('input[name="products"]').forEach(radio => {
        radio.addEventListener('change', fetchAndDisplayProducts);
    });

    // Initially fetch and display all products
    fetchAndDisplayProducts();
});

 