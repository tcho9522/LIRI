require("dotenv").config();
var keys = require('./keys.js');
var axios = require('axios');
var moment = require('moment');
var fs = require('fs');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

switch (process.argv[2]) {
  case 'concert-this':
    concertSearch(process.argv[3]);
    break;
  case 'spotify-this-song':
    if (!process.argv[3]) {
      console.log('No song provided');
      songSearch('The Sign')
    }
    else {
      songSearch(process.argv[3]);
    }
    break;
  case 'movie-this':
    if (!process.argv[3]) {
      console.log('No movie provided')
      movieSearch('Mr. Nobody')
    }
    else {
      movieSearch(process.argv[3]);
    }
    break;
  case 'do-what-it-says':
    var data = fs.readFile();
    var arguments = data.splice(",");
    var data = fs.readFile("./random.txt", function(err,data){
      if(err){console.log(err)}
      else{console.log(data)}
    });
    // var arguments = data.splice(',');
    switch (arguments[0]) {
      case 'concert-this':
        concertSearch(arguments[1]);
        break;
      case 'spotify-this-song':
        songSearch(arguments[1]);
        break;
      case 'movie-this':
        movieSearch(arguments[1]);
        break;
    }
    break;
}

function concertSearch(artist) {
  axios.get(`https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`).then(function (response) {
    if (response.data === null) {
      console.log('No upcoming events for ' + artist)
    }
    else {
      for (var i = 0; i < response.data.length; i++) {
        console.log(
          "Name of venue: " + response.data[i].venue.name + "\n" +
          "Venue Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country + "\n" +
          "Date: " + moment(response.data[i].datetime).format("MM/DD/YYYY") + "\n"
        )
      }
    }
  })
}

function songSearch(title) {
  spotify.search({ type: 'track', query: title, limit: 1 }).then(function (data) {
    // console.log(JSON.stringify(data,null,2));
    console.log(
      "Artist: " + data.tracks.items[0].album.artists[0].name + "\n" +
      "Album name: " + data.tracks.items[0].album.name + "\n" +
      "Song name: " + data.tracks.items[0].name + "\n" +
      "Preview link: " + data.tracks.items[0].external_urls.spotify
    )
  });
}


function movieSearch(title) {
  axios.get(`http://www.omdbapi.com/?t=${title}&apikey=trilogy`).then(function (response) {
    var ax = response.data;
    console.log(
      "Movie title: " + ax.Title + "\n" +
      "Release date: " + ax.Year + "\n" +
      "IMDB rating: " + ax.imdbRating + "\n" +
      "Rotten Tomatoes rating: " + ax.Ratings[2].Value + "\n" +
      "Country: " + ax.Country + "\n" +
      "Language: " + ax.Language + "\n" +
      "Plot: " + ax.Plot + "\n" +
      "Actors: " + ax.Actors
    )
  })
}