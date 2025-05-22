// Inicializa el fondo animado de nubes usando VANTA.CLOUDS
VANTA.CLOUDS({
  el: "#clouds-bg",
  mouseControls: false,
  touchControls: false,
  gyroControls: false,
  minHeight: 150.00,
  minWidth: 150.00,
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
    objetivo: 'Primeros auxilios para recobrar la tranquilidad.',
    otrosUsos: [
      'Disminuir miedo a volar',
      'Disminuir miedos, ansiedad, tristeza, etc.',
      'Autoayuda inmediata',
      'Recuperar confianza y seguridad'
    ],
    cover: 'podcast1.jpg',
    audio: 'tecnicas/PAS_en_Aeromexico_Rescate.mp3'
  },
  {
    title: 'Empodérate',
    objetivo: 'Lograr claridad para iniciar y mantener el cambio.',
    otrosUsos: [
      'Desarrollar autoconfianza',
      'Poder lograr las metas',
      'Acabar con las excusas'
    ],
    cover: 'podcast2.jpg',
    audio: 'tecnicas/PAS_en_Aeromexico_Empoderate.mp3'
  },
  {
    title: 'Estrés',
    objetivo: 'Atenuar la tensión física y el estrés.',
    otrosUsos: [
      'Producir relajación',
      'Disminuir dolores de cuello, espalda, etc.',
      'Reducir las presiones y preocupaciones',
      
    ],
    cover: 'podcast3.jpg',
    audio: 'tecnicas/PAS_en_Aeromexico_Padeces_Estres.mp3'
  },
  {
    title: 'Dormir bien',
    objetivo: 'Inducir el estado natural del sueño.',
    otrosUsos: [
      'Saber relajarse',
      'Poder soltar pendientes',
      'Dormir profundamente',
      ],
    cover: 'podcast4.jpg',
    audio: 'tecnicas/PAS_en_Aeromexico_Dormir_bien.mp3'
  },
  {
    title: 'Malestares físicos',
    objetivo: 'Disminuir el malestar y el dolor crónico o agudo.',
    otrosUsos: [
      'Poder descansar',
      'Analgesia natural',      
      'Control mental'
    ],
    cover: 'podcast5.jpg',
    audio: 'tecnicas/PAS_en_Aeromexico_Malestares_Fisicos.mp3'
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
  document.getElementById('podcast-description').innerHTML = `
    <div class="podcast-section">
      <h3 class="podcast-section-title">Objetivo:</h3>
      <p class="podcast-section-text">${podcast.objetivo}</p>
    </div>
    <div class="podcast-section">
      <h3 class="podcast-section-title">Otros usos posibles:</h3>
      <ul class="podcast-section-list">
        ${podcast.otrosUsos.map(uso => `<li class="podcast-section-item">${uso}</li>`).join('')}
      </ul>
    </div>
  `;
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
  // Reset play button to play icon
  const playBtn = document.getElementById('btn-play');
  if (playBtn) {
    playBtn.innerHTML = '&#9654;';
  }
}

// Control de reproducción
function setupAudioControls() {
  const audioPlayer = document.getElementById('audio-player');
  const playBtn = document.getElementById('btn-play');
  const slider = document.getElementById('audio-slider');
  const timeLabel = document.getElementById('audio-time');
  const durationLabel = document.getElementById('audio-duration');

  if (!audioPlayer || !playBtn || !slider || !timeLabel || !durationLabel) return;

  // Cambia el ícono del botón play/pause
  function updatePlayButton() {
    playBtn.innerHTML = audioPlayer.paused ? '&#9654;' : '&#10073;&#10073;';
  }

  // Actualiza el slider y el tiempo mostrado
  function updateProgress() {
    slider.max = Math.floor(audioPlayer.duration) || slider.max;
    slider.value = Math.floor(audioPlayer.currentTime);
    timeLabel.textContent = formatTime(Math.floor(audioPlayer.currentTime));
    durationLabel.textContent = formatTime(Math.floor(audioPlayer.duration) || 0);
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

// --- Swipe detection ---
function setupSwipeOnPodcastCard() {
  const card = document.querySelector('.podcast-card');
  if (!card) return;

  let startX = null;
  let isTouch = false;

  function onTouchStart(e) {
    isTouch = true;
    startX = e.touches[0].clientX;
  }
  function onTouchMove(e) {
    if (startX === null) return;
    // Prevent scrolling while swiping
    e.preventDefault();
  }
  function onTouchEnd(e) {
    if (startX === null) return;
    const endX = e.changedTouches[0].clientX;
    handleSwipe(endX - startX);
    startX = null;
  }
  function onMouseDown(e) {
    if (isTouch) return;
    startX = e.clientX;
    card.addEventListener('mousemove', onMouseMove);
    card.addEventListener('mouseup', onMouseUp);
    card.addEventListener('mouseleave', onMouseUp);
  }
  function onMouseMove(e) {
    // No-op, but could be used for drag effect
  }
  function onMouseUp(e) {
    if (startX === null) return;
    const endX = e.clientX;
    handleSwipe(endX - startX);
    startX = null;
    card.removeEventListener('mousemove', onMouseMove);
    card.removeEventListener('mouseup', onMouseUp);
    card.removeEventListener('mouseleave', onMouseUp);
  }
  function handleSwipe(deltaX) {
    const threshold = 50; // px
    if (deltaX < -threshold && selectedPodcast < podcasts.length - 1) {
      selectedPodcast++;
      updatePodcastCard();
      renderPodcastMenu();
    } else if (deltaX > threshold && selectedPodcast > 0) {
      selectedPodcast--;
      updatePodcastCard();
      renderPodcastMenu();
    }
  }
  card.addEventListener('touchstart', onTouchStart, {passive: false});
  card.addEventListener('touchmove', onTouchMove, {passive: false});
  card.addEventListener('touchend', onTouchEnd);
  card.addEventListener('mousedown', onMouseDown);
}

document.addEventListener('DOMContentLoaded', () => {
  renderPodcastMenu();
  updatePodcastCard();
  setupAudioControls();
  setupSwipeOnPodcastCard();

  // --- Burger menu logic ---
  const burgerBtn = document.getElementById('burger-btn');
  const podcastMenu = document.getElementById('podcast-burger-menu');

  function closeMenu() {
    podcastMenu.classList.remove('open');
  }

  if (burgerBtn && podcastMenu) {
    burgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      podcastMenu.classList.toggle('open');
    });
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (podcastMenu.classList.contains('open') && !podcastMenu.contains(e.target) && e.target !== burgerBtn) {
        closeMenu();
      }
    });
    // Cerrar menú al seleccionar una técnica
    podcastMenu.addEventListener('click', (e) => {
      if (e.target.classList.contains('podcast-menu-item')) {
        closeMenu();
      }
    });
  }
});
