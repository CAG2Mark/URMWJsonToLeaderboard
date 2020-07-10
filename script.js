/*jshint esversion: 6 */

const ranks = [
    {
        "name": "Grander Champion",
        "bound": 9000,
        "players": []
    },
    {
        "name": "Champion",
        "bound": 1600,
        "players": []
    },
    {
        "name": "Diamond",
        "bound": 1510,
        "players": []
    },
    {
        "name": "Platinum",
        "bound": 1430,
        "players": []
    },
    {
        "name": "Gold",
        "bound": 1350,
        "players": []
    },
    {
        "name": "Silver",
        "bound": 1260,
        "players": []
    },
    {
        "name": "Bronze",
        "bound": 0,
        "players": []
    },
    {
        "name": "Unranked",
        "bound": 0,
        "players": []
    }
];

// grandchamp rank
let grandChamp = {
    "name": "Grand Champion",
    "bound": 0,
    "players": []
};

function getRank(playerValue) {
    var ts = playerValue.trueskill;

    // return unranked
    if (playerValue.rd > 75) return ranks[ranks.length - 1];

    for (var rankKey in ranks) {
        var rank = ranks[rankKey];
        if (ts >= rank.bound) {
            return rank;
        }
    }
    return ranks[ranks.length - 1];
}

function addPlayer(playerKey, playerValue) {
    playerValue.name = playerKey; // for clarity
    var rank = getRank(playerValue);
    rank.players.push(playerValue);
}

// get data
const url = "https://raw.githubusercontent.com/LlewVallis/urmw-stats/master/src/trueskill-data.json";

var data = fetch(url, {
        mode: 'cors'
    })
    .then((res) => res.json().then((json) => {
        handleData(json);
    }));

function handleData(json) {
    let playerData = json.playerData;

    for (var playerKey in playerData) {
        addPlayer(playerKey, playerData[playerKey]);
    }
    
    // sort

    for (var rankKey in ranks) {
        var rank = ranks[rankKey];
        rank.players.sort((a, b) => {
            return b.trueskill - a.trueskill;
        });
    }

    // add grandchamp
    grandChamp.players.push(ranks[1].players.shift()); // get highest player in champion
    ranks.splice(1, 0, grandChamp);

    var output = "";
    // print out data
    for (var rankKey in ranks) {
        var rank = ranks[rankKey];
        output += `**${rank.name}**<br>`;
        console.log(rank.players)
        for (var playerKey in rank.players) {
            var player = rank.players[playerKey];
            output += `${player.name}: ${player.trueskill} RD${player.rd}<br>`;
        }
    }

    document.getElementById("output").innerHTML = output;
}