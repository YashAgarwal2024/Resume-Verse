// Sample resume data (simulating Supabase data)
const resumeData = [
    {
        id: '1',
        full_name: 'Alex Chen',
        photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        cgpa: 9.2,
        skills: ['JavaScript', 'React', 'Node.js', 'Python'],
        projects: [
            { name: 'E-commerce Platform', tech: ['React', 'Node.js'] },
            { name: 'AI Chatbot', tech: ['Python', 'TensorFlow'] }
        ],
        github_url: 'https://github.com/alexchen',
        bio: 'Full-stack developer passionate about AI and web technologies'
    },
    {
        id: '2',
        full_name: 'Sarah Johnson',
        photo_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        cgpa: 8.7,
        skills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Science'],
        projects: [
            { name: 'Predictive Analytics', tech: ['Python', 'Scikit-learn'] },
            { name: 'Computer Vision App', tech: ['TensorFlow', 'OpenCV'] }
        ],
        github_url: 'https://github.com/sarahjohnson',
        bio: 'Data scientist with expertise in machine learning and AI'
    },
    {
        id: '3',
        full_name: 'Michael Rodriguez',
        photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        cgpa: 8.9,
        skills: ['Java', 'Spring Boot', 'Microservices', 'Docker'],
        projects: [
            { name: 'Banking System', tech: ['Java', 'Spring Boot'] },
            { name: 'Cloud Migration', tech: ['Docker', 'Kubernetes'] }
        ],
        github_url: 'https://github.com/michaelrodriguez',
        bio: 'Backend engineer specializing in enterprise applications'
    },
    {
        id: '4',
        full_name: 'Emily Davis',
        photo_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        cgpa: 9.1,
        skills: ['React', 'Vue.js', 'CSS', 'JavaScript', 'UI/UX'],
        projects: [
            { name: 'Design System', tech: ['React', 'Storybook'] },
            { name: 'Mobile App UI', tech: ['React Native', 'Figma'] }
        ],
        github_url: 'https://github.com/emilydavis',
        bio: 'Frontend developer with strong design sensibilities'
    },
    {
        id: '5',
        full_name: 'David Kim',
        photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        cgpa: 8.4,
        skills: ['C++', 'Rust', 'Systems Programming', 'Blockchain'],
        projects: [
            { name: 'Cryptocurrency Wallet', tech: ['Rust', 'Blockchain'] },
            { name: 'Game Engine', tech: ['C++', 'OpenGL'] }
        ],
        github_url: 'https://github.com/davidkim',
        bio: 'Systems programmer interested in blockchain and game development'
    },
    {
        id: '6',
        full_name: 'Lisa Wang',
        photo_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
        cgpa: 9.0,
        skills: ['DevOps', 'AWS', 'Kubernetes', 'Terraform'],
        projects: [
            { name: 'CI/CD Pipeline', tech: ['Jenkins', 'Docker'] },
            { name: 'Infrastructure as Code', tech: ['Terraform', 'AWS'] }
        ],
        github_url: 'https://github.com/lisawang',
        bio: 'DevOps engineer focused on cloud infrastructure and automation'
    }
];

// Physics engine setup
let engine, render, world;
let physicsEnabled = false;
let physicsBodies = new Map();
let currentFilter = null;
let tornadoActive = false;
let waterActive = false;
let focusMode = false;
let focusedCard = null;

// Initialize Matter.js
function initPhysics() {
    engine = Matter.Engine.create();
    world = engine.world;

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

// Generate star rating based on CGPA
function generateStarRating(cgpa) {
    const fullStars = Math.floor(cgpa);
    const hasHalfStar = cgpa % 1 >= 0.5;
    const emptyStars = 10 - fullStars - (hasHalfStar ? 1 : 0);

    let stars = '';
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star text-yellow-400"></i>';
    }
    // Half star
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt text-yellow-400"></i>';
    }
    // Empty stars (optional, for visual completeness)
    for (let i = 0; i < Math.min(emptyStars, 10 - fullStars - (hasHalfStar ? 1 : 0)); i++) {
        stars += '<i class="far fa-star text-gray-400"></i>';
    }

    return stars;
}

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

