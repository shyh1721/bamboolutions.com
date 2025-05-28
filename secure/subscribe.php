<?php
// File: subscribe.php
// Basic security checks
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

// Honeypot trap
if (!empty($_POST['website'])) {
    header("Location: " . $_SERVER['HTTP_REFERER'] . "?subscription=success");
    exit;
}

// Process email
$email = trim($_POST['email'] ?? '');
$cleaned_email = filter_var($email, FILTER_SANITIZE_EMAIL);

// Simple validation
if (empty($email) || !preg_match('/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/', $cleaned_email)) {
    header("Location: " . $_SERVER['HTTP_REFERER'] . "?subscription=invalid");
    exit;
}

// Load PHPMailer
require $_SERVER['DOCUMENT_ROOT'] . '/phpmailer/src/Exception.php';
require $_SERVER['DOCUMENT_ROOT'] . '/phpmailer/src/PHPMailer.php';
require $_SERVER['DOCUMENT_ROOT'] . '/phpmailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

try {
    $mail = new PHPMailer(true);

    // SMTP Configuration
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'simon.yh103@gmail.com';
    $mail->Password = 'gqtl vczi vpei zwno';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;

    // Email content
    $mail->setFrom('noreply@bamboolutions.com', 'Website Subscription');
    $mail->addAddress('sales@bamboolutions.com');
    $mail->Subject = 'New Newsletter Subscription';
    $mail->Body = "New subscriber email: $cleaned_email";

    $mail->send();
    header("Location: " . $_SERVER['HTTP_REFERER'] . "?subscription=success");

} catch (Exception $e) {
    error_log('Subscription Error: ' . $e->getMessage());
    header("Location: " . $_SERVER['HTTP_REFERER'] . "?subscription=error");
}

exit;
