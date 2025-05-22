// Inicializa el fondo animado de nubes usando VANTA.CLOUDS
VANTA.CLOUDS({
  el: "#clouds-bg",
  mouseControls: false,
  touchControls: false,
  gyroControls: false,
  minHeight: 200.00,
  minWidth: 200.00,
  skyColor: 0x68b8d7,
  cloudColor: 0xadc1de,
  cloudShadowColor: 0x6b7f91,
  sunColor: 0xc56d19,
  sunGlareColor: 0xff6633,
  sunlightColor: 0xc07033,
  speed: 1
});

// --- Podcast Data ---
const podcasts = [
  {
    title: 'Rescate',
    description: 'Recuperar el equilibrio emocional y mental.',
    cover: 'podcast1.jpg',
    audio: 'rescate_aeromexico.mp3'
  },
  {
    title: 'Empodérate',
    description: 'Fortalecer la confianza y el poder personal.',
    cover: 'podcast2.jpg',
    audio: 'audio2.mp3'
  },
  {
    title: 'Estrés',
    description: 'Atenuar la tensión física y el estrés.',
    cover: 'podcast3.jpg',
    audio: 'estres_aeromexico.mp3'
  },
  {
    title: 'Dormir bien',
    description: 'Inducir el estado natural del sueño.',
    cover: 'podcast4.jpg',
    audio: 'audio4.mp3'
  },
  {
    title: 'Malestares físicos',
    description: 'Aliviar dolores y tensiones corporales.',
    cover: 'podcast5.jpg',
    audio: 'audio5.mp3'
  }
];

let selectedPodcast = 0;

function formatTime(seconds) {
  const min = String(Math.floor(seconds / 60)).padStart(2, '0');
  const sec = String(seconds % 60).padStart(2, '0');
  return `${min}:${sec}`;
}

function renderPodcastMenu() {
  const menu = document.querySelector('.podcast-menu');
  menu.innerHTML = '';
  podcasts.forEach((podcast, idx) => {
    const item = document.createElement('div');
    item.className = 'podcast-menu-item' + (idx === selectedPodcast ? ' selected' : '');
    item.innerHTML = `
      <div class="podcast-menu-title">${podcast.title}</div>
    `;
    item.addEventListener('click', () => {
      selectedPodcast = idx;
      updatePodcastCard();
      renderPodcastMenu();
    });
    menu.appendChild(item);
  });
}

function updatePodcastCard() {
  const podcast = podcasts[selectedPodcast];
  document.getElementById('podcast-title').textContent = podcast.title;
  document.getElementById('podcast-description').innerHTML = podcast.description;
  // Limpiar el tiempo y slider hasta que se cargue el audio
  document.getElementById('audio-time').textContent = '00:00';
  document.getElementById('audio-slider').value = 0;
  // Actualizar la fuente del audio
  const audioPlayer = document.getElementById('audio-player');
  if (audioPlayer) {
    audioPlayer.src = podcast.audio;
    audioPlayer.currentTime = 0;
    audioPlayer.pause();
  }
}

// Control de reproducción
function setupAudioControls() {
  const audioPlayer = document.getElementById('audio-player');
  const playBtn = document.getElementById('btn-play');
  const slider = document.getElementById('audio-slider');
  const timeLabel = document.getElementById('audio-time');

  if (!audioPlayer || !playBtn || !slider || !timeLabel) return;

  // Cambia el ícono del botón play/pause
  function updatePlayButton() {
    playBtn.innerHTML = audioPlayer.paused ? '&#9654;' : '&#10073;&#10073;';
  }

  // Actualiza el slider y el tiempo mostrado
  function updateProgress() {
    slider.max = Math.floor(audioPlayer.duration) || slider.max;
    slider.value = Math.floor(audioPlayer.currentTime);
    timeLabel.textContent = formatTime(Math.floor(audioPlayer.currentTime));
  }

  // Play/Pause
  playBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
      audioPlayer.play();
    } else {
      audioPlayer.pause();
    }
  });

  // Actualizar ícono al reproducir/pausar
  audioPlayer.addEventListener('play', updatePlayButton);
  audioPlayer.addEventListener('pause', updatePlayButton);

  // Actualizar barra de progreso y tiempo
  audioPlayer.addEventListener('timeupdate', updateProgress);
  audioPlayer.addEventListener('loadedmetadata', () => {
    slider.max = Math.floor(audioPlayer.duration);
    updateProgress();
  });

  // Permitir buscar en el audio
  slider.addEventListener('input', () => {
    audioPlayer.currentTime = slider.value;
    updateProgress();
  });

  // Inicializar estado
  updatePlayButton();
  updateProgress();
}

document.addEventListener('DOMContentLoaded', () => {
  renderPodcastMenu();
  updatePodcastCard();
  setupAudioControls();
});
