import React from 'react';

//shouldve been in display folder, dont wanna move it at this point

function Spotify(props) {
  if (!props.songs.length) {
    return (
      <div id="spotify">
        Sorry, looks like spotify is not available in this country :(
      </div>
    );
  }
  const arrayOfSongs = [];
  for (let i = 0; i < 10; i += 1) {
    arrayOfSongs.push(
      <div className="song" key={'song' + i}>
        {props.songs[i].name} by {props.songs[i].by}
        <br></br>
        <a target="blank" href={props.songs[i].url}>
          Listen
        </a>
      </div>
    );
  }

  return (
    <div>
      <h2>Spotify Top Chart</h2>
      <div id="spotify">{arrayOfSongs}</div>;
    </div>
  );
}

export default Spotify;
