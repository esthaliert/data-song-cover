// document.addEventListener('DOMContentLoaded',domloaded,false);
// function domloaded(){
//     // your code here.
// }
function nextForm(){
    var activeSlide = $('.form-slide.active');
    var activeNumber = parseInt(activeSlide.attr('form-slide'));
    var nextNumber = activeNumber+1;
    console.log(nextNumber);
    $('.form-slide.active').removeClass('active').addClass('deactivated');
    $('.form-slide[form-slide="' + nextNumber + '"]').addClass('active');

}

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

function getArtist() {
    var artist_id = $('.search-result.clicked').attr('artistid');
    if ( artist_id.length > 0 ){
        url = ARTIST.replace("{{ArtistID}}", artist_id);
        callApi( "GET", url, null, handleArtistResponse );
    }
}

function handleArtistResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        var genre = '<ul class="genre-list"><li>Genres: ' + data.genres + '</li></ul>';
        $('.genre-list').remove();
        $(genre).appendTo('#track-metas');
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



function getSearchResults(){
    var searchString = $('#searchTrack').val();
    searchString = searchString.replaceAll(' ', '%20');
    url = SEARCH.replace("{{SearchTerm}}", searchString);
    callApi( "GET", url, null, handleSearchResponse );
}
function handleSearchResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        console.log(data);
        var resultArray = data.tracks.items;
        //console.log(resultArray);
        var resultTarget = $('#search-results');
        $('.search-result').each(function(index) {
            $(this).remove();
        });
        for (i = 0; i < resultArray.length; i++) {
            var currentObject = resultArray[i];
            var title = currentObject.name;
            var artist = currentObject.artists[0].name;
            var artistID = currentObject.artists[0].id;
            var albumID = currentObject.album.id;
            var trackID = currentObject.id;
            var resultElement = '<li class="search-result" artistid="' + artistID + '" id="' + trackID + '" albumid="' + albumID + '">' + title + ' - ' + artist + '</li>';
            $(resultElement).appendTo(resultTarget);
        }
        var artist = data.tracks;
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


$(document).on("click", "li.search-result" , function() {
    var clickedSong = $(this);
    var songID = $(this).attr('id');
    var albumID = $(this).attr('albumid');
    $('.search-result').removeClass('clicked');
    clickedSong.addClass('clicked');
    getTrack();
    getFeatures();
    getAnalysis();
    getArtist();
    //draw(keyValue, modeValue, danceabilityValue);
    play(songID, albumID);
    reset = true;
    console.log('start');
})

function getFeatures(){
    var trID = $('.search-result.clicked').attr('id');
    url = FEATURES.replace("{{TrackID}}", trID);
    callApi( "GET", url, null, handleFeatureResponse );
}

var danceabilityValue;
var energyValue;
var keyValue;
var modeValue;
var loudnessValue;
var speechinessValue;
var acousticnessValue;
var instrumentalnessValue;
var livenessValue;
var valenceValue;
var bpm;
var markets;
var happinessValue;

function handleFeatureResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        //console.log(data);
        danceabilityValue = data.danceability;
        energyValue = data.energy;
        keyValue = data.key;
        modeValue = data.mode;
        loudnessValue = data.loudness;
        speechinessValue = data.speechiness;
        acousticnessValue = data.acousticness;
        instrumentalnessValue = data.instrumentalness;
        livenessValue = data.liveness;
        valenceValue = data.valence;
        bpm = data.tempo;
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
    var trID = $('.search-result.clicked').attr('id');
    url = ANALYSIS.replace("{{TrackID}}", trID);
    callApi( "GET", url, null, handleAnalysisResponse );
}

function handleAnalysisResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        //console.log(data);
        var sectionsNr = '<li>Sections: ' + data.sections.length + '</li>';
        var beatsNr = '<li>Beats: ' + data.beats.length + '</li>';
        var trackDuration = '<li>Dauer (in ms): ' + data.track.duration + '</li>';
        var trackAnalysis = '<ul class="analysis-list">' + sectionsNr + beatsNr + trackDuration + '</ul>';
        $('.analysis-list').remove();
        $(trackAnalysis).appendTo('#track-metas');
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

function getTrack(){
    var trID = $('.search-result.clicked').attr('id');
    url = SONG.replace("{{TrackID}}", trID);
    callApi( "GET", url, null, handleTrackResponse );
}

function handleTrackResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        console.log(data);
        markets = data.available_markets.length;
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

function play(_songID, _albumID){
    //let playlist_id = document.getElementById("playlists").value;
    let trackindex = _songID;
    let album = _albumID;
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
        //removeAllItems( "tracks" );
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


// function currentlyPlaying(){
//     callApi( "GET", PLAYER + "?market=US", null, handleCurrentlyPlayingResponse );
// }

// function handleCurrentlyPlayingResponse(){
//     if ( this.status == 200 ){
//         var data = JSON.parse(this.responseText);
//         //console.log(data);
//         if ( data.item != null ){
//             //document.getElementById("albumImage").src = data.item.album.images[0].url;
//             document.getElementById("trackTitle").innerHTML = data.item.name;
//             document.getElementById("trackArtist").innerHTML = data.item.artists[0].name;
//         }


//         if ( data.device != null ){
//             // select device
//             currentDevice = data.device.id;
//             //document.getElementById('devices').value=currentDevice;
//         }

//         if ( data.context != null ){
//             // select playlist
//             currentPlaylist = data.context.uri;
//             currentPlaylist = currentPlaylist.substring( currentPlaylist.lastIndexOf(":") + 1,  currentPlaylist.length );
//             document.getElementById('playlists').value=currentPlaylist;
//         }
//     }
//     else if ( this.status == 204 ){

//     }
//     else if ( this.status == 401 ){
//         refreshAccessToken()
//     }
//     else {
//         console.log(this.responseText);
//         alert(this.responseText);
//     }
// }

function saveNewRadioButton(){
    let item = {};
    item.deviceId = deviceId();
    item.playlistId = document.getElementById("playlists").value;
    radioButtons.push(item);
    localStorage.setItem("radio_button", JSON.stringify(radioButtons));
    refreshRadioButtons();
}