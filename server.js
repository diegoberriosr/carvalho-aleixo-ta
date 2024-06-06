const express = require("express");
const getItems = require('./search');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.get('/api/scrape', async (req, res) => {
    
    // Get query from the requests parameters.
    const keyword = req.query.keyword;
    
    // Do not accept empty queries.
    if (!keyword || keyword.length === 0) return res.status(400).send("Query parameter is required.");

    try {
        // Scrape items from an Amazon search using keyword as a parameter.
        const results = await getItems(keyword); 
        res.json(results);
    }   
    catch (err) {
        res.status.apply(500).send("An error occurred while fetching data.");
    }

});

app.listen( PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});