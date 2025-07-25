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
            if (this.checked) {
                html.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark');
            } else {
                html.classList.remove('dark-theme');
                localStorage.setItem('theme', 'light');
            }
        });
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
    // Update button text with flags
    const langButton = document.getElementById('lang-button-text');
    if (langButton) {
        langButton.textContent = lang === 'en' ? '🇫🇷' : '🇺🇸';
    }
    
    // Update all elements with data attributes
    document.querySelectorAll('[data-en][data-fr]').forEach(element => {
        const text = element.getAttribute('data-' + lang);
        if (text) {
            // For the dark mode toggle, set the data-tooltip attribute for CSS
            if (element.classList.contains('darkmode-toggle')) {
                element.setAttribute('data-tooltip', text);
            } else {
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

/** Contact functionality **/
function handleContactClick(type, value) {
    if (type === 'email') {
        window.location.href = `mailto:${value}`;
    } else if (type === 'sms') {
        window.location.href = `sms:${value}`;
    }
}
