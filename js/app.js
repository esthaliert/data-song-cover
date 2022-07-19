var requestSuccess = false;
var displayingCover = false;





$( document ).ready(function() {

    checkLoginStatus();

    var inputReload = $('#happiness').val();
    generateSmile(inputReload);

    console.log( "ready!" );

    canvasSize = $('#application').outerWidth();
    $('#cover-canvas').width(canvasSize).height(canvasSize);

    $( "#happiness" ).on("input", function() {
        var inputValue = $(this).val();
        generateSmile(inputValue);
    });

    // var qrcode = new QRCode("qrcode", {
    //     text: "https://open.spotify.com/playlist/3kPMmlPAEaxCUaOgGhfFQS?si=d72486da6c0847ac",
    //     width: 500,
    //     height: 500,
    //     colorDark : "#000000",
    //     colorLight : "#ffffff",
    //     correctLevel : QRCode.CorrectLevel.H
    // });

    // Credit: Mateusz Rybczonec

});


function generateSmile(_inputValue) {
    var inputValue = _inputValue;
    var dashOffset = (320/100*inputValue) + 1360;
    var dashArray = 1100 - (260/100*inputValue);
    $('#smile .path-left').css({
        'stroke-dashoffset' : dashOffset,
        'stroke-dasharray' : dashArray
    })
    ;$('#smile .path-right').css({
        'stroke-dashoffset' : dashOffset,
        'stroke-dasharray' : dashArray
    });
}

function restart() {
    location.reload(true);
}

function startTimer() {
    setTimeout(function() {
        restart();
    }, 30000)
}


