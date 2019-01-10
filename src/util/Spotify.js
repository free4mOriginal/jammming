let accessToken;
const clientId = '83c23125eaeb42ce9687201dd08929c4';
const redirectUri = 'http://localhost:3000/';
const searchUrl = 'https://api.spotify.com/v1/search?type=track&q=';

class Spotify {
  getAccessToken() {
    if(accessToken) {
      return accessToken;
    } else if(window.location.href.match(/access_token=([^&]*)/) && window.location.href.match(/expires_in=([^&]*)/)) {
      accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
      const expiresIn = window.location.href.match(/expires_in=([^&]*)/)[1];

      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');

      return accessToken;
    } else {
      let url = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = url;
    }
  }

// Requesting a list of tracks from Spotify in response to a search term;
  search(term) {
    this.getAccessToken();

    return fetch(`${searchUrl}${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Request failed!');
        }, networkError => console.log(networkError.message))
      .then(jsonResponse => {
        return jsonResponse.map(track => {
          return {
             id: track.id,
             name: track.name,
             artist: track.artists[0].name,
             album: track.album.name,
             uri: track.uri
          };
        })
      }).catch (err => console.log(err));
  }

// Saving the new playlist name and track URIs to user's Spotify account;
  savePlaylist(playlistName, trackURIs) {
    if (!playlistName || trackURIs === []) {
      return;
    };

    let currentToken = accessToken;
    let headers = {
      Authorization: `Bearer ${currentToken}`,
      'Content-Type': 'application/json'
    };
    let userId;
    let playlistId;

    // GETting user's Spotify user name (userId);
    fetch('https://api.spotify.com/v1/me', {
      headers: headers})
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Request failed!');
        }, networkError => console.log(networkError.message))
      .then(jsonResponse => {
        userId = jsonResponse.id;
        return userId;
      }).catch (err => console.log(err));

    // Using the returned userId to make a POST request
    // to set the name of the new playlist, and returning playlistId;
    fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      headers: headers,
      method: 'POST',
      body: {
        name: playlistName,
      }
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Request failed!');
      }, networkError => console.log(networkError.message))
      .then(jsonResponse => {
        playlistId = jsonResponse.id;
        return playlistId;
      });

    // Using the returned userId to make a POST request
    // to set the trackURIs in the new user playlistId;
    fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks `, {
      headers: headers,
      method: 'POST',
      body: {
        uris: trackURIs,
      }
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Request failed!');
      }, networkError => console.log(networkError.message))
      .then(jsonResponse => {
        playlistId = jsonResponse.id;
        return playlistId;
      });
  }
}

export default Spotify;

/*
var regex1 = RegExp('a');
var str1 = 'table football, foosball';
console.log(regex1.exec(str1));
*/

/*
search(term) {
   fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
     headers: {
       Authorization: `Bearer ${this.getUserAccessToken}`
     }
   }).then(response => response.json()).then(jsonResponse => {
     if (jsonResponse.ok) {
       return jsonResponse;
     }
     throw new Error('Request failed');
   }, networkError => console.log(networkError.message));

   const tracks = jsonResponse.map(track => {
     id: track.id,
     name: track.name,
     artist: track.artists[0].name,
     album: track.album.name,
     uri: track.uri
   })
   return tracks;
 },
*/

/*
const tracks = jsonResponse.map(track => {
  return {
     id: track.id,
     name: track.name,
     artist: track.artists[0].name,
     album: track.album.name,
     uri: track.uri
  };
 })
*/

/*
let userToken = '';
const clientId = '****************';
const redirectUri = 'http://localhost:3000/';
const searchUrl = 'https://api.spotify.com/v1/search?q=';

const Spotify = {
  getUserToken() {
    if(userToken !== '') {
      return userToken;
    } else if(window.location.href.includes('access_token=') && window.location.href.includes('expires_in=')) {
      const url = window.location.href;
      const tokenExpiration = url.match(/expires_in=([^&]*)/);
      userToken = url.match(/access_token=([^&]*)/);

      window.setTimeout(() => userToken = '', tokenExpiration * 1000);
      window.history.pushState('Access Token', null, '/');
    } else {
      window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
    }
  },

  search(input, type) {
    this.getUserToken();

    return fetch(`${searchUrl}${input}&type=${type}`, {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    })
*/
