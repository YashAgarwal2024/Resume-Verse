let floatingCards = new Map();

// Make card burn with fire and smoke effects
function makeCardBurn(card) {
    // Add burning class for main animation
    card.classList.add('burning');

    // Add burn glow effect
    const burnGlow = document.createElement('div');
    burnGlow.className = 'burn-glow';
    card.appendChild(burnGlow);

    // Create fire icons at various positions
    createFireIcons(card);

    // Create fire particles immediately
    createFireParticles(card);

    // Create ash particles
    createAshParticles(card);

    // Create smoke particles after a delay
    setTimeout(() => {
        createSmokeParticles(card);
    }, 500);

    // Hide card after burn animation completes
    setTimeout(() => {
        card.style.display = 'none';
        card.classList.add('burned-away');
    }, 4000);
}

// Make card float freely in air with proper spacing
function makeCardFloat(card) {
    // Show floating reset button when first card starts floating
    const floatingCards = document.querySelectorAll('.resume-card.floating');
    if (floatingCards.length === 0) {
        showFloatingResetButton();
    }

    // Get all currently floating cards to avoid overlap
    const occupiedPositions = Array.from(floatingCards).map(c => ({
        x: parseInt(c.style.left) || 0,
        y: parseInt(c.style.top) || 0,
        width: c.offsetWidth,
        height: c.offsetHeight
    }));

    // Find a position that doesn't overlap with existing floating cards
    let randomX, randomY, attempts = 0;
    const cardWidth = card.offsetWidth || 300;
    const cardHeight = card.offsetHeight || 400;
    const minDistance = 200; // Much larger minimum distance between cards

    do {
        const maxX = window.innerWidth - cardWidth - 150;
        const maxY = window.innerHeight - cardHeight - 250; // Extra space for floating reset button
        randomX = Math.random() * maxX + 100;
        randomY = Math.random() * (maxY - 250) + 200; // Keep away from top/bottom edges and reset button

        attempts++;
        if (attempts > 100) break; // More attempts to find good positions

    } while (occupiedPositions.some(pos => {
        const distance = Math.sqrt(
            Math.pow(randomX - pos.x, 2) + Math.pow(randomY - pos.y, 2)
        );
        return distance < (cardWidth + pos.width) / 2 + minDistance;
    }));

    // Set initial position
    card.style.position = 'fixed';
    card.style.left = randomX + 'px';
    card.style.top = randomY + 'px';
    card.style.zIndex = '25';

    // Add floating class for animation
    card.classList.add('floating');

    // Create unique drift pattern with much larger, more spread out movements
    const driftRange = 300; // Much larger drift range for more separation
    const rotationRange = 45; // Increased rotation range

    const driftKeyframes = `
        @keyframes drift-${card.dataset.id} {
            0% { transform: translate(0px, 0px) rotate(0deg); }
            20% { transform: translate(${(Math.random() - 0.5) * driftRange}px, ${(Math.random() - 0.5) * 200}px) rotate(${(Math.random() - 0.5) * rotationRange}deg); }
            40% { transform: translate(${(Math.random() - 0.5) * driftRange}px, ${(Math.random() - 0.5) * 250}px) rotate(${(Math.random() - 0.5) * rotationRange}deg); }
            60% { transform: translate(${(Math.random() - 0.5) * driftRange}px, ${(Math.random() - 0.5) * 200}px) rotate(${(Math.random() - 0.5) * rotationRange}deg); }
            80% { transform: translate(${(Math.random() - 0.5) * driftRange}px, ${(Math.random() - 0.5) * 220}px) rotate(${(Math.random() - 0.5) * rotationRange}deg); }
            100% { transform: translate(0px, 0px) rotate(0deg); }
        }
    `;

    // Create and inject unique animation
    let styleSheet = document.getElementById('dynamic-animations');
    if (!styleSheet) {
        styleSheet = document.createElement('style');
        styleSheet.id = 'dynamic-animations';
        document.head.appendChild(styleSheet);
    }

    styleSheet.textContent += driftKeyframes;

    // Apply the unique animation with varied timing
    const driftDuration = 10 + Math.random() * 6; // 10-16 seconds
    const floatDuration = 8 + Math.random() * 4; // 8-12 seconds
    card.style.animation = `drift-${card.dataset.id} ${driftDuration}s ease-in-out infinite, float-free ${floatDuration}s ease-in-out infinite`;

    // Add floating trail effect
    createFloatingTrail(card);
}

// Create wings for floating cards
function createWings(card) {
    // Remove existing wings
    const existingWings = card.querySelectorAll('.wing');
    existingWings.forEach(wing => wing.remove());

    // Create left wing
    const leftWing = document.createElement('div');
    leftWing.className = 'wing wing-left';
    card.appendChild(leftWing);

    // Create right wing
    const rightWing = document.createElement('div');
    rightWing.className = 'wing wing-right';
    card.appendChild(rightWing);
}

