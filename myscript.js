document.getElementById('triggerButton').addEventListener('click', function() {
    console.log('Button clicked. Running myscript...');
    
    // Load and run the external JavaScript file
    var script = document.createElement('script');
    script.src = 'runscript.js';
    document.body.appendChild(script);
});
