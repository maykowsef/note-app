import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';
const YouTubePlaylist = () => {
    const [playlistItems, setPlaylistItems] = useState([]);

    useEffect(() => {
      const fetchPlaylistItems = async () => {
        try {
          const apiKey = 'AIzaSyD-TaFjI0WNb32yTDj9pO7i8x78IgXL19I';
          const playlistId = 'PLsMtqZSQIvcbukJycMvS0ch2ZimgHv_Aj';
          const maxResults = 10; // Change this value to adjust the number of videos to display

          const response = await axios.get(
            `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=${maxResults}&key=${apiKey}`
          );

          setPlaylistItems(response.data.items);
        } catch (error) {
          console.error('Error fetching playlist items:', error);
        }
      };

      fetchPlaylistItems();
    }, []);

    return (
      <div>
        <h1>YouTube Playlist</h1>
        <ul>
          {playlistItems.map(item => (

            <li key={item.id}>
                       <ReactPlayer url={`https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`}/>
              <a
                href={`https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.snippet.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  export default YouTubePlaylist;
