/**
 * NCR Industrial Automation - Professional Production Script
 * High Performance | SEO Friendly | Clean Architecture
 */

(function() {
    "use strict";

    // --- CONFIGURATION & STATE ---
    const state = {
        isNavOpen: false,
        isDarkMode: localStorage.getItem('theme') === 'dark'
    };

    // --- DOM ELEMENTS ---
    const elements = {
        body: document.body,
        navbar: document.getElementById('navbar'),
        navLinks: document.querySelector('.nav-links'),
        mobileToggle: document.querySelector('.mobile-toggle'),
        scrollProgress: document.getElementById('scroll-progress'),
        backToTop: document.getElementById('backToTop'),
        contactForm: document.getElementById('contactForm'),
        faqQuestions: document.querySelectorAll('.faq-question'),
        searchInput: document.getElementById('productSearch'),
        productCards: document.querySelectorAll('.product-card'),
        yearSpan: document.getElementById('year')
    };

    // --- INITIALIZATION ---
    const init = () => {
        elements.body.classList.add('js-loaded');
        if (elements.yearSpan) elements.yearSpan.textContent = new Date().getFullYear();
        setupIntersectionObserver();
        applySavedTheme();
    };

    // --- THEME MANAGEMENT ---
    const applySavedTheme = () => {
        if (state.isDarkMode) elements.body.classList.add('dark-theme');
    };

    // --- NAVIGATION LOGIC ---
    const toggleMobileMenu = () => {
        state.isNavOpen = !state.isNavOpen;
        elements.navLinks.classList.toggle('active');
        const icon = elements.mobileToggle.querySelector('i');
        icon.className = state.isNavOpen ? 'fas fa-times' : 'fas fa-bars';
        elements.body.style.overflow = state.isNavOpen ? 'hidden' : '';
    };

    // --- PERFORMANCE OPTIMIZED SCROLL HANDLER ---
    let tick = false;
    window.addEventListener('scroll', () => {
        if (!tick) {
            window.requestAnimationFrame(() => {
                handleScrollEffects();
                tick = false;
            });
            tick = true;
        }
    });

    const handleScrollEffects = () => {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollY / docHeight) * 100;

        // Progress Bar
        if (elements.scrollProgress) elements.scrollProgress.style.width = `${scrollPercent}%`;

        // Sticky Nav & Back to Top
        elements.navbar.classList.toggle('scrolled', scrollY > 50);
        elements.backToTop.classList.toggle('show', scrollY > 400);

        // Active Link Highlight
        highlightActiveSection(scrollY);
    };

    const highlightActiveSection = (scrollY) => {
        const sections = document.querySelectorAll('section[id]');
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            const link = document.querySelector(`.nav-links a[href*=${sectionId}]`);

            if (link && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                link.classList.add('active');
            } else if (link) {
                link.classList.remove('active');
            }
        });
    };

    // --- INTERSECTION OBSERVER (Scroll Animations) ---
    const setupIntersectionObserver = () => {
        const options = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        document.querySelectorAll('.scroll-fade').forEach(el => observer.observe(el));
    };

    // --- FAQ ACCORDION ---
    elements.faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isOpen = question.classList.contains('active');

            // Close other items for a clean UI
            elements.faqQuestions.forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.style.maxHeight = null;
            });

            if (!isOpen) {
                question.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // --- PRODUCT SEARCH (Optimized) ---
    if (elements.searchInput) {
        elements.searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            elements.productCards.forEach(card => {
                const content = card.getAttribute('data-name') || card.innerText.toLowerCase();
                card.style.display = content.includes(term) ? "" : "none";
            });
        });
    }

    // --- FORM HANDLING & VALIDATION ---
    if (elements.contactForm) {
        elements.contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = elements.contactForm.querySelector('button[type="submit"]');
            const successMsg = document.getElementById('formSuccess');
            
            // Basic UI Feedback
            btn.classList.add('loading');
            btn.disabled = true;

            // Simulate API Call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Success State
            btn.classList.remove('loading');
            successMsg.style.display = 'block';
            elements.contactForm.reset();

            setTimeout(() => {
                successMsg.style.display = 'none';
                btn.disabled = false;
            }, 5000);
        });
    }

    // --- EVENT LISTENERS ---
    elements.mobileToggle.addEventListener('click', toggleMobileMenu);
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (state.isNavOpen) toggleMobileMenu();
        });
    });

    elements.backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Run Init
    init();

})();
