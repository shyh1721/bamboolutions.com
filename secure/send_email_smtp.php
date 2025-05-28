<?php
// Enable error reporting (disable in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Get language from referring page
$lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? 'en', 0, 2);
$allowed_langs = ['en', 'fr', 'es', 'ar', 'de', 'ja', 'zh'];
$lang = in_array($lang, $allowed_langs) ? $lang : 'en';

// Verify POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: https://bamboolutions.com/contact.html?status=error");
    exit;
}

// Load PHPMailer
require $_SERVER['DOCUMENT_ROOT'] . '/phpmailer/src/Exception.php';
require $_SERVER['DOCUMENT_ROOT'] . '/phpmailer/src/PHPMailer.php';
require $_SERVER['DOCUMENT_ROOT'] . '/phpmailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Honeypot trap
if (!empty($_POST['website'])) {
    header("Location: https://bamboolutions.com/contact.html?status=success");
    exit;
}

// Process and validate form data
$fields = [
    'name' => FILTER_SANITIZE_STRING,
    'company' => FILTER_SANITIZE_STRING,
    'email' => FILTER_SANITIZE_EMAIL,
    'phone' => FILTER_SANITIZE_STRING,
    'subject' => FILTER_SANITIZE_STRING,
    'message' => FILTER_SANITIZE_STRING
];

$data = filter_input_array(INPUT_POST, $fields);

// Validation
$errors = [];
if (empty($data['name'])) $errors[] = 'Name required';
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) $errors[] = 'Invalid email';
if (empty($data['message'])) $errors[] = 'Message required';

if (!empty($errors)) {
    $errorString = urlencode(implode(', ', $errors));
    header("Location: https://bamboolutions.com/contact.html?status=error&message=$errorString");
    exit;
}

// Configure Gmail SMTP
$mail = new PHPMailer(true);
try {
    // Server settings
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'simon.yh103@gmail.com';
    $mail->Password = 'gqtl vczi vpei zwno';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;

    // SSL context
    $mail->SMTPOptions = [
        'ssl' => [
            'verify_peer' => true,
            'verify_peer_name' => true,
            'allow_self_signed' => false
        ]
    ];

    // Recipients
    $mail->setFrom('simon.yh103@gmail.com', 'Bamboolutions Contact Form');
    $mail->addAddress('sales@bamboolutions.com');
    $mail->addReplyTo($data['email'], $data['name']);

    // Content
    $mail->Subject = "New Contact Form Submission - " . date('Y-m-d H:i');
    $mail->Body = sprintf(
        "Name: %s\nCompany: %s\nEmail: %s\nPhone: %s\nSubject: %s\n\nMessage:\n%s",
        $data['name'],
        $data['company'],
        $data['email'],
        $data['phone'],
        $data['subject'],
        $data['message']
    );

    $mail->send();
    header("Location: https://bamboolutions.com/contact.html?status=success");
} catch (Exception $e) {
    error_log('Mail Error: ' . $e->getMessage());
    header("Location: https://bamboolutions.com/contact.html?status=error&message=Service+unavailable");
}
