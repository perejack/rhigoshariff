<?php
/* =========================================================
   RHINGGO ENERGY - CAREER APPLICATION HANDLER
   Uploads are emailed to the recruitment recipient.
   Change $recipient below if Rhinggo uses another address.
========================================================= */

header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit;
}

$recipient = 'Sales@rhinggo.com';

$name     = trim($_POST['name'] ?? '');
$email    = trim($_POST['email'] ?? '');
$phone    = trim($_POST['phone'] ?? '');
$location = trim($_POST['location'] ?? '');
$job      = trim($_POST['job'] ?? '');
$message  = trim($_POST['message'] ?? '');

if ($name === '' || $email === '' || $phone === '' || $job === '') {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Please complete all required fields.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}

if (!isset($_FILES['cv']) || $_FILES['cv']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Please upload your CV before submitting.']);
    exit;
}

$cv = $_FILES['cv'];
$maxSize = 5 * 1024 * 1024;

if ($cv['size'] > $maxSize) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Your CV must be smaller than 5 MB.']);
    exit;
}

$allowed = [
    'pdf'  => 'application/pdf',
    'doc'  => 'application/msword',
    'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

$extension = strtolower(pathinfo($cv['name'], PATHINFO_EXTENSION));

if (!isset($allowed[$extension])) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Only PDF, DOC and DOCX CV files are accepted.']);
    exit;
}

$detectedMime = '';
if (function_exists('finfo_open')) {
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    if ($finfo) {
        $detectedMime = finfo_file($finfo, $cv['tmp_name']);
        finfo_close($finfo);
    }
}

$validMime = false;
if ($extension === 'doc') {
    $validMime = in_array($detectedMime, ['application/msword', 'application/octet-stream'], true);
} elseif ($extension === 'docx') {
    $validMime = in_array($detectedMime, ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip', 'application/octet-stream'], true);
} elseif ($extension === 'pdf') {
    $validMime = ($detectedMime === 'application/pdf');
}

if ($detectedMime !== '' && !$validMime) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'The uploaded CV file type could not be verified.']);
    exit;
}

$safeName = preg_replace('/[^A-Za-z0-9._-]/', '_', basename($cv['name']));
$subject = 'New Rhinggo Job Application - ' . $job;

$body = "A new job application has been submitted through the Rhinggo Careers website.\n\n";
$body .= "Position: {$job}\n";
$body .= "Full Name: {$name}\n";
$body .= "Email: {$email}\n";
$body .= "Phone: {$phone}\n";
$body .= "Location: {$location}\n\n";
$body .= "Cover Letter / Message:\n{$message}\n";

$boundary = md5((string) microtime(true));

$headers = "From: Rhinggo Careers <no-reply@rhinggo.com>\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: multipart/mixed; boundary=\"{$boundary}\"\r\n";

$encodedBody = chunk_split(base64_encode($body));
$fileData = chunk_split(base64_encode(file_get_contents($cv['tmp_name'])));

$emailBody  = "--{$boundary}\r\n";
$emailBody .= "Content-Type: text/plain; charset=\"UTF-8\"\r\n";
$emailBody .= "Content-Transfer-Encoding: base64\r\n\r\n";
$emailBody .= $encodedBody . "\r\n";
$emailBody .= "--{$boundary}\r\n";
$emailBody .= "Content-Type: {$allowed[$extension]}; name=\"{$safeName}\"\r\n";
$emailBody .= "Content-Disposition: attachment; filename=\"{$safeName}\"\r\n";
$emailBody .= "Content-Transfer-Encoding: base64\r\n\r\n";
$emailBody .= $fileData . "\r\n";
$emailBody .= "--{$boundary}--\r\n";

$sent = mail($recipient, $subject, $emailBody, $headers);

if (!$sent) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'We could not send your application right now. Please try again later.'
    ]);
    exit;
}

echo json_encode([
    'success' => true,
    'message' => 'Your application has been submitted successfully. Thank you for applying to Rhinggo.'
]);
