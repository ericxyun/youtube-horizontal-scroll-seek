- Getting Netflix to work
    - https://stackoverflow.com/questions/61963921/seek-to-a-point-in-a-netflix-video
    - ```
      const videoPlayer = netflix.appContext.state.playerApp.getAPI().videoPlayer;
      const player=videoPlayer.getVideoPlayerBySessionId(videoPlayer.getAllPlayerSessionIds()[0]);
      player.seek(1091243)

      ```
