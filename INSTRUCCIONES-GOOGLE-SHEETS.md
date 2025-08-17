# 📊 Configuración Google Sheets para Formulario de Colaboraciones

## 🚀 Pasos para Configurar

### 1. **Crear Google Spreadsheet**
1. Ve a [Google Sheets](https://sheets.google.com)
2. Crea una nueva hoja de cálculo
3. Nómbrala: "Colaboraciones Plantas y Flores"
4. Copia el **ID del Spreadsheet** de la URL:
   ```
   https://docs.google.com/spreadsheets/d/TU_SPREADSHEET_ID_AQUI/edit
                                         ^^^^^^^^^^^^^^^^^^^
   ```

### 2. **Configurar Google Apps Script**
1. Ve a [Google Apps Script](https://script.google.com)
2. Crea un **nuevo proyecto**
3. Borra el código por defecto
4. Copia y pega el contenido del archivo `google-apps-script.js`
5. **Personaliza estas variables**:
   ```javascript
   const SPREADSHEET_ID = 'TU_SPREADSHEET_ID_AQUI'; // ID de tu hoja
   
   // En la función de email, cambia:
   MailApp.sendEmail({
     to: 'tu-email@plantasyflores.online', // Tu email real
     subject: emailSubject,
     body: emailBody
   });
   ```

### 3. **Configurar Permisos**
1. Guarda el proyecto (Ctrl+S)
2. Haz clic en **"Desplegar"** > **"Nueva implementación"**
3. Tipo: **"Aplicación web"**
4. Configuración:
   - **Ejecutar como**: Tu cuenta
   - **Quién puede acceder**: Cualquier persona
5. Haz clic en **"Desplegar"**
6. **Autoriza los permisos** cuando te lo pida
7. **Copia la URL** que te da (algo como: `https://script.google.com/macros/s/ABC123.../exec`)

### 4. **Actualizar el Formulario**
1. Ve al archivo `src/pages/colaboraciones.astro`
2. En la línea 1423, reemplaza:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'TU_GOOGLE_SCRIPT_URL_AQUI';
   ```
   Por:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/TU_URL_AQUI/exec';
   ```

## 📋 Estructura de Datos que se Guardará

| Columna | Descripción |
|---------|-------------|
| **Fecha/Hora** | Timestamp automático |
| **Empresa** | Nombre de la empresa |
| **Nombre Contacto** | Persona de contacto |
| **Email** | Email de contacto |
| **Sitio Web** | URL de la empresa |
| **Productos/Servicios** | Descripción de productos |
| **Tipo Colaboración** | Tipo seleccionado |
| **Valores Sostenibles** | Respuesta sobre sostenibilidad |
| **Mensaje Adicional** | Mensaje opcional |
| **Estado** | "Nuevo" por defecto |

## 🔧 Funcionalidades Incluidas

### ✅ **Formulario Frontend**
- Validación completa de campos
- Indicador de carga durante envío
- Mensajes de éxito/error
- Responsive para móvil
- Reset automático tras envío exitoso

### ✅ **Google Apps Script**
- Creación automática de hoja "Colaboraciones"
- Formato automático de encabezados
- Colores alternados en filas
- Ajuste automático de columnas
- Timestamp automático en zona horaria española

### ✅ **Notificaciones Email**
- Email automático por cada nueva colaboración
- Incluye todos los datos del formulario
- Enlace directo al Google Sheets
- Formato legible y profesional

### ✅ **Seguridad y CORS**
- Configuración CORS para permitir el dominio
- Validación de datos
- Manejo de errores
- Protección anti-spam básica

## 🚨 **Importante: Configurar Permisos**

Para que Google Apps Script pueda:
- ✅ Escribir en Google Sheets
- ✅ Enviar emails
- ✅ Ser accesible desde tu web

Debes autorizar estos permisos cuando despliegues el script.

## 📱 **Prueba el Formulario**

1. Una vez configurado, ve a `/colaboraciones/`
2. Rellena el formulario de prueba
3. Verifica que aparece en Google Sheets
4. Comprueba que recibes el email de notificación

## 🔄 **Actualizaciones Futuras**

Si necesitas actualizar el script:
1. Modifica el código en Google Apps Script
2. Guarda (Ctrl+S)
3. **Importante**: Crea una **nueva implementación** (no actualices la existente)
4. Actualiza la URL en tu formulario

## 📊 **Gestión de Datos**

En Google Sheets podrás:
- ✅ Ver todas las colaboraciones en tiempo real
- ✅ Filtrar por empresa, tipo, fecha
- ✅ Marcar estados (Nuevo, En proceso, Completado)
- ✅ Exportar datos a Excel/PDF
- ✅ Crear gráficos y reportes
- ✅ Compartir con tu equipo

¡Tu formulario estará 100% funcional y profesional! 🚀