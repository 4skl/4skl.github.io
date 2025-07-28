/** Dark mode functionality with system preference detection **/
function initializeDarkMode() {
    const toggleButton = document.querySelector('#darkmode-toggle-button input[type="checkbox"]');
    const html = document.documentElement;
    
    // Check for saved user preference, otherwise use system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let isDarkMode;
    if (savedTheme) {
        // User has made a choice before
        isDarkMode = savedTheme === 'dark';
    } else {
        // Use system preference
        isDarkMode = systemPrefersDark;
    }
    
    // Apply the theme
    if (isDarkMode) {
        html.classList.add('dark-theme');
        if (toggleButton) toggleButton.checked = true;
    } else {
        html.classList.remove('dark-theme');
        if (toggleButton) toggleButton.checked = false;
    }
    
    // Listen for toggle changes
    if (toggleButton) {
        toggleButton.addEventListener('change', function() {
            const isDark = this.checked;
            if (isDark) {
                html.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark');
            } else {
                html.classList.remove('dark-theme');
                localStorage.setItem('theme', 'light');
            }
            
            // Update ARIA state
            const toggleContainer = document.querySelector('#darkmode-toggle-button');
            if (toggleContainer) {
                toggleContainer.setAttribute('aria-checked', isDark);
            }
        });
        
        // Add keyboard support for the toggle container
        const toggleContainer = document.querySelector('#darkmode-toggle-button');
        if (toggleContainer) {
            toggleContainer.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleButton.click();
                }
            });
        }
    }
    
    // Listen for system theme changes (only if user hasn't set preference)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            // Only update if user hasn't made a manual choice
            if (e.matches) {
                html.classList.add('dark-theme');
                if (toggleButton) toggleButton.checked = true;
            } else {
                html.classList.remove('dark-theme');
                if (toggleButton) toggleButton.checked = false;
            }
        }
    });
}

/** Language switching functionality **/
function initializeLanguage() {
    // Check for saved language preference, otherwise use browser language
    let savedLang = localStorage.getItem('language');
    let browserLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    let lang = 'en';
    if (!savedLang) {
        if (browserLang.startsWith('fr')) {
            lang = 'fr';
        }
        // Save the detected language so toggle works as expected
        localStorage.setItem('language', lang);
    } else {
        lang = savedLang;
    }
    setLanguage(lang);
}

function toggleLanguage() {
    const currentLang = localStorage.getItem('language') || 'en';
    const newLang = currentLang === 'en' ? 'fr' : 'en';
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
}

function setLanguage(lang) {
    // Update HTML lang attribute for accessibility
    document.documentElement.setAttribute('lang', lang);
    
    // Update ARIA state for dark mode toggle
    const toggleContainer = document.querySelector('#darkmode-toggle-button');
    if (toggleContainer) {
        toggleContainer.setAttribute('aria-checked', document.documentElement.classList.contains('dark-theme'));
    }
    
    // Update flag SVG and button text
    const langButtonLabel = document.getElementById('lang-button-label');
    const langButtonDescription = document.getElementById('lang-button-description');
    const flagIcon = document.getElementById('lang-flag-icon');
    
    if (langButtonLabel) {
        const labelText = langButtonLabel.getAttribute('data-' + lang);
        if (labelText) {
            langButtonLabel.textContent = labelText;
        }
    }
    
    if (langButtonDescription) {
        const descText = langButtonDescription.getAttribute('data-' + lang);
        if (descText) {
            langButtonDescription.textContent = descText;
        }
    }
    
    // Update flag SVG
    if (flagIcon) {
        if (lang === 'en') {
            // Show French flag when in English (click to switch to French)
            flagIcon.innerHTML = `
                <rect width="8" height="16" fill="#002395"/>
                <rect x="8" width="8" height="16" fill="#FFFFFF"/>
                <rect x="16" width="8" height="16" fill="#ED2939"/>
            `;
        } else {
            // Show British flag when in French (click to switch to English)
            flagIcon.innerHTML = `
                <rect width="24" height="16" fill="#012169"/>
                <path d="M0 0l24 16M24 0L0 16" stroke="#FFFFFF" stroke-width="3"/>
                <path d="M0 0l24 16M24 0L0 16" stroke="#C8102E" stroke-width="2"/>
                <path d="M12 0v16M0 8h24" stroke="#FFFFFF" stroke-width="5"/>
                <path d="M12 0v16M0 8h24" stroke="#C8102E" stroke-width="3"/>
            `;
        }
    }
    
    // Update all elements with data attributes
    document.querySelectorAll('[data-en][data-fr]').forEach(element => {
        const text = element.getAttribute('data-' + lang);
        if (text) {
            // For the dark mode toggle, set the data-tooltip attribute for CSS
            if (element.classList.contains('darkmode-toggle')) {
                element.setAttribute('data-tooltip', text);
            } else if (!element.classList.contains('sr-only')) {
                element.textContent = text;
            }
        }
    });
    
    // Update page title and description
    if (lang === 'fr') {
        document.title = '4skl - Développeur Freelance & Solutions Informatiques';
        document.querySelector('meta[name="description"]').setAttribute('content', 
            'Services professionnels de développement freelance et dépannage informatique. Spécialisé dans le développement web, solutions logicielles et support technique.');
    } else {
        document.title = '4skl - Freelance Developer & IT Solutions';
        document.querySelector('meta[name="description"]').setAttribute('content', 
            'Professional freelance developer and IT troubleshooting services. Specializing in web development, software solutions, and technical support.');
    }
}

/** Initialize all functionality when DOM is loaded **/
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dark mode
    initializeDarkMode();
    
    // Initialize language
    initializeLanguage();
    
    // Smooth scrolling for better UX
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add interactive effects to cards
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Initialize toggle fade on scroll
    initializeToggleFade();
});

/** Toggle fade on scroll functionality **/
function initializeToggleFade() {
    const darkModeToggle = document.querySelector('.darkmode-toggle');
    const languageToggle = document.querySelector('.language-toggle');
    let ticking = false;
    
    function updateToggleOpacity() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const fadeStart = 50; // Start fading after 50px
        const fadeEnd = 100;   // Completely hidden after 100px

        let opacity = 1;
        if (scrollTop > fadeStart) {
            opacity = Math.max(0, 1 - (scrollTop - fadeStart) / (fadeEnd - fadeStart));
        }
        
        if (darkModeToggle) {
            darkModeToggle.style.opacity = opacity;
            darkModeToggle.style.pointerEvents = opacity > 0.1 ? 'auto' : 'none';
        }
        if (languageToggle) {
            languageToggle.style.opacity = opacity;
            languageToggle.style.pointerEvents = opacity > 0.1 ? 'auto' : 'none';
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateToggleOpacity);
            ticking = true;
        }
    }
    
    // Add scroll event listener
    window.addEventListener('scroll', requestTick);
    
    // Initial call to set correct opacity on page load
    updateToggleOpacity();
}

/** Contact functionality with error handling **/
function handleContactClick(type, value) {
    try {
        if (type === 'email') {
            window.location.href = `mailto:${value}`;
        } else if (type === 'sms') {
            window.location.href = `sms:${value}`;
        }
    } catch (error) {
        console.error('Error handling contact click:', error);
        // Fallback: copy to clipboard if available
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(value).then(() => {
                console.log('Contact info copied to clipboard as fallback');
            }).catch(err => {
                console.error('Failed to copy to clipboard:', err);
            });
        }
    }
}

/** Performance optimization: Debounced scroll handler **/
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
