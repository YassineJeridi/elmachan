// Enhanced JavaScript with Mobile Video Carousel and Pink Theme - FIXED
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const birthdayMessage = document.getElementById('birthdayMessage');
    const mainContent = document.getElementById('mainContent');
    const loading = document.getElementById('loading');
    const messagesContainer = document.getElementById('messagesContainer');
    const photoGallery = document.getElementById('photoGallery');
    const videosContainer = document.getElementById('videosContainer');
    const videoCarousel = document.getElementById('videoCarousel');
    const carouselIndicators = document.getElementById('carouselIndicators');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const musicControl = document.getElementById('musicControl');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const words = document.querySelectorAll('.word');

    // Animation states
    let isAnimating = false;
    let websiteData = {};
    let musicEnabled = false;
    let currentVideoIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    let carouselInitialized = false;

    // Enhanced data loading with error handling
    async function loadData() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) throw new Error('Failed to load data');
            websiteData = await response.json();
            return true;
        } catch (error) {
            console.log('Loading fallback data...');
            // Fallback data
            websiteData = {
                messages: [
                    {
                        text: "Every moment with you feels like a dream come true. You light up my world in ways I never thought possible. ❤️",
                        date: "Every day with you"
                    },
                    {
                        text: "Your smile is my favorite sight, your laugh is my favorite sound, and being with you is my favorite feeling. 💕",
                        date: "Always and forever"
                    },
                    {
                        text: "Thank you for being the most amazing girlfriend anyone could ask for. You make every day special! 🥰",
                        date: "From my heart"
                    },
                    {
                        text: "I fall in love with you more and more each day. Happy birthday to my everything! 🎂",
                        date: "Today and always"
                    },
                    {
                        text: "You are my sunshine on cloudy days, my peace in chaotic moments, and my home wherever we are. 🏠💖",
                        date: "Forever yours"
                    },
                    {
                        text: "With you, every ordinary day becomes an extraordinary adventure. Here's to many more birthdays together! 🎈",
                        date: "Birthday wishes"
                    }
                ],
                photos: [
                    { src: "assets/img1.png", caption: "Our first date - unforgettable! 💖" },
                    { src: "assets/img2.png", caption: "That perfect sunset together 🌅" },
                    { src: "assets/img3.png", caption: "Laughing until our sides hurt 😂❤️" },
                    { src: "assets/img4.png", caption: "Adventure time with my favorite person 🗺️" },
                    { src: "assets/img5.png", caption: "Cozy nights, warm hearts 🏠💕" }
                ],
                videos: [
                    { src: "assets/video1.mp4", caption: "When I'm with you, every moment is precious 🎬💖" },
                    { src: "assets/video2.mp4", caption: "I love being with you in motion 🎭💕" },
                    { src: "assets/video3.mp4", caption: "When I'm with you, life becomes a movie 🎪💗" },
                    { src: "assets/video4.mp4", caption: "I love being with you in every frame 🎨💘" }
                ]
            };
            return true;
        }
    }

    // Enhanced message cards with sequential animation
    function createMessageCards() {
        if (!messagesContainer) return;
        
        messagesContainer.innerHTML = '';
        websiteData.messages.forEach((message, index) => {
            const messageCard = document.createElement('div');
            messageCard.className = 'message-card';
            messageCard.innerHTML = `
                <div class="message-text">${message.text}</div>
                <div class="message-date">${message.date}</div>
            `;
            
            messageCard.style.animationDelay = `${index * 0.2}s`;
            messagesContainer.appendChild(messageCard);

            observeElement(messageCard, () => {
                setTimeout(() => {
                    messageCard.classList.add('show');
                    createSparkleEffect(messageCard);
                }, index * 150);
            });
        });
    }

    // Enhanced photo gallery with better animations
    function createPhotoGallery() {
        if (!photoGallery) return;
        
        photoGallery.innerHTML = '';
        websiteData.photos.forEach((photo, index) => {
            const photoItem = document.createElement('div');
            photoItem.className = 'photo-item';
            photoItem.innerHTML = `
                <img src="${photo.src}" alt="Memory ${index + 1}" loading="lazy">
                <div class="photo-overlay">
                    <p>${photo.caption}</p>
                </div>
            `;
            photoGallery.appendChild(photoItem);

            photoItem.addEventListener('click', () => expandPhoto(photoItem, photo));

            observeElement(photoItem, () => {
                setTimeout(() => {
                    photoItem.classList.add('show');
                    addPhotoShimmer(photoItem);
                }, index * 100);
            });
        });
    }

    // Enhanced videos section for desktop
    function createVideosSection() {
        if (!videosContainer) return;
        
        videosContainer.innerHTML = '';
        websiteData.videos.forEach((video, index) => {
            const videoItem = document.createElement('div');
            videoItem.className = 'video-item';
            videoItem.innerHTML = `
                <video controls preload="metadata">
                    <source src="${video.src}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                <div class="video-caption">${video.caption}</div>
            `;
            videosContainer.appendChild(videoItem);

            observeElement(videoItem, () => {
                setTimeout(() => {
                    videoItem.classList.add('show');
                }, index * 200);
            });
        });
    }

    // FIXED: Create mobile video carousel with proper error handling
    function createVideoCarousel() {
        if (!videoCarousel || !carouselIndicators || !websiteData.videos) {
            console.warn('Video carousel elements not found or no video data available');
            return;
        }
        
        try {
            videoCarousel.innerHTML = '';
            carouselIndicators.innerHTML = '';
            currentVideoIndex = 0;
            
            websiteData.videos.forEach((video, index) => {
                // Create carousel item
                const carouselItem = document.createElement('div');
                carouselItem.className = 'video-carousel-item';
                carouselItem.innerHTML = `
                    <video controls preload="metadata">
                        <source src="${video.src}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                    <div class="video-caption">${video.caption}</div>
                `;
                videoCarousel.appendChild(carouselItem);

                // Create indicator
                const indicator = document.createElement('div');
                indicator.className = `carousel-indicator ${index === 0 ? 'active' : ''}`;
                indicator.addEventListener('click', () => goToVideo(index));
                carouselIndicators.appendChild(indicator);
            });

            // Setup carousel controls
            setupCarouselControls();
            setupTouchControls();
            carouselInitialized = true;
            
            console.log('Video carousel initialized successfully');
        } catch (error) {
            console.error('Error creating video carousel:', error);
            carouselInitialized = false;
        }
    }

    // FIXED: Setup carousel navigation controls with error handling
    function setupCarouselControls() {
        try {
            if (prevBtn) {
                prevBtn.removeEventListener('click', handlePrevClick); // Remove existing listeners
                prevBtn.addEventListener('click', handlePrevClick);
            }

            if (nextBtn) {
                nextBtn.removeEventListener('click', handleNextClick); // Remove existing listeners
                nextBtn.addEventListener('click', handleNextClick);
            }
        } catch (error) {
            console.error('Error setting up carousel controls:', error);
        }
    }

    // Separate event handlers to prevent memory leaks
    function handlePrevClick() {
        if (carouselInitialized && websiteData.videos) {
            currentVideoIndex = Math.max(0, currentVideoIndex - 1);
            updateCarousel();
        }
    }

    function handleNextClick() {
        if (carouselInitialized && websiteData.videos) {
            currentVideoIndex = Math.min(websiteData.videos.length - 1, currentVideoIndex + 1);
            updateCarousel();
        }
    }

    // FIXED: Setup touch/swipe controls with error handling
    function setupTouchControls() {
        if (!videoCarousel) return;

        try {
            // Remove existing event listeners first
            videoCarousel.removeEventListener('touchstart', handleTouchStart);
            videoCarousel.removeEventListener('touchend', handleTouchEnd);
            videoCarousel.removeEventListener('mousedown', handleMouseDown);
            videoCarousel.removeEventListener('mouseup', handleMouseUp);

            // Add new event listeners
            videoCarousel.addEventListener('touchstart', handleTouchStart);
            videoCarousel.addEventListener('touchend', handleTouchEnd);
            videoCarousel.addEventListener('mousedown', handleMouseDown);
            videoCarousel.addEventListener('mouseup', handleMouseUp);
        } catch (error) {
            console.error('Error setting up touch controls:', error);
        }
    }

    // Separate touch event handlers
    function handleTouchStart(e) {
        touchStartX = e.touches[0].clientX;
    }

    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
    }

    function handleMouseDown(e) {
        touchStartX = e.clientX;
    }

    function handleMouseUp(e) {
        touchEndX = e.clientX;
        handleSwipe();
    }

    // FIXED: Handle swipe gestures with error handling
    function handleSwipe() {
        if (!carouselInitialized || !websiteData.videos) return;

        try {
            const swipeThreshold = 50;
            const difference = touchStartX - touchEndX;

            if (Math.abs(difference) > swipeThreshold) {
                if (difference > 0) {
                    nextVideo();
                } else {
                    prevVideo();
                }
            }
        } catch (error) {
            console.error('Error handling swipe:', error);
        }
    }

    // FIXED: Navigate to next video with error handling
    function nextVideo() {
        if (!carouselInitialized || !websiteData.videos) return;
        
        if (currentVideoIndex < websiteData.videos.length - 1) {
            currentVideoIndex++;
            updateCarousel();
        }
    }

    // FIXED: Navigate to previous video with error handling
    function prevVideo() {
        if (!carouselInitialized || !websiteData.videos) return;
        
        if (currentVideoIndex > 0) {
            currentVideoIndex--;
            updateCarousel();
        }
    }

    // FIXED: Go to specific video with error handling
    function goToVideo(index) {
        if (!carouselInitialized || !websiteData.videos || index < 0 || index >= websiteData.videos.length) {
            return;
        }
        
        currentVideoIndex = index;
        updateCarousel();
    }

    // FIXED: Update carousel position and indicators with comprehensive error handling
    function updateCarousel() {
        if (!carouselInitialized || !videoCarousel || !carouselIndicators || !websiteData.videos) {
            console.warn('Carousel not properly initialized, skipping update');
            return;
        }

        try {
            const carouselItems = videoCarousel.children;
            if (!carouselItems || carouselItems.length === 0) {
                console.warn('No carousel items found');
                return;
            }

            const firstItem = carouselItems[0];
            if (!firstItem) {
                console.warn('First carousel item not found');
                return;
            }

            const itemWidth = firstItem.offsetWidth || 0;
            const gap = 20; // CSS gap value
            const scrollPosition = currentVideoIndex * (itemWidth + gap);
            
            // Safe scroll with error handling
            if (videoCarousel.scrollTo) {
                videoCarousel.scrollTo({
                    left: scrollPosition,
                    behavior: 'smooth'
                });
            } else {
                videoCarousel.scrollLeft = scrollPosition;
            }

            // Update indicators safely
            const indicators = carouselIndicators.querySelectorAll('.carousel-indicator');
            indicators.forEach((indicator, index) => {
                if (indicator) {
                    indicator.classList.toggle('active', index === currentVideoIndex);
                }
            });

            // Update button states safely
            if (prevBtn) {
                prevBtn.style.opacity = currentVideoIndex === 0 ? '0.5' : '1';
                prevBtn.style.pointerEvents = currentVideoIndex === 0 ? 'none' : 'auto';
            }

            if (nextBtn) {
                const isLastVideo = currentVideoIndex >= websiteData.videos.length - 1;
                nextBtn.style.opacity = isLastVideo ? '0.5' : '1';
                nextBtn.style.pointerEvents = isLastVideo ? 'none' : 'auto';
            }
        } catch (error) {
            console.error('Error updating carousel:', error);
        }
    }

    // Enhanced intersection observer
    function observeElement(element, callback) {
        if (!element || typeof callback !== 'function') return;

        try {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        callback();
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.2,
                rootMargin: '0px 0px -50px 0px'
            });
            observer.observe(element);
        } catch (error) {
            console.error('Error setting up observer:', error);
            // Fallback: call callback immediately
            if (typeof callback === 'function') {
                setTimeout(callback, 100);
            }
        }
    }

    // Setup enhanced scroll animations
    function setupScrollAnimations() {
        const sections = document.querySelectorAll('section');
        sections.forEach((section, index) => {
            observeElement(section, () => {
                setTimeout(() => {
                    section.classList.add('visible');
                    triggerSectionAnimation(section);
                }, index * 100);
            });
        });
    }

    // Word reveal animation for subtitle
    function animateSubtitleWords() {
        words.forEach((word, index) => {
            if (word && word.dataset) {
                const delay = parseInt(word.dataset.delay) || 0;
                setTimeout(() => {
                    word.style.animationDelay = `${delay}ms`;
                    word.style.animation = 'wordReveal 0.6s ease-out forwards';
                }, delay);
            }
        });
    }

    // Enhanced sparkle effect
    function createSparkleEffect(element) {
        if (!element) return;
        
        try {
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    const sparkle = document.createElement('div');
                    sparkle.innerHTML = '✨';
                    sparkle.style.position = 'absolute';
                    sparkle.style.left = Math.random() * 100 + '%';
                    sparkle.style.top = Math.random() * 100 + '%';
                    sparkle.style.fontSize = '1rem';
                    sparkle.style.pointerEvents = 'none';
                    sparkle.style.animation = 'sparkle 1s ease-out forwards';
                    sparkle.style.zIndex = '10';
                    element.style.position = 'relative';
                    element.appendChild(sparkle);
                    setTimeout(() => {
                        if (sparkle.parentNode) {
                            sparkle.parentNode.removeChild(sparkle);
                        }
                    }, 1000);
                }, i * 200);
            }
        } catch (error) {
            console.error('Error creating sparkle effect:', error);
        }
    }

    // Photo shimmer effect
    function addPhotoShimmer(photoItem) {
        if (!photoItem) return;
        
        try {
            const img = photoItem.querySelector('img');
            if (!img) return;
            
            img.addEventListener('load', () => {
                photoItem.style.position = 'relative';
                photoItem.style.overflow = 'hidden';
                const shimmer = document.createElement('div');
                shimmer.style.position = 'absolute';
                shimmer.style.top = '0';
                shimmer.style.left = '-100%';
                shimmer.style.width = '100%';
                shimmer.style.height = '100%';
                shimmer.style.background = 'linear-gradient(90deg, transparent, rgba(255,105,180,0.4), transparent)';
                shimmer.style.animation = 'shimmer 2s ease-in-out';
                shimmer.style.pointerEvents = 'none';
                photoItem.appendChild(shimmer);
                setTimeout(() => {
                    if (shimmer.parentNode) {
                        shimmer.parentNode.removeChild(shimmer);
                    }
                }, 2000);
            });
        } catch (error) {
            console.error('Error adding photo shimmer:', error);
        }
    }

    // Section animation triggers
    function triggerSectionAnimation(section) {
        if (!section) return;
        
        try {
            if (section.classList.contains('messages-section')) {
                createFloatingHearts(section, 3);
            } else if (section.classList.contains('gallery-section')) {
                createFloatingEmojis(section, ['📸', '✨', '💖'], 5);
            } else if (section.classList.contains('videos-section')) {
                createFloatingEmojis(section, ['🎬', '🎭', '🌟'], 4);
            }
        } catch (error) {
            console.error('Error triggering section animation:', error);
        }
    }

    // Enhanced floating hearts
    function createFloatingHearts(container, count) {
        if (!container || !count) return;
        
        try {
            for (let i = 0; i < count; i++) {
                setTimeout(() => {
                    const heart = document.createElement('div');
                    heart.innerHTML = ['💖', '💕', '❤️', '💗'][Math.floor(Math.random() * 4)];
                    heart.style.position = 'absolute';
                    heart.style.left = Math.random() * 100 + '%';
                    heart.style.top = '100%';
                    heart.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
                    heart.style.pointerEvents = 'none';
                    heart.style.zIndex = '5';
                    heart.style.animation = `floatUp ${3 + Math.random() * 2}s linear forwards`;
                    container.style.position = 'relative';
                    container.appendChild(heart);
                    setTimeout(() => {
                        if (heart.parentNode) {
                            heart.parentNode.removeChild(heart);
                        }
                    }, 5000);
                }, i * 500);
            }
        } catch (error) {
            console.error('Error creating floating hearts:', error);
        }
    }

    // Floating emojis
    function createFloatingEmojis(container, emojis, count) {
        if (!container || !emojis || !count) return;
        
        try {
            for (let i = 0; i < count; i++) {
                setTimeout(() => {
                    const emoji = document.createElement('div');
                    emoji.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
                    emoji.style.position = 'absolute';
                    emoji.style.left = Math.random() * 100 + '%';
                    emoji.style.top = '100%';
                    emoji.style.fontSize = (Math.random() * 1.2 + 0.8) + 'rem';
                    emoji.style.pointerEvents = 'none';
                    emoji.style.zIndex = '5';
                    emoji.style.animation = `floatUp ${4 + Math.random() * 2}s linear forwards`;
                    container.style.position = 'relative';
                    container.appendChild(emoji);
                    setTimeout(() => {
                        if (emoji.parentNode) {
                            emoji.parentNode.removeChild(emoji);
                        }
                    }, 6000);
                }, i * 700);
            }
        } catch (error) {
            console.error('Error creating floating emojis:', error);
        }
    }

    // Photo expansion feature
    function expandPhoto(photoItem, photo) {
        if (isAnimating || !photoItem || !photo) return;
        
        try {
            isAnimating = true;

            const overlay = document.createElement('div');
            overlay.className = 'photo-expanded-overlay';
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.background = 'rgba(0, 0, 0, 0.95)';
            overlay.style.zIndex = '9999';
            overlay.style.display = 'flex';
            overlay.style.justifyContent = 'center';
            overlay.style.alignItems = 'center';
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 0.3s ease';

            const expandedImg = document.createElement('img');
            expandedImg.src = photo.src;
            expandedImg.style.maxWidth = '90%';
            expandedImg.style.maxHeight = '90%';
            expandedImg.style.borderRadius = '15px';
            expandedImg.style.boxShadow = '0 20px 60px rgba(255, 20, 147, 0.5)';
            expandedImg.style.transform = 'scale(0.8)';
            expandedImg.style.transition = 'transform 0.3s ease';

            const caption = document.createElement('div');
            caption.style.position = 'absolute';
            caption.style.bottom = '10%';
            caption.style.left = '50%';
            caption.style.transform = 'translateX(-50%)';
            caption.style.color = 'white';
            caption.style.fontSize = '1.5rem';
            caption.style.textAlign = 'center';
            caption.style.padding = '20px';
            caption.style.background = 'rgba(0, 0, 0, 0.8)';
            caption.style.borderRadius = '10px';
            caption.innerHTML = photo.caption;

            overlay.appendChild(expandedImg);
            overlay.appendChild(caption);
            document.body.appendChild(overlay);

            requestAnimationFrame(() => {
                overlay.style.opacity = '1';
                expandedImg.style.transform = 'scale(1)';
            });

            overlay.addEventListener('click', () => {
                overlay.style.opacity = '0';
                expandedImg.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    if (document.body.contains(overlay)) {
                        document.body.removeChild(overlay);
                    }
                    isAnimating = false;
                }, 300);
            });

            setTimeout(() => isAnimating = false, 300);
        } catch (error) {
            console.error('Error expanding photo:', error);
            isAnimating = false;
        }
    }

    // Enhanced loading animation
    function showLoading() {
        if (!loading) return;
        
        try {
            loading.style.display = 'flex';
            const heartLoader = loading.querySelector('.heart-loader');
            const dots = loading.querySelectorAll('.loading-dots span');

            setTimeout(() => {
                if (heartLoader) {
                    heartLoader.style.animation = 'heartLoaderPulse 2.5s ease-in-out infinite';
                }
            }, 100);

            dots.forEach((dot, index) => {
                setTimeout(() => {
                    if (dot) {
                        dot.style.animation = 'loadingDots 2s ease-in-out infinite';
                        dot.style.animationDelay = `${index * 0.4}s`;
                    }
                }, 200 + index * 100);
            });
        } catch (error) {
            console.error('Error showing loading:', error);
        }
    }

    function hideLoading() {
        if (!loading) return;
        
        try {
            const heartLoader = loading.querySelector('.heart-loader');
            const loadingText = loading.querySelector('.main-loading-text');

            if (heartLoader) heartLoader.style.transform = 'scale(0)';
            if (loadingText) loadingText.style.opacity = '0';
            
            setTimeout(() => {
                loading.style.display = 'none';
            }, 500);
        } catch (error) {
            console.error('Error hiding loading:', error);
            loading.style.display = 'none';
        }
    }

    // Music control functionality
    function setupMusicControl() {
        if (!musicControl || !backgroundMusic) return;
        
        try {
            musicControl.addEventListener('click', () => {
                if (musicEnabled) {
                    backgroundMusic.pause();
                    musicControl.innerHTML = '🎵';
                    musicEnabled = false;
                } else {
                    backgroundMusic.play().catch(() => {
                        console.log('Audio playback failed - user interaction required');
                    });
                    musicControl.innerHTML = '🎶';
                    musicEnabled = true;
                }

                musicControl.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    musicControl.style.transform = 'scale(1)';
                }, 100);
            });
        } catch (error) {
            console.error('Error setting up music control:', error);
        }
    }

    // Enhanced initialization
    async function initialize() {
        showLoading();
        try {
            await loadData();

            await new Promise(resolve => {
                setTimeout(() => {
                    createMessageCards();
                    resolve();
                }, 300);
            });

            await new Promise(resolve => {
                setTimeout(() => {
                    createPhotoGallery();
                    resolve();
                }, 500);
            });

            await new Promise(resolve => {
                setTimeout(() => {
                    createVideosSection();
                    createVideoCarousel(); // Create mobile carousel
                    resolve();
                }, 700);
            });

            setupScrollAnimations();
            setupMusicControl();
        } catch (error) {
            console.error('Initialization error:', error);
        } finally {
            hideLoading();
        }
    }

    // Enhanced birthday message click handler
    if (birthdayMessage) {
        birthdayMessage.addEventListener('click', async function() {
            if (isAnimating) return;
            isAnimating = true;

            createSparkleEffect(birthdayMessage);

            const title = birthdayMessage.querySelector('.main-title');
            const hearts = birthdayMessage.querySelectorAll('.heart-emoji');
            
            if (title) title.style.animation = 'titlePulse 0.5s ease-out';
            hearts.forEach((heart, index) => {
                setTimeout(() => {
                    heart.style.transform = 'scale(2) rotate(360deg)';
                    heart.style.opacity = '0';
                }, index * 100);
            });

            setTimeout(() => {
                birthdayMessage.style.transform = 'translate(-50%, -50%) scale(0) rotate(180deg)';
                birthdayMessage.style.opacity = '0';
            }, 800);

            setTimeout(async () => {
                birthdayMessage.classList.add('hidden');
                
                await initialize();
                if (mainContent) mainContent.style.display = 'block';

                setTimeout(() => {
                    animateSubtitleWords();
                }, 500);

                window.scrollTo({ top: 0, behavior: 'smooth' });
                isAnimating = false;
            }, 1200);
        });
    }

    // Enhanced touch interactions for mobile
    if ('ontouchstart' in window) {
        let touchStartTime = 0;
        let touchStartPos = { x: 0, y: 0 };

        document.addEventListener('touchstart', function(e) {
            touchStartTime = Date.now();
            touchStartPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            
            if (e.target.closest('.photo-item, .video-item, .message-card, .birthday-message')) {
                const element = e.target.closest('.photo-item, .video-item, .message-card, .birthday-message');
                element.style.transform = element.style.transform.replace('scale(1)', 'scale(0.95)');
                createRippleEffect(element, e.touches[0]);
            }
        });

        document.addEventListener('touchend', function(e) {
            const touchEndTime = Date.now();
            const touchDuration = touchEndTime - touchStartTime;
            
            if (e.target.closest('.photo-item, .video-item, .message-card, .birthday-message')) {
                const element = e.target.closest('.photo-item, .video-item, .message-card, .birthday-message');
                setTimeout(() => {
                    element.style.transform = element.style.transform.replace('scale(0.95)', 'scale(1)');
                }, 150);
            }

            if (touchDuration < 300) {
                handleTouchInteraction(e.target);
            }
        });
    }

    // Ripple effect for touch interactions
    function createRippleEffect(element, touch) {
        if (!element || !touch) return;
        
        try {
            const ripple = document.createElement('div');
            const rect = element.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = touch.clientX - rect.left - size / 2;
            const y = touch.clientY - rect.top - size / 2;

            ripple.style.position = 'absolute';
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.background = 'rgba(255, 20, 147, 0.3)';
            ripple.style.borderRadius = '50%';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.pointerEvents = 'none';

            element.style.position = 'relative';
            element.style.overflow = 'hidden';
            element.appendChild(ripple);

            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        } catch (error) {
            console.error('Error creating ripple effect:', error);
        }
    }

    // Handle touch interactions
    function handleTouchInteraction(target) {
        if (!target) return;
        
        try {
            if (target.closest('.photo-item')) {
                const photoItem = target.closest('.photo-item');
                const now = Date.now();
                const lastTap = photoItem.dataset.lastTap || 0;
                
                if (now - lastTap < 300) {
                    const img = photoItem.querySelector('img');
                    const caption = photoItem.querySelector('.photo-overlay p');
                    if (img && caption) {
                        expandPhoto(photoItem, {
                            src: img.src,
                            caption: caption.textContent
                        });
                    }
                }
                photoItem.dataset.lastTap = now;
            }
        } catch (error) {
            console.error('Error handling touch interaction:', error);
        }
    }

    // FIXED: Responsive utilities with comprehensive error handling
    function handleResize() {
        try {
            const width = window.innerWidth;
            
            if (width <= 480) {
                document.documentElement.style.setProperty('--animation-duration', '0.3s');
            } else {
                document.documentElement.style.setProperty('--animation-duration', '0.6s');
            }

            adjustGridLayouts(width);
            
            // FIXED: Only update carousel if it's properly initialized
            if (carouselInitialized && videoCarousel && currentVideoIndex >= 0 && websiteData.videos) {
                setTimeout(() => {
                    updateCarousel();
                }, 100);
            }
        } catch (error) {
            console.error('Error handling resize:', error);
        }
    }

    function adjustGridLayouts(width) {
        try {
            const messageContainer = document.querySelector('.messages-container');
            const photoGallery = document.querySelector('.photo-gallery');
            const videoContainer = document.querySelector('.videos-container');

            if (width <= 768) {
                if (messageContainer) messageContainer.style.gridTemplateColumns = '1fr';
                if (videoContainer) videoContainer.style.gridTemplateColumns = '1fr';
            }

            if (width <= 480) {
                if (photoGallery) {
                    photoGallery.style.gridTemplateColumns = 'repeat(auto-fit, minmax(180px, 1fr))';
                    photoGallery.style.gap = '15px';
                }
            }
        } catch (error) {
            console.error('Error adjusting grid layouts:', error);
        }
    }

    // Event listeners with error handling
    try {
        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', () => {
            setTimeout(handleResize, 100);
        });
    } catch (error) {
        console.error('Error setting up window event listeners:', error);
    }

    // Visibility change handler for performance
    try {
        document.addEventListener('visibilitychange', function() {
            const videos = document.querySelectorAll('video');
            if (document.visibilityState === 'hidden') {
                videos.forEach(video => {
                    if (video) video.pause();
                });
                if (backgroundMusic && musicEnabled) {
                    backgroundMusic.pause();
                }
            } else {
                if (backgroundMusic && musicEnabled) {
                    backgroundMusic.play().catch(() => {
                        console.log('Audio playback failed on visibility change');
                    });
                }
            }
        });
    } catch (error) {
        console.error('Error setting up visibility change handler:', error);
    }

    // Initialize responsive handling
    handleResize();

    // Add additional CSS keyframes for new animations
    try {
        const additionalStyles = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            @keyframes wordReveal {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes titlePulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = additionalStyles;
        document.head.appendChild(styleSheet);
    } catch (error) {
        console.error('Error adding additional styles:', error);
    }

    console.log('🎂 Enhanced Pink & Red Birthday Website loaded successfully! 💖✨');
    console.log('💕 New Features: Mobile video carousel with swipe, pink theme, enhanced UX, comprehensive error handling');
});
