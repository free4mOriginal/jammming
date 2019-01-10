import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  search(term) {
    Spotify.searchSpotify(term).then(searchResults => {
      this.setState({searchResults: searchResults});
    });
  }

// this method creates an array of track URIs;
  savePlaylist() {
    let trackURIs = [];
    for (let i=0; i<this.state.playlistTracks.length; i++) {
      trackURIs.push(this.state.playlistTracks[i].uri);
    }
    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState({playlistName: 'New Playlist'});
  }

// this method updates the state of the playlistName;
  updatePlaylistName(name) {
    this.setState({
      playlistName: name
    });
  }

// this method adds a selected track to the playlistTracks state
// after checking whether it already exists there;
  addTrack(track) {
    // if it finds the track against the saved tracks then do nothing;
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    this.setState({playlistTracks: [...this.state.playlistTracks, track]});
    // a different way to write this line, which returns the correct array, but gives a Type Error in TrackList.js;
    // this.setState({playlistTracks: this.state.playlistTracks.push(track)});
  }

// this method removes a track from the playlistTracks state
// by filtering the track out of the playlistTracks array;
  removeTrack(track) {
    this.setState({playlistTracks: this.state.playlistTracks.filter(item => item.id !== track.id)});
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar
            onSearch={this.search}
          />
          <div className="App-playlist">
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}
            />
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