// document.addEventListener('DOMContentLoaded',domloaded,false);
// function domloaded(){
//     // your code here.
// }
function nextForm(){
    var activeSlide = $('.form-slide.active');
    var activeNumber = parseInt(activeSlide.attr('form-slide'));
    var nextNumber = activeNumber+1;
    $('.form-slide.active').removeClass('active').addClass('deactivated');
    $('.form-slide[form-slide="' + nextNumber + '"]').addClass('active');
    // console.log($('.form-slide').length);
    // console.log(nextNumber);
    if (nextNumber+1 == $('.form-slide').length) {
        console.log('final');
        $('#application-display').addClass('dark-mode');
        $('#cover-canvas').addClass('active');
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
            // document.getElementById("albumImage").src = data.item.album.images[0].url;
            // document.getElementById("trackTitle").innerHTML = data.item.name;
            // document.getElementById("trackArtist").innerHTML = data.item.artists[0].name;
        }


        if ( data.device != null ){
            // select device
            currentDevice = data.device.id;
            document.getElementById('devices').value=currentDevice;
        }

        if ( data.context != null ){
            // select playlist
            // currentPlaylist = data.context.uri;
            // currentPlaylist = currentPlaylist.substring( currentPlaylist.lastIndexOf(":") + 1,  currentPlaylist.length );
            // document.getElementById('playlists').value=currentPlaylist;
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
    artist = $('.search-result.clicked').attr('artist');
    if ( artist_id.length > 0 ){
        url = ARTIST.replace("{{ArtistID}}", artist_id);
        callApi( "GET", url, null, handleArtistResponse );
    }
}

var genreMin = 0.5;
var genreMax = 1.4;
var genre;
let genreSwitches = [genreMin,genreMin,genreMin,genreMin,genreMin,genreMin,genreMin,genreMin,genreMin,genreMin,genreMin,genreMin,genreMin,genreMin,genreMin,genreMin];
const genreNumbers = ['electro house','sonstiges','country','folk','classical','jazz','blues','r&b','hip hop','world','reggae','latin','pop','rock','metal','punk'];
let genreFamilies = [];
function handleArtistResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        console.log(data);
        genre = data.genres;
        console.log(genre);
        genreFamilies = [];
        genreSwitches = [genreMin,genreMin,genreMin,genreMin,genreMin,genreMin,genreMin,genreMin,genreMin,genreMin,genreMin,genreMin,genreMin,genreMin,genreMin,genreMin];
        // alle Genres durchiterieren
        for (var g = 0; g < allGenres.length; g++) {
            // alle Genres des gewählten Songs iterieren
            for (var s = 0; s < genre.length; s++) {
                // prüfen, ob der Name eines Genres gleich der Name eines Genres des Songs ist
                var genreIndex = allGenres[g].name.indexOf(genre[s]);
                if (genreIndex !== -1) {
                    // Nur die Genre-Familien-Namen behalten, die auch genau mit dem des Songs übereinstimmen
                    // Beispielsweise modern rock ≠ rock, würde aber sonst drin bleiben, da indexOf nur prüft, ob "rock" enthalten ist
                    if (allGenres[g].name.length == genre[s].length) {
                        for (f = 0; f < allGenres[g].family.length; f++) {
                            var genreName = allGenres[g].family[f];
                            if (genreFamilies.indexOf(genreName) == -1) {
                                genreFamilies.push(allGenres[g].family[f]);
                            }
                        }
                    }
                }
            }
        }
        // Array zur Bestimmung der Vektor-Skalierung befüllen = an welchen Positionen der Blob "ausschägt"
        if (genreFamilies.length == 0) {
            // Fallback falls Song kein Genre hat
            genreSwitches[1] = genreMax - 0.2;
        } else {
            // durch die festgelegten Genres durchiterieren
            for (var c = 0; c < genreNumbers.length; c++) {
                // durch jedes Genre im erstellten Array iterieren
                for ( var b = 0; b < genreFamilies.length; b++) {
                    if (genreFamilies.length == 1) {
                        genreMax = genreMax;
                    }
                    // checken, ob und wo die Strings der beiden Array übereinstimmen
                    var genrePosition = genreNumbers.indexOf(genreFamilies[b]);
                    if (c == genrePosition) {
                        // Bei Übereinstimmung wird das Genre "angeschaltet" & der Wert von genreMin auf 1 geändert
                        genreSwitches[genrePosition] = genreMax;
                        console.log(genreFamilies[b]);
                    }
                }
            }
        }
        var blendValue = 0.7;
        // Übergang zwischen Werten mit 1 und 0.3 
        for (var u = 0; u < genreSwitches.length; u++) {
            if (genreSwitches[u] == genreMax) {
                var positionPrev;
                var positionNext;
                if (u == 0) {
                    genreSwitches[16] = genreMax;
                    if (genreSwitches[1] !== genreMax) {
                        genreSwitches[1] = blendValue;
                    }
                    if (genreSwitches[15] !== genreMax) {
                        genreSwitches[15] = blendValue;
                    }
                } else if (u == 15) {
                    if (genreSwitches[0] !== genreMax) {
                        genreSwitches[0] = blendValue;
                    }
                    if (genreSwitches[14] !== genreMax) {
                        genreSwitches[14] = blendValue;
                    }
                    if (genreSwitches[16] !== genreMax) {
                        genreSwitches[16] = blendValue;
                    }
                } else {
                    positionPrev = u - 1;
                    positionNext = u + 1;
                    if (genreSwitches[positionPrev] !== genreMax) {
                        genreSwitches[positionPrev] = blendValue;
                    }
                    if (genreSwitches[positionNext] !== genreMax) {
                        genreSwitches[positionNext] = blendValue;
                    }
                    
                    
                }
            } else if (genreSwitches[u] == genreMin) {
                var randomAdd = Math.random();
                genreSwitches[u] = genreSwitches[u] + (randomAdd/25);
            }
        }
        console.log(genreSwitches);
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


var currentObject;
var title;
var artist;
var artistID;
var albumName;
var albumID;
var trackID;
var trackNr;
var discNr;
var albumImg;

var resultData = {};
var trackList = [];
console.log(resultData);

function getSearchResults(){
    var searchString = $('#searchTrack').val();
    searchString = searchString.replaceAll(' ', '%20');
    url = SEARCH.replace("{{SearchTerm}}", searchString);
    callApi( "GET", url, null, handleSearchResponse );
}
var listNumber = 0;
function handleSearchResponse(){
    if ( this.status == 200 ){
        resultData = [];
        var data = JSON.parse(this.responseText);
        console.log(data);
        var resultArray = data.tracks.items;
        //console.log(resultArray);
        var resultTarget = $('#search-results');
        $('.form-slide.slide-2').addClass('results');
        $('.search-result').each(function(index) {
            $(this).remove();
        });
        for (i = 0; i < resultArray.length; i++) {
            currentObject = resultArray[i];
            console.log(currentObject);
            title = currentObject.name;
            artist = currentObject.artists[0].name;
            artistID = currentObject.artists[0].id;
            albumName = currentObject.album.name;
            albumID = currentObject.album.id;
            trackID = currentObject.id;
            trackNr = currentObject.track_number;
            discNr = currentObject.disc_number;
            albumImg = currentObject.album.images[1].url;
            var resultElement = '<li class="search-result" position="' + i + '" songtitle="' + title + '" artist="' + artist + '" discNr="' + discNr + '" artistid="' + artistID + '" trackNr="' + trackNr + '" id="' + trackID + '" albumid="' + albumID + '"><div class="result-cover"><img src="' + albumImg + '" alt="' + albumName + '"></div><div class="result-content"><p class="song-title">' + title + '</p><span class="song-infos"><span class="song-artist">' + artist + '</span><span class="song-album">' + albumName + '</span></span></div><div class="result-action"><div class="play-song"><div class="play-icon"></div></div></li>';
            $(resultElement).appendTo(resultTarget);
            trackList.push(trackID);
            getFeatures(trackID);
        }
        console.log(resultData);
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
function getFeatures(_trackID){
    trID = _trackID;
    url = FEATURES.replace("{{TrackID}}", trID);
    callApi( "GET", url, null, handleFeatureResponse);
}

function handleFeatureResponse(){
    console.log(this.status);
    if ( this.status == 200 ){
        trackID = this.responseURL.split("/").pop();
        var data = JSON.parse(this.responseText);
        console.log(data);
        var danceabilityValue = data.danceability;
        var energyValue = data.energy;
        var keyValue = data.key;
        var modeValue = data.mode;
        var loudnessValue = data.loudness;
        var speechinessValue = data.speechiness;
        var acousticnessValue = data.acousticness;
        var instrumentalnessValue = data.instrumentalness;
        var livenessValue = data.liveness;
        var valenceValue = data.valence;
        var bpm = data.tempo;
        var duration = data.duration_ms;
        resultData[trackID] = 
            {
                "key": keyValue,
                "mode": modeValue,
                "danceability": danceabilityValue,
                "energy": energyValue,
                "valence": valenceValue,
                "loudness": loudnessValue,
                "tempo": bpm,
                "duration": duration
            }
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

// _title, _artist, _artistID, _albumName, _albumID, _trackID, _trackNr, _discNr, _albumImg
function generateResult() {
    // title = _title; 
    // artist = _artist; 
    // artistID = _artistID;
    // albumName = _albumName
    // albumID = _albumID;
    // trackID = _trackID;
    // trackNr =  _trackNr;
    // discNr = _discNr;
    // albumImg = _albumImg;
    
}

$(document).on("click", "#start-search", function(event){
    event.preventDefault();
    getSearchResults();
})
$(document).on("click", "li.search-result" , function() {
    var clickedSong = $(this);
    $('.search-result').removeClass('clicked');
    clickedSong.addClass('clicked');
    console.log('song selected');
})
var keyValueCover;
var modeValueCover;
var danceabilityValueCover;
var energyValueCover;
var loudnessValueCover;
var valenceValueCover;
var tempoValueCover;
var durationValueCover;
var durationCount;
var songID;
var songNr;
var albumID;
var discNr;
$(document).on("click", "li.search-result .play-song" , function() {
    var clickedSong = $('.search-result.clicked');
    var clickID = clickedSong.attr('id');
    console.log(resultData);
    var songFeatures = resultData[clickID];
    keyValueCover = songFeatures.key;
    modeValueCover = songFeatures.mode;
    danceabilityValueCover = songFeatures.danceability;
    energyValueCover = songFeatures.energy;
    console.log(energyValueCover);
    loudnessValueCover = songFeatures.loudness;
    valenceValueCover = songFeatures.valence;
    tempoValueCover = songFeatures.tempo;
    console.log(tempoValueCover);
    durationValueCover = songFeatures.duration;
    durationCount = parseInt(durationValueCover/10000);
    songID = clickedSong.attr('id');
    songNr = clickedSong.attr('trackNr');
    albumID = clickedSong.attr('albumid');
    discNr = clickedSong.attr('discNr');
    happinessValue = $('#happiness').val();
    console.log(albumID);
    nextForm();
    setTimeout(function() {
        getArtist();
        getTrack(songNr, albumID, discNr);
        getAnalysis();
        if (keyValueCover !== null && typeof keyValueCover !== 'undefined') {
            //addToPlaylist(songID);
        }
    }, 1700);
    //playSong(songNr, albumID, discNr);
    console.log('start');
    
})



function addToPlaylist(_songID){
    let body = {};
    var trackID = _songID;
    body.context_uri = "spotify:track:" + trackID;
    body.offset = {};
    url = ADD.replace("{{PlaylistID}}", playlistID);
    callApi( "POST", url + trackID, JSON.stringify(body), handlePlaylistEditResponse );
}

function handlePlaylistEditResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        console.log(data);
    }
    else if ( this.status == 401 ){
        refreshAccessToken()
        console.log('401');
    }
    else {
        //console.log(this.responseText);
        //alert('Song konnte nicht hinzugefügt werden.');
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
        console.log(data);
        var sectionsNr = '<li>Sections: ' + data.sections.length + '</li>';
        var beatsNr = '<li>Beats: ' + data.beats.length + '</li>';
        var trackDuration = '<li>Dauer (in ms): ' + data.track.duration + '</li>';
        var trackAnalysis = '<ul class="analysis-list">' + sectionsNr + beatsNr + trackDuration + '</ul>';
        //$('.analysis-list').remove();
        //$(trackAnalysis).appendTo('#track-metas');
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
    title = $('.search-result.clicked').attr('songtitle');
    url = SONG.replace("{{TrackID}}", trID);
    callApi( "GET", url, null, handleTrackResponse );
}

function handleTrackResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        console.log(data);
        markets = data.available_markets.length;
        var songPreview = data.preview_url;
        var songPosition = data.track_number;
        var songDuration = data.duration_ms;
        //console.log(songPreview);
        if (songPreview !== null) {
            playPreview(songPreview);
        } else {
            console.log('no preview');
            playSong(songPosition, albumID, discNr, songDuration);
        }
        //     playSong(trackNr, albumID, discNr);
        // }
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

function playPreview(_songPreview){
    let preview = _songPreview;
    var audio = new Audio(preview);
    audio.volume = 0;
    setTimeout(function() {
        audio.play();
        $('.progress-bar').addClass('active');
        setTimeout(function() {
            audio.volume = 0.1;
        }, 100)
        setTimeout(function() {
            audio.volume = 0.3;
        }, 300)
        setTimeout(function() {
            audio.volume = 0.8;
        }, 600)
        setTimeout(function() {
            audio.volume = 0.6;
        }, 29400)
        setTimeout(function() {
            audio.volume = 0.3;
        }, 29700)
        setTimeout(function() {
            audio.volume = 0.1;
        }, 29900)
    }, 500)

    setTimeout(function() {
        screenshotTrigger = true;
        $('.canvas-slide').addClass('end-screen');
        startTimer();
    }, 30000)
};

function playSong(_songPosition, _albumID, _discNr, _songDuration){
    //let playlist_id = plID;
    let trackIndex = _songPosition-1;
    let album = _albumID;
    let discNumber = _discNr;
    let trackDuration = _songDuration;
    console.log(trackDuration);
    let body = {};
    if ( album.length > 0 ){
        body.context_uri = "spotify:album:" + album;
    }
    else {
        body.context_uri = "spotify:playlist:" + playlist_id;
        console.log(body.context_uri);
    }
    // if (discNumber > 1) {
    //     console.log('mehr als 2');
    //     body.offset.position = trackIndex;
    // } else {
        
    // }
     body.offset = {};
     body.offset.position_ms = 0;
     body.offset.position = trackIndex;
     console.log(body.offset.position);
    callApi( "PUT", PLAY + "?device_id=" + deviceId(), JSON.stringify(body), handleApiResponse );

    setTimeout(function() {
        $('.progress-bar').addClass('active');
    }, 500)

    setTimeout(function() {
        pause();
        screenshotTrigger = true;
        $('.canvas-slide').addClass('end-screen');
        startTimer();
    }, trackDuration)
}


// function addPlaylist(item){
//     let node = document.createElement("option");
//     node.value = item.id;
//     node.innerHTML = item.name + " (" + item.tracks.total + ")";
//     document.getElementById("playlists").appendChild(node); 
// }

// function removeAllItems( elementId ){
//     let node = document.getElementById(elementId);
//     while (node.firstChild) {
//         node.removeChild(node.firstChild);
//     }
// }

function play(){
    //let playlist_id = document.getElementById("playlists").value;
    let trackindex = _songID;
    let album = _albumID;
    let body = {};
    if ( album.length > 0 ){
        console.log('album');
        body.context_uri = "spotify:album:" + album;
    }
    else{
        body.context_uri = "spotify:playlist:" + playlist_id;
    }
    body.offset = {};
    body.offset.position = trackindex.length > 0 ? Number(trackindex) : 0;
    body.offset.position_ms = 0;
    console.log(body);
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


function currentlyPlaying(){
    callApi( "GET", PLAYER + "?market=US", null, handleCurrentlyPlayingResponse );
}

function handleCurrentlyPlayingResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        //console.log(data);
        if ( data.item != null ){
            //document.getElementById("albumImage").src = data.item.album.images[0].url;
            // document.getElementById("trackTitle").innerHTML = data.item.name;
            // document.getElementById("trackArtist").innerHTML = data.item.artists[0].name;
        }


        if ( data.device != null ){
            // select device
            currentDevice = data.device.id;
            //document.getElementById('devices').value=currentDevice;
        }

        if ( data.context != null ){
            // select playlist
            currentPlaylist = data.context.uri;
            currentPlaylist = currentPlaylist.substring( currentPlaylist.lastIndexOf(":") + 1,  currentPlaylist.length );
            //document.getElementById('playlists').value=currentPlaylist;
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