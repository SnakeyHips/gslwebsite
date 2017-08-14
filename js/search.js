// Defining global variable to use same game informtion from GiantBombAPI for YouTube API
var name;
var date;

//Function which takes YouTube API information to append to output list div
function parsePlaylistResponse(response, soundID) { //response and infoID parameter input in to make sure video is appended to the corresponding search result
    console.log(response.items);
    try {
        var playlist = response.items[0].id.playlistId;
        var playlistappend = document.getElementById("sound" + soundID); //grabs output div list from goSearch function
        var playtitle = document.createTextNode("Top YouTube Playlist:");
        var playtitle_p = document.createElement("p");
        var play = document.createElement("iframe");
        play.className = "playlistplayer";
        play.width = "380";
        play.height = "250";
        play.src = "https://www.youtube.com/embed?listType=playlist&list=" + playlist + "&enablejsapi=1&controls=2"; //controls=2 used as now it only loads the flash video when pressed play to increase performance as said by YouTube API notes
        play.frameborder = "0";
        // code above used to make embedded YouTube video without lots of JS: https://developers.google.com/youtube/iframe_api_reference
        playtitle_p.appendChild(playtitle);
        playlistappend.appendChild(playtitle_p);
        playlistappend.appendChild(play);
    } catch (err) {
        console.log("SYSTEMS OFFLINE");
    }
}

//Function which uses Giantbomb API info to find corresponding video on YouTube API
function getPlaylist(soundID) { //listID parameter input to pass through onto parseResponse function
    var API_KEY = "AIzaSyAtkuZlK1ZDQCv6Yj9WFYucmywhgjSlzWg";
    var xhttp = new XMLHttpRequest();
    xhttp.addEventListener("load", function() { //Function to allow the soundID to pass through the parseResponse function
        var response = JSON.parse(this.response);
        parsePlaylistResponse(response, soundID);
    });
    var url = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + name.replace(/ /g, "+") + "+soundtrack&type=playlist&maxResults=1&key=" + API_KEY;
    //edit url to replace spaces in name with +, add +soundtrack to get soundtrack listings and restrict type to videos to stop playlists - maybe edit back to include playlists too
    xhttp.open("GET", url);
    xhttp.send();
}

//Function which takes YouTube API information to append to output list div
function parseVideoResponse(response, soundID) { //response and infoID parameter input in to make sure video is appended to the corresponding search result
    console.log(response.items);
    try {
        var video1 = response.items[0].id.videoId;
        var video2 = response.items[1].id.videoId;
        var video3 = response.items[2].id.videoId;
        var video4 = response.items[3].id.videoId;
        var video5 = response.items[4].id.videoId;
        var videoappend = document.getElementById("sound" + soundID); //grabs output div list from goSearch function
        var videotitle = document.createTextNode("Top 5 YouTube Results:");
        var videotitle_p = document.createElement("p");
        var video = document.createElement("iframe");
        video.className = "videoplayer";
        video.width = "380";
        video.height = "250";
        video.src = "https://www.youtube.com/embed/" + video1 + "?enablejsapi=1&playlist=" + video2 + "," + video3 + "," + video4 + "," + video5 + "&controls=2"; //controls=2 used as now it only loads the flash video when pressed play to increase performance as said by YouTube API notes
        video.frameborder = "0";
        // code above used to make embedded YouTube video without lots of JS: https://developers.google.com/youtube/iframe_api_reference
        videotitle_p.appendChild(videotitle);
        videoappend.appendChild(videotitle_p);
        videoappend.appendChild(video);
    } catch (err) {
        console.log("SYSTEMS OFFLINE");
    }
}

//Function which uses Giantbomb API info to find corresponding video on YouTube API
function getVideo(soundID) { //listID parameter input to pass through onto parseResponse function
    var API_KEY = "AIzaSyAtkuZlK1ZDQCv6Yj9WFYucmywhgjSlzWg";
    var xhttp = new XMLHttpRequest();
    xhttp.addEventListener("load", function() { //Function to allow the infoID to pass through the parseResponse function
        var response = JSON.parse(this.response);
        parseVideoResponse(response, soundID);
    });
    var url = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + name.replace(/ /g, "+") + "+soundtrack&type=video&maxResults=5&key=" + API_KEY;
    //edit url to replace spaces in name with +, add +soundtrack to get soundtrack listings and restrict type to videos to stop playlists - maybe edit back to include playlists too
    xhttp.open("GET", url);
    xhttp.send();
}

