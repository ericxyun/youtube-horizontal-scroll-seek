function preventDefault(event) {
  event.preventDefault();
}

function preventDefaultForScrollKeys(event) {
  if (keys[event.keyCode]) {
    preventDefault(event);
    return false;
  }
}

// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
  window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
    get: function () { supportsPassive = true; } 
  }));
} catch(e) {}

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

// call this to Disable
function disableScroll() {
  window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
  window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
  window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
  window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

// call this to Enable
function enableScroll() {
  window.removeEventListener('DOMMouseScroll', preventDefault, false);
  window.removeEventListener(wheelEvent, preventDefault, wheelOpt); 
  window.removeEventListener('touchmove', preventDefault, wheelOpt);
  window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}

function createPlaybackRateDiv() {
  var div = document.createElement("div");
  div.setAttribute("id", 'playbackrate')
  div.style.width = "100%";
  div.style.height = "auto";
  div.style.bottom = "0px";
  div.style.position = "fixed";
  div.style.background = "red";
  div.style.color = "black";
  div.style.textAlign = "center"
  div.style.fontSize = "14px";
  // div.style.opacity = "0.75";
  // div.innerHTML = target.playbackRate;
  var body = document.getElementsByTagName("body")[0]
  body.appendChild(div)
}

function createTimestampDiv() {
  var div = document.createElement("div");
  div.setAttribute("id", 'timestamp')
  div.style.width = "100%";
  div.style.height = "auto";
  div.style.bottom = "0px";
  div.style.position = "fixed";
  div.style.color = "black";
  div.style.textAlign = "center"
  div.style.fontSize = "14px";
  // div.style.opacity = "0.75";
  // div.innerHTML = target.playbackRate;
  var body = document.getElementsByTagName("body")[0]
  body.appendChild(div)
}

function isTimestampDiv() {
  if (document.querySelector("div#timestamp")) 
    return true;
  return false
}

function isPlaybackRateDiv() {
  if (document.querySelector("div#playbackrate")) 
    return true;
  return false
}

var playbackTimeout;
function  setPlaybackTimeout () {
    playbackTimeout = setTimeout(function() {
      document.querySelector("div#playbackrate").remove()
    }, 2500)
}

var timestampTimeout;
function  setTimestampTimeout () {
    timestampTimeout = setTimeout(function() {
      document.querySelector('div#timestamp').remove()
    }, 2500)
}

function clearPlaybackTimeout () {
  clearTimeout(playbackTimeout)
}

function clearTimestampTimeout() {
  clearTimeout(timestampTimeout)
}

function setCurrentPlaybackRate (rate) {
  document.querySelector('div#playbackrate').innerHTML = rate + "x"
}

function setCurrentTimestamp (current, duration) {
  document.querySelector('div#timestamp').innerHTML = current + " / " + duration
}

function setTimestampGradient(percent) {
  // two solid tone using 'linear-gradient' 
  document.querySelector('div#timestamp').style.background = `linear-gradient(to right, red ${percent}%, orange 0`
}
function convertToTimeStamp(seconds) {
  return new Date(seconds * 1000).toISOString().substr(11, 8)

}

// This was for the MacBook. Prevent horizontal scrolling when on the video tag.
// const navigator = window.navigator
// if (navigator.platform === 'MacIntel') {
//   function touchMove (event) {
//     event.preventDefault();
//     enableScroll();
//   }
//   const video = document.querySelector('video')
//   video.addEventListener('mousewheel', touchMove, false)
// }

// Add an area where you can youtube seek
var leftControls = document.querySelector('div.ytp-left-controls')
function addSeekDiv() {
}


// I can't have this here because going from YouTube's main page to a video from there, the page needs to reload. If not, video tag will not be avaiable.
// var video = document.querySelector('video');

// place inside function for realtime update?
var seekSpeed;
document.addEventListener('onload', function(event) {
  chrome.storage.sync.get(['seekSpeed'], function(result) {
    seekSpeed = parseInt(result.seekSpeed)
  })

}, false)

// If shift is pressed where the video tag is, shift + scroll down to fast forward 5 sec, shift + scroll up to back up 5 sec
document.addEventListener('wheel', function(event) {
  chrome.storage.sync.get(['seekSpeed'], function(result) {
    seekSpeed = parseInt(result.seekSpeed)
  })
  var target = event.target
  const nodeName = event.target.nodeName
  var video = document.querySelector('video')

  if (video) {
    target = video
  }
  if (nodeName !== 'VIDEO') {
    enableScroll()
  }

  if (nodeName === 'VIDEO') {
    if (event.shiftKey === true) {
      clearPlaybackTimeout()
      disableScroll()
      if (event.deltaY > 0) {
        // document.dispatchEvent(new KeyboardEvent('keydown',{keyCode: 39})); // Right arrow
        // target.currentTime += 0.5
        target.playbackRate -= 0.25
      } else if (event.deltaY < 0) {
        // document.dispatchEvent(new KeyboardEvent('keydown',{keyCode: 37})); // Left arrow
        // target.currentTime -= 0.5
        target.playbackRate += 0.25
      }
      if (!document.querySelector("div#playbackrate")) {
        createPlaybackRateDiv();
      } 
      setCurrentPlaybackRate(target.playbackRate)
      setPlaybackTimeout()
      enableScroll()
    } else {
      clearTimestampTimeout();
      var duration = target.duration
      var deltaX = parseFloat(event.deltaX)

      // dynamic increment depending on length of video
      // what is the math behind this?
      const divisor = parseFloat(duration) 
      var increment = Math.abs(parseFloat(event.deltaX)) / 16
      if (Math.abs(deltaX) > 5) {
        if (seekSpeed) {
          var increment = Math.abs(deltaX) * divisor / seekSpeed
        }
        else {

          // var increment = Math.abs(deltaX) * divisor / 4500
          // console.log('Didnt work')
          // 
        }
      }
      
      // dynamic increment depending on deltaX mouse movement
      // var increment = Math.abs(parseFloat(event.deltaX)) / 16
      
      var durationTimestamp = convertToTimeStamp(duration)
      disableScroll()
      var deltaY = Math.abs(event.deltaY)
      var deltaYThresholdSeek = 2
      var deltaYThreshold = 10
      if (deltaY <= deltaYThresholdSeek) {

        if (event.deltaX > 0) {
          // document.dispatchEvent(new KeyboardEvent('keydown',{keyCode: 39})); // Right arrow
          target.currentTime += increment
        } else if (event.deltaX < 0) {
          // document.dispatchEvent(new KeyboardEvent('keydown',{keyCode: 37})); // Left arrow
          target.currentTime -= increment
        }
        if (event.deltaX !== 0) {
          var currentTimestamp = convertToTimeStamp(target.currentTime)
          var percentDuration = Math.round((parseInt(target.currentTime) / parseInt(duration)) * 100)
          if (!isTimestampDiv()) {
            createTimestampDiv(percentDuration)
          }
          setTimestampGradient(percentDuration);
          setCurrentTimestamp(currentTimestamp, durationTimestamp);

        }
      }
      setTimestampTimeout() // Need this here so timestampDiv does persist when scrolling down after horizontal scroll
      if (Math.abs(event.deltaY) >= deltaYThreshold) {
        enableScroll()
      } 
    }
  }
}, false)

document.addEventListener('auxclick', function(event) {
  const nodeName = event.target.nodeName
  var video = document.querySelector('video')
  var target = event.target
  if (video) {
    target = video
  }
  if (nodeName === 'VIDEO') {
    if (target.playbackRate !== 1) {
      if (event.button == 1) {
        target.playbackRate = 1;
        setCurrentPlaybackRate(target.playbackRate)
      }
    }
  }
})
