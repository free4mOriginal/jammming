// NESTED Fetch (FULL):

let accessToken;
const clientId = '83c23125eaeb42ce9687201dd08929c4';
const redirectUri = 'http://localhost:3000/';
const searchUrl = 'https://api.spotify.com/v1/search?type=track&q=';

const Spotify = {
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
  },

// Requesting a list of tracks from Spotify in response to a search term;
  searchSpotify(term) {
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
        return jsonResponse.tracks.items.map(track => {
          return {
             id: track.id,
             name: track.name,
             artist: track.artists[0].name,
             album: track.album.name,
             uri: track.uri
          };
        })
      }).catch (err => console.log(err));
  },

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

        // Using the returned userId to make a POST request
        // to set the name of the new playlist, and returning playlistId;
        fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          headers: headers,
          method: 'POST',
          body: {
            name: playlistName
          }
        })
          .then(response => {
            console.log(response);
            if (response.ok) {
              return response.json();
            }
            throw new Error('Request failed!');
          }, networkError => console.log(networkError.message))
          .then(jsonResponse => {
            playlistId = jsonResponse.id;

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
          });

      }).catch (err => console.log(err));
  }
};

export default Spotify;

/* FETCH sequent (one after another) FULL:

let accessToken;
const clientId = '83c23125eaeb42ce9687201dd08929c4';
const redirectUri = 'http://localhost:3000/';
const searchUrl = 'https://api.spotify.com/v1/search?type=track&q=';

const Spotify = {
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
  },

// Requesting a list of tracks from Spotify in response to a search term;
  searchSpotify(term) {
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
        return jsonResponse.tracks.items.map(track => {
          return {
             id: track.id,
             name: track.name,
             artist: track.artists[0].name,
             album: track.album.name,
             uri: track.uri
          };
        })
      }).catch (err => console.log(err));
  },

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
        return userId = jsonResponse.id;
    }).catch (err => console.log(err));

    // Using the returned userId to make a POST request
    // to set the name of the new playlist, and returning playlistId;
    fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      headers: headers,
      method: 'POST',
      body: {
        name: playlistName
      }
    })
      .then(response => {
        console.log(response);
        if (response.ok) {
          return response.json();
        }
        throw new Error('Request failed!');
      }, networkError => console.log(networkError.message))
      .then(jsonResponse => {
        return playlistId = jsonResponse.id;
    }).catch (err => console.log(err));

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
        return playlistId = jsonResponse.id;
    }).catch (err => console.log(err));

  }
};

export default Spotify;

*/
