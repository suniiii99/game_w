document.addEventListener("DOMContentLoaded", function() {
    const orientationMessage = document.querySelector('.orientation-message');

    function checkOrientation() {
        if (window.innerHeight > window.innerWidth) {
            orientationMessage.classList.remove('hidden');
        } else {
            orientationMessage.classList.add('hidden');
        }
    }

    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    
    checkOrientation();
});
