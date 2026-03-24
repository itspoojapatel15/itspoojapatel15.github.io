// ==========================================================================
// Theme Toggle (Dark Mode)
// ==========================================================================
function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    const icon = toggle.querySelector('i');
    const savedTheme = localStorage.getItem('theme') || 'light';

    document.documentElement.setAttribute('data-theme', savedTheme);
    icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

    toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        icon.className = next === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    });
}

// ==========================================================================
// Load Site Configuration (Meta Tags)
// ==========================================================================
async function loadSiteConfig() {
    try {
        const response = await fetch('data/site-config.json');
        const config = await response.json();

        document.title = config.meta.title;
        document.querySelector('meta[name="description"]').setAttribute('content', config.meta.description);
        document.querySelector('meta[name="author"]').setAttribute('content', config.meta.author);
        document.querySelector('meta[name="keywords"]').setAttribute('content', config.meta.keywords);
    } catch (error) {
        console.error('Error loading site config:', error);
    }
}

// ==========================================================================
// Load Navigation
// ==========================================================================
async function loadNavigation() {
    try {
        const response = await fetch('data/navigation.json');
        const navData = await response.json();

        const navBrand = document.querySelector('.nav-brand a');
        if (navBrand) {
            navBrand.textContent = navData.brand.name;
            navBrand.setAttribute('href', navData.brand.href);
        }

        const navMenu = document.getElementById('navMenu');
        if (navMenu) {
            navMenu.innerHTML = '';
            navData.menuItems.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `<a href="${item.href}" class="nav-link">${item.label}</a>`;
                navMenu.appendChild(li);
            });

            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    const navToggle = document.getElementById('navToggle');
                    if (navToggle) navToggle.classList.remove('active');
                });
            });
        }
    } catch (error) {
        console.error('Error loading navigation:', error);
    }
}

// ==========================================================================
// Load Hero Section
// ==========================================================================
async function loadHero() {
    try {
        const response = await fetch('data/hero.json');
        const hero = await response.json();

        const heroGreeting = document.getElementById('heroGreeting');
        const heroName = document.getElementById('heroName');
        const heroTitle = document.getElementById('heroTitle');
        const heroSummary = document.getElementById('heroSummary');

        if (heroGreeting) heroGreeting.textContent = hero.greeting;
        if (heroName) heroName.textContent = hero.name;
        if (heroTitle) heroTitle.textContent = hero.title;
        if (heroSummary) heroSummary.innerHTML = hero.summary;

        const highlightsContainer = document.getElementById('heroHighlights');
        if (highlightsContainer) {
            highlightsContainer.innerHTML = '';
            hero.highlights.forEach(highlight => {
                const div = document.createElement('div');
                div.className = 'highlight-item';
                div.innerHTML = `
                    <i class="${highlight.icon}"></i>
                    <span>${highlight.text}</span>
                `;
                highlightsContainer.appendChild(div);
            });
        }

        const ctaContainer = document.getElementById('heroCTA');
        if (ctaContainer) {
            ctaContainer.innerHTML = '';
            hero.cta.buttons.forEach(button => {
                const a = document.createElement('a');
                a.href = button.href;
                a.className = `btn btn-${button.type}`;
                if (button.external) a.target = '_blank';
                a.innerHTML = button.icon ? `<i class="${button.icon}"></i> ${button.text}` : button.text;
                ctaContainer.appendChild(a);
            });
        }

        const socialContainer = document.getElementById('heroSocial');
        if (socialContainer) {
            socialContainer.innerHTML = '';
            hero.socialLinks.forEach(social => {
                const a = document.createElement('a');
                a.href = social.url;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.setAttribute('aria-label', social.platform);
                a.innerHTML = `<i class="${social.icon}"></i>`;
                socialContainer.appendChild(a);
            });
        }
    } catch (error) {
        console.error('Error loading hero data:', error);
    }
}

// ==========================================================================
// Load About Section
// ==========================================================================
async function loadAbout() {
    try {
        const response = await fetch('data/about.json');
        const about = await response.json();

        const sectionTitle = document.querySelector('#about .section-title');
        if (sectionTitle) sectionTitle.textContent = about.sectionTitle;

        const textContainer = document.getElementById('aboutText');
        if (textContainer) {
            textContainer.innerHTML = '';
            about.paragraphs.forEach(paragraph => {
                const p = document.createElement('p');
                p.textContent = paragraph;
                textContainer.appendChild(p);
            });
        }

        const statsContainer = document.getElementById('aboutStats');
        if (statsContainer) {
            statsContainer.innerHTML = '';
            about.statistics.forEach(stat => {
                const div = document.createElement('div');
                div.className = 'stat-item';
                div.innerHTML = `
                    <h3>${stat.value}</h3>
                    <p>${stat.label}</p>
                `;
                statsContainer.appendChild(div);
            });
        }
    } catch (error) {
        console.error('Error loading about data:', error);
    }
}

