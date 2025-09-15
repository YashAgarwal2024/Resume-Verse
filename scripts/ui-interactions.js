// UI Interactions Module
// Note: resumeData is defined globally in main.js

// Card interaction handlers
function handleCardHover(card, isEntering) {
    // Only trigger focus mode if card has animations (floating, glowing, etc.)
    const hasAnimations = card.classList.contains('floating') ||
                         card.classList.contains('glowing') ||
                         card.classList.contains('high-cgpa');

    if (!hasAnimations) return;

    if (isEntering) {
        enterFocusMode(card);
    } else {
        // Small delay before exiting to prevent flickering
        setTimeout(() => {
            if (!card.matches(':hover')) {
                exitFocusMode();
            }
        }, 100);
    }
}

function handleCardClick(card) {
    // Toggle focus mode on click for animated cards
    const hasAnimations = card.classList.contains('floating') ||
                         card.classList.contains('glowing') ||
                         card.classList.contains('high-cgpa');

    if (!hasAnimations) return;

    if (focusMode && focusedCard === card) {
        exitFocusMode();
    } else {
        enterFocusMode(card);
    }
}

// Render resumes
function renderResumes(resumes = resumeData) {
    const grid = document.getElementById('resume-grid');
    grid.innerHTML = resumes.map(createResumeCard).join('');

    // Update stats
    document.getElementById('total-count').textContent = resumeData.length;
    document.getElementById('filtered-count').textContent = resumes.length;

    // Create physics bodies if physics is enabled
    if (physicsEnabled) {
        createPhysicsBodies();
    }
}

// Show/hide floating reset button
function showFloatingResetButton() {
    const floatingResetBtn = document.getElementById('floating-reset-button');
    const normalResetBtn = document.getElementById('reset-button').parentElement;

    floatingResetBtn.classList.remove('hidden');
    normalResetBtn.style.opacity = '0.3'; // Dim the normal reset button
}

function hideFloatingResetButton() {
    const floatingResetBtn = document.getElementById('floating-reset-button');
    const normalResetBtn = document.getElementById('reset-button').parentElement;

    floatingResetBtn.classList.add('hidden');
    normalResetBtn.style.opacity = '1'; // Restore normal reset button
}

// Show notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg text-white font-medium transform transition-all duration-300 translate-x-full`;

    switch (type) {
        case 'success':
            notification.classList.add('bg-green-600');
            break;
        case 'error':
            notification.classList.add('bg-red-600');
            break;
        default:
            notification.classList.add('bg-blue-600');
    }

    notification.textContent = message;
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function resetPositions() {
    // Exit focus mode first
    exitFocusMode();

    // Hide floating reset button and restore normal one
    hideFloatingResetButton();

    // Stop tornado if active
    stopTornado();

    // Stop water mode if active
    if (waterActive) {
        if (typeof resetWaterMode === 'function') {
            resetWaterMode();
        } else {
            // Fallback to manual reset
            const waterEffect = document.getElementById('water-effect');
            waterEffect.classList.add('hidden');
            waterEffect.innerHTML = '';
            waterActive = false;
            removeWaterFloatingEffects();
        }
    }

    // Stop podium mode if active
    if (typeof resetPodiumMode === 'function') {
        resetPodiumMode();
    }

    // Reset font to default
    if (typeof resetFont === 'function') {
        resetFont();
    }

    if (physicsEnabled) {
        physicsBodies.forEach(({ body }) => {
            Matter.Body.setPosition(body, {
                x: Math.random() * window.innerWidth,
                y: Math.random() * 200 + 100
            });
            Matter.Body.setAngle(body, 0);
            Matter.Body.setVelocity(body, { x: 0, y: 0 });
            Matter.Body.setAngularVelocity(body, 0);
        });
    }

    // Clear effects and reset positions for ALL elements (including tornado-affected ones)
    const allElements = [
        ...document.querySelectorAll('.resume-card'),
        document.querySelector('h1'), // Title
        document.getElementById('command-input'), // Command input
        document.querySelector('button[onclick="executeCommand()"]'), // Execute button
        document.querySelector('button[onclick="toggleAddForm()"]'), // Add resume button
        ...document.querySelectorAll('.flex.gap-2 button') // Physics control buttons
    ].filter(el => el); // Remove null elements

    allElements.forEach((element, index) => {
        // Add transition for smooth return
        element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';

        setTimeout(() => {
            // Remove all effect classes
            element.classList.remove('glowing', 'floating', 'high-cgpa', 'focused', 'hidden-by-focus',
                                   'burning', 'burned-away', 'snapped', 'snapped-away', 'in-tornado',
                                   'water-floating-high', 'water-floating-medium', 'water-sinking', 'water-floating-ui');

            // Reset all positioning and styling
            element.style.position = '';
            element.style.left = '';
            element.style.top = '';
            element.style.zIndex = '';
            element.style.animation = '';
            element.style.transform = '';
            element.style.display = ''; // Restore burned cards
            element.style.opacity = ''; // Reset opacity
            element.style.filter = ''; // Reset filters

            // Remove floating trails
            const trail = element.querySelector('.floating-trail');
            if (trail) {
                trail.remove();
            }

            // Remove burn glow effects
            const burnGlow = element.querySelector('.burn-glow');
            if (burnGlow) {
                burnGlow.remove();
            }

            // Remove any remaining fire, smoke, ash particles and fire icons
            const particles = element.querySelectorAll('.fire-particle, .smoke-particle, .ash-particle, .fire-icon');
            particles.forEach(particle => particle.remove());

            // Remove transition after animation completes
            setTimeout(() => {
                element.style.transition = '';
            }, 800);
        }, index * 50); // Stagger the reset animation
    });

    // Clear dynamic animations
    const dynamicStyles = document.getElementById('dynamic-animations');
    if (dynamicStyles) {
        dynamicStyles.textContent = '';
    }

    // Reset physics bodies map
    physicsBodies.clear();

    // Re-render all resumes to ensure all cards are restored
    setTimeout(() => {
        renderResumes();
        showNotification('Reset complete - showing all candidates!', 'info');
    }, 1000); // Wait for reset animations to complete
}

function updateStarPreview() {
    const cgpaInput = document.getElementById('cgpa');
    const starPreview = document.getElementById('star-preview');
    const cgpa = parseFloat(cgpaInput.value) || 0;

    if (cgpa > 0) {
        starPreview.innerHTML = `Stars: ${generateStarRating(cgpa)} (${cgpa}/10)`;
    } else {
        starPreview.innerHTML = '';
    }
}

function updateSkillsPreview() {
    const skillsInput = document.getElementById('skills');
    const skillsPreview = document.getElementById('skills-preview');
    const skills = skillsInput.value.split(',').map(s => s.trim()).filter(s => s);

    skillsPreview.innerHTML = skills.map(skill =>
        `<span class="skill-tag">${skill}</span>`
    ).join('');
}

// Export functions for use in other modules
window.handleCardHover = handleCardHover;
window.handleCardClick = handleCardClick;
window.renderResumes = renderResumes;
window.showFloatingResetButton = showFloatingResetButton;
window.hideFloatingResetButton = hideFloatingResetButton;
window.showNotification = showNotification;
window.resetPositions = resetPositions;
window.updateStarPreview = updateStarPreview;
window.updateSkillsPreview = updateSkillsPreview;