// Function that will process the response from the API
// This function should probably check for errors
function processJSONPResponse(data) {
    console.log("giantbomb", data);
    var output = document.getElementById("output");
    //code to remove any previous search results
    while (output.firstChild) { //code to clear any previous search results from: http://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
        output.removeChild(output.firstChild);
    }
    for (let i = 0; i < data.results.length; i++) { //let used instead of var to limit use of i within the scope
        try {
            var list = document.createElement("ol");
            var result = document.createElement("div");
            result.classList.add("result"); //classList from: https://developer.mozilla.org/en/docs/Web/API/Element/classList
            name = data.results[i].name;
            var title = document.createTextNode(i + 1 + ": " + name);
            var header = document.createElement("h2");
            var button = document.createElement("button");
            var slidername = document.createTextNode("View");
            var info = document.createElement("div");
            info.id = ("info" + i);
            info.classList.add("hidden"); //class list for using allowing the hidden and show function
            info.classList.add("gameinfo");
            (function() { //Function to check if game is released yet or not as otherwise it wouldn"t display any results for this title
                if (data.results[i].original_release_date === null) {
                    date = "Not released 123456789"; //Added numbers to make sure slice method below still works
                } else {
                    date = data.results[i].original_release_date;
                }
                return date;
            })();
            var release = date.slice(0, -9); //Have to slice off end of date information as it also contains time of release when I only want the date
            var release_date = document.createTextNode("Release Date: " + release);
            var release_p = document.createElement("p");
            var deck = data.results[i].deck; //named deck to match the api name
            var description = document.createTextNode(deck);
            var description_p = document.createElement("p");
            var image = document.createElement("img");
            image.src = data.results[i].image.small_url;
            var sound = document.createElement("div");
            sound.id = ("sound" + i);
            sound.classList.add("gamesound");
            header.appendChild(title);
            button.appendChild(slidername);
            result.appendChild(header);
            result.appendChild(button);
            list.appendChild(result);
            info.appendChild(image);
            release_p.appendChild(release_date);
            info.appendChild(release_p);
            description_p.appendChild(description);
            info.appendChild(description_p);
            getPlaylist(i); //Function to use search results to append a YouTube playlist to the results
            getVideo(i); //Function to use search results to append top 5 YouTube videos as a custom playlist to the results
            info.appendChild(sound);
            list.appendChild(info);
            output.appendChild(list);
            //EventListener to toggle display of output as default or hidden classList
            button.addEventListener("click", function() {
                var view = document.getElementById("info" + i);
                if (view.classList.contains("hidden")) {
                    view.classList.remove("hidden");
                    view.classList.add("shown");
                } else {
                    view.classList.remove("shown");
                    view.classList.add("hidden");
                }
            });
        } catch (err) {
            console.log(data.results[i]);
        }
    }
}

// Function to ensure parameters used in request are encoded correctly
function encodeParameters(params) {
    // join all key value pairs and store in an array
    var strArray = [];
    for (var key in params) {
        if (params.hasOwnProperty(key)) {
            var paramString = encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
            strArray.push(paramString);
        }
    }
    // join everything in the array together
    return strArray.join("&");
}

// Function which uses search_term to get get information from Giantbomb API
function doSearch() {
    var search_term = document.getElementById("search_term").value;
    console.log(search_term);
    var parameters = {
        api_key: "2f3364ca9792993e141850a348f5bc8a1393841e",
        format: "jsonp",
        query: search_term,
        resources: "game",
        limit: "5",
        json_callback: "processJSONPResponse"
    };

    var base_url = "http://www.giantbomb.com/api/search/";
    var query_url = base_url + "?" + encodeParameters(parameters);
    console.log(query_url);

    // add a new script to the page, using the query_url as the source
    var script = document.createElement("script");
    script.src = query_url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

//Function which runs doSearch function when pressing the search button
var search_button = document.getElementById("search_button");
search_button.addEventListener("click", doSearch);

//Function to allow pressing enter in the search box to run the doSearch function from: http://stackoverflow.com/questions/155188/trigger-a-button-click-with-javascript-on-the-enter-key-in-a-text-box
document.getElementById("search_term")
    .addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode == 13) {
            document.getElementById("search_button").click();
        }
    });

//Function just to display to the console that all the above code has been read by the browser okay
window.onload = function() {
    console.log("ALL SYSTEMS GO");
};
