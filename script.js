// ==================== //
// CONFIGURATION
// ==================== //
const GITHUB_USERNAME = 'esquires14';
const FEATURED_REPOS = [
    'WGU-Vacation-Scheduler-Android',
    'WGU-Java-Frameworks',
    'WGU-Hotel-Page',
    'Portfolio'
];

// ==================== //
// MOBILE NAVIGATION
// ==================== //
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// ==================== //
// SMOOTH SCROLL
// ==================== //
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== //
// NAVBAR SCROLL EFFECT
// ==================== //
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// ==================== //
// GITHUB API INTEGRATION
// ==================== //

// Technology icon mapping
const techIcons = {
    'JavaScript': 'fab fa-js-square',
    'Python': 'fab fa-python',
    'Java': 'fab fa-java',
    'TypeScript': 'fab fa-js',
    'HTML': 'fab fa-html5',
    'CSS': 'fab fa-css3-alt',
    'React': 'fab fa-react',
    'Angular': 'fab fa-angular',
    'Node': 'fab fa-node-js',
    'Android': 'fab fa-android'
};

// Fetch all repositories from GitHub
async function fetchGitHubRepos() {
    console.log('Fetching repos for:', GITHUB_USERNAME);
    
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`GitHub API returned ${response.status}`);
        }
        
        const repos = await response.json();
        console.log('Fetched repos:', repos.length);
        
        // Filter out forks and sort by last updated
        const ownRepos = repos
            .filter(repo => !repo.fork)
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        
        console.log('Own repos (no forks):', ownRepos.length);
        
        if (ownRepos.length === 0) {
            showPlaceholderProjects();
            return;
        }
        
        displayFeaturedProjects(ownRepos);
        displayAllRepos(ownRepos);
        
    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        showPlaceholderProjects();
    }
}

// Show placeholder projects if GitHub repos can't be loaded
function showPlaceholderProjects() {
    const placeholderProjects = [
        {
            name: 'WGU-Vacation-Scheduler-Android',
            description: 'Android mobile application for planning vacations with Room database, CRUD operations, and notifications.',
            language: 'Java',
            topics: ['android', 'java', 'mobile', 'room-database'],
            html_url: 'https://github.com/esquires14/WGU-Vacation-Scheduler-Android',
            isFeatured: true
        },
        {
            name: 'WGU-Java-Frameworks',
            description: 'E-commerce application for custom PC parts built with Spring Boot and Thymeleaf.',
            language: 'Java',
            topics: ['spring-boot', 'thymeleaf', 'java', 'e-commerce'],
            html_url: 'https://github.com/esquires14/WGU-Java-Frameworks',
            isFeatured: true
        },
        {
            name: 'WGU-Hotel-Page',
            description: 'Hotel booking application with Spring Boot and Angular featuring multithreading and internationalization.',
            language: 'Java',
            topics: ['spring-boot', 'angular', 'java', 'multithreading'],
            html_url: 'https://github.com/esquires14/WGU-Hotel-Page',
            isFeatured: true
        },
        {
            name: 'Portfolio',
            description: 'Personal portfolio website showcasing projects and skills.',
            language: 'HTML',
            topics: ['portfolio', 'javascript', 'html', 'css'],
            html_url: 'https://github.com/esquires14/Portfolio',
            isFeatured: false
        },
        {
            name: 'student-records-manager',
            description: 'Java application for managing student information.',
            language: 'Java',
            topics: ['java', 'crud', 'database'],
            html_url: 'https://github.com/esquires14/student-records-manager',
            isFeatured: false
        },
        {
            name: 'TaskFlow-Java',
            description: 'Task management application built with Java.',
            language: 'Java',
            topics: ['java', 'task-management'],
            html_url: 'https://github.com/esquires14/TaskFlow-Java',
            isFeatured: false
        },
        {
            name: 'personal_taskmanager',
            description: 'Personal task manager with CSS styling.',
            language: 'CSS',
            topics: ['css', 'task-manager'],
            html_url: 'https://github.com/esquires14/personal_taskmanager',
            isFeatured: false
        }
    ];
    
    const featured = placeholderProjects.filter(p => p.isFeatured);
    const all = placeholderProjects;
    
    document.getElementById('featured-projects').innerHTML = 
        featured.map(repo => createProjectCard(repo, true)).join('');
    
    document.getElementById('all-repos').innerHTML = 
        all.map(repo => createProjectCard(repo, false)).join('') +
        `<div class="repo-note">
            <i class="fas fa-info-circle"></i>
            <p>Repositories loaded from cache. For live updates, visit my <a href="https://github.com/esquires14" target="_blank">GitHub profile</a>.</p>
        </div>`;
}

// Display featured projects
function displayFeaturedProjects(repos) {
    const featuredContainer = document.getElementById('featured-projects');
    
    // Get featured repos
    const featured = repos.filter(repo => 
        FEATURED_REPOS.some(name => repo.name.toLowerCase().includes(name.toLowerCase()))
    );
    
    if (featured.length === 0) {
        // If no WGU projects yet, show top 3 repos
        featured.push(...repos.slice(0, 3));
    }
    
    featuredContainer.innerHTML = featured.map(repo => createProjectCard(repo, true)).join('');
}

// Display all repositories
function displayAllRepos(repos) {
    const reposContainer = document.getElementById('all-repos');
    
    reposContainer.innerHTML = repos.map(repo => createProjectCard(repo, false)).join('');
}

// Create project card HTML
function createProjectCard(repo, isFeatured) {
    const language = repo.language || 'Code';
    const icon = techIcons[language] || 'fas fa-code';
    const description = repo.description || 'No description available';
    
    // Parse topics/tags
    const topics = repo.topics || [];
    const techTags = topics.length > 0 
        ? topics.slice(0, 5).map(tag => `<span class="tech-tag">${tag}</span>`).join('')
        : `<span class="tech-tag">${language}</span>`;
    
    const featuredClass = isFeatured ? 'featured' : '';
    
    return `
        <div class="project-card ${featuredClass}">
            <div class="project-header">
                <i class="${icon} project-icon"></i>
                <h3 class="project-title">${repo.name}</h3>
            </div>
            <p class="project-description">${description}</p>
            <div class="project-tech">
                ${techTags}
            </div>
            <div class="project-links">
                <a href="${repo.html_url}" target="_blank" class="project-link">
                    <i class="fab fa-github"></i> View Code
                </a>
                ${repo.homepage ? `
                    <a href="${repo.homepage}" target="_blank" class="project-link">
                        <i class="fas fa-external-link-alt"></i> Live Demo
                    </a>
                ` : ''}
            </div>
        </div>
    `;
}

// ==================== //
// INTERSECTION OBSERVER (Animate on scroll)
// ==================== //
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
});

// ==================== //
// RESUME DOWNLOAD
// ==================== //
document.getElementById('download-resume')?.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Resume download feature - Add your resume PDF link here!\n\nUpdate the href in index.html to point to your resume PDF file.');
    // In production, replace with: window.open('path/to/your/resume.pdf', '_blank');
});

// ==================== //
// INITIALIZE
// ==================== //
document.addEventListener('DOMContentLoaded', () => {
    // Fetch GitHub repos
    fetchGitHubRepos();
    
    // Add fade-in animation to hero
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        setTimeout(() => {
            heroContent.style.animation = 'fadeInUp 1s ease forwards';
        }, 100);
    }
});

// ==================== //
// ACTIVE NAV LINK ON SCROLL
// ==================== //
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});