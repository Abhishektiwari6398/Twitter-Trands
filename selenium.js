const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const proxy = require('selenium-webdriver/proxy');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Trend = require('./model'); 
require('dotenv').config();

const options = new chrome.Options();
options.addArguments('start-maximized');

const proxyUrl = process.env.PROXYMESH_URL;

async function scrapeTwitterTrends() {
    let driver;
    try {
        driver = new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .setProxy(proxy.manual({ http: proxyUrl, https: proxyUrl }))
            .build();

        console.log('Navigating to Twitter Explore page...');
        await driver.get('https://twitter.com/explore');
        console.log('Waiting for trending topics section...');
        await driver.wait(until.elementLocated(By.css('div[aria-label="Trending now"]')), 120000); // Increased timeout

        console.log('Scraping trending topics...');
        const trends = await driver.findElements(By.css('div[aria-label="Trending now"] a'));
        const trendTexts = [];

        for (let i = 0; i < 5 && i < trends.length; i++) {
            const text = await trends[i].getText();
            trendTexts.push(text);
        }

        const uniqueId = uuidv4();
        const dateTime = new Date();
        const ipAddress = proxyUrl.split('@')[1].split(':')[0];

        const trendRecord = new Trend({
            unique_id: uniqueId,
            trend1: trendTexts[0] || '',
            trend2: trendTexts[1] || '',
            trend3: trendTexts[2] || '',
            trend4: trendTexts[3] || '',
            trend5: trendTexts[4] || '',
            date_time: dateTime,
            ip_address: ipAddress
        });

        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Saving trends to MongoDB...');
        await trendRecord.save();
        await mongoose.connection.close();

        console.log('Scraping and saving completed.');
        return trendRecord;
    } catch (error) {
        console.error('Error while scraping Twitter:', error);
    } finally {
        if (driver) {
            await driver.quit();
        }
    }
}

module.exports = { scrapeTwitterTrends };