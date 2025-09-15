// Physics Engine Module
// Global physics variables (shared across modules)
let engine, render, world;
let physicsEnabled = true;
let physicsBodies = new Map();
let tornadoActive = false;
let waterActive = false;

// Initialize Matter.js
function initPhysics() {
    engine = Matter.Engine.create();
    world = engine.world;

    // Disable gravity by default
    world.gravity.y = 0;

    const canvas = document.getElementById('physics-canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create boundaries
    const boundaries = [
        Matter.Bodies.rectangle(window.innerWidth / 2, -25, window.innerWidth, 50, { isStatic: true }),
        Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 25, window.innerWidth, 50, { isStatic: true }),
        Matter.Bodies.rectangle(-25, window.innerHeight / 2, 50, window.innerHeight, { isStatic: true }),
        Matter.Bodies.rectangle(window.innerWidth + 25, window.innerHeight / 2, 50, window.innerHeight, { isStatic: true })
    ];

    Matter.World.add(world, boundaries);

    // Start the engine
    Matter.Engine.run(engine);
}

// Create physics bodies for resume cards
function createPhysicsBodies() {
    // Clear existing bodies
    physicsBodies.forEach(body => {
        Matter.World.remove(world, body);
    });
    physicsBodies.clear();

    const cards = document.querySelectorAll('.resume-card');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const body = Matter.Bodies.rectangle(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            rect.width,
            rect.height,
            {
                restitution: 0.8,
                friction: 0.3,
                frictionAir: 0.01
            }
        );

        Matter.World.add(world, body);
        physicsBodies.set(card.dataset.id, { body, element: card });
    });
}

// Sync physics bodies with DOM elements
function syncPhysicsWithDOM() {
    if (!physicsEnabled) return;

    physicsBodies.forEach(({ body, element }) => {
        element.style.position = 'absolute';
        element.style.left = (body.position.x - element.offsetWidth / 2) + 'px';
        element.style.top = (body.position.y - element.offsetHeight / 2) + 'px';
        element.style.transform = `rotate(${body.angle}rad)`;
    });

    requestAnimationFrame(syncPhysicsWithDOM);
}

// Physics controls
function togglePhysics() {
    physicsEnabled = !physicsEnabled;
    document.getElementById('physics-status').textContent = physicsEnabled ? 'On' : 'Off';

    if (physicsEnabled) {
        // Reset gravity when enabling physics
        world.gravity.y = 0.5;
        world.gravity.x = 0;
        createPhysicsBodies();
        syncPhysicsWithDOM();
    } else {
        // Reset positions
        document.querySelectorAll('.resume-card').forEach(card => {
            card.style.position = 'relative';
            card.style.left = 'auto';
            card.style.top = 'auto';
            card.style.transform = 'none';
        });
    }
}

function activateWater() {
    waterActive = !waterActive;
    const waterEffect = document.getElementById('water-effect');

    if (waterActive) {
        waterEffect.classList.remove('hidden');
        if (!physicsEnabled) togglePhysics();

        // Apply buoyancy force
        physicsBodies.forEach(({ body }) => {
            if (body.position.y > window.innerHeight - 200) {
                Matter.Body.applyForce(body, body.position, { x: 0, y: -0.03 });
            }
        });
    } else {
        waterEffect.classList.add('hidden');
    }
}

function activateTornado() {
    tornadoActive = !tornadoActive;
    const tornadoEffect = document.getElementById('tornado-effect');

    if (tornadoActive) {
        tornadoEffect.classList.remove('hidden');
        tornadoEffect.style.left = (window.innerWidth / 2 - 100) + 'px';
        tornadoEffect.style.top = (window.innerHeight / 2 - 100) + 'px';

        if (!physicsEnabled) togglePhysics();

        // Create tornado effect
        const tornadoInterval = setInterval(() => {
            if (!tornadoActive) {
                clearInterval(tornadoInterval);
                return;
            }

            physicsBodies.forEach(({ body }) => {
                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;
                const dx = body.position.x - centerX;
                const dy = body.position.y - centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 300) {
                    const force = 0.001 * (300 - distance) / 300;
                    Matter.Body.applyForce(body, body.position, {
                        x: -dy * force,
                        y: dx * force
                    });
                }
            });
        }, 16);
    } else {
        tornadoEffect.classList.add('hidden');
    }
}

