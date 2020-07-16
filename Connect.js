const mongoose = require('mongoose');
const port = process.env.PORT;

const db = "mongodb+srv://LimChinHai:podifu98@cluster0-6y2dj.mongodb.net/DOTA2?retryWrites=true&w=majority";

mongoose
  .connect(
    process.env.MONGODB_URI || db,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log('Connected to database');
  })
  .catch(error => {
    console.log('Mongoose connetion error: ', error);
  });

const dotaSchema = new mongoose.Schema({
    personaName:{type: String},
    steamID:{type: String},
    profileURL:{type: String},
    competitiveRank:{type: String},
    leaderboardRank:{type: String},
    soloCompetitiveRank:{type: String },
    rankTier:{type: String},
    friends:{type: Array}
});

const Record = mongoose.model('Data', dotaSchema);

module.exports = Record; 