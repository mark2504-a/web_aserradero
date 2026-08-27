document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const nombre = document.getElementById('name').value;
    const correoCliente = document.getElementById('email').value;
    const producto = document.getElementById('subject').value;
    const mensaje = document.getElementById('message').value;

    const asunto = encodeURIComponent(`Solicitud de cotización - ${nombre}`);
    const cuerpo = encodeURIComponent(
        `Nombre: ${nombre}\n` +
        `Correo del cliente: ${correoCliente}\n` +
        `Producto/Tema: ${producto}\n` +
        `Mensaje:\n${mensaje}`
    );

    var formMessage = document.getElementById('formMessage');
    if (formMessage) {
        formMessage.classList.remove('error');
        formMessage.classList.add('success');
        formMessage.textContent = 'Se abrió tu aplicación de correo con el mensaje listo. Por favor confirma el envío desde ahí para completar el contacto.';
        formMessage.style.display = 'block';
    }

    window.location.href = `mailto:ne7366010@gmail.com?subject=${asunto}&body=${cuerpo}`;
});
