const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const axios = require("axios");



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

        // Each "match" card/product can have two different combinations of classes.
        const sectionSelectors = [
            ".sg-col-20-of-24.s-result-item.s-asin.sg-col-0-of-12.sg-col-16-of-20.sg-col.s-widget-spacing-small.gsx-ies-anchor.sg-col-12-of-16",
            ".sg-col-4-of-24.sg-col-4-of-12.s-result-item.s-asin.sg-col-4-of-16.AdHolder.sg-col.s-widget-spacing-small.sg-col-4-of-20.gsx-ies-anchor"
        ]; 

        // Combine both selectors.
        const combinedSectionSelector = sectionSelectors.join(", ");

        // Get all search matches using the combination of both possible selectors.
        const sections = dom.window.document.querySelectorAll(combinedSectionSelector)

        // Map through each product's card and get associated the image, title, url, average rating, and number of ratings.
        const results = Array.from(sections).map(section => {
            
            // Get the product's <img/> tag.
            const image = section.querySelector("img"); 

            // Parse the card's header (contains title and link).
            const header = section.querySelector("h2"); 
            const hyperlink = header.querySelector("a"); // Get listing URL.
            const title = header.querySelector("span"); // Get product's title.

            // Try to get average rating. Keep in mind some listings do not have an average rating.
            const avgRating = section.querySelector(".a-icon-alt") 
                ? section
                .querySelector(".a-icon-alt").innerHTML : 
                undefined;
            
            // Try to get number of ratings. Listings may not have any ratings as well.
            const ratings = section.querySelector(".a-size-base .s-underline-text") 
                ? section
                .querySelector(".a-size-base .s-underline-text").innerHTML : 
                undefined;

            return {
                'title': title.innerHTML,
                'url': hyperlink.href,
                'image': {
                    'url': image.src,
                    'alt': image.alt
                },
                'avgRating': avgRating,
                'ratings': ratings
            }
        });
        
        return results;
    } catch (err) {
        console.log(err);
        return [] // Return an empty array if an error occurs.
    }
};

module.exports = getItems;