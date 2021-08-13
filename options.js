function save_options() {
  var playbackSpeedChecked = document.getElementById('playbackspeed').checked;
  var seekSpeed = document.getElementById('seekSpeed')
  console.log(seekSpeed.value)
  chrome.storage.sync.set({
    "playbackSpeedChecked": playbackSpeedChecked,
    "seekSpeed": seekSpeed.value
  }, function() {
    var status = document.getElementById('status');
    status.textContent = 'Options saved.'
    setTimeout(function() {
      status.textContent = '';
    }, 1000)

  })
}

function restore_options() {
  chrome.storage.sync.get(['playbackSpeedChecked', 'seekSpeed'], function(result) {
    var playbackSpeed = document.getElementById('playbackspeed')
    var seekSpeed = document.getElementById('seekSpeed')
    console.log(result)
    playbackSpeed.checked = result.playbackSpeedChecked
    seekSpeed.value = result.seekSpeed

  })
}


var seekSlider = document.getElementById('seekSpeed');
function updateSlider() {
    var seekSpeed = document.getElementById('seekSpeed')
    console.log(seekSpeed.value)
    var seekSpeedValue = document.getElementById('seekSpeedValue')
    seekSpeedValue.innerText = seekSpeed.value
}

seekSlider.addEventListener('change', function () {
  updateSlider()
}, true)


document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options)
