import React from 'react';
import './TrackList.css';
import Track from '../Track/Track';

// this .map() method calls on <Track> Component every time
// to render the individual tracks in succession
class TrackList extends React.Component {
  render() {
    return(
      <div className="TrackList">
          {this.props.tracks.map(track => {
            return <Track
              key={track.id}
              track={track}
              onAdd={this.props.onAdd}
              onRemove={this.props.onRemove}
              isRemoval={this.props.isRemoval}
              />
          })}
      </div>
    );
  }
}

export default TrackList;
