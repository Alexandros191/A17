document.addEventListener('DOMContentLoaded', function () {
    const runButton = document.getElementById('runButton');

    runButton.addEventListener('click', function () {
        // Load and execute another JavaScript file
        const script = document.createElement('script');
        script.src = 'newsim.cjs';
        document.head.appendChild(script);
    });
});
