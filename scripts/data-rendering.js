// Data Rendering Module
// Note: resumeData is defined globally in main.js

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

// Export functions for use in other modules
window.generateStarRating = generateStarRating;
window.createResumeCard = createResumeCard;