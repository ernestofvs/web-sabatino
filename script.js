document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    
    let currentSlide = 0;
    let slideInterval;
    const intervalTime = 5000; // 5 segundos por cada slide

    const nextSlide = () => {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    };

    const prevSlide = () => {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    };

    const goToSlide = (index) => {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    };

    if (slides.length > 0 && nextBtn && prevBtn) {
        // Event Listeners
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetInterval();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetInterval();
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetInterval();
            });
        });

        // Auto slide
        const startInterval = () => {
            slideInterval = setInterval(nextSlide, intervalTime);
        };

        const resetInterval = () => {
            clearInterval(slideInterval);
            startInterval();
        };

        startInterval();
    }

    // =========================================================
    // Animación de los números de estadísticas
    // =========================================================
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers.length > 0) {
        // Función para animar el contador
        const animateNumber = (element) => {
            const target = parseInt(element.getAttribute('data-target'));
            const isFormatted = element.getAttribute('data-is-formatted') === 'true';
            
            // Empezamos desde 2 como solicitaste
            let current = 2;
            if (target <= 2) current = 0;
            
            // Para que la animación dure unos 3.5 a 4 segundos a 60FPS (~240 frames)
            // Usamos incrementos con decimales para que los números pequeños también vayan lento
            const increment = target / 200; 
            
            const updateCounter = () => {
                current += increment;
                
                if (current >= target) {
                    current = target;
                    
                    let finalDisplay = current;
                    if (isFormatted && current >= 1000) {
                        finalDisplay = current.toLocaleString('es-ES');
                    }
                    
                    element.textContent = '+' + finalDisplay;
                } else {
                    // Redondeamos para no mostrar decimales durante la animación
                    let displayValue = Math.floor(current);
                    if (isFormatted && displayValue >= 1000) {
                        displayValue = displayValue.toLocaleString('es-ES');
                    }
                    
                    element.textContent = '+' + displayValue;
                    requestAnimationFrame(updateCounter);
                }
            };
            
            // Iniciar la animación
            updateCounter();
        };

        // Configurar el IntersectionObserver para detectar cuándo los números son visibles
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // El elemento es visible, iniciamos la animación
                    animateNumber(entry.target);
                    // Dejamos de observar para que la animación solo ocurra una vez
                    observer.unobserve(entry.target);
                }
            });
        }, {
            // threshold de 0.5 significa que se activará cuando al menos el 50% de la caja de cifras sea visible
            threshold: 0.5
        });

        // Observar cada número
        statNumbers.forEach(stat => {
            // Inicializar el texto a +2 antes de que empiece (o al estado base)
            const target = parseInt(stat.getAttribute('data-target'));
            if (target > 2) {
                stat.textContent = '+2';
            }
            statsObserver.observe(stat);
        });
    }

    // =========================================================
    // Menú Móvil
    // =========================================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav');
    const headerCta = document.querySelector('.header-cta');
    const navLinks = document.querySelectorAll('.nav a');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            headerCta.classList.toggle('active');
        });

        // Cerrar el menú al hacer clic en un enlace
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                headerCta.classList.remove('active');
            });
        });
    }

    // =========================================================
    // Acordeón de Servicios
    // =========================================================
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            // Verificar si este elemento ya está activo
            const isActive = item.classList.contains('active');
            
            // Alternar estado activo en el elemento clicado
            if (isActive) {
                item.classList.remove('active');
                item.querySelector('.accordion-content').style.maxHeight = null;
            } else {
                item.classList.add('active');
                const content = item.querySelector('.accordion-content');
                // Asignar un maxHeight basado en el scrollHeight real para permitir la transición
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

});
