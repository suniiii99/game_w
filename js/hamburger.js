function toggleMenu() {
    const navLinks = document.querySelector('.menu-icons');

    navLinks.classList.toggle('active');

    if (navLinks.classList.contains('active')) {
        document.body.classList.add('menu-active'); // Bloquea el movimiento del fondo
    } else {
        document.body.classList.remove('menu-active'); // Permite el movimiento nuevamente
    }
}