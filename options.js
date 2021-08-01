function save_options() {
  var playbackSpeedChecked = document.getElementById('playbackspeed').checked;
  chrome.storage.sync.set({
    playbackSpeedChecked: playbackSpeedChecked
  }, function() {
    var status = document.getElementById('status');
    status.textContent = 'Options saved.'
    setTimeout(function() {
      status.textContent = '';
    }, 1000)

  })
}

function restore_options() {
  chrome.storage.sync.get(['playbackSpeedChecked'], function(result) {
    var playbackSpeed = document.getElementById('playbackspeed')
    console.log(result)
    playbackSpeed.checked = result.playbackSpeedChecked
    
  })
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options)
