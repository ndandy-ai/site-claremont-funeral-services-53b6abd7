document.addEventListener('DOMContentLoaded', () => {

    // --- PRELOADER --- //
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        loader.classList.add('hidden');
    });

    // --- ELEMENT SELECTION --- //
    const header = document.getElementById('main-header');
    const navLinks = document.querySelectorAll('.nav-link');
    const pageSections = document.querySelectorAll('.page-section');
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');

    let currentActivePage = document.querySelector('.page-section.active-page');

    // --- HEADER SCROLL EFFECT --- //
    const handleScroll = (e) => {
        if (e.target.scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    if (currentActivePage) {
        currentActivePage.addEventListener('scroll', handleScroll);
    }

    // --- SPA NAVIGATION LOGIC --- //
    const setActivePage = (targetId) => {
        // Deactivate current scroll listener
        if (currentActivePage) {
            currentActivePage.removeEventListener('scroll', handleScroll);
            currentActivePage.classList.remove('active-page');
        }

        // Remove active class from all nav links
        navLinks.forEach(link => link.classList.remove('active'));

        // Find and activate the target page section
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.classList.add('active-page');
            currentActivePage = targetSection;
            currentActivePage.scrollTop = 0; // Scroll to top of new section

            // Add new scroll listener
            currentActivePage.addEventListener('scroll', handleScroll);
            header.classList.remove('scrolled'); // Reset header style

            // Update active state on nav links
            document.querySelectorAll(`a[href='${targetId}']`).forEach(link => {
                link.classList.add('active');
            });
        } else {
          // Fallback for initial load if hash doesn't match
          document.querySelector('#home').classList.add('active-page');
          document.querySelector('a[href="#home"]').classList.add('active');
        }
        
        // Close mobile menu if open
        mainNav.classList.remove('open');
        menuToggle.classList.remove('open');
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                setActivePage(href);
                // Update URL hash without jumping
                history.pushState(null, null, href);
            }
        });
    });
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        const hash = window.location.hash || '#home';
        setActivePage(hash);
    });

    // Set initial page based on URL hash or default to #home
    const initialHash = window.location.hash || '#home';
    setActivePage(initialHash);

    // --- MOBILE MENU TOGGLE --- //
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('open');
        mainNav.classList.toggle('open');
    });

    // --- SCROLL-TRIGGERED ANIMATIONS --- //
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: unobserve after animation
                // observer.unobserve(entry.target);
            }
        });
    }, {
        root: null, // observes intersections relative to the viewport
        threshold: 0.1 // 10% of the item must be visible
    });

    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // --- FAQ ACCORDION --- //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            if (isActive) {
                item.classList.remove('active');
                answer.style.maxHeight = null;
            } else {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // --- FORM HANDLING (simple feedback) ---
    const contactForm = document.getElementById('contact-form');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('.form-submit-btn');
            submitBtn.textContent = 'Sending...';
            
            // Simulate a network request
            setTimeout(() => {
                submitBtn.textContent = 'Message Sent!';
                submitBtn.style.backgroundColor = '#45a049'; // Use darker green for success
                contactForm.reset();

                // Reset button after a few seconds
                setTimeout(() => {
                    submitBtn.textContent = 'Send Message';
                    submitBtn.style.backgroundColor = '';
                }, 3000);

            }, 1500);
        });
    }
});