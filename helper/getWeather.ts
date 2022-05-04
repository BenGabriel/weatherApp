import {API_KEY} from '@env'

export const getWeather = async (lat: number, lon: number) => {
    let location
    await fetch(`http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts&appid=${API_KEY}`)
        .then(res => res.json())
        .then(data => location = congifureResponse(data))
        .catch(err => console.log(err))

    return location
}

const congifureResponse = (response: any) => {

    let city = response.timezone
    let allDetails = [response.current, ...response.daily]
    let daily = allDetails.slice(0, 6).map((item: any, index: number) => ({
        id: `${index}`,
        weather: item.weather,
        image: item.weather[0].main === 'Rain' ? require("../assets/rain.json") : item.weather[0].main === 'Clouds' ? require("../assets/cloudy.json") : item.weather[0].main === 'Snow' ? require("../assets/snow.json") : item.weather[0].main === 'Drizzle' ? require("../assets/drizzle.json") : item.weather[0].main === 'Thunderstorm' ? require("../assets/thunderstorm.json") : item.weather[0].main === 'Clear' ? require("../assets/clear.json") : require("../assets/mist.json"),
        image2: item.weather[0].main === 'Rain' ? require("../assets/rain.png") : item.weather[0].main === 'Clouds' ? require("../assets/cloud.png") : item.weather[0].main === 'Snow' ? require("../assets/snow.png") : item.weather[0].main === 'Drizzle' ? require("../assets/drizzle.png") : item.weather[0].main === 'Thunderstorm' ? require("../assets/thunderstorm.png") : item.weather[0].main === 'Clear' ? require("../assets/clear.png") : require("../assets/mist.png"),
        color: item.weather[0].main === 'Rain' ? '#00e4f1' : item.weather[0].main === 'Clouds' ? '#1da597' : item.weather[0].main === 'Snow' ? '#eee4ac' : item.weather[0].main === 'Drizzle' ? '#008dcd' : item.weather[0].main === 'Thunderstorm' ? '#faca93' : item.weather[0].main === 'Clear' ? '#00e2c5' : '#008d7e',
        temp: typeof item.temp === "number" ? Math.ceil(item.temp - 272.15) : Math.ceil(item.temp.day - 272.15),
    }))

    return {
        city,
        daily,
    }
}
