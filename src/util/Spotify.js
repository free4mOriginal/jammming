let userToken;
const clientId = '83c23125eaeb42ce9687201dd08929c4';
const redirectUri = 'http://localhost:3000/';
const searchUrl = 'https://api.spotify.com/v1/search?q=';

class Spotify = {
  getAccessToken() {
    if(accessToken) {
      return accessToken;
    } else if(window.location.href.match(/access_token=([^&]*)/) && window.location.href.match(/expires_in=([^&]*)/)) {
      accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
      expiresIn = window.location.href.match(/expires_in=([^&]*)/)[1];

      window.setTimeout(() => accessToken = '', expiresIn*1000);
      window.history.pushState('Access Token', null, '/');

      return accessToken;
    } else {
      let url = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      window.location = url;
    }
  },

  search(input, type) {
    this.getUserToken();
    return fetch(`${searchUrl}${input}&type=${type}`, {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    })
  }
}

export default Spotify;

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
