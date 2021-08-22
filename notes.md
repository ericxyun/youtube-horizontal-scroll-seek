- Getting Netflix to work
    ```
    const videoPlayer = netflix.appContext.state.playerApp.getAPI().videoPlayer;
    const player=videoPlayer.getVideoPlayerBySessionId(videoPlayer.getAllPlayerSessionIds()[0]);
    player.seek(1091243)
      ```
    - https://stackoverflow.com/questions/61963921/seek-to-a-point-in-a-netflix-video

- Create floating button to take you down to comment section


- Element traverse for video tag Issues
  - Combine video check into a function:
    - There are currently two areas that need to be consolidated.
  - General
    - Will not work for last item of node (check content.js:181)
  - metacafe.com
    - Not working on direct sibling