// Create resume card HTML
function createResumeCard(resume) {
    const socialLinks = [];

    if (resume.github_url) {
        socialLinks.push(`
            <a href="${resume.github_url}" target="_blank"
               class="inline-flex items-center text-blue-300 hover:text-blue-200 text-sm transition-colors mr-4">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd"></path>
                </svg>
                GitHub
            </a>
        `);
    }

    if (resume.linkedin_url) {
        socialLinks.push(`
            <a href="${resume.linkedin_url}" target="_blank"
               class="inline-flex items-center text-blue-300 hover:text-blue-200 text-sm transition-colors mr-4">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"/>
                </svg>
                LinkedIn
            </a>
        `);
    }

    if (resume.email) {
        socialLinks.push(`
            <a href="mailto:${resume.email}"
               class="inline-flex items-center text-blue-300 hover:text-blue-200 text-sm transition-colors">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
                Email
            </a>
        `);
    }

    return `
        <div class="resume-card bg-white bg-opacity-10 rounded-xl p-6 transform transition-all duration-300 hover:scale-105"
             data-id="${resume.id}" data-cgpa="${resume.cgpa}"
             onmouseenter="handleCardHover(this, true)"
             onmouseleave="handleCardHover(this, false)"
             onclick="handleCardClick(this)">
            <div class="flex items-center mb-4">
                <img src="${resume.photo_url || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjQiIGZpbGw9IiM2MzY2RjEiLz4KPHN2ZyB4PSIxMiIgeT0iMTIiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC42ODYyOSAxNCA2IDE2LjY4NjMgNiAyMFYyMkgxOFYyMEMxOCAxNi42ODYzIDE1LjMxMzcgMTQgMTIgMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+'}" alt="${resume.full_name}"
                     class="w-12 h-12 rounded-full object-cover mr-3"
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjQiIGZpbGw9IiM2MzY2RjEiLz4KPHN2ZyB4PSIxMiIgeT0iMTIiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC42ODYyOSAxNCA2IDE2LjY4NjMgNiAyMFYyMkgxOFYyMEMxOCAxNi42ODYzIDE1LjMxMzcgMTQgMTIgMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+'; this.alt='Profile picture';">
                <div>
                    <h3 class="text-white font-semibold">${resume.full_name}</h3>
                    <div class="flex items-center">
                        <span class="text-yellow-300 text-sm">CGPA: ${resume.cgpa}</span>
                        <div class="ml-2 flex text-lg">
                            ${generateStarRating(resume.cgpa)}
                        </div>
                    </div>
                </div>
            </div>

            <p class="text-blue-100 text-sm mb-4">${resume.bio}</p>

            <div class="mb-4">
                <h4 class="text-white text-sm font-medium mb-2">Skills</h4>
                <div class="flex flex-wrap gap-1">
                    ${resume.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>

            ${resume.projects && resume.projects.length > 0 ? `
            <div class="mb-4">
                <h4 class="text-white text-sm font-medium mb-2">Projects</h4>
                ${resume.projects.map(project => `
                    <div class="text-blue-100 text-xs mb-1">
                        <span class="font-medium">${project.name}</span>
                        <span class="text-blue-200"> - ${project.tech.join(', ')}</span>
                    </div>
                `).join('')}
            </div>
            ` : ''}

            <div class="flex flex-wrap gap-2">
                ${socialLinks.join('')}
            </div>
        </div>
    `;
}

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

