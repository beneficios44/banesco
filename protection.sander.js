(function() {
    // 1. Bloqueo del clic derecho
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });

    // 2. Bloqueo de atajos de teclado para inspeccionar
    document.addEventListener('keydown', function(e) {
        // Bloquear F12
        if (e.keyCode === 123) {
            e.preventDefault();
        }
        // Bloquear Ctrl+Shift+I
        if (e.ctrlKey && e.shiftKey && e.keyCode === 'I'.charCodeAt(0)) {
            e.preventDefault();
        }
        // Bloquear Ctrl+Shift+J
        if (e.ctrlKey && e.shiftKey && e.keyCode === 'J'.charCodeAt(0)) {
            e.preventDefault();
        }
        // Bloquear Ctrl+U (Ver código fuente)
        if (e.ctrlKey && e.keyCode === 'U'.charCodeAt(0)) {
            e.preventDefault();
        }
        // Bloquear Ctrl+S (Guardar página)
        if (e.ctrlKey && e.keyCode === 'S'.charCodeAt(0)) {
            e.preventDefault();
        }
    });

    // 3. Detección de herramientas de desarrollador
    const checkDevTools = () => {
        const widthThreshold = window.outerWidth - window.innerWidth > 160;
        const heightThreshold = window.outerHeight - window.innerHeight > 160;

        if (widthThreshold || heightThreshold) {
            // Redirige o bloquea la página si se detectan las herramientas
            // document.body.innerHTML = '<h1>Acceso no autorizado.</h1>';
        }

        // Bucle para dificultar el debugging
        (function() {
            try {
                (function(counter) {
                    if (('' + (counter / counter)).length !== 1 || counter % 20 === 0) {
                        debugger;
                    } else {
                        debugger;
                    }
                    arguments.callee(++counter);
                })(0);
            } catch (e) {}
        })();
    };
    setInterval(checkDevTools, 1000);
})();