// ==========================================================================
// Load Contact Section
// ==========================================================================
async function loadContact() {
    try {
        const response = await fetch('data/contact.json');
        const contact = await response.json();

        const sectionTitle = document.querySelector('#contact .section-title');
        if (sectionTitle) sectionTitle.textContent = contact.sectionTitle;

        const contactInfoContainer = document.getElementById('contactInfo');
        if (contactInfoContainer) {
            contactInfoContainer.innerHTML = '';
            contact.contactInfo.forEach(info => {
                const div = document.createElement('div');
                div.className = 'contact-item';

                const valueContent = info.href
                    ? `<a href="${info.href}">${info.value}</a>`
                    : `<p>${info.value}</p>`;

                div.innerHTML = `
                    <i class="${info.icon}"></i>
                    <div>
                        <h3>${info.label}</h3>
                        ${valueContent}
                    </div>
                `;
                contactInfoContainer.appendChild(div);
            });
        }

        const formContainer = document.getElementById('contactFormContainer');
        if (formContainer) {
            let formHTML = '<form class="contact-form" id="contactForm">';

            contact.form.fields.forEach(field => {
                formHTML += '<div class="form-group">';
                formHTML += `<label for="${field.id}" class="sr-only">${field.placeholder}</label>`;
                if (field.type === 'textarea') {
                    formHTML += `<textarea id="${field.id}" name="${field.id}" rows="${field.rows}" placeholder="${field.placeholder}" ${field.required ? 'required' : ''}></textarea>`;
                } else {
                    formHTML += `<input type="${field.type}" id="${field.id}" name="${field.id}" placeholder="${field.placeholder}" ${field.required ? 'required' : ''}>`;
                }
                formHTML += '</div>';
            });

            formHTML += `<button type="submit" class="btn btn-${contact.form.submitButton.type}">${contact.form.submitButton.text}</button>`;
            formHTML += '</form>';

            formContainer.innerHTML = formHTML;

            const contactForm = document.getElementById('contactForm');
            if (contactForm) {
                contactForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const name = document.getElementById('name')?.value || '';
                    const email = document.getElementById('email')?.value || '';
                    const message = document.getElementById('message')?.value || '';
                    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
                    const body = encodeURIComponent(`From: ${name} (${email})\n\n${message}`);
                    const recipientEmail = contact.contactInfo.find(i => i.type === 'email')?.value || 'patel.pooja81599@gmail.com';
                    window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
                });
            }
        }
    } catch (error) {
        console.error('Error loading contact data:', error);
    }
}

// ==========================================================================
// Load Footer
// ==========================================================================
async function loadFooter() {
    try {
        const response = await fetch('data/footer.json');
        const footer = await response.json();

        const copyrightContainer = document.getElementById('footerCopyright');
        if (copyrightContainer) {
            const year = new Date().getFullYear();
            copyrightContainer.textContent = `\u00A9 ${year} ${footer.copyright.name}. ${footer.copyright.text}`;
        }

        const linksContainer = document.getElementById('footerLinks');
        if (linksContainer) {
            linksContainer.innerHTML = '';
            footer.links.forEach(link => {
                const a = document.createElement('a');
                a.href = link.url;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.textContent = link.text;
                linksContainer.appendChild(a);
            });
        }
    } catch (error) {
        console.error('Error loading footer data:', error);
    }
}

