// Focus Mode Module
// Global focus mode variables (shared across modules)
let focusMode = false;
let focusedCard = null;

// Focus mode functions
function enterFocusMode(targetCard) {
    if (focusMode) return;

    focusMode = true;
    focusedCard = targetCard;

    // Show overlay
    const overlay = document.getElementById('focus-overlay');
    overlay.classList.add('active');

    // Hide all other cards
    const allCards = document.querySelectorAll('.resume-card');
    allCards.forEach(card => {
        if (card !== targetCard) {
            card.classList.add('hidden-by-focus');
        } else {
            card.classList.add('focused');
        }
    });

    // Pause physics for other cards but keep focused card's animation
    if (physicsEnabled) {
        physicsBodies.forEach(({ body, element }) => {
            if (element !== targetCard) {
                Matter.Body.setStatic(body, true);
            }
        });
    }
}

function exitFocusMode() {
    if (!focusMode) return;

    focusMode = false;

    // Hide overlay
    const overlay = document.getElementById('focus-overlay');
    overlay.classList.remove('active');

    // Show all cards and remove focus
    const allCards = document.querySelectorAll('.resume-card');
    allCards.forEach(card => {
        card.classList.remove('hidden-by-focus', 'focused');
    });

    // Resume physics for all cards
    if (physicsEnabled) {
        physicsBodies.forEach(({ body }) => {
            Matter.Body.setStatic(body, false);
        });
    }

    focusedCard = null;
}

// Export functions for use in other modules
window.enterFocusMode = enterFocusMode;
window.exitFocusMode = exitFocusMode;