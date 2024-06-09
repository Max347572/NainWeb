const numSheep = 10;
const sheepData = [];

// Función para crear elementos oveja y agregarlos al documento
function createSheep() {
    for (let i = 0; i < numSheep; i++) {
        const sheep = document.createElement('div');
        sheep.classList.add('sheep');
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        sheep.style.top = startY + 'px';
        sheep.style.left = startX + 'px';
        sheep.dataset.startX = startX;
        sheep.dataset.startY = startY;
        document.body.appendChild(sheep);

        sheepData.push({
            element: sheep,
            startX: startX,
            startY: startY,
            lastMove: Date.now(),
            moveTimer: null
        });

        // Agregar evento de clic para hacer que las ovejas caigan y desaparezcan
        sheep.addEventListener('click', () => {
            sheep.style.animation = 'fall 2s forwards'; // Agregar animación de caída
            setTimeout(() => {
                sheep.remove();
            }, 2000); // Eliminar después de que termine la animación
        });
    }
}

// Función para mover las ovejas lejos del cursor suavemente
function moveSheepAway(event) {
    sheepData.forEach(sheep => {
        const rect = sheep.element.getBoundingClientRect();
        const sheepX = rect.left + rect.width / 2;
        const sheepY = rect.top + rect.height / 2;
        const distX = sheepX - event.clientX;
        const distY = sheepY - event.clientY;
        const distance = Math.sqrt(distX * distX + distY * distY);

        if (distance < 150) {
            const moveX = (distX / distance) * 5;
            const moveY = (distY / distance) * 5;
            const newX = rect.left + moveX;
            const newY = rect.top + moveY;
            sheep.element.style.left = newX + 'px';
            sheep.element.style.top = newY + 'px';
            sheep.lastMove = Date.now(); // Actualizar última vez movida

            // Limpiar cualquier temporizador de movimiento existente
            if (sheep.moveTimer) {
                clearTimeout(sheep.moveTimer);
            }

            // Establecer un nuevo temporizador de movimiento para movimiento continuo
            sheep.moveTimer = setTimeout(() => {
                sheep.moveTimer = null;
            }, 500); // Continuar moviendo durante 500ms
        }
    });
}

// Función para devolver las ovejas a sus posiciones originales después de la inactividad
function returnSheepToStartPosition() {
    const now = Date.now();
    sheepData.forEach(sheep => {
        if (now - sheep.lastMove > 3000) { // 3 segundos de inactividad
            const startX = parseFloat(sheep.element.dataset.startX);
            const startY = parseFloat(sheep.element.dataset.startY);
            const currentX = sheep.element.offsetLeft;
            const currentY = sheep.element.offsetTop;

            const distX = startX - currentX;
            const distY = startY - currentY;
            const distance = Math.sqrt(distX * distX + distY * distY);

            if (distance > 1) {
                const moveX = distX / 20; // Ajustar la velocidad cambiando el divisor
                const moveY = distY / 20; // Ajustar la velocidad cambiando el divisor
                sheep.element.style.left = currentX + moveX + 'px';
                sheep.element.style.top = currentY + moveY + 'px';
            }
        }
    });
}

// Agregar event listener para movimiento del mouse
document.addEventListener('mousemove', moveSheepAway);

// Llamar a la función para crear ovejas al cargar el script
createSheep();

// Verificar periódicamente si las ovejas deben volver a sus posiciones de inicio
setInterval(returnSheepToStartPosition, 50);
