// Main Application Module
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

// Initialize application
function init() {
    // Wait for all required functions to be available
    const checkFunctions = () => {
        if (typeof initPhysics === 'function' &&
            typeof renderResumes === 'function' &&
            typeof generateStars === 'function') {

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
                "snap",
                "burn students with cgpa < 4",
                "float java experts",
                "make students with cgpa > 9 float",
                "burn students with cgpa < 6",
                "float python developers",
                "thanos snap",
                "tornado",
                "start tornado",
                "spin the cards"
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
        } else {
            // Retry after a short delay
            setTimeout(checkFunctions, 50);
        }
    };

    checkFunctions();
}

// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', init);

// Export global variables and functions for use in other modules
window.resumeData = resumeData;