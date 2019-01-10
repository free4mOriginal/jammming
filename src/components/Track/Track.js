import React from 'react';
import './Track.css';

class Track extends React.Component {
  constructor(props) {
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }

// This method returns the Plus or Minus sign anchor tag in the listings
// depending on whether the variable isRemoval had a value of
// true (coming from the Playlist.js)
// or false (coming from the SearchResults.js)
  renderPlusMinus() {
    if (this.props.isRemoval) {
      return <a className="Track-action" onClick={this.removeTrack}> - </a>;
    } else {
      return <a className="Track-action" onClick={this.addTrack}> + </a>;
    }
  }

// passes the track from the this.props object to the addTrack() method
// in the App.js through props of TrackList.js and SearchResults.js;
  addTrack() {
    this.props.onAdd(this.props.track);
  }

// passes the track from the this.props object to the removeTrack() method
// in the App.js through props of TrackList.js and Playlist.js;
  removeTrack() {
    this.props.onRemove(this.props.track);
  }

// this renders each track with name, artist, album,
// and a Plus of Minus sign next to it;
  render() {
    return(
      <div className="Track">
        <div className="Track-information">
          <h3>{this.props.track.name}</h3>
          <p>{this.props.track.artist} | {this.props.track.album}</p>
        </div>
        {this.renderPlusMinus()}
      </div>
    );
  }
}

export default Track;
