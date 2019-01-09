import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [{
        name: 'Search Result track name',
        artist: 'Search Result artist',
        album: 'Search Result album',
        id: 'Search Result id',
        uri: '01'
      },
      {
        name: 'Search Result2 track name',
        artist: 'Search Result2 artist',
        album: 'Search Result2 album',
        id: 'Search Result2 id',
        uri: '02'
      }
    ],
      playlistName: 'First Test',
      playlistTracks: [{
        name: 'Playlist track name',
        artist: 'Playlist artist',
        album: 'Playlist album',
        id: 'Playlist id',
        uri: '034'
      }]
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  search(term) {
    console.log(term);
  }
  /*
  searchYelp(term, location, sortBy) {
    Yelp.searchYelp(term, location, sortBy).then(businesses => {
      this.setState({businesses: businesses});
    });
  }
   */

  savePlaylist() {
    let trackURIs = [];
    for (let i=0; i<this.state.playlistTracks.length; i++) {
      trackURIs.push(this.state.playlistTracks[i].uri);
    }
    console.log(trackURIs);
  }

  updatePlaylistName(name) {
    this.setState({
      playlistName: name
    });
  }

  addTrack(track) {
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    this.setState({playlistTracks: [...this.state.playlistTracks, track]});
    // this.setState({playlistTracks: this.state.playlistTracks.push(track)});
  }

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
