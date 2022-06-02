// function refreshPlaylists(){
//     callApi( "GET", PLAYLISTS, null, handlePlaylistsResponse );
// }

// function handlePlaylistsResponse(){
//     if ( this.status == 200 ){
//         var data = JSON.parse(this.responseText);
//         //console.log(data.items);
//         //removeAllItems( "playlists" );
//         data.items.forEach(item => addPlaylist(item));
//         document.getElementById('playlists').value = currentPlaylist;
//         var coverList = document.createElement("ul");
//         data.items.forEach(function (playlist) {
//             var itemID = playlist.id;
//             var childElement = '<div class="cover-container" value="' + itemID + '" ><div class="cover-image" alt="Playlist Cover" style=background-image:url("' + playlist.images[0].url + '");></div></div>';
//             $(childElement).appendTo('#playlist-covers');
//         });
//         handleCoverSizes();
//     }
//     else if ( this.status == 401 ){
//         refreshAccessToken()
//     }
//     else {
//         console.log(this.responseText);
//         alert(this.responseText);
//     }
// }

// function handleCoverSizes() {
//     var cover = $('.cover-image');
//     var coverWidth = cover.outerWidth();
//     cover.each(function(index) {
//         $(this).css('height', coverWidth + 'px');
//     });
// }

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

// function addTrack(item, index){
//     var trackID = item.track.id;
//     var artistID = item.track.artists[0].id;
//     var artistName = item.track.artists[0].name;
//     fetchArtist(artistID);
//     var track = '<li class="song-item" id="' + trackID + '" value="' + index + '" availability="' + item.track.available_markets.length + '" album="' + item.track.album.name + '" duration="' + item.track.duration_ms + '" popularity="' + item.track.popularity + '"><span class="song-title">' + item.track.name + '</span><br/><span class="song-artist" artist-id="' + artistID + '">' + artistName  + '</span></li>';
//     $(track).appendTo('#track-list');
// }

function getArtist() {
    var artist_id = $('.search-result.clicked').attr('artistid');
    console.log(artist_id);
    if ( artist_id.length > 0 ){
        url = ARTIST.replace("{{ArtistID}}", artist_id);
        callApi( "GET", url, null, handleArtistResponse );
    }
}

function handleArtistResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        var genre = '<ul><li>Genres: ' + data.genres + '</li></ul>';

        $(genre).appendTo('#track-metas');
        console.log(genre);
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
    var trID = $('.search-result.clicked').attr('id');
    url = FEATURES.replace("{{TrackID}}", trID);
    callApi( "GET", url, null, handleFeatureResponse );
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
        var resultArray = data.tracks.items;
        console.log(resultArray);
        var resultTarget = $('#search-results');
        $('.search-result').each(function(index) {
            $(this).remove();
        });
        for (i = 0; i < resultArray.length; i++) {
            var currentObject = resultArray[i];
            var title = currentObject.name;
            var artist = currentObject.artists[0].name;
            var artistID = currentObject.artists[0].id;
            var trackID = currentObject.id;
            var resultElement = '<li class="search-result" artistid="' + artistID + '" id="' + trackID + '">' + title + ' - ' + artist + '</li>';
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


setTimeout(function() { 
    $("#search-results").on("click", ".search-result", function(){
        var clickedSong = $(this);
        var songID = $(this).attr('id');
        $('.search-result').removeClass('clicked');
        clickedSong.addClass('clicked');
        getFeatures();
        getAnalysis();
        getArtist();
    });
}, 1000);

function handleFeatureResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        var danceabilityValue = '<li>Danceability: ' + data.danceability + '</li>';
        var energyValue = '<li>Energy: ' + data.energy + '</li>';
        var keyValue = '<li>Key: ' + data.key + '</li>';
        var loudnessValue = '<li>Loudness: ' + data.loudness + '</li>';
        var speechinessValue = '<li>Speechiness: ' + data.speechiness + '</li>';
        var acousticnessValue = '<li>Acousticness: ' + data.acousticness + '</li>';
        var instrumentalnessValue = '<li>Instrumentalness: ' + data.instrumentalness + '</li>';
        var livenessValue = '<li>Liveness: ' + data.liveness + '</li>';
        var valenceValue = '<li>Valence: ' + data.valence + '</li>';
        var bpm = '<li>Geschwindigkeit (in bpm): ' + data.tempo + '</li>';
        var trackMetas = '<ul class="meta-list">' + danceabilityValue + energyValue + keyValue + loudnessValue + speechinessValue + acousticnessValue + instrumentalnessValue + livenessValue + valenceValue + bpm + '</ul>'
        console.log(data);
        $('.meta-list').remove();
        $(trackMetas).appendTo('#track-metas');
        
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
    var trID = $('.search-result.clicked').attr('id');
    url = ANALYSIS.replace("{{TrackID}}", trID);
    callApi( "GET", url, null, handleAnalysisResponse );
}

function handleAnalysisResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
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
            document.getElementById("albumImage").src = data.item.album.images[0].url;
            document.getElementById("trackTitle").innerHTML = data.item.name;
            document.getElementById("trackArtist").innerHTML = data.item.artists[0].name;
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

// function refreshRadioButtons(){
//     let data = localStorage.getItem("radio_button");
//     if ( data != null){
//         radioButtons = JSON.parse(data);
//         if ( Array.isArray(radioButtons) ){
//             //removeAllItems("radioButtons");
//             radioButtons.forEach( (item, index) => addRadioButton(item, index));
//         }
//     }
// }

// function onRadioButton( deviceId, playlistId ){
//     let body = {};
//     body.context_uri = "spotify:playlist:" + playlistId;
//     body.offset = {};
//     body.offset.position = 0;
//     body.offset.position_ms = 0;
//     callApi( "PUT", PLAY + "?device_id=" + deviceId, JSON.stringify(body), handleApiResponse );
//     //callApi( "PUT", SHUFFLE + "?state=true&device_id=" + deviceId, null, handleApiResponse );
// }

// function addRadioButton(item, index){
//     let node = document.createElement("button");
//     node.className = "btn btn-primary m-2";
//     node.innerText = index;
//     node.onclick = function() { onRadioButton( item.deviceId, item.playlistId ) };
//     document.getElementById("radioButtons").appendChild(node);
// }