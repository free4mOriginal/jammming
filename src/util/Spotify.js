let accessToken;
const clientId = '83c23125eaeb42ce9687201dd08929c4';
const redirectUri = 'http://localhost:3000/';

const Spotify = {
  // Method gets and checks valid token and expiration from Spotify;
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]) * 1000;

      window.setTimeout(() => accessToken = '', expiresIn);
      window.history.pushState('Access Token', null, '/'); // This clears the parameters, allowing us to grab a new access token when it expires.
      return accessToken;
    } else {
      let url = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = url;
    }
},

// Requesting a list of tracks from Spotify in response to a search term;
  searchSpotify(term) {
  const access = this.getAccessToken();

  return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
    headers: {
      Authorization: `Bearer ${access}`
    }
  }).then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Request failed!');
      }, networkError => console.log(networkError.message))
    .then(jsonResponse => {
      if (jsonResponse.tracks) {
        return jsonResponse.tracks.items.map(track => ({
             id: track.id,
             name: track.name,
             artist: track.artists[0].name,
             album: track.album.name,
             uri: track.uri
            }));
      } else {
        return [];
      }
    });
},

// Saving the new playlist name and track URIs to user's Spotify account;
  savePlaylist(playlistName, trackURIs) {
    if (!playlistName || !trackURIs.length) {
      return;
    }

    let currentToken = this.getAccessToken();
    let headers = {
      Authorization: `Bearer ${currentToken}`,
      'Content-Type': 'application/json'
    };
    let userId;
    let playlistId;

    // GETting user's Spotify user name (userId);
    return fetch('https://api.spotify.com/v1/me', {headers: headers})
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Request failed!');
        }, networkError => console.log(networkError.message))
      .then(jsonResponse => {
        userId = jsonResponse.id;

        // Using the returned userId to POST the name of the new playlist and return playlistId;
        fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({name: playlistName})
        }).then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Request failed!');
          }, networkError => console.log(networkError.message))
          .then(jsonResponse => {
            playlistId = jsonResponse.id;

          // Using the returned userId to POST trackURIs to the new user playlistId;
          fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks `, {
              headers: headers,
              method: 'POST',
              body: JSON.stringify({uris: trackURIs})});
          })
    })
  }
};

export default Spotify;