// Enhanced water activation with rising water effect
function activateWater() {
    const waterEffect = document.getElementById('water-effect');
    waterActive = !waterActive;

    if (waterActive) {
        // Clear any existing water content
        waterEffect.innerHTML = '';

        // Create water image container
        const waterImage = document.createElement('img');
        waterImage.className = 'water-image';
        waterImage.src = 'assets/water.png';
        waterImage.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            object-fit: cover;
            opacity: 0.3;
            animation: water-rise 8s ease-out forwards;
            pointer-events: none;
            z-index: 5;
        `;

        waterEffect.appendChild(waterImage);
        waterEffect.classList.remove('hidden');

        // Apply floating effects to elements after water starts rising
        setTimeout(() => {
            applyWaterFloatingEffects();
        }, 2000); // Increased delay to 2 seconds

        showNotification('<i class="fas fa-water mr-2"></i>Water mode activated! Watch the water rise...', 'success');
    } else {
        // Remove water effects
        waterEffect.classList.add('hidden');
        waterEffect.innerHTML = ''; // Clear the water image
        removeWaterFloatingEffects();
        showNotification('Water mode deactivated!', 'info');
    }
}

// Apply floating effects based on CGPA and element type
function applyWaterFloatingEffects() {
    // Get all resume cards and sort by CGPA
    const resumeCards = Array.from(document.querySelectorAll('.resume-card'));
    const visibleCards = resumeCards.filter(card =>
        !card.classList.contains('burned-away') &&
        !card.classList.contains('snapped-away') &&
        card.style.display !== 'none'
    );

    // Sort cards by CGPA (high to low)
    const sortedCards = visibleCards.sort((a, b) => {
        const cgpaA = parseFloat(a.dataset.cgpa) || 0;
        const cgpaB = parseFloat(b.dataset.cgpa) || 0;
        return cgpaB - cgpaA; // High CGPA first
    });

    // Apply floating effects to cards based on CGPA
    sortedCards.forEach((card, index) => {
        const cgpa = parseFloat(card.dataset.cgpa) || 0;

        if (cgpa >= 9.0) {
            // High CGPA (>=9.0) cards float above water
            card.classList.add('water-floating-high');
            card.style.zIndex = '15';
        } else {
            // Low CGPA (<9.0) cards sink to waterbed
            card.classList.add('water-sinking');
            card.style.zIndex = '8';
        }
    });

    // Apply floating effects to other elements (buttons, text, etc.)
    const elementsToFloat = [
        document.querySelector('h1'), // Title
        document.getElementById('command-input'), // Command input
        document.querySelector('button[onclick="executeCommand()"]'), // Execute button
        document.querySelector('button[onclick="toggleAddForm()"]'), // Add resume button
        ...document.querySelectorAll('.flex.gap-2 button') // Physics control buttons
    ].filter(el => el && !el.id?.includes('reset')); // Exclude reset button

    elementsToFloat.forEach((element, index) => {
        element.classList.add('water-floating-ui');
        element.style.zIndex = '20';
    });
}

// Remove all water floating effects
function removeWaterFloatingEffects() {
    // Clear the water effect container completely
    const waterEffect = document.getElementById('water-effect');
    if (waterEffect) {
        waterEffect.innerHTML = '';
        waterEffect.classList.add('hidden');
    }

    // Reset water active state
    waterActive = false;

    // Remove effects from all elements
    const allElements = [
        ...document.querySelectorAll('.resume-card'),
        document.querySelector('h1'),
        document.getElementById('command-input'),
        document.querySelector('button[onclick="executeCommand()"]'),
        document.querySelector('button[onclick="toggleAddForm()"]'),
        ...document.querySelectorAll('.flex.gap-2 button')
    ].filter(el => el);

    allElements.forEach(element => {
        element.classList.remove('water-floating-high', 'water-floating-medium', 'water-sinking', 'water-floating-ui');
        element.style.position = '';
        element.style.left = '';
        element.style.top = '';
        element.style.zIndex = '';
        element.style.animation = '';
    });
}

// Dedicated function to reset water mode
function resetWaterMode() {
    const waterEffect = document.getElementById('water-effect');
    if (waterEffect) {
        waterEffect.innerHTML = '';
        waterEffect.classList.add('hidden');
    }
    waterActive = false;
    removeWaterFloatingEffects();
    console.log('Water mode reset complete');
}

// Podium effect - show top 3 CGPA students on podium, hide others
function activatePodium() {
    // Get all resume cards and sort by CGPA (highest first)
    const resumeCards = Array.from(document.querySelectorAll('.resume-card'));
    const visibleCards = resumeCards.filter(card =>
        !card.classList.contains('burned-away') &&
        !card.classList.contains('snapped-away') &&
        card.style.display !== 'none'
    );

    // Sort cards by CGPA (high to low)
    const sortedCards = visibleCards.sort((a, b) => {
        const cgpaA = parseFloat(a.dataset.cgpa) || 0;
        const cgpaB = parseFloat(b.dataset.cgpa) || 0;
        return cgpaB - cgpaA; // High CGPA first
    });

    // Take top 3
    const top3Cards = sortedCards.slice(0, 3);
    const otherCards = sortedCards.slice(3);

    // Hide all other cards
    otherCards.forEach(card => {
        card.style.display = 'none';
        card.classList.add('podium-hidden');
    });

    // Position top 3 on podium
    const podiumPositions = [
        { x: window.innerWidth * 0.2, y: window.innerHeight * 0.6, height: 1, color: '#FFD700' }, // Gold - 1st place
        { x: window.innerWidth * 0.5, y: window.innerHeight * 0.7, height: 2, color: '#C0C0C0' }, // Silver - 2nd place
        { x: window.innerWidth * 0.8, y: window.innerHeight * 0.8, height: 3, color: '#CD7F32' }  // Bronze - 3rd place
    ];

    top3Cards.forEach((card, index) => {
        const position = podiumPositions[index];
        const cgpa = parseFloat(card.dataset.cgpa) || 0;

        // Position card on podium
        card.style.position = 'absolute';
        card.style.left = (position.x - card.offsetWidth / 2) + 'px';
        card.style.top = (position.y - card.offsetHeight) + 'px';
        card.style.zIndex = '20';
        card.style.display = 'block';
        card.classList.add('podium-card');

        // Add podium stand visual effect
        const podiumStand = document.createElement('div');
        podiumStand.className = 'podium-stand';
        podiumStand.style.cssText = `
            position: absolute;
            left: ${position.x - 60}px;
            top: ${position.y - 20}px;
            width: 120px;
            height: ${position.height * 40}px;
            background: linear-gradient(180deg, ${position.color} 0%, ${position.color}80 100%);
            border-radius: 10px 10px 0 0;
            border: 3px solid ${position.color}DD;
            z-index: 15;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: white;
            font-size: 18px;
        `;
        podiumStand.textContent = `${index + 1}st`;

        // Add medal icon based on position
        const medalIcons = ['<i class="fas fa-medal text-yellow-400"></i>', '<i class="fas fa-medal text-gray-400"></i>', '<i class="fas fa-medal text-amber-600"></i>'];
        const medalDiv = document.createElement('div');
        medalDiv.style.cssText = `
            position: absolute;
            top: -30px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 24px;
            z-index: 25;
        `;
        medalDiv.innerHTML = medalIcons[index];

        podiumStand.appendChild(medalDiv);
        document.body.appendChild(podiumStand);

        // Add celebration animation
        card.style.animation = 'podium-celebration 2s ease-out';
        card.style.transform = 'scale(1.05)';

        // Add CGPA display
        const cgpaDisplay = document.createElement('div');
        cgpaDisplay.className = 'cgpa-display';
        cgpaDisplay.style.cssText = `
            position: absolute;
            top: -40px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 5px 10px;
            border-radius: 15px;
            font-weight: bold;
            font-size: 14px;
            z-index: 25;
        `;
        cgpaDisplay.textContent = `CGPA: ${cgpa}`;
        card.appendChild(cgpaDisplay);
    });

    // Show floating reset button for easy access
    if (typeof showFloatingResetButton === 'function') {
        showFloatingResetButton();
    }

    showNotification('<i class="fas fa-trophy mr-2"></i>Podium activated! Top 3 CGPA students on the podium!', 'success');
}

// Reset podium effect and show all resumes
function resetPodiumMode() {
    // Show all hidden cards
    const hiddenCards = document.querySelectorAll('.podium-hidden');
    hiddenCards.forEach(card => {
        card.style.display = 'block';
        card.classList.remove('podium-hidden');
    });

    // Remove podium cards styling
    const podiumCards = document.querySelectorAll('.podium-card');
    podiumCards.forEach(card => {
        card.classList.remove('podium-card');
        card.style.position = 'relative';
        card.style.left = 'auto';
        card.style.top = 'auto';
        card.style.zIndex = '';
        card.style.animation = '';
        card.style.transform = '';

        // Remove CGPA display
        const cgpaDisplay = card.querySelector('.cgpa-display');
        if (cgpaDisplay) {
            cgpaDisplay.remove();
        }
    });

    // Remove podium stands
    const podiumStands = document.querySelectorAll('.podium-stand');
    podiumStands.forEach(stand => {
        stand.remove();
    });

    // Hide floating reset button
    if (typeof hideFloatingResetButton === 'function') {
        hideFloatingResetButton();
    }

    console.log('Podium mode reset complete');
}

// Font changing functionality
const availableFonts = {
    'inter': 'Inter',
    'roboto': 'Roboto',
    'open-sans': 'Open Sans',
    'lato': 'Lato',
    'montserrat': 'Montserrat',
    'poppins': 'Poppins',
    'raleway': 'Raleway',
    'nunito': 'Nunito',
    'playfair-display': 'Playfair Display',
    'merriweather': 'Merriweather',
    'source-sans-pro': 'Source Sans Pro',
    'ubuntu': 'Ubuntu',
    'pt-sans': 'PT Sans',
    'roboto-mono': 'Roboto Mono'
};

function changeFont(fontName) {
    const normalizedFont = fontName.toLowerCase().replace(/\s+/g, '-');

    if (availableFonts[normalizedFont]) {
        const fontFamily = availableFonts[normalizedFont];

        // Apply font to body and all elements
        document.body.style.fontFamily = `'${fontFamily}', sans-serif`;

        // Apply to specific elements that might override
        const elementsToUpdate = [
            ...document.querySelectorAll('h1, h2, h3, h4, h5, h6'),
            ...document.querySelectorAll('p, span, div, button, input, textarea'),
            ...document.querySelectorAll('.resume-card'),
            document.querySelector('#command-input'),
            ...document.querySelectorAll('.notification')
        ];

        elementsToUpdate.forEach(element => {
            if (element) {
                element.style.fontFamily = `'${fontFamily}', sans-serif`;
            }
        });

        showNotification(`<i class="fas fa-font mr-2"></i>Font changed to ${fontFamily}!`, 'success');
        return true;
    } else {
        const availableFontsList = Object.values(availableFonts).join(', ');
        showNotification(`<i class="fas fa-exclamation-triangle mr-2"></i>Font '${fontName}' not found. Available fonts: ${availableFontsList}`, 'error');
        return false;
    }
}

function resetFont() {
    // Reset to default font (Inter)
    document.body.style.fontFamily = "'Inter', sans-serif";

    const elementsToReset = [
        ...document.querySelectorAll('h1, h2, h3, h4, h5, h6'),
        ...document.querySelectorAll('p, span, div, button, input, textarea'),
        ...document.querySelectorAll('.resume-card'),
        document.querySelector('#command-input'),
        ...document.querySelectorAll('.notification')
    ];

    elementsToReset.forEach(element => {
        if (element) {
            element.style.fontFamily = "'Inter', sans-serif";
        }
    });

    showNotification('<i class="fas fa-undo mr-2"></i>Font reset to default (Inter)!', 'info');
}

// Export functions for use in other modules
window.initPhysics = initPhysics;
window.createPhysicsBodies = createPhysicsBodies;
window.syncPhysicsWithDOM = syncPhysicsWithDOM;
window.togglePhysics = togglePhysics;
window.activateWater = activateWater;
window.resetWaterMode = resetWaterMode;
window.activatePodium = activatePodium;
window.resetPodiumMode = resetPodiumMode;
window.changeFont = changeFont;
window.resetFont = resetFont;