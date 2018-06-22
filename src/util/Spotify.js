let accessToken = '';
const clientId = '4cf0726ba34a4d358e1e60432541ac4d';
const redirectURI = 'http://localhost:3000/';

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
        Authorization: 'Bearer ' + accessToken,
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
    if(!playlistName || !trackURIs.length) {
      /* if the playlistName (string) or trackURIs (array) parameters are empty, return */
      return;
    }

    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: 'Bearer ' + accessToken };
    let userId;

    return fetch('https://api.spotify.com/v1/me', {headers: headers}
    ).then(response => response.json()
    ).then(jsonResponse => {
      userId = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({name: playlistName, public: false})
      }).then(response => response.json()
      ).then(jsonResponse => {
        const playlistId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({uris: trackURIs})
        });
      });
    });
  }

};

export default Spotify;
