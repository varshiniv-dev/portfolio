const faders = document.querySelectorAll('.fade');

const appearOptions = {
    threshold: 0.2
};

const appearOnScroll = new IntersectionObserver(function(
    entries,
    observer
) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
    });
}, appearOptions);

faders.forEach(fade => {
    appearOnScroll.observe(fade);
});
if (window.location.hash) {
    setTimeout(() => {
        history.replaceState(null, null, window.location.pathname);
    }, 500);
}