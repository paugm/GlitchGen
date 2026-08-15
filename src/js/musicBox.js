const MELODIES = {
  starwars:
    "G4,0.4,G4,0.4,G4,0.4,E5,0.8,C5,0.8,G5,0.8,F5,0.4,E5,0.4,D5,0.4,C6,1.2,G5,0.8,F5,0.4,E5,0.4,D5,0.4,C6,1.2,G5,0.8,F5,0.4,E5,0.4,F5,0.4,D5,1.2",
  harrypotter:
    "B3,0.4,E4,0.6,G4,0.4,F#4,0.8,E4,1.2,B4,0.4,A4,0.6,F#4,1.4,E4,0.4,G4,0.4,F#4,0.8,D4,0.8,F4,0.4,B3,1.4",
  jamesbond:
    "E4,0.1,F#4,0.2,F#4,0.2,F#4,0.2,F#4,0.4,F#4,0.2,F#4,0.2,F#4,0.2,G#4,0.2,G#4,0.2,G#4,0.2,G#4,0.4,G#4,0.2,G#4,0.2,G#4,0.2,F#4,0.8,F#4,0.2,F#4,0.2,F#4,0.4,F#4,0.2,F#4,0.2,E4,0.8,E4,0.2,E4,0.2,E4,0.4,E4,0.2,E4,0.2",
  indianajones:
    "E4,0.4,F4,0.4,G4,0.4,C5,1.2,B4,0.4,A4,0.4,G4,0.4,F4,0.4,E4,0.4,C4,1.2,E4,0.4,F4,0.4,G4,0.4,C5,1.2,B4,0.4,A4,0.4,G4,0.4,F4,0.4,E4,0.4,C4,1.2",
  jurassicpark:
    "C4,0.8,D4,0.4,C4,0.4,G4,1.4,F4,1.4,C4,0.8,D4,0.4,C4,0.4,A#4,1.4,A4,0.8,G4,0.8,C5,1.4,C4,1.4",
  pirates:
    "D4,0.4,D5,0.4,D5,0.4,G4,0.8,A4,0.8,B4,0.4,C5,0.4,D5,0.4,E5,0.4,F#5,0.8,G5,0.8,A5,0.8,D5,0.8,C5,0.8,B4,0.4,A4,0.4",
  mario:
    "E5,0.3,E5,0.3,0,0.3,E5,0.3,0,0.3,C5,0.3,E5,0.3,G5,0.6,0,0.6,G4,0.3,0,0.3,C5,0.3,G4,0.3,E4,0.3,0,0.3,A4,0.3,B4,0.3,Bb4,0.3,A4,0.6",
  zelda:
    "G4,0.4,A4,0.4,B4,0.4,C5,1.2,D5,0.4,E5,0.4,F5,0.4,G5,1.2,G5,0.4,F5,0.4,E5,0.4,D5,0.4,C5,0.4,B4,0.4,A4,0.4,G4,1.4",
  tetris:
    "E5,0.3,B4,0.3,C5,0.3,D5,0.3,C5,0.3,B4,0.3,A4,0.3,A4,0.3,C5,0.3,E5,0.3,D5,0.3,C5,0.3,B4,0.3,C5,0.3,D5,0.3,E5,0.3,C5,0.3,A4,0.3,A4,0.3",
};

const NOTE_OFFSETS = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

/**
 * Converts a note token like C4, F#5, or Bb4 into Hz. "0" is a rest.
 * @param {string} note
 * @returns {number|null}
 */