// Natural language command parser
function parseCommand(command) {
    const cmd = command.toLowerCase().trim();
    console.log('Parsing command:', cmd);

    // Burn commands - check for burn first
    if (cmd.includes('burn')) {
        // Check for CGPA-based burn commands
        const cgpaBurnMatch = cmd.match(/burn.*?(?:cgpa|gpa)\s*([><=]+)\s*(\d+\.?\d*)/);
        if (cgpaBurnMatch) {
            const operator = cgpaBurnMatch[1];
            const value = parseFloat(cgpaBurnMatch[2]);
            return {
                type: 'burn',
                field: 'cgpa',
                operator,
                value
            };
        }

        // Alternative pattern for CGPA burn: "burn students with cgpa < 4"
        const altCgpaBurnMatch = cmd.match(/(?:cgpa|gpa)\s*([><=]+)\s*(\d+\.?\d*).*?burn/);
        if (altCgpaBurnMatch) {
            const operator = altCgpaBurnMatch[1];
            const value = parseFloat(altCgpaBurnMatch[2]);
            return {
                type: 'burn',
                field: 'cgpa',
                operator,
                value
            };
        }

        // General burn command
        return { type: 'burn', field: 'all' };
    }

    // Float commands - check for float first before skill parsing
    if (cmd.includes('float')) {
        // Check for CGPA-based float commands
        const cgpaFloatMatch = cmd.match(/float.*?(?:cgpa|gpa)\s*([><=]+)\s*(\d+\.?\d*)/);
        if (cgpaFloatMatch) {
            const operator = cgpaFloatMatch[1];
            const value = parseFloat(cgpaFloatMatch[2]);
            return {
                type: 'float',
                field: 'cgpa',
                operator,
                value
            };
        }

        // Alternative pattern for CGPA float: "make students with cgpa > 9 float"
        const altCgpaMatch = cmd.match(/(?:cgpa|gpa)\s*([><=]+)\s*(\d+\.?\d*).*?float/);
        if (altCgpaMatch) {
            const operator = altCgpaMatch[1];
            const value = parseFloat(altCgpaMatch[2]);
            return {
                type: 'float',
                field: 'cgpa',
                operator,
                value
            };
        }

        // Check for skill-based float commands
        const skillMap = {
            'javascript': ['javascript', 'js'],
            'python': ['python'],
            'react': ['react', 'reactjs'],
            'java': ['java'],
            'css': ['css'],
            'node.js': ['node.js', 'nodejs', 'node'],
            'machine learning': ['machine learning', 'ml'],
            'docker': ['docker'],
            'aws': ['aws'],
            'tensorflow': ['tensorflow'],
            'spring boot': ['spring boot', 'spring'],
            'vue.js': ['vue.js', 'vue', 'vuejs'],
            'ui/ux': ['ui/ux', 'ui', 'ux', 'design'],
            'c++': ['c++', 'cpp'],
            'rust': ['rust'],
            'devops': ['devops'],
            'kubernetes': ['kubernetes', 'k8s'],
            'terraform': ['terraform']
        };

        for (const [mainSkill, variations] of Object.entries(skillMap)) {
            for (const variation of variations) {
                if (cmd.includes(variation)) {
                    return {
                        type: 'float',
                        field: 'skills',
                        value: mainSkill
                    };
                }
            }
        }

        // General float command
        return { type: 'float', field: 'all' };
    }

    // CGPA filters - improved regex patterns
    if (cmd.includes('cgpa') || cmd.includes('gpa')) {
        // Match patterns like "cgpa > 8.5", "gpa >= 8", "students with cgpa > 8.5"
        const cgpaMatch = cmd.match(/(?:cgpa|gpa)\s*([><=]+)\s*(\d+\.?\d*)/);
        if (cgpaMatch) {
            const operator = cgpaMatch[1];
            const value = parseFloat(cgpaMatch[2]);
            console.log('CGPA filter found:', operator, value);
            return {
                type: 'filter',
                field: 'cgpa',
                operator,
                value
            };
        }

        // Alternative pattern: "students with cgpa greater than 8"
        const altMatch = cmd.match(/(?:greater than|more than|above)\s*(\d+\.?\d*)/);
        if (altMatch) {
            const value = parseFloat(altMatch[1]);
            console.log('CGPA filter (alt pattern):', '>', value);
            return {
                type: 'filter',
                field: 'cgpa',
                operator: '>',
                value
            };
        }

        // Pattern: "students with cgpa less than 8"
        const lessMatch = cmd.match(/(?:less than|below|under)\s*(\d+\.?\d*)/);
        if (lessMatch) {
            const value = parseFloat(lessMatch[1]);
            console.log('CGPA filter (less than):', '<', value);
            return {
                type: 'filter',
                field: 'cgpa',
                operator: '<',
                value
            };
        }
    }

    // Skill-based filters and effects - expanded skill list
    const skillMap = {
        'javascript': ['javascript', 'js'],
        'python': ['python'],
        'react': ['react', 'reactjs'],
        'java': ['java'],
        'css': ['css'],
        'node.js': ['node.js', 'nodejs', 'node'],
        'machine learning': ['machine learning', 'ml'],
        'docker': ['docker'],
        'aws': ['aws'],
        'tensorflow': ['tensorflow'],
        'spring boot': ['spring boot', 'spring'],
        'vue.js': ['vue.js', 'vue', 'vuejs'],
        'ui/ux': ['ui/ux', 'ui', 'ux', 'design'],
        'c++': ['c++', 'cpp'],
        'rust': ['rust'],
        'devops': ['devops'],
        'kubernetes': ['kubernetes', 'k8s'],
        'terraform': ['terraform']
    };

    for (const [mainSkill, variations] of Object.entries(skillMap)) {
        for (const variation of variations) {
            if (cmd.includes(variation)) {
                console.log('Skill found:', mainSkill, 'via', variation);

                if (cmd.includes('glow') || cmd.includes('highlight')) {
                    return {
                        type: 'effect',
                        effect: 'glow',
                        skill: mainSkill
                    };
                } else if (cmd.includes('show') || cmd.includes('filter') || cmd.includes('experts') || cmd.includes('developers')) {
                    return {
                        type: 'filter',
                        field: 'skills',
                        value: mainSkill
                    };
                }
            }
        }
    }

    // Physics commands
    if (cmd.includes('levitate')) {
        return { type: 'physics', effect: 'float' };
    }

    if (cmd.includes('shake') || cmd.includes('vibrate')) {
        return { type: 'physics', effect: 'shake' };
    }

    // Reset command
    if (cmd.includes('reset') || cmd.includes('clear') || cmd.includes('show all')) {
        return { type: 'reset' };
    }

    console.log('No command pattern matched');
    return null;
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

    // Create wings
    createWings(card);

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

// Execute parsed command
function executeCommand() {
    const input = document.getElementById('command-input');
    const command = input.value.trim();

    if (!command) {
        alert('Please enter a command!');
        return;
    }

    console.log('Executing command:', command);
    const parsed = parseCommand(command);
    console.log('Parsed result:', parsed);

    if (!parsed) {
        alert('Command not recognized. Try:\n• "burn students with cgpa < 4"\n• "float java experts"\n• "make students with cgpa > 9 float"\n• "show python developers"\n• "make javascript developers glow"');
        return;
    }

    // Clear previous effects
    document.querySelectorAll('.resume-card').forEach(card => {
        card.classList.remove('glowing', 'floating');
        card.style.position = '';
        card.style.left = '';
        card.style.top = '';
        card.style.zIndex = '';
        card.style.animation = '';
    });

    if (parsed.type === 'filter') {
        let filtered = [];

        if (parsed.field === 'cgpa') {
            console.log('Filtering by CGPA:', parsed.operator, parsed.value);
            filtered = resumeData.filter(resume => {
                let result = false;
                switch (parsed.operator) {
                    case '>': result = resume.cgpa > parsed.value; break;
                    case '>=': result = resume.cgpa >= parsed.value; break;
                    case '<': result = resume.cgpa < parsed.value; break;
                    case '<=': result = resume.cgpa <= parsed.value; break;
                    case '=': case '==': result = resume.cgpa === parsed.value; break;
                    default: result = true;
                }
                console.log(`${resume.full_name} (${resume.cgpa}) ${parsed.operator} ${parsed.value} = ${result}`);
                return result;
            });
        } else if (parsed.field === 'skills') {
            console.log('Filtering by skill:', parsed.value);
            filtered = resumeData.filter(resume => {
                const hasSkill = resume.skills.some(skill => {
                    const skillLower = skill.toLowerCase();
                    const searchLower = parsed.value.toLowerCase();

                    // Exact match or partial match
                    return skillLower === searchLower ||
                           skillLower.includes(searchLower) ||
                           searchLower.includes(skillLower);
                });
                console.log(`${resume.full_name} has ${parsed.value}:`, hasSkill, resume.skills);
                return hasSkill;
            });
        }

        console.log('Filtered results:', filtered.length, 'out of', resumeData.length);

        if (filtered.length === 0) {
            alert(`No candidates found matching "${command}". Try a different filter!`);
            return;
        }

        renderResumes(filtered);
        currentFilter = parsed;

        // Apply special animations for high CGPA students
        if (parsed.field === 'cgpa' && parsed.operator === '>' && parsed.value >= 9) {
            setTimeout(() => {
                const cards = document.querySelectorAll('.resume-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('high-cgpa');
                        createSparkleEffect(card);
                    }, index * 200);
                });
            }, 500);
        }

        // Show success message
        const message = parsed.field === 'cgpa'
            ? `Found ${filtered.length} students with CGPA ${parsed.operator} ${parsed.value}`
            : `Found ${filtered.length} candidates with ${parsed.value} skills`;

        showNotification(message, 'success');

    } else if (parsed.type === 'effect') {
        console.log('Applying effect:', parsed.effect, 'to skill:', parsed.skill);
        let affectedCount = 0;

        const cards = document.querySelectorAll('.resume-card');
        cards.forEach(card => {
            const resumeId = card.dataset.id;
            const resume = resumeData.find(r => r.id === resumeId);

            if (resume) {
                const hasSkill = resume.skills.some(skill => {
                    const skillLower = skill.toLowerCase();
                    const searchLower = parsed.skill.toLowerCase();
                    return skillLower === searchLower ||
                           skillLower.includes(searchLower) ||
                           searchLower.includes(skillLower);
                });

                if (hasSkill) {
                    card.classList.add(parsed.effect === 'glow' ? 'glowing' : 'floating');
                    affectedCount++;
                }
            }
        });

        if (affectedCount === 0) {
            alert(`No candidates found with ${parsed.skill} skills to apply the effect!`);
        } else {
            showNotification(`Applied ${parsed.effect} effect to ${affectedCount} ${parsed.skill} experts!`, 'success');
        }

    } else if (parsed.type === 'burn') {
        console.log('Applying burn effect:', parsed);
        let affectedCount = 0;

        // Clear previous effects first
        document.querySelectorAll('.resume-card').forEach(card => {
            card.classList.remove('glowing', 'floating', 'burning');
            card.style.position = '';
            card.style.left = '';
            card.style.top = '';
            card.style.zIndex = '';
            card.style.animation = '';

            // Remove floating trails
            const trail = card.querySelector('.floating-trail');
            if (trail) {
                trail.remove();
            }


        });

        const cards = document.querySelectorAll('.resume-card');

        if (parsed.field === 'cgpa') {
            // Burn cards based on CGPA
            cards.forEach((card, index) => {
                const resumeId = card.dataset.id;
                const resume = resumeData.find(r => r.id === resumeId);

                if (resume) {
                    let shouldBurn = false;
                    switch (parsed.operator) {
                        case '>': shouldBurn = resume.cgpa > parsed.value; break;
                        case '>=': shouldBurn = resume.cgpa >= parsed.value; break;
                        case '<': shouldBurn = resume.cgpa < parsed.value; break;
                        case '<=': shouldBurn = resume.cgpa <= parsed.value; break;
                        case '=': case '==': shouldBurn = resume.cgpa === parsed.value; break;
                    }

                    if (shouldBurn) {
                        setTimeout(() => {
                            makeCardBurn(card);
                            affectedCount++;
                        }, index * 300); // Stagger the burning effect
                    }
                }
            });

            if (affectedCount === 0) {
                alert(`No students found with CGPA ${parsed.operator} ${parsed.value} to burn!`);
            } else {
                showNotification(`<i class="fas fa-fire mr-2"></i>Burning ${affectedCount} students with CGPA ${parsed.operator} ${parsed.value}! They will disappear in flames...`, 'error');
                showFloatingResetButton();
            }

        } else if (parsed.field === 'all') {
            // Burn all cards
            cards.forEach((card, index) => {
                setTimeout(() => {
                    makeCardBurn(card);
                    affectedCount++;
                }, index * 300);
            });
            showNotification(`<i class="fas fa-fire mr-2"></i>Burning all ${cards.length} resume cards! Watch them disappear in flames...`, 'error');
            showFloatingResetButton();
        }

    } else if (parsed.type === 'float') {
        console.log('Applying float effect:', parsed);
        let affectedCount = 0;

        // Clear previous floating effects
        document.querySelectorAll('.resume-card').forEach(card => {
            card.classList.remove('floating');
            card.style.position = '';
            card.style.left = '';
            card.style.top = '';
            card.style.zIndex = '';
            card.style.animation = '';

            // Remove floating trails
            const trail = card.querySelector('.floating-trail');
            if (trail) {
                trail.remove();
            }


        });

        const cards = document.querySelectorAll('.resume-card');

        if (parsed.field === 'all') {
            // Float all cards
            cards.forEach((card, index) => {
                setTimeout(() => {
                    makeCardFloat(card);
                    affectedCount++;
                }, index * 200);
            });
            showNotification(`All ${cards.length} resume cards are now floating freely!`, 'success');

        } else if (parsed.field === 'cgpa') {
            // Float cards based on CGPA
            cards.forEach((card, index) => {
                const resumeId = card.dataset.id;
                const resume = resumeData.find(r => r.id === resumeId);

                if (resume) {
                    let shouldFloat = false;
                    switch (parsed.operator) {
                        case '>': shouldFloat = resume.cgpa > parsed.value; break;
                        case '>=': shouldFloat = resume.cgpa >= parsed.value; break;
                        case '<': shouldFloat = resume.cgpa < parsed.value; break;
                        case '<=': shouldFloat = resume.cgpa <= parsed.value; break;
                        case '=': case '==': shouldFloat = resume.cgpa === parsed.value; break;
                    }

                    if (shouldFloat) {
                        setTimeout(() => {
                            makeCardFloat(card);
                            affectedCount++;
                        }, index * 200);
                    }
                }
            });

            if (affectedCount === 0) {
                alert(`No students found with CGPA ${parsed.operator} ${parsed.value} to float!`);
            } else {
                showNotification(`${affectedCount} students with CGPA ${parsed.operator} ${parsed.value} are now floating freely!`, 'success');
            }

        } else if (parsed.field === 'skills') {
            // Float cards based on skills
            cards.forEach((card, index) => {
                const resumeId = card.dataset.id;
                const resume = resumeData.find(r => r.id === resumeId);

                if (resume) {
                    const hasSkill = resume.skills.some(skill => {
                        const skillLower = skill.toLowerCase();
                        const searchLower = parsed.value.toLowerCase();
                        return skillLower === searchLower ||
                               skillLower.includes(searchLower) ||
                               searchLower.includes(skillLower);
                    });

                    if (hasSkill) {
                        setTimeout(() => {
                            makeCardFloat(card);
                            affectedCount++;
                        }, index * 200);
                    }
                }
            });

            if (affectedCount === 0) {
                alert(`No candidates found with ${parsed.value} skills to float!`);
            } else {
                showNotification(`${affectedCount} ${parsed.value} experts are now floating freely in the air!`, 'success');
            }
        }

    } else if (parsed.type === 'physics') {
        if (!physicsEnabled) {
            togglePhysics();
        }

        if (parsed.effect === 'float') {
            physicsBodies.forEach(({ body }) => {
                Matter.Body.applyForce(body, body.position, { x: 0, y: -0.01 });
            });
            showNotification('Applied floating effect!', 'success');
        } else if (parsed.effect === 'shake') {
            physicsBodies.forEach(({ body }) => {
                Matter.Body.applyForce(body, body.position, {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02
                });
            });
            showNotification('Applied shake effect!', 'success');
        }

    } else if (parsed.type === 'reset') {
        resetPositions();
        showNotification('Reset complete - showing all candidates!', 'info');
    }

    input.value = '';
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

