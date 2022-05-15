var redirect_uri = "http://127.0.0.1:5500/index.html"; // change this your value
//var redirect_uri = "http://127.0.0.1:5500/index.html";
 

var client_id = ""; 
var client_secret = ""; // In a real app you should not expose your client_secret to the user

var access_token = null;
var refresh_token = null;
var currentPlaylist = "";
var radioButtons = [];

const AUTHORIZE = "https://accounts.spotify.com/authorize"
const TOKEN = "https://accounts.spotify.com/api/token";
const PLAYLISTS = "https://api.spotify.com/v1/me/playlists";
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

function onPageLoad(){
    client_id = localStorage.getItem("client_id");
    client_secret = localStorage.getItem("client_secret");
    if ( window.location.search.length > 0 ){
        handleRedirect();
    }
    else{
        access_token = localStorage.getItem("access_token");
        if ( access_token == null ){
            // we don't have an access token so present token section
            document.getElementById("tokenSection").style.display = 'block';  
        }
        else {
            // we have an access token so present device section
            document.getElementById("deviceSection").style.display = 'block';  
            refreshDevices();
            refreshPlaylists();
            currentlyPlaying();
        }
    }
    refreshRadioButtons();
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
    client_id = document.getElementById("clientId").value;
    client_secret = document.getElementById("clientSecret").value;
    localStorage.setItem("client_id", client_id);
    localStorage.setItem("client_secret", client_secret); // In a real app you should not expose your client_secret to the user

    let url = AUTHORIZE;
    url += "?client_id=" + client_id;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect_uri);
    url += "&show_dialog=true";
    url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
    window.location.href = url; // Show Spotify's authorization screen
}

function fetchAccessToken( code ){
    let body = "grant_type=authorization_code";
    body += "&code=" + code; 
    body += "&redirect_uri=" + encodeURI(redirect_uri);
    body += "&client_id=" + client_id;
    body += "&client_secret=" + client_secret;
    callAuthorizationApi(body);
}

function refreshAccessToken(){
    console.log('refresh');
    refresh_token = localStorage.getItem("refresh_token");
    let body = "grant_type=refresh_token";
    body += "&refresh_token=" + refresh_token;
    body += "&client_id=" + client_id;
    callAuthorizationApi(body);
}

function callAuthorizationApi(body){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", TOKEN, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(client_id + ":" + client_secret));
    xhr.send(body);
    xhr.onload = handleAuthorizationResponse;
    console.log(client_id);
    console.log(client_secret);
}

function handleAuthorizationResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        console.log(data);
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
        alert(this.responseText);
    }
}

function refreshDevices(){
    callApi( "GET", DEVICES, null, handleDevicesResponse );
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

function addDevice(item){
    let node = document.createElement("option");
    node.value = item.id;
    node.innerHTML = item.name;
    document.getElementById("devices").appendChild(node); 
}

function callApi(method, url, body, callback){
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    xhr.send(body);
    xhr.onload = callback;
}

function refreshPlaylists(){
    callApi( "GET", PLAYLISTS, null, handlePlaylistsResponse );
}

function handlePlaylistsResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        //console.log(data.items);
        removeAllItems( "playlists" );
        data.items.forEach(item => addPlaylist(item));
        document.getElementById('playlists').value = currentPlaylist;
        var coverList = document.createElement("ul");
        data.items.forEach(function (playlist) {
            var itemID = playlist.id;
            var childElement = '<div class="cover-container" value="' + itemID + '" ><div class="cover-image" alt="Playlist Cover" style=background-image:url("' + playlist.images[0].url + '");></div></div>';
            $(childElement).appendTo('#playlist-covers');
        });
        handleCoverSizes();
    }
    else if ( this.status == 401 ){
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}
function handleCoverSizes() {
    var cover = $('.cover-image');
    var coverWidth = cover.outerWidth();
    cover.each(function(index) {
        $(this).css('height', coverWidth + 'px');
    });
}

