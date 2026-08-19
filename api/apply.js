const Busboy = require('busboy');
const nodemailer = require('nodemailer');

export const config = {
  api: {
    bodyParser: false, // Disables standard body parser so Busboy can parse multipart form-data stream
  },
};

export default function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Invalid request method.' });
  }

  const fields = {};
  let fileData = null;
  let fileInfo = null;
  let fileSize = 0;

  let busboy;
  try {
    busboy = Busboy({ headers: req.headers });
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Failed to initialize form parser.' });
  }

  busboy.on('field', (fieldname, val) => {
    fields[fieldname] = val;
  });

  busboy.on('file', (fieldname, file, info) => {
    const { filename, encoding, mimeType } = info;

    if (fieldname !== 'cv' || !filename) {
      file.resume(); // consume and ignore non-CV files
      return;
    }

    const chunks = [];
    file.on('data', (data) => {
      fileSize += data.length;
      chunks.push(data);
    });

    file.on('end', () => {
      fileData = Buffer.concat(chunks);
      fileInfo = { filename, encoding, mimeType };
    });
  });

  busboy.on('finish', async () => {
    const name = (fields.name || '').trim();
    const email = (fields.email || '').trim();
    const phone = (fields.phone || '').trim();
    const location = (fields.location || '').trim();
    const job = (fields.job || '').trim();
    const message = (fields.message || '').trim();

    // 1. Field Validations
    if (!name || !email || !phone || !job) {
      return res.status(422).json({ success: false, message: 'Please complete all required fields.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(422).json({ success: false, message: 'Please enter a valid email address.' });
    }

    if (!fileData || !fileInfo || !fileInfo.filename) {
      return res.status(422).json({ success: false, message: 'Please upload your CV before submitting.' });
    }

    // 2. File Size Validation (Max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (fileSize > maxSize) {
      return res.status(422).json({ success: false, message: 'Your CV must be smaller than 5 MB.' });
    }

    // 3. File Extension Validation
    const extension = fileInfo.filename.split('.').pop().toLowerCase();
    const allowedExtensions = ['pdf', 'doc', 'docx'];
    if (!allowedExtensions.includes(extension)) {
      return res.status(422).json({
        success: false,
        message: 'Only PDF, DOC and DOCX CV files are accepted.',
      });
    }

    // 4. Configure Email Transporter
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT || 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpHost || !smtpUser || !smtpPass) {
      // Return 500 error if environment variables aren't configured yet
      return res.status(500).json({
        success: false,
        message: 'Email service is not configured. Please set SMTP_HOST, SMTP_USER, and SMTP_PASS environment variables on Vercel.',
      });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort),
      secure: Number(smtpPort) === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const recipient = process.env.RECIPIENT_EMAIL || 'Sales@rhinggo.com';
    const mailOptions = {
      from: `Rhinggo Careers <${process.env.SMTP_FROM || smtpUser}>`,
      to: recipient,
      replyTo: email,
      subject: `New Rhinggo Job Application - ${job}`,
      text: `A new job application has been submitted through the Rhinggo Careers website.\n\n` +
        `Position: ${job}\n` +
        `Full Name: ${name}\n` +
        `Email: ${email}\n` +
        `Phone: ${phone}\n` +
        `Location: ${location}\n\n` +
        `Cover Letter / Message:\n${message}\n`,
      attachments: [
        {
          filename: fileInfo.filename,
          content: fileData,
          contentType: fileInfo.mimeType,
        },
      ],
    };

    try {
      await transporter.sendMail(mailOptions);
      return res.status(200).json({
        success: true,
        message: 'Your application has been submitted successfully. Thank you for applying to Rhinggo.',
      });
    } catch (sendErr) {
      console.error('Nodemailer send error:', sendErr);
      return res.status(500).json({
        success: false,
        message: 'We could not send your application right now. Please try again later.',
      });
    }
  });

  req.pipe(busboy);
}
