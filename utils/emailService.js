/**
 * Email Service Utility
 * Centraliza la lógica de envío de emails con nodemailer
 */

const nodemailer = require('nodemailer');

// Crear transporter una sola vez (reutilizable)
let transporter = null;

/**
 * Obtener o crear el transporter de nodemailer
 */
function getTransporter() {
  if (!transporter) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠️ EMAIL_USER o EMAIL_PASS no configurados en .env');
      return null;
    }

    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true para puerto 465, false para otros puertos
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: true
      }
    });
  }
  return transporter;
}

/**
 * Enviar email de cotización
 */
async function sendQuotationEmail(data) {
  const transporter = getTransporter();
  if (!transporter) {
    throw new Error('Email service no configurado. Verificar .env');
  }

  const { nombre, apellido, email, telefono, direccion, rol } = data;

  await transporter.sendMail({
    from: `"Formulario Web" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    subject: 'Nueva Cotización desde el formulario',
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="background-color: #8ad1da; padding: 10px; border-radius: 5px; color: white;">
          📩 Nueva Cotización Recibida
        </h2>
        <p>Se ha recibido una nueva solicitud de cotización con los siguientes datos:</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tbody>
            <tr>
              <td style="padding: 8px; border: 1px solid #ccc;"><strong>Nombre:</strong></td>
              <td style="padding: 8px; border: 1px solid #ccc;">${nombre} ${apellido}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ccc;"><strong>Email:</strong></td>
              <td style="padding: 8px; border: 1px solid #ccc;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ccc;"><strong>Teléfono:</strong></td>
              <td style="padding: 8px; border: 1px solid #ccc;">${telefono}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ccc;"><strong>Dirección:</strong></td>
              <td style="padding: 8px; border: 1px solid #ccc;">${direccion}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ccc;"><strong>Rol:</strong></td>
              <td style="padding: 8px; border: 1px solid #ccc;">${rol}</td>
            </tr>
          </tbody>
        </table>
        <p style="font-size: 0.9rem; color: #555; margin-top: 20px;">
          Este mensaje fue enviado automáticamente desde el formulario de contacto de tu sitio web.
        </p>
      </div>
    `
  });
}

/**
 * Enviar email de contacto desde footer
 */
async function sendContactEmail(data) {
  const transporter = getTransporter();
  if (!transporter) {
    throw new Error('Email service no configurado. Verificar .env');
  }

  const { nombre, apellido, telefono, email, mensaje } = data;

  await transporter.sendMail({
    from: `"Formulario Web" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    subject: 'Nuevo Mensaje desde el Formulario de Contacto (Footer)',
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="background-color: #8ad1da; padding: 10px; border-radius: 5px; color: white;">
          📬 Nuevo Mensaje de Contacto
        </h2>
        <p>Se ha recibido un nuevo mensaje desde el formulario de contacto ubicado en el footer del sitio:</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tbody>
            <tr>
              <td style="padding: 8px; border: 1px solid #ccc;"><strong>Nombre:</strong></td>
              <td style="padding: 8px; border: 1px solid #ccc;">${nombre} ${apellido}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ccc;"><strong>Email:</strong></td>
              <td style="padding: 8px; border: 1px solid #ccc;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ccc;"><strong>Teléfono:</strong></td>
              <td style="padding: 8px; border: 1px solid #ccc;">${telefono}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ccc;"><strong>Mensaje:</strong></td>
              <td style="padding: 8px; border: 1px solid #ccc;">${mensaje}</td>
            </tr>
          </tbody>
        </table>
        <p style="font-size: 0.9rem; color: #555; margin-top: 20px;">
          Este mensaje fue enviado automáticamente desde el formulario de contacto ubicado en el footer del sitio web.
        </p>
      </div>
    `
  });
}

module.exports = {
  sendQuotationEmail,
  sendContactEmail,
  getTransporter
};
