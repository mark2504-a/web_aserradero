<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitizar y validar los datos de entrada
    $name = filter_var(trim($_POST['name']), FILTER_SANITIZE_STRING);
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $subject = filter_var(trim($_POST['subject']), FILTER_SANITIZE_STRING);
    $message = filter_var(trim($_POST['message']), FILTER_SANITIZE_STRING);

    // Validaciones
    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'El correo electrónico no es válido']);
        exit;
    }

    // Configuración del correo
    $to = "aserraderoceibadeoro@msn.com"; // Cambia por tu correo
    $email_subject = "Nuevo mensaje de contacto: $subject";
    
    // Construir el cuerpo del mensaje
    $email_body = "Has recibido un nuevo mensaje del formulario de contacto.\n\n";
    $email_body .= "Nombre: $name\n";
    $email_body .= "Email: $email\n";
    $email_body .= "Asunto: $subject\n\n";
    $email_body .= "Mensaje:\n$message\n";

    // Encabezados
    $headers = "From: $email\n";
    $headers .= "Reply-To: $email\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\n";

    try {
        // Intentar enviar el correo
        if (mail($to, $email_subject, $email_body, $headers)) {
            echo json_encode(['success' => true, 'message' => 'Mensaje enviado correctamente']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al enviar el correo. Intente nuevamente.']);
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}
?>