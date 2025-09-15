// Form Handling Module
// Note: resumeData is defined globally in main.js

// Form handling functions
function toggleAddForm() {
    const form = document.getElementById('add-resume-form');
    form.classList.toggle('hidden');

    if (!form.classList.contains('hidden')) {
        // Scroll to form
        form.scrollIntoView({ behavior: 'smooth' });
        // Clear form
        document.getElementById('resume-form').reset();
        // Clear image preview
        document.getElementById('image-preview').classList.add('hidden');
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

// Image preview and handling functions
function previewImage(input) {
    const preview = document.getElementById('image-preview');
    const previewImg = document.getElementById('preview-img');

    if (input.files && input.files[0]) {
        const file = input.files[0];

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file.');
            input.value = '';
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image file size must be less than 5MB.');
            input.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            previewImg.src = e.target.result;
            preview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
}

function removeImage() {
    const input = document.getElementById('photo_file');
    const preview = document.getElementById('image-preview');

    input.value = '';
    preview.classList.add('hidden');
}

function handleFormSubmit(event) {
    event.preventDefault();

    // Get form data
    const formData = new FormData(event.target);
    const photoFile = document.getElementById('photo_file').files[0];

    // Handle image upload
    let photoData = null;
    if (photoFile) {
        // Convert file to data URL (this is synchronous for small files)
        const reader = new FileReader();
        reader.onload = function(e) {
            photoData = e.target.result;
            // Continue with form submission after image is loaded
            submitForm(photoData);
        };
        reader.readAsDataURL(photoFile);
    } else {
        // No image uploaded, use default
        submitForm(null);
    }
}

function submitForm(photoData) {
    const newResume = {
        id: Date.now().toString(), // Simple ID generation
        full_name: document.getElementById('full_name').value,
        photo_url: photoData, // Store the data URL instead of URL
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

// Export functions for use in other modules
window.toggleAddForm = toggleAddForm;
window.addProjectField = addProjectField;
window.removeProjectField = removeProjectField;
window.previewImage = previewImage;
window.removeImage = removeImage;
window.handleFormSubmit = handleFormSubmit;