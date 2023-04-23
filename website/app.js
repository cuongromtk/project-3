/* Global Project Variables */
const apiKey = '&appid=5e7ec1de054038f00ea6dbf77d14589a&units=imperial'
const zipInput = document.getElementById('zip');
const userInput = document.getElementById('feelings')

// Dynamically create a new JS date instance
let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();

// Call function to fetch via OpenWeatherMap
const getWeather = async (zip, api) => {
	const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}${api}`
	const response = await fetch(url)
	let jsonResponse = await response.json()
	return jsonResponse
}

// User-input post data function
const postData = async ( url = '', data = {})=>{
	console.log(data);
	const response = await fetch(url, {
        method: 'POST', 
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        // Body data type must match "Content-Type" header        
	    body: JSON.stringify(data), 
	});

	try {
		const newData = await response.json();
		console.log(newData);
		return newData;
	} catch(error) {
		console.log("error", error);
	}
}

// Update UI function 
const retrieveData = async () =>{
	const request = await fetch('/all');
	try {
		// Transform into JSON
		const allData = await request.json()
		console.log(allData)
		// Write updated data to DOM elements
		document.getElementById('temp').innerHTML = Math.round(allData.temp)+ 'degrees';
		document.getElementById('content').innerHTML = allData.feel;
		document.getElementById("date").innerHTML = allData.date;
	}
	catch(error) {
	    console.log("error", error);
    }
}

// Event handler handleClick
const handleClick = async () => {
    document.getElementById('temp').innerHTML = '';
    document.getElementById('content').innerHTML = '';
    document.getElementById("date").innerHTML = '';
    if (zipInput.value) {
        const weatherData = await getWeather(zipInput.value, apiKey)
        if (weatherData.cod == '200') {
            const data = {
                temp: weatherData.main.temp,
                date: newDate,
                feel: userInput.value
            }
            await postData('/add', data);
            retrieveData();
        } else {
            document.getElementById('massageError').innerHTML = 'zipCode is error';
        }
    } else {
        document.getElementById('massageError').innerHTML = 'zipCode is not null';
    }
}

// Add element event listener with 'generate' id
const button = document.getElementById('generate');
button.addEventListener('click', handleClick);