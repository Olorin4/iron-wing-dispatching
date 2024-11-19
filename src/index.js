import "./normalize.css";
import "./styles.css";
import { fetchData } from "./api-access";

document.addEventListener("DOMContentLoaded", () => {
    fetchData();
});

// TO DO:
// - Fetch weather data from Visual Crossing API.
// - Add ability to search for a specific location and toggle displaying
// - the data in Fahrenheit or Celsius.
// - Process the JSON data from the API and return an object the data required by the app.
// - Change the look of the page based on the data (maybe use Giphy API).
// - Set up a form that will let users input their location and will fetch the weather info.
// - Display the information on the webpage.
// - Add styling.
// - Optional: add a ‘loading’ component.
