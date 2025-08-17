// Script para Google Apps Script - Colaboraciones Plantas y Flores
// Copia este código en Google Apps Script y despliega como Web App

// ID de tu Google Spreadsheet (obtienes el ID de la URL)
const SPREADSHEET_ID = '11h0m1IKNRo37ttLXBwQ4DaUl0eKBSA6XyvOBKRSkjQo';
const SHEET_NAME = 'Colaboraciones';

function doPost(e) {
  console.log('Script ejecutado con datos:', e);
  try {
    // Permitir CORS
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    
    // Obtener datos desde parámetros (más directo)
    let data = e.parameter || {};
    
    // Si no hay parámetros, intentar parsear el body
    if (Object.keys(data).length === 0 && e.postData) {
      try {
        // Intentar JSON
        data = JSON.parse(e.postData.contents);
      } catch {
        // Intentar URL-encoded
        const params = new URLSearchParams(e.postData.contents);
        data = {};
        for (const [key, value] of params) {
          data[key] = value;
        }
      }
    }
    
    console.log('Datos parseados:', data);
    
    // Abrir el spreadsheet
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // Si la hoja no existe, crearla con encabezados
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      const headers = [
        'Fecha/Hora',
        'Empresa',
        'Nombre Contacto',
        'Email',
        'Sitio Web',
        'Productos/Servicios',
        'Tipo Colaboración',
        'Valores Sostenibles',
        'Mensaje Adicional',
        'Estado'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Formatear encabezados
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#4a7c23');
      headerRange.setFontColor('white');
      headerRange.setFontWeight('bold');
      headerRange.setFontSize(11);
    }
    
    // Preparar los datos para insertar
    const rowData = [
      data.timestamp || new Date().toLocaleString('es-ES', {timeZone: 'Europe/Madrid'}),
      data.company || '',
      data.name || '',
      data.email || '',
      data.website || '',
      data.products || '',
      data.collaboration || '',
      data.values || '',
      data.message || '',
      'Nuevo' // Estado inicial
    ];
    
    // Insertar nueva fila al final
    sheet.appendRow(rowData);
    
    // Formatear la nueva fila
    const lastRow = sheet.getLastRow();
    const dataRange = sheet.getRange(lastRow, 1, 1, rowData.length);
    
    // Alternar color de fondo para facilitar lectura
    if (lastRow % 2 === 0) {
      dataRange.setBackground('#f8f9fa');
    }
    
    // Ajustar ancho de columnas automáticamente
    sheet.autoResizeColumns(1, rowData.length);
    
    // Enviar email de notificación (opcional)
    try {
      const emailSubject = `Nueva Colaboración: ${data.company}`;
      const emailBody = `
        Nueva propuesta de colaboración recibida:
        
        📝 Empresa: ${data.company}
        👤 Contacto: ${data.name}
        📧 Email: ${data.email}
        🌐 Web: ${data.website || 'No especificado'}
        
        🎯 Tipo de colaboración: ${data.collaboration || 'No especificado'}
        
        💚 Valores sostenibles:
        ${data.values}
        
        📋 Productos/Servicios:
        ${data.products}
        
        💬 Mensaje adicional:
        ${data.message || 'Ninguno'}
        
        ⏰ Recibido: ${data.timestamp}
        
        ---
        Ver en Google Sheets: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}
      `;
      
      // Cambiar por tu email
      MailApp.sendEmail({
        to: 'jardineraamable@gmail.com',
        subject: emailSubject,
        body: emailBody
      });
    } catch (emailError) {
      console.log('Error enviando email:', emailError);
      // No fallar si el email falla
    }
    
    // Respuesta exitosa
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Colaboración guardada correctamente'
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
      
  } catch (error) {
    console.error('Error:', error);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Error procesando la solicitud: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      });
  }
}

// Manejar preflight requests (CORS)
function doGet(e) {
  return ContentService
    .createTextOutput('API de colaboraciones activa')
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
}

// Manejar OPTIONS requests (preflight CORS)
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    });
}

// Función de utilidad para limpiar datos
function cleanData(data) {
  const cleaned = {};
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      cleaned[key] = typeof data[key] === 'string' ? data[key].trim() : data[key];
    }
  }
  return cleaned;
}