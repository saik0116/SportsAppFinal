"use strict";

if (document.deviceready) {
    document.addEventListener('deviceready', onDeviceReady);

} else {
    document.addEventListener('DOMContentLoaded', onDeviceReady);
}

var links = [];
var pages = [];
var standings = [];
var garray = [];


function onDeviceReady() {
    console.log("READY!");
    serverData.getJSON();

    // Recently added

    pages = document.querySelectorAll('[data-role="page"]');

    links = document.querySelectorAll('[data-role="nav"] a');

    for (let i = 0; i < links.length; i++) {
        links[i].addEventListener("click", navigate);
    }

}

let serverData = {
    url: "https://griffis.edumedia.ca/mad9014/sports/hockey.php",
    httpRequest: "GET",
    getJSON: function () {

        // Add headers and options objects
        // Create an empty Request Headers instance
        let headers = new Headers();

        // Add a header(s)
        // key value pairs sent to the server

        headers.append("Content-Type", "text/plain");
        headers.append("Accept", "application/json; charset=utf-8");

        // simply show them in the console
        console.dir("headers: " + headers.get("Content-Type"));
        console.dir("headers: " + headers.get("Accept"));

        // Now the best way to get this data all together is to use an options object:

        // Create an options object
        let options = {
            method: serverData.httpRequest,
            mode: "cors",
            headers: headers
        };

        // Create an request object so everything we need is in one package
        let request = new Request(serverData.url, options);
        console.log(request);

        fetch(request)
            .then(function (response) {

                console.log(response);
                return response.json();
            })
            .then(function (data) {
                console.log(data); // now we have JS data, let's display it

                // Call a function that uses the data we recieved  
                displayData(data);
            })
            .catch(function (err) {
                alert("Error: " + err.message);
            });
    }
};


function displayData(data) {
    console.log(data);
    console.log(data.teams);
    console.log(data.scores);

    localStorage.setItem("scores", JSON.stringify(data));

    //get our stored contaacts data and convert it back to a js array

    //var myScoreData = JSON.parse(localStorage.getItem("scores"));
    //    console.log("From LS: ");
    //    console.log(myScoreData);

    console.log(data.teams);
    console.log(data.scores);

    let ul = document.querySelector(".result_list");
    ul.innerHTML = ""; // clear existing list items



    standings = []; // empty the standings array

    // Create the standings array keys for each team
    data.teams.forEach(function (i) {
        let team = {
            teamname: i.name,
            points: 0,
            W: 0,
            L: 0,
            T: 0
        };
        //standings.push(team);
        garray[i.id] = team;
    });




    data.scores.forEach(function (value) {
        let li = document.createElement("li");
        li.className = "score";

        let h3 = document.createElement("h3");
        h3.textContent = value.date;

        let homeTeam = null;
        let awayTeam = null;

        ul.appendChild(li);
        ul.appendChild(h3);

        let games = value.games;


        games.forEach(function (item) {

            homeTeam = getTeamName(data.teams, item.home);
            awayTeam = getTeamName(data.teams, item.away);



            let dg = document.createElement("div");
            dg.className = "gino";
            let home = document.createElement("div");
            home.innerHTML = homeTeam + " " + "<b>" + item.home_score + "</b>" + "&nbsp" + "<br>";
            let homescore = value.home_score;
            let awayscore = value.away_score;
            let away = document.createElement("div");
            let hometeam = garray[item.home].teamname; //getTeamName(data.teams, value.home);
            let awayteams = garray[item.away].teamname; //getTeamName(data.teams, value.away);


            away.innerHTML = "&nbsp" + awayTeam + " " + "<b>" + item.away_score + "</b>" + "&nbsp";

            dg.appendChild(home);
            dg.appendChild(away);
            ul.appendChild(dg);

            //            if (homescore > awayscore) {
            //                homescore
            //            }

            if (item.home_score > item.away_score) {
                //                calculateStandings(item.home, "W");
                //                calculateStandings(item.away, "L");
                garray[item.home].W++;
                garray[item.away].L++;
                garray[item.home].points += 2;


            } else if (item.home_score < item.away_score) {
                //                calculateStandings(item.home, "L");
                //                calculateStandings(item.away, "W");
                garray[item.home].L++;
                garray[item.away].W++;
                garray[item.away].points += 2;


            } else {
                //                calculateStandings(item.home, "T");
                //                calculateStandings(item.away, "T");
                garray[item.home].T++;
                garray[item.away].T++;
                garray[item.home].points += 1;
                garray[item.away].points += 1;
            }

        });



    });
    console.log("Hi");
    console.log(standings);
    StandingsData();

}


function getTeamName(teams, id) {
    for (let i = 0; i < teams.length; i++) {
        if (teams[i].id == id) {
            return teams[i].name;
        }
    }
    return "unknown";
}

function navigate(ev) {
    ev.preventDefault();

    let link = ev.currentTarget;
    console.log(link);
    // split a string into an array of substrings using # as the seperator
    let id = link.href.split("#")[1]; // get the href page name
    console.log(id);
    //update what is shown in the location bar
    history.replaceState({}, "", link.href);

    for (let i = 0; i < pages.length; i++) {
        if (pages[i].id == id) {
            pages[i].classList.add("active");
        } else {
            pages[i].classList.remove("active");
        }
    }
}


function StandingsData() {
    let tbody = document.querySelector("#teamStandings tbody");

    let wins = 36;
    let losses = 0;
    let ties = 2;
    let points = 110;
    let name = "Charlton Athletic";

    garray.forEach(function (data) {
        let tr = document.createElement("tr");
        let tdn = document.createElement("td");
        tdn.textContent = data.teamname;
        let tdw = document.createElement("td");
        tdw.textContent = data.W;
        let tdl = document.createElement("td");
        tdl.textContent = data.L;
        let tdt = document.createElement("td");
        tdt.textContent = data.T;
        let tdp = document.createElement("td");
        tdp.textContent = data.points;
        tr.appendChild(tdn);
        tr.appendChild(tdw);
        tr.appendChild(tdl);
        tr.appendChild(tdt);
        tr.appendChild(tdp);
        tbody.appendChild(tr);
    });

    //Sample Tables stuff here:
    //    let tr = document.createElement("tr");
    //    let tdn = document.createElement("td");
    //    tdn.textContent = name;
    //    let tdw = document.createElement("td");
    //    tdw.textContent = wins;
    //    let tdl = document.createElement("td");
    //    tdl.textContent = losses;
    //    let tdt = document.createElement("td");
    //    tdt.textContent = ties;
    //    let tdp = document.createElement("td");
    //    tdp.textContent = points;
    //    tr.appendChild(tdn);
    //    tr.appendChild(tdw);
    //    tr.appendChild(tdl);
    //    tr.appendChild(tdt);
    //    tr.appendChild(tdp);
    //    tbody.appendChild(tr);
}

function calculateStandings(id, result) {

    let win = 2; // correct for hockey
    let tie = 1; // doesn't apply to hockey but!!
    let loss = 0;


    standings.forEach(function (value) {
        if (value.id == id) {

            switch (result) {

            case "W":
                value.points += win;
                value.W++;
                break;

            case "L":
                value.points += loss;
                value.L++;
                break;

            case "T":
                value.points += tie;
                value.T++;
                break;

            default:
                console.log("calculateStandings ERROR");
                break;

            }
        }
    });
}