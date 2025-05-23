// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animations and interactions
    initializeAnimations();
    initializeScrollAnimations();
    initializeInteractions();
});

// Initialize main animations
function initializeAnimations() {
    // Check if animation has been shown before
    const hasSeenAnimation = localStorage.getItem('hasSeenAnimation');
    
    if (!hasSeenAnimation) {
        // Show animation screen
        const animationScreen = document.getElementById('animationScreen');
        const mainContent = document.getElementById('mainContent');
        
        // Hide main content initially
        mainContent.style.opacity = '0';
        
        // After animation completes (3.5s), show main content
        setTimeout(() => {
            mainContent.style.opacity = '1';
            localStorage.setItem('hasSeenAnimation', 'true');
        }, 3500);
    } else {
        // If animation has been shown before, hide animation screen immediately
        const animationScreen = document.getElementById('animationScreen');
        animationScreen.style.display = 'none';
        document.getElementById('mainContent').style.opacity = '1';
    }
}

// Initialize scroll animations
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-fadeIn-scroll, .animate-slideUp-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize user interactions
function initializeInteractions() {
    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('.email-input');
            const email = emailInput.value;
            
            if (validateEmail(email)) {
                // Show success message
                showNotification('Thank you for subscribing!', 'success');
                emailInput.value = '';
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }
    
    // Close fit club badge
    const closeBadgeBtn = document.querySelector('.close-badge');
    const fitClubBadge = document.querySelector('.fit-club-badge');
    
    if (closeBadgeBtn && fitClubBadge) {
        closeBadgeBtn.addEventListener('click', () => {
            fitClubBadge.style.display = 'none';
        });
    }
    
    // Add hover effects to collection cards
    const collectionCards = document.querySelectorAll('.collection-card');
    collectionCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

// Utility functions
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Add styles dynamically
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.padding = '1rem 2rem';
    notification.style.borderRadius = '4px';
    notification.style.color = 'white';
    notification.style.backgroundColor = type === 'success' ? '#4CAF50' : '#f44336';
    notification.style.zIndex = '1000';
    notification.style.animation = 'slideIn 0.3s ease forwards';
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style); 