// ==========================================================================
// Load Experience Data
// ==========================================================================
async function loadExperience() {
    try {
        const response = await fetch('data/experience.json');
        const data = await response.json();

        const sectionTitle = document.querySelector('#experience .section-title');
        if (sectionTitle) sectionTitle.textContent = data.sectionTitle;

        const timeline = document.getElementById('experienceTimeline');
        const experiences = data.experiences || data;

        (Array.isArray(experiences) ? experiences : [experiences]).forEach(exp => {
            if (exp._instructions) return;

            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';

            const hasResponsibilities = exp.responsibilities && exp.responsibilities.length > 0;
            const descriptionContent = hasResponsibilities
                ? `<ul>${exp.responsibilities.map(r => `<li>${r}</li>`).join('')}</ul>`
                : `<p>${exp.description}</p>`;

            timelineItem.innerHTML = `
                <div class="timeline-content">
                    <div class="timeline-header">
                        <div>
                            <h3 class="timeline-title">${exp.title}</h3>
                            <p class="timeline-company">${exp.company}</p>
                        </div>
                        <span class="timeline-period">${exp.period}</span>
                    </div>
                    <div class="timeline-description">
                        ${descriptionContent}
                    </div>
                </div>
            `;
            timeline.appendChild(timelineItem);
        });
    } catch (error) {
        console.error('Error loading experience data:', error);
    }
}

// ==========================================================================
// Load Skills Data
// ==========================================================================
async function loadSkills() {
    try {
        const response = await fetch('data/skills.json');
        const data = await response.json();

        const sectionTitle = document.querySelector('#skills .section-title');
        if (sectionTitle) sectionTitle.textContent = data.sectionTitle;

        const skillsGrid = document.getElementById('skillsGrid');
        const categories = data.categories || data;

        (Array.isArray(categories) ? categories : [categories]).forEach(category => {
            if (category._instructions) return;

            const skillCategory = document.createElement('div');
            skillCategory.className = 'skill-category';

            const skillTags = category.skills
                .map(skill => `<span class="skill-tag">${skill}</span>`)
                .join('');

            skillCategory.innerHTML = `
                <h3><i class="${category.icon}"></i> ${category.category}</h3>
                <div class="skill-list">
                    ${skillTags}
                </div>
            `;
            skillsGrid.appendChild(skillCategory);
        });
    } catch (error) {
        console.error('Error loading skills data:', error);
    }
}

// ==========================================================================
// Load Projects Data
// ==========================================================================
const PROJECT_GRADIENTS = [
    'linear-gradient(135deg, #154D57, #1a6672)',
    'linear-gradient(135deg, #B7A08B, #D4B896)',
    'linear-gradient(135deg, #2C3E50, #3498DB)',
    'linear-gradient(135deg, #1a6672, #48a999)',
    'linear-gradient(135deg, #8B5E3C, #B7A08B)',
];

async function loadProjects() {
    try {
        const response = await fetch('data/projects.json');
        const data = await response.json();

        const sectionTitle = document.querySelector('#projects .section-title');
        if (sectionTitle) sectionTitle.textContent = data.sectionTitle;

        const projectsGrid = document.getElementById('projectsGrid');
        const projects = data.projects || data;

        (Array.isArray(projects) ? projects : [projects]).forEach((project, index) => {
            if (project._instructions) return;

            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.setAttribute('data-category', project.category || 'featured');

            const techBadges = project.technologies
                .map(tech => `<span class="tech-badge">${tech}</span>`)
                .join('');

            const links = [];
            if (project.github) {
                links.push(`<a href="${project.github}" target="_blank" rel="noopener noreferrer" class="project-link">
                    <i class="fab fa-github"></i> View Code
                </a>`);
            }
            if (project.demo) {
                links.push(`<a href="${project.demo}" target="_blank" rel="noopener noreferrer" class="project-link">
                    <i class="fas fa-external-link-alt"></i> Live Demo
                </a>`);
            }

            const gradient = PROJECT_GRADIENTS[index % PROJECT_GRADIENTS.length];
            const badge = project.badge ? `<span class="project-badge">${project.badge}</span>` : '';
            const icon = project.icon ? `<i class="${project.icon}" style="color: var(--primary-color); font-size: 0.875rem;"></i>` : '';

            projectCard.innerHTML = `
                <div class="project-image" style="background: ${gradient}"></div>
                <div class="project-content">
                    <h3 class="project-title">${icon} ${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tech">
                        ${techBadges}
                        ${badge}
                    </div>
                    <div class="project-links">
                        ${links.join('')}
                    </div>
                </div>
            `;
            projectsGrid.appendChild(projectCard);
        });

        // Set up filter buttons with fade animation
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;
                const cards = document.querySelectorAll('.project-card');

                // Fade out non-matching, fade in matching
                cards.forEach(card => {
                    const matches = filter === 'all' || card.dataset.category === filter;
                    if (matches) {
                        card.classList.remove('hidden');
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(12px)';
                        requestAnimationFrame(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        });
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(12px)';
                        setTimeout(() => card.classList.add('hidden'), 300);
                    }
                });
            });
        });
    } catch (error) {
        console.error('Error loading projects data:', error);
    }
}

