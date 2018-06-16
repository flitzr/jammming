let accessToken = '';
const clientId = '4cf0726ba34a4d358e1e60432541ac4d';
const redirectURI = 'http://localhost:3000/';
let userId = '';
let playlistId = '';

const Spotify = {
  getAccessToken() {
    if (!accessToken === '') {
      console.log('token from variable');
      return accessToken;
    } else if (window.location.href.match(/access_token=([^&]*)/) && window.location.href.match(/expires_in=([^&]*)/)) {
      console.log('token from URL');
      accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
      let expiresIn = window.location.href.match(/expires_in=([^&]*)/)[1];
      window.setTimeout( () => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      console.log('redirect');
      window.location = 'https://accounts.spotify.com/authorize?client_id='
      + clientId + '&response_type=token&scope=playlist-modify-public&redirect_uri='
      + redirectURI;
    }
  },

  search(term) {
    /* Spotify.getAccessToken(); */
    return fetch(`https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: 'Bearer ' + Spotify.getAccessToken(),
        'Content-Type': 'application/json'
      }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if(jsonResponse.tracks) {
        return jsonResponse.tracks.items.map(track => {
          return {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          }
        });
      }
      return [];
    });
  },

  savePlaylist(playlistName, trackURIs) {
    if(playlistName === '' || trackURIs === '') {
      return;
    } else {
      /* Code that returns the user's Spotify username */
      let headers = {
        Authorization: 'Bearer ' + Spotify.getAccessToken()
      };
      return fetch('https://api.spotify.com/v1/me', {headers: headers}).then(response => {
        return response.json();
      }).then(jsonResponse => {
        userId = jsonResponse.id;
      }).then(createPlaylist => {
        /* Code that creates a new playlist */
        let urlCreatePlaylist = `https://api.spotify.com/v1/users/${userId}/playlists`;
        let dataCreatePlaylist = {name: playlistName, public: false};
        return fetch(urlCreatePlaylist, {
          method: 'POST',
          body: JSON.stringify(dataCreatePlaylist),
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
          }
        });
      }).then(response => {
        return response.json();
      }).catch(error => console.log('Create playlist error: ', error))
      .then(jsonResponse => {
        playlistId = jsonResponse.id;
      }).then(addTracks => {
        /* Code that adds tracks to the user's playlist */
        let urlAddTracks = `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`;
        let dataAddTracks = {uris: trackURIs};
        fetch(urlAddTracks, {
          method: 'POST',
          body: JSON.stringify(dataAddTracks),
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
          }
        })
      }).then(response => {
        return response.json();
      }).catch(error => console.log('Add tracks error: ', error))
      .then(jsonResponse => {
        let snapshotId = jsonResponse.snapshot_id;
        userId = '';
        playlistId = '';
      });
    }
  }
};

export default Spotify;