// Physics controls
function togglePhysics() {
    physicsEnabled = !physicsEnabled;
    document.getElementById('physics-status').textContent = physicsEnabled ? 'On' : 'Off';

    if (physicsEnabled) {
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

function resetPositions() {
    // Exit focus mode first
    exitFocusMode();

    // Hide floating reset button and restore normal one
    hideFloatingResetButton();

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

    // Clear effects and reset positions with smooth transition
    document.querySelectorAll('.resume-card').forEach((card, index) => {
        // Add transition for smooth return to grid
        card.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';

        setTimeout(() => {
            card.classList.remove('glowing', 'floating', 'high-cgpa', 'focused', 'hidden-by-focus', 'burning', 'burned-away');
            card.style.position = '';
            card.style.left = '';
            card.style.top = '';
            card.style.zIndex = '';
            card.style.animation = '';
            card.style.transform = '';
            card.style.display = ''; // Restore burned cards
            card.style.opacity = ''; // Reset opacity
            card.style.filter = ''; // Reset filters

            // Remove floating trails
            const trail = card.querySelector('.floating-trail');
            if (trail) {
                trail.remove();
            }



            // Remove burn glow effects
            const burnGlow = card.querySelector('.burn-glow');
            if (burnGlow) {
                burnGlow.remove();
            }

            // Remove any remaining fire, smoke, ash particles and fire icons
            const particles = card.querySelectorAll('.fire-particle, .smoke-particle, .ash-particle, .fire-icon');
            particles.forEach(particle => particle.remove());

            // Remove transition after animation completes
            setTimeout(() => {
                card.style.transition = '';
            }, 800);
        }, index * 100); // Stagger the reset animation
    });

    // Clear dynamic animations
    const dynamicStyles = document.getElementById('dynamic-animations');
    if (dynamicStyles) {
        dynamicStyles.textContent = '';
    }

    // Reset filters
    setTimeout(() => {
        renderResumes();
        currentFilter = null;
    }, 500);
}

// Event listeners
document.getElementById('command-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        executeCommand();
    }
});

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
}

