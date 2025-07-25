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

/** Initialize all functionality when DOM is loaded **/
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dark mode
    initializeDarkMode();
    
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
});

/** Contact functionality **/
function handleContactClick(type, value) {
    if (type === 'email') {
        window.location.href = `mailto:${value}`;
    } else if (type === 'sms') {
        window.location.href = `sms:${value}`;
    }
}
