// Particle Effects Module
// Global particle variables (shared across modules)
let starsGenerated = false;

// Create fire particles for burning effect
function createFireParticles(card) {
    const particleCount = 25; // More particles for intense effect
    const cardRect = card.getBoundingClientRect();

    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'fire-particle';

            // Focus more particles at the bottom where fire is strongest
            const randomX = Math.random() * cardRect.width;
            const randomY = Math.random() * (cardRect.height * 0.8) + (cardRect.height * 0.2); // Bottom 80%

            particle.style.left = randomX + 'px';
            particle.style.top = randomY + 'px';

            // Random horizontal drift
            const driftX = (Math.random() - 0.5) * 80;
            particle.style.setProperty('--random-x', driftX + 'px');

            // Random animation duration
            const duration = 1.2 + Math.random() * 1.8;
            particle.style.animation = `fire-rise ${duration}s ease-out forwards`;

            // Random size for variety
            const size = 6 + Math.random() * 8;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';

            card.appendChild(particle);

            // Remove particle after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, duration * 1000);
        }, i * 80);
    }
}

// Create ash particles for burning effect
function createAshParticles(card) {
    const ashCount = 20;
    const cardRect = card.getBoundingClientRect();

    for (let i = 0; i < ashCount; i++) {
        setTimeout(() => {
            const ash = document.createElement('div');
            ash.className = 'ash-particle';
            ash.style.cssText = `
                position: absolute;
                width: ${2 + Math.random() * 4}px;
                height: ${2 + Math.random() * 4}px;
                background: ${Math.random() > 0.5 ? '#666' : '#999'};
                border-radius: 50%;
                pointer-events: none;
                z-index: 38;
                opacity: ${0.6 + Math.random() * 0.4};
            `;

            // Random position within card bounds
            const randomX = Math.random() * cardRect.width;
            const randomY = Math.random() * cardRect.height;

            ash.style.left = randomX + 'px';
            ash.style.top = randomY + 'px';

            // Random drift for ash
            const driftX = (Math.random() - 0.5) * 120;
            const driftY = -100 - Math.random() * 150;
            ash.style.setProperty('--ash-x', driftX + 'px');
            ash.style.setProperty('--ash-y', driftY + 'px');

            // Random animation duration
            const duration = 2 + Math.random() * 3;
            ash.style.animation = `ash-float ${duration}s ease-out forwards`;

            card.appendChild(ash);

            // Remove ash after animation
            setTimeout(() => {
                if (ash.parentNode) {
                    ash.parentNode.removeChild(ash);
                }
            }, duration * 1000);
        }, i * 150 + 800); // Start ash after fire begins
    }
}

// Create smoke particles for burning effect
function createSmokeParticles(card) {
    const smokeCount = 8;
    const cardRect = card.getBoundingClientRect();

    for (let i = 0; i < smokeCount; i++) {
        setTimeout(() => {
            const smoke = document.createElement('div');
            smoke.className = 'smoke-particle';

            // Random position within card bounds
            const randomX = Math.random() * cardRect.width;
            const randomY = Math.random() * (cardRect.height * 0.3); // Start from top area

            smoke.style.left = randomX + 'px';
            smoke.style.top = randomY + 'px';

            // Random horizontal drift for smoke
            const driftX = (Math.random() - 0.5) * 100;
            smoke.style.setProperty('--smoke-x', driftX + 'px');

            // Random animation duration
            const duration = 2 + Math.random() * 2;
            smoke.style.animation = `smoke-rise ${duration}s ease-out forwards`;

            card.appendChild(smoke);

            // Remove smoke after animation
            setTimeout(() => {
                if (smoke.parentNode) {
                    smoke.parentNode.removeChild(smoke);
                }
            }, duration * 1000);
        }, i * 200 + 1000); // Start smoke after fire begins
    }
}

