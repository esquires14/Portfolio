document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section');

    // Function to add 'fadeIn' animation class when section is in view
    function checkInView() {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionBottom = section.getBoundingClientRect().bottom;

            // Check if section is partially in viewport
            const halfShown = (sectionTop < window.innerHeight - 50) && (sectionBottom > 0);
            
            if (halfShown) {
                section.classList.add('fadeIn');
            } else {
                section.classList.remove('fadeIn');
            }
        });
    }

    // Initial check when page loads
    checkInView();

    // Event listener for scroll to check which section is in view
    window.addEventListener('scroll', checkInView);

    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const sectionId = this.getAttribute('href').substring(1);
            const section = document.getElementById(sectionId);

            window.scrollTo({
                top: section.offsetTop - 50,
                behavior: 'smooth'
            });
        });
    });
});
