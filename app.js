/* ==========================================================================
   THEME: Antigravity Aesthetic - Premium Travel & Tourism Portfolio
   SCRIPT: Interactivity, Navigation, Form Submission & Filter Mocking
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Sticky Navigation & Header Transitions
    const header = document.querySelector('.site-header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('is-sticky');
        } else {
            header.classList.remove('is-sticky');
        }
    };
    
    // Trigger scroll check on load and scroll
    window.addEventListener('scroll', handleScroll);
    handleScroll();


    // 2. Mobile Menu Toggle
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileNavToggle && navMenu) {
        mobileNavToggle.addEventListener('click', () => {
            mobileNavToggle.classList.toggle('active');
            navMenu.classList.toggle('open');
            // Disable page scroll when menu is open
            if (navMenu.classList.contains('open')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when navigation link is clicked
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNavToggle.classList.remove('active');
                navMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }


    // 3. Elegant Search Modal Overlay
    const searchTrigger = document.getElementById('searchTrigger');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchOverlayClose = document.getElementById('searchOverlayClose');
    const searchOverlayInput = document.getElementById('searchOverlayInput');
    
    if (searchTrigger && searchOverlay && searchOverlayClose) {
        searchTrigger.addEventListener('click', () => {
            searchOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                searchOverlayInput.focus();
            }, 300);
        });

        const closeSearch = () => {
            searchOverlay.classList.remove('open');
            document.body.style.overflow = '';
            searchOverlayInput.value = '';
        };

        searchOverlayClose.addEventListener('click', closeSearch);

        // Escape Key closure
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchOverlay.classList.contains('open')) {
                closeSearch();
            }
        });
    }


    // 4. Traveler Testimonials Carousel / Slider
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    const testimonialDots = document.querySelectorAll('.testimonial-dot');
    let currentSlide = 0;
    let sliderTimer = null;
    
    const showSlide = (index) => {
        if (testimonialItems.length === 0) return;
        
        // Remove active states
        testimonialItems.forEach(item => item.classList.remove('active'));
        testimonialDots.forEach(dot => dot.classList.remove('active'));
        
        // Add active states to targeted elements
        testimonialItems[index].classList.add('active');
        testimonialDots[index].classList.add('active');
        currentSlide = index;
    };
    
    const nextSlide = () => {
        const nextIndex = (currentSlide + 1) % testimonialItems.length;
        showSlide(nextIndex);
    };
    
    const startAutoplay = () => {
        clearInterval(sliderTimer);
        sliderTimer = setInterval(nextSlide, 7000); // Transitions every 7 seconds
    };
    
    if (testimonialDots.length > 0) {
        testimonialDots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                showSlide(idx);
                startAutoplay(); // Reset timer upon user interaction
            });
        });
        
        // Initialize
        showSlide(0);
        startAutoplay();
    }


    // 5. Scroll Reveal animations using Intersection Observer
    const revealElements = document.querySelectorAll('.reveal');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Stop observing once animated
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        // Fallback for older browsers
        revealElements.forEach(element => {
            element.classList.add('revealed');
        });
    }


    // 6. WP Forms simulated inquiry submission
    const inquiryForm = document.getElementById('inquiryForm');
    const formNotification = document.getElementById('formNotification');
    const resetFormBtn = document.getElementById('resetFormBtn');
    
    if (inquiryForm && formNotification) {
        inquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic validation
            const nameInput = document.getElementById('inquiryName');
            const emailInput = document.getElementById('inquiryEmail');
            const destInput = document.getElementById('inquiryDest');
            
            if (!nameInput.value.trim() || !emailInput.value.trim()) {
                alert('Please fill out all required fields.');
                return;
            }
            
            const submitBtn = inquiryForm.querySelector('.form-submit-btn');
            const originalText = submitBtn.innerHTML;
            
            // Simulating WordPress Ajax Form Loading State
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span style="letter-spacing: 0.05em;">Sending Inquiry...</span>';
            
            setTimeout(() => {
                // Fade in WP Form success overlay
                formNotification.classList.add('show');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                
                // Clear input fields
                inquiryForm.reset();
            }, 1800);
        });
    }
    
    if (resetFormBtn && formNotification) {
        resetFormBtn.addEventListener('click', () => {
            formNotification.classList.remove('show');
        });
    }


    // 7. Quick Search & Loop Grid Filter
    const heroSearchForm = document.getElementById('heroSearchForm');
    const destinationCards = document.querySelectorAll('.destination-card');
    const destinationsSection = document.getElementById('destinations');
    
    if (heroSearchForm) {
        heroSearchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const destQuery = document.getElementById('heroDest').value.toLowerCase().trim();
            const selectedType = document.getElementById('heroType').value.toLowerCase();
            
            let matchedCount = 0;
            
            destinationCards.forEach(card => {
                const cardTitle = card.querySelector('.destination-name').innerText.toLowerCase();
                const cardBadge = card.querySelector('.destination-badge').innerText.toLowerCase();
                
                // Check if card matches filters
                const matchesDest = destQuery === '' || cardTitle.includes(destQuery);
                
                let matchesType = false;
                if (selectedType === 'all') {
                    matchesType = true;
                } else {
                    // Map categories
                    if (selectedType === 'luxury' && (cardBadge.includes('luxury') || cardTitle.includes('maldives'))) {
                        matchesType = true;
                    } else if (selectedType === 'adventure' && (cardBadge.includes('adventure') || cardTitle.includes('alps') || cardTitle.includes('patagonia'))) {
                        matchesType = true;
                    } else if (selectedType === 'cultural' && (cardBadge.includes('cultural') || cardTitle.includes('kyoto') || cardTitle.includes('amalfi'))) {
                        matchesType = true;
                    }
                }
                
                if (matchesDest && matchesType) {
                    card.style.display = 'flex';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                    matchedCount++;
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Scroll smoothly down to the filtered results section
            if (destinationsSection) {
                destinationsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

});
