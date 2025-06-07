document.addEventListener('DOMContentLoaded', function() {
    // Elementos principales
    const openBtn = document.getElementById('openBtn');
    const closeBtn = document.getElementById('closeBtn');
    const envelopeWrapper = document.querySelector('.envelope-wrapper');
    const letter = document.getElementById('letter');
    const playBtn = document.getElementById('playBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const volumeControl = document.getElementById('volumeControl');
    const progressBar = document.getElementById('progressBar');
    const currentTimeDisplay = document.getElementById('currentTime');
    const durationDisplay = document.getElementById('duration');
    const songSelector = document.getElementById('songSelector');
    const songTitle = document.getElementById('songTitle');
    const body = document.body;
    const particles = document.querySelector('.particles');
    const audioWave = document.querySelector('.audio-wave');
    const themeToggle = document.getElementById('themeToggle');
    const colorPickerBtn = document.getElementById('colorPickerBtn');
    const primaryColorInput = document.getElementById('primaryColor');
    const secondaryColorInput = document.getElementById('secondaryColor');
    const secretMessage = document.querySelector('.secret-message');
    const secretModal = document.getElementById('secretModal');
    const closeModal = document.querySelector('.close-modal');
    const audioStatus = document.getElementById('audioStatus');
    const notification = document.getElementById('messageNotification');
    
    // Variables de estado
    let audioReady = false;
    let heartInterval;
    let primaryColor = '#d8b5ff';
    let secondaryColor = '#f39fdc';
    let currentSongIndex = 0;
    
    const songs = [
        { 
            name: "Cielo eterno - DannyLux, Jasiel Nuñez", 
            path: "./assets/ci_eterno.mp3",
            type: "audio/mpeg" 
        },
        { 
            name: "M.A.I - Milo j", 
            path: "./assets/m.i.a.mp3",
            type: "audio/mpeg" 
        },
        { 
            name: "Únicos - Siddhartha", 
            path: "./assets/unicos.mp3",
            type: "audio/mpeg" 
        },
        { 
            name: "Amar De Nuevo - Rauw Alejandro", 
            path: "./assets/amar_de_nuevo.mp3",
            type: "audio/mpeg" 
        },
        { 
            name: "COSAS QUE NO TE DIJE - Saiko", 
            path: "./assets/cosas_que_no_te_dije.mp3",
            type: "audio/mpeg" 
        },
        { 
            name: "Algo Mágico - Rauw Alejandro", 
            path: "./assets/algo_magico.mp3",
            type: "audio/mpeg" 
        }
    ];

    // Audio
    const audio = new Audio();
    audio.loop = true;
    
    // Función para cargar la canción actual
    function loadCurrentSong() {
        if (songs.length === 0) {
            audioStatus.textContent = "No hay canciones disponibles";
            return;
        }
        
        const song = songs[currentSongIndex];
        audio.src = song.path;
        songTitle.textContent = song.name;
        audio.load()
            .then(() => {
                audioStatus.textContent = `${song.name} cargada`;
                updateTimeDisplay();
            })
            .catch(e => {
                console.error("Error al cargar canción:", e);
                audioStatus.textContent = `Error al cargar ${song.name}`;
            });
    }
    
    // Función para desbloquear el audio
    function unlockAudio() {
        if (audioReady) return;
        
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) {
                throw new Error("AudioContext no soportado");
            }
            
            const audioContext = new AudioContext();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            gainNode.gain.value = 0;
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
            
            audioReady = true;
            audioStatus.textContent = 'Audio listo! Haz clic en reproducir';
            loadCurrentSong();
        } catch (e) {
            console.error("Error al desbloquear audio:", e);
            audioStatus.textContent = 'Haz clic en cualquier parte para activar audio';
            
            document.addEventListener('click', function tempListener() {
                audioReady = true;
                audioStatus.textContent = 'Audio listo! Haz clic en reproducir';
                loadCurrentSong();
                document.removeEventListener('click', tempListener);
            }, { once: true });
        }
    }
    
    // Función para actualizar el tiempo de reproducción
    function updateTimeDisplay() {
        if (isNaN(audio.duration)) {
            durationDisplay.textContent = '0:00';
            return;
        }
        
        const currentMinutes = Math.floor(audio.currentTime / 60);
        const currentSeconds = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
        currentTimeDisplay.textContent = `${currentMinutes}:${currentSeconds}`;
        
        const durationMinutes = Math.floor(audio.duration / 60);
        const durationSeconds = Math.floor(audio.duration % 60).toString().padStart(2, '0');
        if (isFinite(audio.duration)) {
            durationDisplay.textContent = `${durationMinutes}:${durationSeconds}`;
        } else {
            durationDisplay.textContent = '0:00';
        }
    }
    
    // Función para actualizar el botón de reproducción
    function updatePlayButton() {
        if (audio.paused) {
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            document.querySelector('.audio-container').classList.remove('playing');
        } else {
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            document.querySelector('.audio-container').classList.add('playing');
        }
    }
    
    // Evento para cambiar de canción
    songSelector.addEventListener('change', function() {
        const selectedIndex = parseInt(this.value);
        if (!isNaN(selectedIndex)) {
            const wasPlaying = !audio.paused;
            audio.pause();
            currentSongIndex = selectedIndex;
            
            loadCurrentSong();
            
            if (wasPlaying) {
                setTimeout(() => {
                    audio.play().catch(e => {
                        console.error("Error al reproducir:", e);
                        audioStatus.textContent = "Error al reproducir";
                    });
                }, 300);
            }
        }
    });
    
    // Botón siguiente canción
    nextBtn.addEventListener('click', function() {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        songSelector.value = currentSongIndex;
        loadCurrentSong();
        if (!audio.paused) {
            audio.play();
        }
    });
    
    // Botón anterior canción
    prevBtn.addEventListener('click', function() {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        songSelector.value = currentSongIndex;
        loadCurrentSong();
        if (!audio.paused) {
            audio.play();
        }
    });
    
    // Control de volumen
    volumeControl.addEventListener('input', function() {
        audio.volume = this.value;
    });
    
    // Actualización de la barra de progreso
    audio.addEventListener('timeupdate', function() {
        if (!isNaN(audio.duration) && audio.duration > 0) {
            const progress = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = `${progress}%`;
            updateTimeDisplay();
        }
    });
    
    // Click en la barra de progreso
    document.querySelector('.progress-container').addEventListener('click', function(e) {
        if (!isNaN(audio.duration) && audio.duration > 0) {
            const percent = e.offsetX / this.offsetWidth;
            audio.currentTime = percent * audio.duration;
        }
    });
    
    // Cuando termina la canción
    audio.addEventListener('ended', function() {
        if (audio.loop) {
            audio.currentTime = 0;
            audio.play();
        }
    });
    
    // Cuando se cargan los metadatos
    audio.addEventListener('loadedmetadata', function() {
        updateTimeDisplay();
    });
    
    // Abrir carta
    openBtn.addEventListener('click', function() {
        envelopeWrapper.style.opacity = '0';
        envelopeWrapper.style.pointerEvents = 'none';
        
        letter.classList.add('open');
        body.classList.add('letter-open');
        
        startHearts();
        createParticles();
        createStars();
        createConfetti();
    });
    
    // Cerrar carta
    closeBtn.addEventListener('click', function() {
        letter.classList.remove('open');
        body.classList.remove('letter-open');
        
        setTimeout(() => {
            envelopeWrapper.style.opacity = '1';
            envelopeWrapper.style.pointerEvents = 'auto';
        }, 500);
        
        clearInterval(heartInterval);
    });
    
    // Control de reproducción
    playBtn.addEventListener('click', function() {
        if (!audioReady) {
            audioStatus.textContent = "Haz clic primero en cualquier parte de la página";
            return;
        }
        
        if (audio.paused) {
            audio.play()
                .then(() => {
                    updatePlayButton();
                    audioStatus.textContent = `Reproduciendo: ${songs[currentSongIndex].name}`;
                })
                .catch(e => {
                    console.error("Error al reproducir:", e);
                    audioStatus.textContent = "Error: Haz clic en la página primero";
                });
        } else {
            audio.pause();
            updatePlayButton();
            audioStatus.textContent = `Pausado: ${songs[currentSongIndex].name}`;
        }
    });
    
    // Partículas flotantes
    function createParticles() {
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.top = `${Math.random() * 100}%`;
                particle.style.width = `${Math.random() * 4 + 2}px`;
                particle.style.height = particle.style.width;
                particle.style.animationDuration = `${Math.random() * 15 + 5}s`;
                particle.style.animationDelay = `${Math.random() * 5}s`;
                particle.style.backgroundColor = `hsla(${Math.random() * 60 + 200}, 70%, 70%, 0.7)`;
                particles.appendChild(particle);
            }, i * 100);
        }
    }
    
    // Estrellas (modo nocturno)
    function createStars() {
        const starsContainer = document.querySelector('.stars');
        starsContainer.innerHTML = '';
        
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.width = `${Math.random() * 3 + 1}px`;
            star.style.height = star.style.width;
            star.style.animationDuration = `${Math.random() * 5 + 3}s`;
            star.style.animationDelay = `${Math.random() * 5}s`;
            starsContainer.appendChild(star);
        }
    }
    
    // Confeti
    function createConfetti() {
        const confettiContainer = document.getElementById('confetti');
        confettiContainer.innerHTML = '';
        
        for (let i = 0; i < 150; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = `${Math.random() * 100}%`;
                confetti.style.top = `${Math.random() * 100 - 20}%`;
                confetti.style.width = `${Math.random() * 10 + 5}px`;
                confetti.style.height = `${Math.random() * 5 + 3}px`;
                confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
                confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
                confetti.style.animationDelay = `${Math.random() * 2}s`;
                confettiContainer.appendChild(confetti);
            }, i * 20);
        }
    }
    
    // Corazones flotantes
    function startHearts() {
        const heartColors = ['#e0aaff', '#a0c4ff', '#ffadad', '#fbc2eb', '#d6a3fb'];
        
        heartInterval = setInterval(() => {
            if (document.querySelectorAll('.heart-float').length < 30) {
                createHeart(heartColors);
            }
        }, 300);
        
        for (let i = 0; i < 15; i++) {
            setTimeout(() => createHeart(heartColors), i * 200);
        }
    }
    
    function createHeart(colors) {
        const heart = document.createElement('div');
        heart.className = 'heart-float';
        heart.innerHTML = '<i class="fas fa-heart"></i>';
        
        heart.style.left = `${10 + (Math.random() * 80)}%`;
        heart.style.bottom = '-50px';
        heart.style.fontSize = `${20 + Math.random() * 25}px`;
        heart.style.color = colors[Math.floor(Math.random() * colors.length)];
        
        const duration = 8 + Math.random() * 12;
        heart.style.animationDuration = `${duration}s`;
        heart.style.setProperty('--tx', `${(Math.random() - 0.5) * 150}px`);
        
        heart.addEventListener('click', (e) => {
            e.stopPropagation();
            createHeartExplosion(e.clientX, e.clientY, heart.style.color);
            heart.remove();
        });
        
        document.body.appendChild(heart);
        
        setTimeout(() => heart.remove(), duration * 1000);
    }
    
    function createHeartExplosion(x, y, color) {
        const explosion = document.createElement('div');
        explosion.style.position = 'fixed';
        explosion.style.left = `${x}px`;
        explosion.style.top = `${y}px`;
        explosion.style.transform = 'translate(-50%, -50%)';
        explosion.style.fontSize = '30px';
        explosion.style.color = color;
        explosion.style.zIndex = '1000';
        explosion.style.pointerEvents = 'none';
        explosion.innerHTML = '<i class="fas fa-heart"></i>';
        
        document.body.appendChild(explosion);
        
        const animation = explosion.animate([
            { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
            { transform: 'translate(-50%, -50%) scale(3)', opacity: 0 }
        ], {
            duration: 800,
            easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        });
        
        animation.onfinish = () => explosion.remove();
        
        for (let i = 0; i < 12; i++) {
            setTimeout(() => {
                const miniHeart = document.createElement('div');
                miniHeart.innerHTML = '<i class="fas fa-heart"></i>';
                miniHeart.style.position = 'fixed';
                miniHeart.style.left = `${x}px`;
                miniHeart.style.top = `${y}px`;
                miniHeart.style.color = color;
                miniHeart.style.fontSize = '15px';
                miniHeart.style.zIndex = '1000';
                miniHeart.style.pointerEvents = 'none';
                
                document.body.appendChild(miniHeart);
                
                const angle = Math.random() * Math.PI * 2;
                const distance = 50 + Math.random() * 80;
                const duration = 800 + Math.random() * 500;
                
                const miniAnimation = miniHeart.animate([
                    { 
                        transform: `translate(-50%, -50%) translate(0, 0)`,
                        opacity: 1 
                    },
                    { 
                        transform: `translate(-50%, -50%) translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`,
                        opacity: 0 
                    }
                ], {
                    duration: duration,
                    easing: 'cubic-bezier(0.39, 0.575, 0.565, 1)'
                });
                
                miniAnimation.onfinish = () => miniHeart.remove();
            }, i * 50);
        }
    }
    
    // Notificación
    function showNotification() {
        setTimeout(() => {
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 5000);
        }, 2000);
    }
    
    // Toggle modo nocturno
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        themeToggle.title = isDark ? 'Modo Diurno' : 'Modo Nocturno';
        
        if (isDark) {
            createStars();
        } else {
            document.querySelector('.stars').innerHTML = '';
        }
    });
    
    // Selector de colores
    colorPickerBtn.addEventListener('click', function() {
        primaryColorInput.click();
    });
    
    primaryColorInput.addEventListener('input', function() {
        primaryColor = this.value;
        updateColors();
    });
    
    secondaryColorInput.addEventListener('input', function() {
        secondaryColor = this.value;
        updateColors();
    });
    
    function updateColors() {
        document.documentElement.style.setProperty('--primary', primaryColor);
        document.documentElement.style.setProperty('--secondary', secondaryColor);
        
        const gradientElements = document.querySelectorAll('.heart-button, #playBtn, .custom-btn, .audio-nav');
        gradientElements.forEach(el => {
            el.style.background = `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`;
        });
    }
    
    // Mensaje secreto
    secretMessage.addEventListener('click', function() {
        secretModal.style.display = 'flex';
        createModalHearts();
    });
    
    function createModalHearts() {
        const container = document.querySelector('.floating-hearts-modal');
        const colors = ['#ff6b6b', '#ff8e8e', '#ffb3b3', '#ffd8d8', '#f39fdc', '#d8b5ff'];
        
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.innerHTML = '<i class="fas fa-heart"></i>';
                heart.style.position = 'absolute';
                heart.style.left = `${Math.random() * 100}%`;
                heart.style.top = `${Math.random() * 100}%`;
                heart.style.fontSize = `${15 + Math.random() * 20}px`;
                heart.style.color = colors[Math.floor(Math.random() * colors.length)];
                heart.style.opacity = '0.7';
                heart.style.animation = `float ${3 + Math.random() * 4}s infinite ease-in-out`;
                heart.style.animationDelay = `${Math.random() * 2}s`;
                container.appendChild(heart);
            }, i * 200);
        }
        
        // Sparkles
        const sparkles = document.querySelector('.sparkles');
        for (let i = 0; i < 30; i++) {
            const sparkle = document.createElement('div');
            sparkle.style.position = 'absolute';
            sparkle.style.left = `${Math.random() * 100}%`;
            sparkle.style.top = `${Math.random() * 100}%`;
            sparkle.style.width = `${5 + Math.random() * 5}px`;
            sparkle.style.height = sparkle.style.width;
            sparkle.style.backgroundColor = 'white';
            sparkle.style.borderRadius = '50%';
            sparkle.style.animation = `sparkle ${1 + Math.random() * 2}s infinite`;
            sparkle.style.animationDelay = `${Math.random() * 2}s`;
            sparkle.style.filter = 'blur(1px)';
            sparkles.appendChild(sparkle);
        }
    }
    
    closeModal.addEventListener('click', function() {
        secretModal.style.display = 'none';
    });
    
    // Flores flotantes
    function createFloatingFlowers() {
        const flowers = ['🌸', '🌹', '🌺', '🌻', '🌼', '🌷', '💐', '🏵️'];
        const container = document.querySelector('.floating-flowers');
        
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const flower = document.createElement('div');
                flower.className = 'flower';
                flower.textContent = flowers[Math.floor(Math.random() * flowers.length)];
                flower.style.left = `${Math.random() * 100}%`;
                flower.style.top = `${Math.random() * 100}%`;
                flower.style.fontSize = `${20 + Math.random() * 30}px`;
                flower.style.color = `hsla(${Math.random() * 360}, 70%, 70%, 0.7)`;
                flower.style.animationDuration = `${15 + Math.random() * 30}s`;
                flower.style.setProperty('--tx', `${(Math.random() - 0.5) * 200}px`);
                flower.style.setProperty('--ty', `-${100 + Math.random() * 50}vh`);
                container.appendChild(flower);
                
                setTimeout(() => flower.remove(), parseFloat(flower.style.animationDuration) * 1000);
            }, i * 1000);
        }
    }
    
    // Efectos interactivos al hacer clic
    document.addEventListener('click', function(e) {
        if (e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
            createClickSparkle(e.clientX, e.clientY);
        }
    });
    
    function createClickSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.className = 'interactive-sparkle';
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        sparkle.style.backgroundColor = `hsl(${Math.random() * 60 + 200}, 70%, 70%)`;
        document.querySelector('.interactive-elements').appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 1000);
    }
    
    // Inicialización
    document.addEventListener('click', unlockAudio, { once: true });
    document.addEventListener('touchstart', unlockAudio, { once: true });
    
    showNotification();
    createFloatingFlowers();
    setInterval(createFloatingFlowers, 15000);
    
    // Efecto hover en el sobre
    const envelope = document.querySelector('.envelope');
    envelope.addEventListener('mouseenter', function() {
        this.querySelector('.envelope-flap').style.transform = 'rotateX(180deg)';
        this.querySelector('.envelope-heart').style.transform = 'translate(-50%, -50%) scale(1.1)';
    });
    
    envelope.addEventListener('mouseleave', function() {
        this.querySelector('.envelope-flap').style.transform = 'rotateX(0)';
        this.querySelector('.envelope-heart').style.transform = 'translate(-50%, -50%) scale(1)';
    });

    // Solución adicional para el audio en móviles
    document.addEventListener('touchend', function() {
        if (!audioReady) {
            unlockAudio();
        }
    }, { once: true });
});