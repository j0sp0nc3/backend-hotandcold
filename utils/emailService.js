/**
 * Email Service Utility
 * Centraliza la lógica de envío de emails con Resend
 */

const { Resend } = require('resend');

// Inicializar Resend
let resend = null;

/**
 * Obtener o crear la instancia de Resend
 */
function getResend() {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      console.warn('⚠️ RESEND_API_KEY no configurado en .env');
      return null;
    }
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

/**
 * Enviar email de cotización
 */
async function sendQuotationEmail(data) {
  const resendClient = getResend();
  if (!resendClient) {
    throw new Error('Email service no configurado. Verificar RESEND_API_KEY en .env');
  }

  const { nombre, apellido, email, telefono, direccion, rol } = data;

  const emailOptions = {
    from: 'Formulario Web <onboarding@resend.dev>',
    to: process.env.EMAIL_TO || 'beroiza79@gmail.com',
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
  };

  // Agregar CC si está configurado
  if (process.env.EMAIL_CC) {
    emailOptions.cc = process.env.EMAIL_CC;
  }

  // Agregar BCC si está configurado
  if (process.env.EMAIL_BCC) {
    emailOptions.bcc = process.env.EMAIL_BCC;
  }

  await resendClient.emails.send(emailOptions);
}

/**
 * Enviar email de contacto
 */
async function sendContactEmail(data) {
  const resendClient = getResend();
  if (!resendClient) {
    throw new Error('Email service no configurado. Verificar RESEND_API_KEY en .env');
  }

  const { nombre, apellido, telefono, email, mensaje } = data;

  const emailOptions = {
    from: 'Formulario Web <onboarding@resend.dev>',
    to: process.env.EMAIL_TO || 'beroiza79@gmail.com',
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
  };

  // Agregar CC si está configurado
  if (process.env.EMAIL_CC) {
    emailOptions.cc = process.env.EMAIL_CC;
  }

  // Agregar BCC si está configurado
  if (process.env.EMAIL_BCC) {
    emailOptions.bcc = process.env.EMAIL_BCC;
  }

  await resendClient.emails.send(emailOptions);
  sendContactEmail,
  getResend
};
