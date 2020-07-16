const Record = require('./Connect');
const express = require('express');
const axios = require('axios');
const { response } = require('express');
const app = express();
var personaName, steamID, profileURL, competitiveRank, leaderboardRank, soloCompetitiveRank, rankTier;
var length;
var i = 0;
var friends = new Array();

app.get('/add', (req, res) =>{
    account_id = req.query.account_id;
    const querystr = `https://api.opendota.com/api/players/${account_id}`;

    axios.get(querystr).then((response) =>{
        personaName = response.data.profile.personaname;
        steamID = response.data.profile.steamid;
        profileURL = response.data.profile.profileurl;
        competitiveRank = response.data.competitive_rank;
        leaderboardRank = response.data.leaderboard_rank;
        soloCompetitiveRank = response.data.solo_competitive_rank;
        rankTier = response.data.rank_tier;


        const querystr1 =`https://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=E5B408C9AA1BABA48E91E8935E771001&steamid=${steamID}&relationship=friend`;
        axios.get(querystr1).then(response =>{
            length = response.data.friendslist.friends.length;

            while (i < length) {
                friends[i] = response.data.friendslist.friends[i];
                i++;
            }  
        });

        //Save to database
        playerValue = new Record({
            personaName:personaName,
            steamID:steamID,
            profileURL:profileURL,
            competitiveRank:competitiveRank,
            leaderboardRank:leaderboardRank,
            soloCompetitiveRank:soloCompetitiveRank,
            rankTier:rankTier,
            friends:friends
        });

        playerValue.save().then(result => {
            console.log("Success" + result);
        })
        .catch(error => {
            console.log("Error: " + error);
        });

    });
});

app.get('/delete', (req, res) =>{
    steamID = req.query.steamID;
    Record.deleteOne({steamID:steamID}, function(err){
        if (err) return handleError(err);
    })
    res.send("<h1>Deleting data<h1>");
});

app.get('/update', (req, res) => {
    steamID = req.query.steamID;
    personaName = req.query.personaName;
    Record.updateOne({steamID: steamID}, {personaName: personaName}, function(err, res){

    });
    res.send("<h1>Updating Data<h1>");
});

app.get('/getRecords', (req, res) => {
    Record.find({})
        .then(response => {
            res.status(200).send(response);
        })
        .catch(error => {
            res.status(400).send(error);
        });
});

app.listen(5000);