setTimeout(function() { 
    $('.cover-container').click(function(){
        var clickedPlaylist = $(this);
        var playlistID = $(this).attr('value');
        $('.cover-container').removeClass('clicked');
        clickedPlaylist.addClass('clicked');
        $('.song-item').each(function(i) {
            $(this).remove();
        });
        fetchSongs(playlistID);
    });
    $("#track-list").on("click", ".song-item", function(){
        var clickedSong = $(this);
        var songID = $(this).attr('id');
        //var playlistID = $(this).attr('value');
        $('.song-item').removeClass('clicked');
        clickedSong.addClass('clicked');
        fetchSong(songID);
    });

    $('.playlist-ui > div').click(function(){
        $('.playlist-ui > div').removeClass('active');
        var playlistID = $('.cover-container.clicked').attr('value');
        if ($(this).hasClass('play')) {
            if ($(this).hasClass('pause')) {
                $(this).removeClass('pause');
                playSong(playlistID);
            } else {
                $(this).addClass('pause');

            }
        } else if ($(this).hasClass('shuffle')) {
            $(this).addClass('active');
            //playSong();
        } else if ($(this).hasClass('prev')) {

        } else if ($(this).hasClass('next')) {
            
        }
    });
}, 1000);

function fetchSongs(plID){
    let playlist_id = plID;
    if ( playlist_id.length > 0 ){
        url = TRACKS.replace("{{PlaylistId}}", playlist_id);
        console.log(url);
        callApi( "GET", url, null, handleTracksResponse );
    }
}

function fetchSong(soID) {
    let song_id = soID;
    if ( song_id.length > 0 ){
        url = SONG.replace("{{TrackID}}", song_id);
        callApi( "GET", url, null, handleSongResponse );
    }
}

function handleSongResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        console.log(data);
    }
    else if ( this.status == 401 ){
        refreshAccessToken()
        console.log('401');
    }
    else {
        console.log(this.responseText);
        //alert('Bitte wähle einen Song aus!');
    }
}

function addTrack(item, index){
    var trackID = item.track.id;
    var artistID = item.track.artists[0].id;
    fetchArtist(artistID);
    var track = '<li class="song-item" id="' + trackID + '" value="' + index + '" availability="' + item.track.available_markets.length + '" album="' + item.track.album.name + '" duration="' + item.track.duration_ms + '" popularity="' + item.track.popularity + '"><span class="song-title">' + item.track.name + '</span><br/><span class="song-artist" artist-id="' + artistID + '">' + item.track.artists[0].name  + '</span></li>';
    $(track).appendTo('#track-list');
}

function fetchArtist(aID) {
    let artist_id = aID;
    if ( artist_id.length > 0 ){
        url = ARTIST.replace("{{ArtistID}}", artist_id);
        callApi( "GET", url, null, handleArtistResponse );
    }
}

function handleArtistResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        var genre = data.genres;
        console.log(data);
    }
    else if ( this.status == 401 ){
        refreshAccessToken()
        console.log('401');
    }
    else {
        //console.log(this.responseText);
        alert('Bitte wähle einen Song aus!');
    }
}

function getFeatures(){
    var trID = $('.song-item.clicked').attr('id');
    url = FEATURES.replace("{{TrackID}}", trID);
    callApi( "GET", url, null, handleFeatureResponse );
    getAnalysis();
}

function handleFeatureResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        var danceabilityValue = data.danceability;
        var energyValue = data.energy;
        var keyValue = data.key;
        var loudnessValue = data.loudness;
        var speechinessValue = data.speechiness;
        var acousticnessValue = data.acousticness;
        var instrumentalnessValue = data.instrumentalness;
        var livenessValue = data.liveness;
        var valenceValue = data.valence;
        var bpm = data.tempo;
        $('.danceability').css('background-color', 'rgb(' + (danceabilityValue*50)*10 + ',' + (danceabilityValue*30)*10 + ',' + (danceabilityValue*70)*10 + ')');
        $('.energy').css('background-color', 'rgb(' + (energyValue*50)*5 + ',' + (energyValue*30)*5 + ',' + (energyValue*20)*5 + ')');
        $('.key').css('background-color', 'rgb(' + (keyValue*30)*8 + ',' + (keyValue*50)*8 + ',' + (keyValue*10)*8 + ')');
        $('.loudness').css('background-color', 'rgb(' + (loudnessValue*-10)*3 + ',' + (loudnessValue*-20)*3 + ',' + (loudnessValue*-30)*3 + ')');
        $('.speechiness').css('background-color', 'rgb(' + (speechinessValue*50)*10 + ',' + (speechinessValue*60)*10 + ',' + (speechinessValue*40)*10 + ')');
        $('.acousticness').css('background-color', 'rgb(' + (acousticnessValue*70)*7 + ',' + (acousticnessValue*60)*6 + ',' + (speechinessValue*70)*7 + ')');
        $('.instrumentalness').css('background-color', 'rgb(' + (instrumentalnessValue*40)*8 + ',' + (instrumentalnessValue*80)*8 + ',' + (instrumentalnessValue*50)*8 + ')');
        $('.liveness').css('background-color', 'rgb(' + (livenessValue*30)*5 + ',' + (livenessValue*20)*5 + ',' + (livenessValue*40)*5 + ')');
        $('.valence').css('background-color', 'rgb(' + (valenceValue*80)*5 + ',' + (valenceValue*80)*5 + ',' + (valenceValue*80)*5 + ')');
        var tempoValue = 60/bpm;
        var visualizerCss = 'songbeat ' + tempoValue + 's linear 0 infinite alternate';
        //$('#visualizer').css('animation', visualizerCss);
        function loop(){
            $('#visualizer')
            .animate({top: "0" }, (tempoValue*1000), "linear")
            .animate({top:"50px"}, (tempoValue*1000), "linear", loop);
        }
        loop();
    }
    else if ( this.status == 401 ){
        refreshAccessToken()
        console.log('401');
    }
    else {
        //console.log(this.responseText);
        alert('Bitte wähle einen Song aus!');
    }
}

function getAnalysis(){
    var trID = $('.song-item.clicked').attr('id');
    url = ANALYSIS.replace("{{TrackID}}", trID);
    callApi( "GET", url, null, handleAnalysisResponse );
}

function handleAnalysisResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        var sections = data.sections;
        var beats = data.beats;
        var sectionTarget = $('#sections');
        var trackDuration = data.track.duration;
        for (var i = 0; i < sections.length; i++) {
            var sectionDuration = sections[i].duration;
            var sectionPercentage = sectionDuration / trackDuration * 100;
            var sectionObject = '<div class="section" style="width:' + sectionPercentage + '%;"></div>';
            $(sectionObject).appendTo(sectionTarget);
        }
    }
    else if ( this.status == 401 ){
        refreshAccessToken()
        console.log('401');
    }
    else {
        //console.log(this.responseText);
        alert('Bitte wähle einen Song aus!');
    }
}

function playSong(plID){
    let playlist_id = plID;
    let trackIndex = $('.song-item.clicked').attr('value');
    let album = document.getElementById("album").value;
    let body = {};
    if ( album.length > 0 ){
        body.context_uri = album;
    }
    else {
        body.context_uri = "spotify:playlist:" + playlist_id;
        console.log(body.context_uri);
    }
     body.offset = {};
     body.offset.position = trackIndex.length > 0 ? Number(trackIndex) : 0;
     body.offset.position_ms = 0;
    callApi( "PUT", PLAY + "?device_id=" + deviceId(), JSON.stringify(body), handleApiResponse );
}


function addPlaylist(item){
    let node = document.createElement("option");
    node.value = item.id;
    node.innerHTML = item.name + " (" + item.tracks.total + ")";
    document.getElementById("playlists").appendChild(node); 
}