// Create fire icons at various positions on the card
function createFireIcons(card) {
    // Create broad bottom fire coverage
    const bottomFireCount = 12; // Many fire icons for broad coverage
    for (let i = 0; i < bottomFireCount; i++) {
        setTimeout(() => {
            const fireIcon = document.createElement('div');
            fireIcon.className = 'fire-icon bottom-fire';
            fireIcon.innerHTML = '<i class="fas fa-fire text-orange-500"></i>';
            fireIcon.style.cssText = `
                position: absolute;
                bottom: ${-5 + Math.random() * 15}px;
                left: ${(i / bottomFireCount) * 100 + Math.random() * 8}%;
                font-size: ${24 + Math.random() * 16}px;
                z-index: 40;
                pointer-events: none;
                animation: fire-dance ${0.3 + Math.random() * 0.4}s ease-in-out infinite alternate,
                           fire-sway ${1 + Math.random() * 0.5}s ease-in-out infinite;
                transform-origin: bottom center;
                filter: brightness(${1 + Math.random() * 0.5}) saturate(${1.2 + Math.random() * 0.3});
            `;

            card.appendChild(fireIcon);

            // Remove fire icon after burn animation
            setTimeout(() => {
                if (fireIcon.parentNode) {
                    fireIcon.parentNode.removeChild(fireIcon);
                }
            }, 3500);
        }, i * 50); // Quick succession for broad coverage
    }

    // Additional scattered fire positions for complete coverage
    const scatteredPositions = [
        { top: '10px', right: '10px' },      // Top right
        { bottom: '25px', left: '15px' },    // Bottom left elevated
        { top: '50%', right: '5px' },        // Middle right
        { bottom: '40%', left: '5px' },      // Middle left elevated
        { top: '15px', left: '50%' },        // Top center
        { bottom: '20px', right: '30%' },    // Bottom right elevated
        { top: '30%', left: '20%' },         // Random position 1
        { bottom: '35%', right: '25%' },     // Random position 2 elevated
        { top: '70%', left: '80%' },         // Side fire
        { bottom: '50%', left: '70%' }       // Mid-bottom fire
    ];

    scatteredPositions.forEach((position, index) => {
        setTimeout(() => {
            const fireIcon = document.createElement('div');
            fireIcon.className = 'fire-icon scattered-fire';
            fireIcon.innerHTML = '<i class="fas fa-fire text-red-500"></i>';
            fireIcon.style.cssText = `
                position: absolute;
                font-size: ${18 + Math.random() * 12}px;
                z-index: 40;
                pointer-events: none;
                animation: fire-dance ${0.4 + Math.random() * 0.6}s ease-in-out infinite alternate,
                           fire-flicker ${0.8 + Math.random() * 0.4}s ease-in-out infinite;
                transform-origin: center;
                filter: brightness(${1 + Math.random() * 0.4}) saturate(${1.1 + Math.random() * 0.4});
            `;

            // Set position
            Object.keys(position).forEach(key => {
                fireIcon.style[key] = position[key];
            });

            card.appendChild(fireIcon);

            // Remove fire icon after burn animation
            setTimeout(() => {
                if (fireIcon.parentNode) {
                    fireIcon.parentNode.removeChild(fireIcon);
                }
            }, 3500);
        }, 600 + index * 100); // Start after bottom fire is established
    });
}

// Create sparkle effect for high achievers
function createSparkleEffect(card) {
    const sparkles = 8;
    for (let i = 0; i < sparkles; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'absolute w-2 h-2 bg-yellow-300 rounded-full pointer-events-none';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.animation = 'sparkle-burst 1s ease-out forwards';

            card.appendChild(sparkle);

            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.parentNode.removeChild(sparkle);
                }
            }, 1000);
        }, i * 100);
    }
}

// Generate animated stars
function generateStars() {
    if (starsGenerated) return; // Prevent multiple generations

    const starsContainer = document.getElementById('stars-container');
    const starCount = 100;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.animationDuration = (2 + Math.random() * 3) + 's';

        // Random star sizes
        const size = Math.random() * 3 + 1;
        star.style.width = size + 'px';
        star.style.height = size + 'px';

        starsContainer.appendChild(star);
    }

    starsGenerated = true;
}

// Export functions for use in other modules
window.createFireParticles = createFireParticles;
window.createAshParticles = createAshParticles;
window.createSmokeParticles = createSmokeParticles;
window.createFireIcons = createFireIcons;
window.createSparkleEffect = createSparkleEffect;
window.generateStars = generateStars;