// Form handling functions
function toggleAddForm() {
    const form = document.getElementById('add-resume-form');
    form.classList.toggle('hidden');

    if (!form.classList.contains('hidden')) {
        // Scroll to form
        form.scrollIntoView({ behavior: 'smooth' });
        // Clear form
        document.getElementById('resume-form').reset();
        updateStarPreview();
        updateSkillsPreview();
    }
}

function addProjectField() {
    const container = document.getElementById('projects-container');
    const projectEntry = document.createElement('div');
    projectEntry.className = 'project-entry grid grid-cols-1 md:grid-cols-2 gap-3';
    projectEntry.innerHTML = `
        <input type="text" placeholder="Project Name"
               class="project-name w-full px-4 py-2 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400">
        <div class="flex gap-2">
            <input type="text" placeholder="Technologies (comma-separated)"
                   class="project-tech flex-1 w-full px-4 py-2 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400">
            <button type="button" onclick="removeProjectField(this)"
                    class="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    container.appendChild(projectEntry);
}

function removeProjectField(button) {
    button.closest('.project-entry').remove();
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

function handleFormSubmit(event) {
    event.preventDefault();

    // Get form data
    const formData = new FormData(event.target);
    const newResume = {
        id: Date.now().toString(), // Simple ID generation
        full_name: document.getElementById('full_name').value,
        photo_url: document.getElementById('photo_url').value,
        cgpa: parseFloat(document.getElementById('cgpa').value),
        bio: document.getElementById('bio').value,
        skills: document.getElementById('skills').value.split(',').map(s => s.trim()).filter(s => s),
        github_url: document.getElementById('github_url').value,
        linkedin_url: document.getElementById('linkedin_url').value,
        email: document.getElementById('email').value,
        projects: []
    };

    // Get projects
    const projectEntries = document.querySelectorAll('.project-entry');
    projectEntries.forEach(entry => {
        const name = entry.querySelector('.project-name').value.trim();
        const tech = entry.querySelector('.project-tech').value.trim();

        if (name && tech) {
            newResume.projects.push({
                name: name,
                tech: tech.split(',').map(t => t.trim()).filter(t => t)
            });
        }
    });

    // Add to resume data
    resumeData.push(newResume);

    // Re-render resumes
    renderResumes();

    // Hide form and show success message
    toggleAddForm();
    showNotification(`Resume for ${newResume.full_name} added successfully!`, 'success');

    // Create special effect for high CGPA
    if (newResume.cgpa >= 9) {
        setTimeout(() => {
            const newCard = document.querySelector(`[data-id="${newResume.id}"]`);
            if (newCard) {
                newCard.classList.add('high-cgpa');
                createSparkleEffect(newCard);
            }
        }, 500);
    }
}

// Initialize application
function init() {
    initPhysics();
    renderResumes();
    generateStars();

    // Add form event listeners
    document.getElementById('resume-form').addEventListener('submit', handleFormSubmit);
    document.getElementById('cgpa').addEventListener('input', updateStarPreview);
    document.getElementById('skills').addEventListener('input', updateSkillsPreview);

    // Add focus overlay click listener
    document.getElementById('focus-overlay').addEventListener('click', exitFocusMode);

    // Add some sample commands for demonstration
    const sampleCommands = [
        "burn students with cgpa < 4",
        "float java experts",
        "make students with cgpa > 9 float",
        "burn students with cgpa < 6",
        "float python developers"
    ];

    let commandIndex = 0;
    const input = document.getElementById('command-input');

    // Cycle through sample commands as placeholder
    setInterval(() => {
        if (input.value === '') {
            input.placeholder = `Try: '${sampleCommands[commandIndex]}'`;
            commandIndex = (commandIndex + 1) % sampleCommands.length;
        }
    }, 3000);
}

// Start the application
init();