// ==========================================================================
// Load Education Data
// ==========================================================================
async function loadEducation() {
    try {
        const response = await fetch('data/education.json');
        const data = await response.json();

        const sectionTitle = document.querySelector('#education .section-title');
        if (sectionTitle) sectionTitle.textContent = data.sectionTitle;

        const certTitle = document.querySelector('#education .certifications h3');
        if (certTitle) certTitle.textContent = data.certificationsTitle || 'Certifications';

        const educationGrid = document.getElementById('educationGrid');
        const certGrid = document.getElementById('certGrid');

        data.education.forEach(edu => {
            if (edu._instructions) return;

            const eduItem = document.createElement('div');
            eduItem.className = 'education-item';

            eduItem.innerHTML = `
                <div class="education-header">
                    <div>
                        <h3 class="education-degree">${edu.degree}</h3>
                        <p class="education-school">${edu.school}</p>
                    </div>
                    <span class="education-period">${edu.period}</span>
                </div>
                ${edu.details ? `<p class="timeline-description">${edu.details}</p>` : ''}
            `;
            educationGrid.appendChild(eduItem);
        });

        // Hide certifications section if empty
        const certSection = document.querySelector('#education .certifications');
        if (certSection && data.certifications.length === 0) {
            certSection.style.display = 'none';
        } else {
            data.certifications.forEach(cert => {
                const certItem = document.createElement('div');
                certItem.className = 'cert-item';
                certItem.innerHTML = `
                    <strong>${cert.name}</strong>
                    ${cert.issuer ? `<p style="font-size: 0.875rem; margin-top: 0.25rem; opacity: 0.8;">${cert.issuer}</p>` : ''}
                `;
                certGrid.appendChild(certItem);
            });
        }
    } catch (error) {
        console.error('Error loading education data:', error);
    }
}

// ==========================================================================
// Navigation Toggle for Mobile
// ==========================================================================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle) {
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        const expanded = navMenu.classList.contains('active');
        navToggle.setAttribute('aria-expanded', String(expanded));
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// ==========================================================================
// Smooth Scroll for Navigation Links
// ==========================================================================
document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
        const offset = 80;
        const targetPosition = target.offsetTop - offset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
});

// ==========================================================================
// Consolidated Scroll Handler
// ==========================================================================
function handleNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    if (window.pageYOffset > 20) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.classList.add('active');
            } else {
                navLink.classList.remove('active');
            }
        }
    });
}

// Scroll Reveal Animation
function revealOnScroll() {
    const elements = document.querySelectorAll('.timeline-item, .skill-category, .project-card, .education-item, .stat-item');

    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Single throttled scroll listener
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            handleNavbarScroll();
            updateActiveNavLink();
            revealOnScroll();
            ticking = false;
        });
        ticking = true;
    }
});

// ==========================================================================
// Initialize Scroll Animation
// ==========================================================================
function initScrollAnimation() {
    const elements = document.querySelectorAll('.timeline-item, .skill-category, .project-card, .education-item, .stat-item');
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        element.style.transitionDelay = `${(index % 6) * 0.1}s`;
    });
}

// ==========================================================================
// Stat Counter Animation
// ==========================================================================
function animateCounters() {
    const statItems = document.querySelectorAll('.stat-item h3');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.textContent;
                const num = parseInt(text);
                if (isNaN(num)) return;
                const suffix = text.replace(/[0-9]/g, '');
                let current = 0;
                const increment = Math.max(1, Math.floor(num / 30));
                const interval = num < 10 ? 150 : 40;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= num) {
                        current = num;
                        clearInterval(timer);
                    }
                    target.textContent = current + suffix;
                }, interval);
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    statItems.forEach(item => observer.observe(item));
}

// ==========================================================================
// Initialize Everything When DOM is Ready
// ==========================================================================
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize theme before content loads
    initThemeToggle();

    // Load all content from JSON files in parallel
    await Promise.all([
        loadSiteConfig(),
        loadNavigation(),
        loadHero(),
        loadAbout(),
        loadExperience(),
        loadSkills(),
        loadProjects(),
        loadEducation(),
        loadContact(),
        loadFooter()
    ]);

    // Small delay to ensure elements are rendered before animation
    setTimeout(() => {
        initScrollAnimation();
        revealOnScroll();
        animateCounters();
    }, 100);

    // Hide loader
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
});
