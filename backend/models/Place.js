const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: String,
    address: String,
    photos: [String],
    description: String,
    perks: [String],
    extraInfo: String,
    checkIn: Date,
    checkOut: Date,
    maxGuests: Number,
    price: Number,
});

PlaceSchema.index({ title: 'text', address: 'text', description: 'text' });
const PlaceModel = mongoose.model('Place', PlaceSchema);

module.exports = PlaceModel;
