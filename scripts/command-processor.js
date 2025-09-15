// Command Processor Module
// Global command variables (shared across modules)
let currentFilter = null;

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

    // Thanos snap command
    if (cmd.includes('snap') || cmd.includes('thanos') || cmd.includes('eliminate') || cmd.includes('disappear')) {
        return { type: 'snap' };
    }

    // Tornado command
    if (cmd.includes('tornado') || cmd.includes('cyclone') || cmd.includes('spin') || cmd.includes('whirlwind')) {
        return { type: 'tornado' };
    }

    // Water command
    if (cmd.includes('water') || cmd.includes('ocean') || cmd.includes('sea') || cmd.includes('lake')) {
        return { type: 'water' };
    }

    // Podium command
    if (cmd.includes('podium') || cmd.includes('top 3') || cmd.includes('winners') || cmd.includes('champions')) {
        return { type: 'podium' };
    }

    // Water reset command
    if ((cmd.includes('reset') || cmd.includes('stop') || cmd.includes('clear')) &&
        (cmd.includes('water') || cmd.includes('ocean') || cmd.includes('sea') || cmd.includes('lake'))) {
        return { type: 'reset_water' };
    }

    // Podium reset command
    if ((cmd.includes('reset') || cmd.includes('stop') || cmd.includes('clear')) &&
        (cmd.includes('podium') || cmd.includes('top 3') || cmd.includes('winners'))) {
        return { type: 'reset_podium' };
    }

    // Font change command
    if (cmd.includes('font') || cmd.includes('change font') || cmd.includes('set font')) {
        // Extract font name from command
        const fontMatch = cmd.match(/(?:font|change font|set font)\s+(?:to\s+)?(.+)/i);
        if (fontMatch) {
            const fontName = fontMatch[1].trim();
            return { type: 'change_font', font: fontName };
        }
    }

    // Font reset command
    if ((cmd.includes('reset') || cmd.includes('default')) && cmd.includes('font')) {
        return { type: 'reset_font' };
    }

    // Reset command
    if ((cmd.includes('reset') || cmd.includes('clear') || cmd.includes('show all')) && !cmd.includes('font')) {
        return { type: 'reset' };
    }

    console.log('No command pattern matched');
    return null;
}

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
        alert('Command not recognized. Try:\n• "burn students with cgpa < 4"\n• "float java experts"\n• "make students with cgpa > 9 float"\n• "show python developers"\n• "make javascript developers glow"\n• "water" or "ocean" to activate water mode\n• "reset water" to stop water mode\n• "tornado" to start tornado effect\n• "podium" or "top 3" to show CGPA winners\n• "reset podium" to stop podium mode\n• "font [name]" to change font (e.g., "font roboto")\n• "reset font" to reset to default font\n• "reset" to clear all effects');
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

    } else if (parsed.type === 'snap') {
        thanosSnap();

    } else if (parsed.type === 'tornado') {
        startTornado();

    } else if (parsed.type === 'water') {
        if (typeof activateWater === 'function') {
            activateWater();
        } else {
            showNotification('Water mode function not available', 'error');
        }

    } else if (parsed.type === 'podium') {
        if (typeof activatePodium === 'function') {
            activatePodium();
        } else {
            showNotification('Podium mode function not available', 'error');
        }

    } else if (parsed.type === 'change_font') {
        if (typeof changeFont === 'function') {
            changeFont(parsed.font);
        } else {
            showNotification('Font change function not available', 'error');
        }

    } else if (parsed.type === 'reset_font') {
        if (typeof resetFont === 'function') {
            resetFont();
        } else {
            showNotification('Font reset function not available', 'error');
        }

    } else if (parsed.type === 'reset_water') {
        if (typeof resetWaterMode === 'function') {
            resetWaterMode();
            showNotification('Water mode reset!', 'info');
        } else {
            showNotification('Water mode reset function not available', 'error');
        }

    } else if (parsed.type === 'reset_podium') {
        if (typeof resetPodiumMode === 'function') {
            resetPodiumMode();
            showNotification('Podium mode reset!', 'info');
        } else {
            showNotification('Podium mode reset function not available', 'error');
        }

    } else if (parsed.type === 'reset') {
        stopTornado(); // Stop tornado if active
        // Stop water mode if active
        if (typeof resetWaterMode === 'function') {
            resetWaterMode();
        }
        // Stop podium mode if active
        if (typeof resetPodiumMode === 'function') {
            resetPodiumMode();
        }
        // Reset font to default
        if (typeof resetFont === 'function') {
            resetFont();
        }
        resetPositions();
        showNotification('Reset complete - showing all candidates!', 'info');
    }    input.value = '';
}

// Export functions for use in other modules
window.parseCommand = parseCommand;
window.executeCommand = executeCommand;