// Create floating trail effect
function createFloatingTrail(card) {
    // Remove existing trail
    const existingTrail = card.querySelector('.floating-trail');
    if (existingTrail) {
        existingTrail.remove();
    }

    const trail = document.createElement('div');
    trail.className = 'floating-trail';
    trail.style.cssText = `
        position: absolute;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, rgba(120, 219, 255, 0.2), rgba(255, 119, 198, 0.2));
        border-radius: 12px;
        filter: blur(8px);
        z-index: -1;
        animation: trail-pulse 3s ease-in-out infinite;
        top: 0;
        left: 0;
    `;

    card.appendChild(trail);
}

// Thanos snap effect - randomly eliminate half of the resume cards
function showThanosSnapGif() {
    // Remove any existing GIF
    const existingGif = document.querySelector('.thanos-snap-gif');
    if (existingGif) {
        existingGif.remove();
    }

    // Create GIF container
    const gifContainer = document.createElement('div');
    gifContainer.className = 'thanos-snap-gif';
    gifContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
        pointer-events: none;
        width: 400px;
        height: 400px;
        background: radial-gradient(circle, rgba(138, 43, 226, 0.3) 0%, transparent 70%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: thanosGlow 2s ease-out;
    `;

    // Create the GIF image
    const gifImage = document.createElement('img');
    gifImage.src = 'assets/thanos.gif';
    gifImage.style.cssText = `
        width: 300px;
        height: 300px;
        object-fit: contain;
        filter: drop-shadow(0 0 20px rgba(138, 43, 226, 0.8));
    `;

    gifContainer.appendChild(gifImage);
    document.body.appendChild(gifContainer);
}

function hideThanosSnapGif() {
    const gifContainer = document.querySelector('.thanos-snap-gif');
    if (gifContainer) {
        gifContainer.style.animation = 'thanosFadeOut 0.5s ease-out';
        setTimeout(() => {
            if (gifContainer.parentNode) {
                gifContainer.parentNode.removeChild(gifContainer);
            }
        }, 500);
    }
}

function thanosSnap() {
    // Get all elements that should be affected by Thanos snap (excluding reset buttons)
    const allCards = Array.from(document.querySelectorAll('.resume-card'));
    const visibleCards = allCards.filter(card => !card.classList.contains('burned-away') && !card.classList.contains('snapped-away') && card.style.display !== 'none');

    // Get other page elements to include in snap
    const titleElement = document.querySelector('h1');
    const commandInput = document.getElementById('command-input');
    const executeButton = document.querySelector('button[onclick="executeCommand()"]');
    const addResumeButton = document.querySelector('button[onclick="toggleAddForm()"]');
    const physicsButtons = document.querySelectorAll('.flex.gap-2 button'); // Physics control buttons

    // Combine all elements to be affected (excluding reset buttons and already snapped elements)
    const allElements = [
        ...visibleCards,
        titleElement,
        commandInput,
        executeButton,
        addResumeButton,
        ...Array.from(physicsButtons)
    ].filter(el => el &&
        !el.id?.includes('reset') &&
        !el.classList.contains('snapped-away') &&
        el.style.display !== 'none' &&
        el !== document.querySelector('.thanos-snap-gif') // Exclude the GIF itself
    );

    if (allElements.length === 0) {
        showNotification('No elements to snap! Everything is already gone.', 'error');
        return;
    }

    // Calculate how many elements to eliminate (half, rounded down)
    const elementsToEliminate = Math.floor(allElements.length / 2);

    if (elementsToEliminate === 0) {
        showNotification('Only one element left - cannot snap!', 'error');
        return;
    }

    // Show Thanos snap GIF animation first
    showThanosSnapGif();

    // Wait for GIF animation to complete (approximately 2 seconds for the snap gesture)
    setTimeout(() => {
        // Remove the GIF
        hideThanosSnapGif();

        // Randomly select elements to eliminate
        const shuffledElements = [...allElements].sort(() => Math.random() - 0.5);
        const elementsToSnap = shuffledElements.slice(0, elementsToEliminate);

        // Create snap effect with particles and animation
        elementsToSnap.forEach((element, index) => {
            setTimeout(() => {
                // Add snap effect class
                element.classList.add('snapped');

                // Create snap particles (only for cards, not for other elements)
                if (element.classList.contains('resume-card')) {
                    createSnapParticles(element);
                }

                // Create purple energy effect for all elements
                createSnapEnergy(element);

                // Make element disappear after effects
                setTimeout(() => {
                    element.style.display = 'none';
                    element.classList.add('snapped-away');
                }, 800);

            }, index * 100); // Stagger the snap effects
        });

        // Update stats
        const remainingElements = allElements.length - elementsToEliminate;
        setTimeout(() => {
            showNotification(`<i class="fas fa-bolt mr-2"></i>Thanos snapped ${elementsToEliminate} elements! ${remainingElements} remain.`, 'success');
            showFloatingResetButton();
        }, elementsToEliminate * 100 + 1000);

    }, 2000); // Wait 2 seconds for GIF animation
}

// Create snap particles effect
function createSnapParticles(card) {
    const particleCount = 15;
    const cardRect = card.getBoundingClientRect();

    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'snap-particle';

            // Random position within card bounds
            const randomX = Math.random() * cardRect.width;
            const randomY = Math.random() * cardRect.height;

            particle.style.left = randomX + 'px';
            particle.style.top = randomY + 'px';

            // Random purple colors
            const colors = ['#9333ea', '#a855f7', '#c084fc', '#d8b4fe', '#e9d5ff'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];

            // Random size
            const size = 3 + Math.random() * 6;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';

            // Random explosion direction
            const angle = Math.random() * Math.PI * 2;
            const distance = 100 + Math.random() * 200;
            const targetX = Math.cos(angle) * distance;
            const targetY = Math.sin(angle) * distance;

            particle.style.setProperty('--target-x', targetX + 'px');
            particle.style.setProperty('--target-y', targetY + 'px');

            card.appendChild(particle);

            // Remove particle after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1000);
        }, i * 20);
    }
}

// Create purple energy effect
function createSnapEnergy(card) {
    const energy = document.createElement('div');
    energy.className = 'snap-energy';
    energy.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, rgba(147, 51, 234, 0.8) 0%, rgba(168, 85, 247, 0.6) 50%, transparent 100%);
        border-radius: 12px;
        animation: snap-energy-pulse 0.8s ease-out forwards;
        pointer-events: none;
        z-index: 50;
    `;

    card.appendChild(energy);

    // Remove energy effect after animation
    setTimeout(() => {
        if (energy.parentNode) {
            energy.parentNode.removeChild(energy);
        }
    }, 800);
}

// Tornado animation - spin all cards in a furious cyclone
function startTornado() {
    // Get all elements that should be affected by tornado (excluding reset buttons)
    const allCards = Array.from(document.querySelectorAll('.resume-card'));
    const visibleCards = allCards.filter(card => !card.classList.contains('burned-away') && !card.classList.contains('snapped-away') && card.style.display !== 'none');

    // Get other page elements to include in tornado
    const titleElement = document.querySelector('h1');
    const commandInput = document.getElementById('command-input');
    const executeButton = document.querySelector('button[onclick="executeCommand()"]');
    const addResumeButton = document.querySelector('button[onclick="toggleAddForm()"]');
    const physicsButtons = document.querySelectorAll('.flex.gap-2 button'); // Physics control buttons

    // Combine all elements to be affected
    const allElements = [
        ...visibleCards,
        titleElement,
        commandInput,
        executeButton,
        addResumeButton,
        ...Array.from(physicsButtons)
    ].filter(el => el && !el.id?.includes('reset')); // Exclude reset buttons

    if (allElements.length === 0) {
        showNotification('No elements to tornado!', 'error');
        return;
    }

    // Create tornado funnel effect
    createTornadoFunnel();

    // Calculate center of the screen
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const radius = Math.min(window.innerWidth, window.innerHeight) * 0.3; // Tornado radius

    allElements.forEach((element, index) => {
        // Add tornado class for styling
        element.classList.add('in-tornado');

        // Calculate position in the tornado
        const angle = (index / allElements.length) * Math.PI * 2;
        const targetX = centerX + Math.cos(angle) * radius;
        const targetY = centerY + Math.sin(angle) * radius;

        // Store original position for restoration
        element.dataset.originalPosition = element.style.position || 'static';
        element.dataset.originalLeft = element.style.left || '';
        element.dataset.originalTop = element.style.top || '';
        element.dataset.originalZIndex = element.style.zIndex || '';

        // Set initial tornado position
        element.style.position = 'fixed';
        element.style.left = targetX - element.offsetWidth / 2 + 'px';
        element.style.top = targetY - element.offsetHeight / 2 + 'px';
        element.style.zIndex = '30';
        element.style.transition = 'all 0.5s ease-out';

        // Start the spinning animation with RANDOM delay (0-2000ms)
        const randomDelay = Math.random() * 2000; // Random delay between 0-2 seconds
        setTimeout(() => {
            startCardSpin(element, centerX, centerY, radius, angle);
        }, randomDelay);
    });

    showNotification(`<i class="fas fa-wind mr-2"></i>Tornado activated! ${allElements.length} elements are spinning in the cyclone!`, 'success');
}

// Stop tornado animation
function stopTornado() {
    const tornadoElements = document.querySelectorAll('.in-tornado');

    tornadoElements.forEach(element => {
        element.classList.remove('in-tornado');
        element.style.animation = '';
        element.style.transform = '';

        // Restore original position
        if (element.dataset.originalPosition) {
            element.style.position = element.dataset.originalPosition;
        }
        if (element.dataset.originalLeft) {
            element.style.left = element.dataset.originalLeft;
        }
        if (element.dataset.originalTop) {
            element.style.top = element.dataset.originalTop;
        }
        if (element.dataset.originalZIndex) {
            element.style.zIndex = element.dataset.originalZIndex;
        }

        // Clean up dataset attributes
        delete element.dataset.originalPosition;
        delete element.dataset.originalLeft;
        delete element.dataset.originalTop;
        delete element.dataset.originalZIndex;
    });

    // Remove tornado funnel
    const funnel = document.querySelector('.tornado-funnel');
    if (funnel) {
        funnel.remove();
    }

    showNotification('<i class="fas fa-wind mr-2"></i>Tornado stopped - all elements returning to normal!', 'info');
}

// Create tornado funnel visual effect
function createTornadoFunnel() {
    // Remove existing funnel
    const existingFunnel = document.querySelector('.tornado-funnel');
    if (existingFunnel) {
        existingFunnel.remove();
    }

    const funnel = document.createElement('div');
    funnel.className = 'tornado-funnel';
    funnel.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 200px;
        height: 400px;
        background: conic-gradient(from 0deg, transparent 0deg, rgba(255, 255, 255, 0.1) 90deg, transparent 180deg, rgba(255, 255, 255, 0.1) 270deg, transparent 360deg);
        border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
        animation: tornado-funnel-spin 2s linear infinite;
        pointer-events: none;
        z-index: 25;
        filter: blur(1px);
    `;

    document.body.appendChild(funnel);
}

// Start spinning animation for individual card
function startCardSpin(card, centerX, centerY, radius, initialAngle) {
    let angle = initialAngle;
    let spinCount = 0;

    // Randomize spinning characteristics for each element
    const spinSpeed = 0.08 + Math.random() * 0.12; // Random speed between 0.08-0.2
    const scaleVariation = 0.1 + Math.random() * 0.3; // Random scale variation 0.1-0.4
    const wobbleAmount = Math.random() * 0.5; // Random wobble 0-0.5
    const verticalDrift = Math.random() * 0.02 - 0.01; // Random vertical movement

    function animate() {
        if (!card.classList.contains('in-tornado')) {
            return; // Stop if tornado is deactivated
        }

        angle += spinSpeed; // Variable speed
        spinCount += spinSpeed * 2; // Variable rotation speed

        // Add some wobble to the radius for more chaotic movement
        const wobbleRadius = radius * (1 + Math.sin(spinCount * 2) * wobbleAmount);

        // Calculate new position with wobble
        const x = centerX + Math.cos(angle) * wobbleRadius;
        const y = centerY + Math.sin(angle) * wobbleRadius + Math.sin(spinCount) * 20; // Add vertical oscillation

        // Apply position and rotation with random variations
        card.style.left = x - card.offsetWidth / 2 + 'px';
        card.style.top = y - card.offsetHeight / 2 + 'px';

        // More complex transform with random scale and rotation variations
        const scale = 0.7 + Math.sin(spinCount) * scaleVariation;
        const rotation = spinCount * (15 + Math.random() * 10); // Random rotation multiplier
        const wobbleX = Math.sin(spinCount * 3) * 5; // Horizontal wobble
        const wobbleY = Math.cos(spinCount * 2) * 3; // Vertical wobble

        card.style.transform = `rotate(${rotation}deg) scale(${scale}) translate(${wobbleX}px, ${wobbleY}px)`;

        requestAnimationFrame(animate);
    }

    animate();
}

// Activate tornado animation (called by HTML button)
function activateTornado() {
    startTornado();
}

// Export functions for use in other modules
window.makeCardBurn = makeCardBurn;
window.makeCardFloat = makeCardFloat;
window.createWings = createWings;
window.createFloatingTrail = createFloatingTrail;
window.thanosSnap = thanosSnap;
window.showThanosSnapGif = showThanosSnapGif;
window.hideThanosSnapGif = hideThanosSnapGif;
window.startTornado = startTornado;
window.stopTornado = stopTornado;
window.activateTornado = activateTornado;