function removeAllItems( elementId ){
    let node = document.getElementById(elementId);
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

function play(){
    let playlist_id = document.getElementById("playlists").value;
    let trackindex = document.getElementById("tracks").value;
    let album = document.getElementById("album").value;
    let body = {};
    if ( album.length > 0 ){
        body.context_uri = album;
    }
    else{
        body.context_uri = "spotify:playlist:" + playlist_id;
    }
    body.offset = {};
    body.offset.position = trackindex.length > 0 ? Number(trackindex) : 0;
    body.offset.position_ms = 0;
    callApi( "PUT", PLAY + "?device_id=" + deviceId(), JSON.stringify(body), handleApiResponse );
}

function shuffle(){
    callApi( "PUT", SHUFFLE + "?state=true&device_id=" + deviceId(), null, handleApiResponse );
    play(); 
}

function pause(){
    callApi( "PUT", PAUSE + "?device_id=" + deviceId(), null, handleApiResponse );
}

function next(){
    callApi( "POST", NEXT + "?device_id=" + deviceId(), null, handleApiResponse );
}

function previous(){
    callApi( "POST", PREVIOUS + "?device_id=" + deviceId(), null, handleApiResponse );
}

function transfer(){
    let body = {};
    body.device_ids = [];
    body.device_ids.push(deviceId())
    callApi( "PUT", PLAYER, JSON.stringify(body), handleApiResponse );
}

function handleApiResponse(){
    if ( this.status == 200){
        console.log(this.responseText);
        setTimeout(currentlyPlaying, 2000);
    }
    else if ( this.status == 204 ){
        setTimeout(currentlyPlaying, 2000);
    }
    else if ( this.status == 401 ){
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }    
}

function deviceId(){
    return document.getElementById("devices").value;
}

function fetchTracks(){
    let playlist_id = document.getElementById("playlists").value;
    if ( playlist_id.length > 0 ){
        url = TRACKS.replace("{{PlaylistId}}", playlist_id);
        callApi( "GET", url, null, handleTracksResponse );
    }
}

function handleTracksResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        //console.log(data);
        removeAllItems( "tracks" );
        //console.log(data.items);
        data.items.forEach( (item, index) => addTrack(item, index));
    }
    else if ( this.status == 401 ){
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}


function currentlyPlaying(){
    callApi( "GET", PLAYER + "?market=US", null, handleCurrentlyPlayingResponse );
}

function handleCurrentlyPlayingResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        //console.log(data);
        if ( data.item != null ){
            document.getElementById("albumImage").src = data.item.album.images[0].url;
            document.getElementById("trackTitle").innerHTML = data.item.name;
            document.getElementById("trackArtist").innerHTML = data.item.artists[0].name;
        }


        if ( data.device != null ){
            // select device
            currentDevice = data.device.id;
            document.getElementById('devices').value=currentDevice;
        }

        if ( data.context != null ){
            // select playlist
            currentPlaylist = data.context.uri;
            currentPlaylist = currentPlaylist.substring( currentPlaylist.lastIndexOf(":") + 1,  currentPlaylist.length );
            document.getElementById('playlists').value=currentPlaylist;
        }
    }
    else if ( this.status == 204 ){

    }
    else if ( this.status == 401 ){
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function saveNewRadioButton(){
    let item = {};
    item.deviceId = deviceId();
    item.playlistId = document.getElementById("playlists").value;
    radioButtons.push(item);
    localStorage.setItem("radio_button", JSON.stringify(radioButtons));
    refreshRadioButtons();
}

function refreshRadioButtons(){
    let data = localStorage.getItem("radio_button");
    if ( data != null){
        radioButtons = JSON.parse(data);
        if ( Array.isArray(radioButtons) ){
            removeAllItems("radioButtons");
            radioButtons.forEach( (item, index) => addRadioButton(item, index));
        }
    }
}

function onRadioButton( deviceId, playlistId ){
    let body = {};
    body.context_uri = "spotify:playlist:" + playlistId;
    body.offset = {};
    body.offset.position = 0;
    body.offset.position_ms = 0;
    callApi( "PUT", PLAY + "?device_id=" + deviceId, JSON.stringify(body), handleApiResponse );
    //callApi( "PUT", SHUFFLE + "?state=true&device_id=" + deviceId, null, handleApiResponse );
}

function addRadioButton(item, index){
    let node = document.createElement("button");
    node.className = "btn btn-primary m-2";
    node.innerText = index;
    node.onclick = function() { onRadioButton( item.deviceId, item.playlistId ) };
    document.getElementById("radioButtons").appendChild(node);
}