const express = require('express');
const bodyParser = require('body-parser');
const { scrapeTwitterTrends } = require('./selenium');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/run-script', async (req, res) => {
    try {
        console.log("Running scrapeTwitterTrends...");
        const data = await scrapeTwitterTrends();
        console.log("Scraping completed:", data);
        res.json(data);
    } catch (error) {
        console.error('Error running script:', error);
        res.status(500).json({ message: 'Error running script' });
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});