var redirect_uri = "http://127.0.0.1:5500/index.html"; // change this your value
//var redirect_uri = "http://127.0.0.1:5500/index.html";


var client_id_global = 'a260bc4ff6e2426986e6aa05fabab58a';
var client_secret_global = 'd15f23b22fbb45d2a4cede2ccf559f61'; // In a real app you should not expose your client_secret to the user
var client_id;
var client_secret;

var access_token = null;
var refresh_token = null;
var currentPlaylist = "";
var radioButtons = [];

const AUTHORIZE = "https://accounts.spotify.com/authorize"
const TOKEN = "https://accounts.spotify.com/api/token";
const PLAYLISTS = "https://api.spotify.com/v1/me/playlists";
const ADD = "https://api.spotify.com/v1/playlists/{{PlaylistID}}/tracks?position=0&uris=spotify%3Atrack%3A";
const DEVICES = "https://api.spotify.com/v1/me/player/devices";
const PLAY = "https://api.spotify.com/v1/me/player/play";
const PAUSE = "https://api.spotify.com/v1/me/player/pause";
const NEXT = "https://api.spotify.com/v1/me/player/next";
const PREVIOUS = "https://api.spotify.com/v1/me/player/previous";
const PLAYER = "https://api.spotify.com/v1/me/player";
const TRACKS = "https://api.spotify.com/v1/playlists/{{PlaylistId}}/tracks";
const CURRENTLYPLAYING = "https://api.spotify.com/v1/me/player/currently-playing";
const SHUFFLE = "https://api.spotify.com/v1/me/player/shuffle";
const FEATURES = "https://api.spotify.com/v1/audio-features/{{TrackID}}";
const ANALYSIS = "https://api.spotify.com/v1/audio-analysis/{{TrackID}}";
const SONG = "https://api.spotify.com/v1/tracks/{{TrackID}}";
const ARTIST = "https://api.spotify.com/v1/artists/{{ArtistID}}";
const SEARCH = 'https://api.spotify.com/v1/search?q={{SearchTerm}}&type=track&limit=5';

function onPageLoad(){
    client_id = localStorage.getItem("client_id");
    if (client_id == 'null') {
      client_id = client_id_global;
    }
    client_secret = localStorage.getItem("client_secret");
    if (client_secret == 'null') {
      client_secret = client_secret_global;
    }
    if ( window.location.search.length > 0 ){
        handleRedirect();
    }
    else{
        access_token = localStorage.getItem("access_token");
        if ( access_token == null ){
            // we don't have an access token so present token section
            //document.getElementById("tokenSection").style.display = 'block';
        }
        else {
            // we have an access token so present device section
            //document.getElementById("deviceSection").style.display = 'block';
            refreshDevices();
            refreshPlaylists();
            currentlyPlaying();
        }
    }
    //refreshRadioButtons();
}

function handleRedirect(){
    let code = getCode();
    fetchAccessToken( code );
    window.history.pushState("", "", redirect_uri); // remove param from url
}

function getCode(){
    let code = null;
    const queryString = window.location.search;
    if ( queryString.length > 0 ){
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code')
    }
    return code;
}

function requestAuthorization(){
    localStorage.setItem("client_id", client_id_global);
    localStorage.setItem("client_secret", client_secret_global); // In a real app you should not expose your client_secret to the user

    let url = AUTHORIZE;
    url += "?client_id=" + client_id_global;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect_uri);
    url += "&show_dialog=true";
    url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private playlist-modify-private playlist-modify-public app-remote-control";
    window.location.href = url; // Show Spotify's authorization screen
}

function fetchAccessToken( code ){
    console.log(access_token);
    let body = "grant_type=authorization_code";
    body += "&code=" + code;
    body += "&redirect_uri=" + encodeURI(redirect_uri);
    body += "&client_id=" + client_id_global;
    body += "&client_secret=" + client_secret_global;
    callAuthorizationApi(body);
}
refreshAccessToken();
function refreshAccessToken(){
    console.log('refresh');
    refresh_token = localStorage.getItem("refresh_token");
    let body = "grant_type=refresh_token";
    body += "&refresh_token=" + refresh_token;
    body += "&client_id=" + client_id_global;
    callAuthorizationApi(body);
    checkLoginStatus();
}
function checkLoginStatus() {
    if (refresh_token.length > 4) {
        $('#start-app').addClass('active');
        $('#log-in').removeClass('active');
        console.log('User eingeloggt');
    } else {
        console.log('User nicht eingeloggt');
        $('#log-in').addClass('active');
        $('#start-app').removeClass('active');
    }
}

function callAuthorizationApi(body){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", TOKEN, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(client_id_global + ":" + client_secret_global));
    xhr.send(body);
    xhr.onload = handleAuthorizationResponse;
}

function handleAuthorizationResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        if ( data.access_token != undefined ){
            access_token = data.access_token;
            localStorage.setItem("access_token", access_token);
        }
        if ( data.refresh_token  != undefined ){
            refresh_token = data.refresh_token;
            localStorage.setItem("refresh_token", refresh_token);
        }
        onPageLoad();
    }
    else {
        console.log(this.responseText);
        //alert(this.responseText);
    }
}

function refreshDevices(){
    callApi( "GET", DEVICES, null, handleDevicesResponse, true );
}

function handleDevicesResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        //console.log(data);
        removeAllItems( "devices" );
        data.devices.forEach(item => addDevice(item));
    }
    else if ( this.status == 401 ){
        refreshAccessToken()
    }
    else {
        //console.log(this.responseText);
        alert(this.responseText);
    }
}

function removeAllItems( elementId ){
    let node = document.getElementById(elementId);
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

function addDevice(item){
    let node = document.createElement("option");
    node.value = item.id;
    node.innerHTML = item.name;
    document.getElementById("devices").appendChild(node);
}

function callApi(method, url, body, callback, setHeader){
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    if (setHeader == true) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    }
    xhr.send(body);
    xhr.onload = callback;
    //console.log(xhr);
}

function refreshPlaylists(){
    callApi( "GET", PLAYLISTS, null, handlePlaylistsResponse, true );
}

var playlistID;
function handlePlaylistsResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        //console.log(data.items);
        //removeAllItems( "playlists" );
        //data.items.forEach(item => addPlaylist(item));
        // document.getElementById('playlists').value = currentPlaylist;
        // var coverList = document.createElement("ul");
        data.items.forEach(function (playlist) {
            var playlistName = playlist.name;
            if (playlistName == 'Shapes of Music') {
                console.log('playlist found');
                playlistID = playlist.id
            } else {
                console.log('playlist not found');
            }
        });
        //console.log(playlistID);
    }
    else if ( this.status == 401 ){
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}
