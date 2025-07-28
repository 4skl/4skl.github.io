/** Dark mode functionality with system preference detection **/
function initializeDarkMode() {
    const toggleButton = document.querySelector('#dark-mode-checkbox');
    const toggleContainer = document.querySelector('#darkmode-toggle-button');
    const html = document.documentElement;
    
    console.log('Initializing dark mode...', { toggleButton, toggleContainer });
    
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
    
    console.log('Initial theme state:', { savedTheme, systemPrefersDark, isDarkMode });
    
    // Apply the theme
    if (isDarkMode) {
        html.classList.add('dark-theme');
        if (toggleButton) toggleButton.checked = true;
    } else {
        html.classList.remove('dark-theme');
        if (toggleButton) toggleButton.checked = false;
    }
    
    // Update ARIA state for the toggle container
    if (toggleContainer) {
        toggleContainer.setAttribute('aria-checked', isDarkMode.toString());
    }
    
    // Listen for toggle changes
    if (toggleButton) {
        toggleButton.addEventListener('change', function() {
            try {
                const isDark = this.checked;
                console.log('Dark mode toggle clicked, isDark:', isDark);
                
                if (isDark) {
                    html.classList.add('dark-theme');
                    localStorage.setItem('theme', 'dark');
                } else {
                    html.classList.remove('dark-theme');
                    localStorage.setItem('theme', 'light');
                }
                
                // Update ARIA state
                if (toggleContainer) {
                    toggleContainer.setAttribute('aria-checked', isDark.toString());
                }
            } catch (error) {
                console.error('Error in dark mode toggle:', error);
            }
        });
    }
    
    // Add click support for the toggle container (in case checkbox doesn't get the click)
    if (toggleContainer) {
        toggleContainer.addEventListener('click', function(e) {
            // Only handle clicks if they didn't come from the checkbox itself
            if (e.target !== toggleButton) {
                console.log('Container clicked, triggering checkbox');
                if (toggleButton) {
                    toggleButton.click();
                }
            }
        });
        
        // Add keyboard support for the toggle container
        toggleContainer.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                console.log('Keyboard event on container, triggering checkbox');
                if (toggleButton) {
                    toggleButton.click();
                }
            }
        });
    }
    
    // Listen for system theme changes (only if user hasn't set preference)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            // Only update if user hasn't made a manual choice
            const isDark = e.matches;
            console.log('System theme changed:', isDark);
            
            if (isDark) {
                html.classList.add('dark-theme');
                if (toggleButton) toggleButton.checked = true;
            } else {
                html.classList.remove('dark-theme');
                if (toggleButton) toggleButton.checked = false;
            }
            
            // Update ARIA state
            if (toggleContainer) {
                toggleContainer.setAttribute('aria-checked', isDark.toString());
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
    try {
        const currentLang = localStorage.getItem('language') || 'en';
        const newLang = currentLang === 'en' ? 'fr' : 'en';
        setLanguage(newLang);
        localStorage.setItem('language', newLang);
        console.log('Language switched to:', newLang);
    } catch (error) {
        console.error('Error toggling language:', error);
    }
}

function setLanguage(lang) {
    // Update HTML lang attribute for accessibility
    document.documentElement.setAttribute('lang', lang);
    
    // Update ARIA state for dark mode toggle
    const toggleContainer = document.querySelector('#darkmode-toggle-button');
    if (toggleContainer) {
        toggleContainer.setAttribute('aria-checked', document.documentElement.classList.contains('dark-theme').toString());
    }
    
    // Update ARIA state for language toggle
    const langButton = document.querySelector('#language-toggle-button button');
    if (langButton) {
        langButton.setAttribute('aria-pressed', 'false'); // Reset to false, it's not a toggle that stays pressed
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
            flagIcon.src = 'flag-fr.svg';
            flagIcon.alt = 'French flag - Click to switch to French';
        } else {
            // Show British flag when in French (click to switch to English)
            flagIcon.src = 'flag-en.svg';
            flagIcon.alt = 'British flag - Click to switch to English';
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
    
    // Make functions globally available
    window.toggleLanguage = toggleLanguage;
    window.handleContactClick = handleContactClick;
    
    console.log('4skl website initialized successfully');
});

/** Toggle fade on scroll functionality - simplified for better performance **/
function initializeToggleFade() {
    const darkModeToggle = document.querySelector('.darkmode-toggle');
    const languageToggle = document.querySelector('.language-toggle');
    
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
    }
    
    // Add scroll event listener with passive option for better performance
    window.addEventListener('scroll', updateToggleOpacity, { passive: true });
    
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
