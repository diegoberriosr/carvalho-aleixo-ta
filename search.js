const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const axios = require("axios");



const parseStars = (string) => {

    // Check if string contains an integer.
    match = string.match(/[0-5] /);

    if (match) return Number(match); // Return the integer if so.
 
    return parseFloat(string); // Otherwise return the number as a float value.
}

const getItems = async (query) => {
    try {
        // Make a search query
        const res = await axios.get( 
            `https://www.amazon.com/s`, {
                headers: { // Make Amazon believe it is a non-automated search.
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                },
                params: { k: query } // Add the query as a search parameter
            });
        
        // Parse HTML file.
        const dom = new JSDOM(res.data);

        // Get all aections selecting by data-component-type.
        const sections = dom.window.document.querySelectorAll('[data-component-type="s-search-result"]');

        // Map through each product's card and get associated the image, title, url, average rating, and number of ratings.
        const results = Array.from(sections).map(section => {
            
            // Get the product's <img/> tag.
            const image = section.querySelector("img"); 

            // Parse the card's header (contains title and link).
            const header = section.querySelector("h2"); 
            const hyperlink = header.querySelector("a").href; // Get listing URL.
            const title = header.querySelector("span").innerHTML; // Get product's title.

            // Try to get average rating. Keep in mind some listings do not have an average rating.
            let avgRating = section.querySelector(".a-icon-alt") 
                ? section
                .querySelector(".a-icon-alt").innerHTML : 
                undefined;
            
            // Try to get number of ratings. Listings may not have any ratings as well.
            const ratings = section.querySelector("span.a-size-base.s-underline-text") 
                ? section
                .querySelector("span.a-size-base.s-underline-text").innerHTML
                :
                undefined;

            // Attempt to get a listing's price. Some products do not have an available price.
            let price = section.querySelector(".a-offscreen")
                ? section
                .querySelector(".a-offscreen")
                .innerHTML
                :
                undefined;
            
            // Parse average rating (if available).
            if (avgRating) avgRating = parseStars(avgRating.slice(0,3));

            // Parse price (if available).
            if (price) {
                // Remove dollar sign from the string and convert it to a number.
                const parsedPrice = parseFloat(price.replace(/[^0-9.]/g, '')); 

                // Split price into integer and decimal parts.
                const integerPart = Math.floor(parsedPrice);
                const decimalPart = (parsedPrice - integerPart).toFixed(2) * 100;

                // Assign the parsed price values.
                price = {
                    "integer": integerPart,
                    "decimal": decimalPart
                }
            };

            return {
                'title': title,
                'url': hyperlink,
                'image': {
                    'url': image.src,
                    'alt': image.alt
                },
                'avgRating': avgRating,
                'ratings': ratings,
                "price": price

            }
        });
        
        return results;
    } catch (err) {
        console.log(err);
        return [] // Return an empty array if an error occurs.
    }
};

module.exports = getItems;