function noteToFreq(note) {
  if (!note || note === "0") return null;
  const match = String(note)
    .trim()
    .match(/^([A-G])([#b]?)(\d)$/i);
  if (!match) return null;
  const letter = match[1].toUpperCase();
  const accidental = match[2];
  const octave = parseInt(match[3], 10);
  let semitone = NOTE_OFFSETS[letter];
  if (semitone === undefined) return null;
  if (accidental === "#") semitone += 1;
  if (accidental === "b") semitone -= 1;
  const midi = (octave + 1) * 12 + semitone;
  return 440 * 2 ** ((midi - 69) / 12);
}

/**
 * Plays a comma-separated note,duration melody. Returns duration in seconds.
 * @param {string} notes
 * @returns {{ stop: () => void, duration: number }}
 */
function playMelody(notes) {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioCtx();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.type = "sine";
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);

  let time = audioContext.currentTime;
  const tokens = String(notes).split(",");
  for (let i = 0; i < tokens.length; i += 2) {
    const freq = noteToFreq(tokens[i]);
    const duration = parseFloat(tokens[i + 1]);
    if (!Number.isFinite(duration) || duration <= 0) continue;
    if (freq) {
      oscillator.frequency.setValueAtTime(freq, time);
      gainNode.gain.setValueAtTime(0, time);
      gainNode.gain.linearRampToValueAtTime(0.5, time + 0.01);
      const release = Math.max(time + duration - 0.01, time + 0.02);
      gainNode.gain.linearRampToValueAtTime(0, release);
    }
    time += duration;
  }

  oscillator.start();
  oscillator.stop(time);
  const duration = Math.max(time - audioContext.currentTime, 0);
  return {
    duration,
    stop: () => {
      try {
        oscillator.stop();
      } catch {
        /* already stopped */
      }
      audioContext.close();
    },
  };
}

function setPlayLabel(button, playing) {
  button.innerHTML = playing
    ? '<i class="fas fa-stop mr-2" aria-hidden="true"></i>Stop'
    : '<i class="fas fa-play mr-2" aria-hidden="true"></i>Play';
}

/**
 * Binds Web Audio playback on a Music Box element (innerHTML scripts never run).
 * @param {HTMLElement} element
 */
export function bindMusicBox(element) {
  const playButton = element.querySelector(".play-button-trigger");
  if (!playButton || playButton.dataset.musicBound === "1") return;
  playButton.dataset.musicBound = "1";
  playButton.type = "button";

  let isPlaying = false;
  let current = null;
  let doneTimer = 0;

  const stop = () => {
    if (current) current.stop();
    current = null;
    isPlaying = false;
    window.clearTimeout(doneTimer);
    setPlayLabel(playButton, false);
  };

  playButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (isPlaying) {
      stop();
      return;
    }
    const song = playButton.getAttribute("data-song");
    const customMelody = playButton.getAttribute("data-custom-melody");
    const notes =
      (song && MELODIES[song]) || customMelody || "";
    if (!notes) {
      window.alert("No song selected. Please configure the Music Box.");
      return;
    }
    current = playMelody(notes);
    isPlaying = true;
    setPlayLabel(playButton, true);
    doneTimer = window.setTimeout(stop, current.duration * 1000);
  });
}

/**
 * Inline player for exported HTML. Event-delegated so it survives copy/paste.
 * @returns {string}
 */
export function getMusicBoxExportScript() {
  const payload = JSON.stringify(MELODIES);
  return `<script>
(function () {
  var MELODIES = ${payload};
  var NOTE_OFFSETS = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  var current = null;
  var playingBtn = null;
  function noteToFreq(note) {
    if (!note || note === "0") return null;
    var match = String(note).trim().match(/^([A-G])([#b]?)(\\d)$/i);
    if (!match) return null;
    var letter = match[1].toUpperCase();
    var accidental = match[2];
    var octave = parseInt(match[3], 10);
    var semitone = NOTE_OFFSETS[letter];
    if (semitone === undefined) return null;
    if (accidental === "#") semitone += 1;
    if (accidental === "b") semitone -= 1;
    return 440 * Math.pow(2, ((octave + 1) * 12 + semitone - 69) / 12);
  }
  function playMelody(notes) {
    var Ctx = window.AudioContext || window.webkitAudioContext;
    var ctx = new Ctx();
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    gain.gain.setValueAtTime(0, ctx.currentTime);
    var time = ctx.currentTime;
    var tokens = String(notes).split(",");
    for (var i = 0; i < tokens.length; i += 2) {
      var freq = noteToFreq(tokens[i]);
      var dur = parseFloat(tokens[i + 1]);
      if (!isFinite(dur) || dur <= 0) continue;
      if (freq) {
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.5, time + 0.01);
        gain.gain.linearRampToValueAtTime(0, Math.max(time + dur - 0.01, time + 0.02));
      }
      time += dur;
    }
    osc.start();
    osc.stop(time);
    return {
      duration: Math.max(time - ctx.currentTime, 0),
      stop: function () {
        try { osc.stop(); } catch (e) {}
        ctx.close();
      }
    };
  }
  function label(btn, playing) {
    btn.innerHTML = playing
      ? '<i class="fas fa-stop mr-2"></i>Stop'
      : '<i class="fas fa-play mr-2"></i>Play';
  }
  document.addEventListener("click", function (event) {
    var btn = event.target.closest && event.target.closest(".play-button-trigger");
    if (!btn) return;
    event.preventDefault();
    if (playingBtn && playingBtn !== btn) {
      current && current.stop();
      label(playingBtn, false);
      current = null;
      playingBtn = null;
    }
    if (playingBtn === btn) {
      current && current.stop();
      label(btn, false);
      current = null;
      playingBtn = null;
      return;
    }
    var song = btn.getAttribute("data-song");
    var custom = btn.getAttribute("data-custom-melody");
    var notes = (song && MELODIES[song]) || custom || "";
    if (!notes) return;
    current = playMelody(notes);
    playingBtn = btn;
    label(btn, true);
    setTimeout(function () {
      if (playingBtn === btn) {
        current && current.stop();
        label(btn, false);
        current = null;
        playingBtn = null;
      }
    }, current.duration * 1000);
  });
})();
</script>`;
}
