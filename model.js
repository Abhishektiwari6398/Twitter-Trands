const mongoose = require('mongoose');

const TrendSchema = new mongoose.Schema({
    unique_id: String,
    trend1: String,
    trend2: String,
    trend3: String,
    trend4: String,
    trend5: String,
    date_time: Date,
    ip_address: String
});

module.exports = mongoose.model('Trend', TrendSchema);