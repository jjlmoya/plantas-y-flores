<template>
  <div class="calendar-export" :class="{ compact: isCompact }">
    <div v-if="!isCompact" class="export-section">
      <h3>📤 Exportar Calendario</h3>
      <p>{{ description }}</p>
      <div class="export-buttons">
        <button @click="exportToPDF" class="export-btn pdf" :disabled="isExporting">
          <span class="btn-icon">📄</span>
          <span class="btn-text">Exportar PDF</span>
          <span v-if="isExporting === 'pdf'" class="loading">...</span>
        </button>
        
        <button @click="exportToICS" class="export-btn ics" :disabled="isExporting">
          <span class="btn-icon">📅</span>
          <span class="btn-text">Exportar .ics</span>
          <span v-if="isExporting === 'ics'" class="loading">...</span>
        </button>
      </div>
    </div>
    
    <div v-else class="export-icons">
      <button @click="exportToPDF" class="icon-btn pdf" :disabled="isExporting" title="Exportar PDF">
        <span class="icon">📄</span>
        <span v-if="isExporting === 'pdf'" class="loading-dot"></span>
      </button>
      
      <button @click="exportToICS" class="icon-btn ics" :disabled="isExporting" title="Exportar calendario">
        <span class="icon">📅</span>
        <span v-if="isExporting === 'ics'" class="loading-dot"></span>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'CalendarExport',
  props: {
    exportData: {
      type: Object,
      required: true
    },
    exportType: {
      type: String,
      default: 'month', // 'month' | 'plant' | 'category'
      validator: value => ['month', 'plant', 'category'].includes(value)
    },
    title: {
      type: String,
      required: true
    },
    isCompact: {
      type: Boolean,
      default: false
    },
    description: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const isExporting = ref(false);
    
    // Parse export data if it's a string (from Astro)
    const exportData = computed(() => {      
      if (typeof props.exportData === 'string') {
        try {
          const parsed = JSON.parse(props.exportData);
          return parsed;
        } catch (e) {
          console.error('Error parsing export data:', e);
          return {};
        }
      }
      
      return props.exportData || {};
    });

    const exportToPDF = async () => {
      isExporting.value = 'pdf';
      
      console.log('Export data received:', exportData.value);
      console.log('Export type:', props.exportType);
      
      try {
        // Dynamic import for better performance
        const { default: jsPDF } = await import('jspdf');

        const pdf = new jsPDF('p', 'mm', 'a4');
        let yPos = 20;
        const lineHeight = 6;
        const pageHeight = pdf.internal.pageSize.height;
        const margin = 20;
        
        // Title
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        const title = props.title || 'Calendario';
        pdf.text(title, margin, yPos);
        yPos += lineHeight * 2;
        
        // Generate minimal text content based on export type
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        if (props.exportType === 'month') {
          yPos = generateMonthPDFContent(pdf, exportData.value, yPos, lineHeight, margin, pageHeight);
        } else if (props.exportType === 'plant') {
          yPos = generatePlantPDFContent(pdf, exportData.value, yPos, lineHeight, margin, pageHeight);
        } else if (props.exportType === 'category') {
          yPos = generateCategoryPDFContent(pdf, exportData.value, yPos, lineHeight, margin, pageHeight);
        }

        // Footer
        const currentDate = new Date().toLocaleDateString('es-ES');
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'italic');
        pdf.text(`Generado el ${currentDate} - plantasyflores.online`, margin, pageHeight - 10);

        // Generate filename
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `calendario-${props.title.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.pdf`;

        // Save PDF
        pdf.save(filename);

      } catch (error) {
        console.error('Error generating PDF:', error);
        // Mostrar error de forma más elegante
        const errorMsg = error.message?.includes('network') 
          ? 'Error de conexión al generar PDF. Verifica tu conexión.' 
          : 'Error al generar el PDF. Por favor, inténtalo de nuevo.';
        alert(errorMsg);
      } finally {
        isExporting.value = false;
      }
    };

    const exportToICS = async () => {
      isExporting.value = 'ics';
      
      try {
        let events = [];
        const currentYear = new Date().getFullYear();
        
        // Generate events based on export type
        if (props.exportType === 'month') {
          events = generateMonthEvents(exportData.value, currentYear);
        } else if (props.exportType === 'plant') {
          events = generatePlantEvents(exportData.value, currentYear);
        } else if (props.exportType === 'category') {
          events = generateCategoryEvents(exportData.value, currentYear);
        }

        // Generate ICS content
        const icsContent = generateICSContent(events, props.title);
        
        // Create and download file
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `calendario-${props.title.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.ics`;
        link.download = filename;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

      } catch (error) {
        console.error('Error generating ICS:', error);
        const errorMsg = error.message?.includes('network') 
          ? 'Error de conexión al generar calendario. Verifica tu conexión.' 
          : 'Error al generar el archivo de calendario. Por favor, inténtalo de nuevo.';
        alert(errorMsg);
      } finally {
        isExporting.value = false;
      }
    };

    const generateMonthEvents = (exportData, year) => {
      const events = [];
      
      // Handle month export data structure
      if (!exportData || !exportData.monthNumber || !exportData.monthName) {
        console.warn('Invalid month export data:', exportData);
        return events;
      }

      const { monthNumber, monthName, activities } = exportData;
      
      // Generate events for different activities
      if (activities && activities.sowing && activities.sowing.length > 0) {
        events.push({
          title: `Siembra - ${monthName}`,
          description: `Época ideal para sembrar: ${activities.sowing.map(p => p.name).join(', ')}`,
          startDate: new Date(year, monthNumber - 1, 1),
          endDate: new Date(year, monthNumber - 1, 15),
          category: 'sowing'
        });
      }
      
      if (activities && activities.transplanting && activities.transplanting.length > 0) {
        events.push({
          title: `Trasplante - ${monthName}`,
          description: `Época ideal para trasplantar: ${activities.transplanting.map(p => p.name).join(', ')}`,
          startDate: new Date(year, monthNumber - 1, 10),
          endDate: new Date(year, monthNumber - 1, 25),
          category: 'transplanting'
        });
      }
      
      if (activities && activities.harvesting && activities.harvesting.length > 0) {
        events.push({
          title: `Cosecha - ${monthName}`,
          description: `Época de cosecha: ${activities.harvesting.map(p => p.name).join(', ')}`,
          startDate: new Date(year, monthNumber - 1, 15),
          endDate: new Date(year, monthNumber, 0), // Last day of month
          category: 'harvesting'
        });
      }

      return events;
    };

    const generatePlantEvents = (exportData, year) => {
      const events = [];
      
      // Handle plant export data structure
      if (!exportData || !exportData.plantName || !exportData.timelineData) {
        console.warn('Invalid plant export data:', exportData);
        return events;
      }

      const { plantName, timelineData } = exportData;
      
      if (Array.isArray(timelineData)) {
        timelineData.forEach(monthData => {
          if (monthData && monthData.activities && monthData.activities.length > 0) {
            monthData.activities.forEach(activity => {
              const startDate = new Date(year, monthData.month - 1, 1);
              const endDate = new Date(year, monthData.month - 1, 15);
              
              events.push({
                title: `${plantName} - ${activity.label}`,
                description: activity.details || `${activity.label} para ${plantName}`,
                startDate,
                endDate,
                category: activity.type || 'general'
              });
            });
          }
        });
      }

      return events;
    };

    const generateCategoryEvents = (categoryData, year) => {
      const events = [];
      const { categoryName, plants } = categoryData;
      
      // This would need to be implemented based on category data structure
      // For now, return empty array
      return events;
    };

    const generateICSContent = (events, title) => {
      const now = new Date();
      const timestamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      
      let ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Plantas y Flores//Calendario de Plantación//ES',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        `X-WR-CALNAME:${title}`,
        'X-WR-TIMEZONE:Europe/Madrid'
      ];

      events.forEach((event, index) => {
        const uid = `${timestamp}-${index}@plantasyflores.online`;
        const dtstart = formatICSDate(event.startDate);
        const dtend = formatICSDate(event.endDate);
        const dtstamp = timestamp;

        ics.push(
          'BEGIN:VEVENT',
          `UID:${uid}`,
          `DTSTAMP:${dtstamp}`,
          `DTSTART;VALUE=DATE:${dtstart}`,
          `DTEND;VALUE=DATE:${dtend}`,
          `SUMMARY:${event.title}`,
          `DESCRIPTION:${event.description}`,
          `CATEGORIES:${event.category}`,
          'STATUS:CONFIRMED',
          'TRANSP:TRANSPARENT',
          'END:VEVENT'
        );
      });

      ics.push('END:VCALENDAR');
      
      return ics.join('\r\n');
    };

    const formatICSDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}${month}${day}`;
    };

    const generateMonthPDFContent = (pdf, exportData, yPos, lineHeight, margin, pageHeight) => {
      if (!exportData) {
        pdf.text('No hay datos disponibles para este mes', margin, yPos);
        return yPos + lineHeight;
      }

      const monthName = exportData.monthName || 'Mes desconocido';
      const activities = exportData.activities || {};
      
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Actividades para ${monthName}:`, margin, yPos);
      yPos += lineHeight;
      
      pdf.setFont('helvetica', 'normal');
      
      if (activities.sowing && Array.isArray(activities.sowing) && activities.sowing.length > 0) {
        pdf.text('SIEMBRA:', margin, yPos);
        yPos += lineHeight;
        activities.sowing.forEach(plant => {
          if (yPos > pageHeight - 30) { pdf.addPage(); yPos = 20; }
          const plantName = plant?.name || plant?.plantName || 'Planta desconocida';
          pdf.text(`• ${plantName}`, margin + 5, yPos);
          yPos += lineHeight;
        });
        yPos += lineHeight;
      }
      
      if (activities.transplanting && Array.isArray(activities.transplanting) && activities.transplanting.length > 0) {
        pdf.text('TRASPLANTE:', margin, yPos);
        yPos += lineHeight;
        activities.transplanting.forEach(plant => {
          if (yPos > pageHeight - 30) { pdf.addPage(); yPos = 20; }
          const plantName = plant?.name || plant?.plantName || 'Planta desconocida';
          pdf.text(`• ${plantName}`, margin + 5, yPos);
          yPos += lineHeight;
        });
        yPos += lineHeight;
      }
      
      if (activities.harvesting && Array.isArray(activities.harvesting) && activities.harvesting.length > 0) {
        pdf.text('COSECHA:', margin, yPos);
        yPos += lineHeight;
        activities.harvesting.forEach(plant => {
          if (yPos > pageHeight - 30) { pdf.addPage(); yPos = 20; }
          const plantName = plant?.name || plant?.plantName || 'Planta desconocida';
          pdf.text(`• ${plantName}`, margin + 5, yPos);
          yPos += lineHeight;
        });
      }
      
      return yPos;
    };

    const generatePlantPDFContent = (pdf, exportData, yPos, lineHeight, margin, pageHeight) => {
      if (!exportData) {
        pdf.text('No hay datos disponibles para esta planta', margin, yPos);
        return yPos + lineHeight;
      }

      const plantName = exportData.plantName || exportData.name || 'Planta desconocida';
      const timelineData = exportData.timelineData || exportData.timeline || [];
      
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Calendario de cultivo para ${plantName}:`, margin, yPos);
      yPos += lineHeight * 2;
      
      pdf.setFont('helvetica', 'normal');
      
      if (Array.isArray(timelineData) && timelineData.length > 0) {
        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                           'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        
        timelineData.forEach(monthData => {
          if (monthData && monthData.activities && Array.isArray(monthData.activities) && monthData.activities.length > 0) {
            if (yPos > pageHeight - 40) { pdf.addPage(); yPos = 20; }
            
            const monthIndex = (monthData.month || 1) - 1;
            const monthName = monthNames[monthIndex] || `Mes ${monthData.month || '?'}`;
            
            pdf.setFont('helvetica', 'bold');
            pdf.text(`${monthName}:`, margin, yPos);
            yPos += lineHeight;
            
            pdf.setFont('helvetica', 'normal');
            monthData.activities.forEach(activity => {
              if (yPos > pageHeight - 30) { pdf.addPage(); yPos = 20; }
              const activityLabel = activity?.label || activity?.name || activity?.activity || 'Actividad';
              pdf.text(`• ${activityLabel}`, margin + 5, yPos);
              yPos += lineHeight;
            });
            yPos += lineHeight;
          }
        });
      } else {
        pdf.text('No hay actividades programadas para esta planta', margin, yPos);
        yPos += lineHeight;
      }
      
      return yPos;
    };

    const generateCategoryPDFContent = (pdf, categoryData, yPos, lineHeight, margin, pageHeight) => {
      if (!categoryData) {
        pdf.text('No hay datos disponibles para esta categoría', margin, yPos);
        return yPos + lineHeight;
      }

      const categoryName = categoryData.categoryName || categoryData.name || 'Categoría desconocida';
      const plants = categoryData.plants || [];
      
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Plantas de la categoría ${categoryName}:`, margin, yPos);
      yPos += lineHeight * 2;
      
      pdf.setFont('helvetica', 'normal');
      
      if (Array.isArray(plants) && plants.length > 0) {
        plants.forEach(plant => {
          if (yPos > pageHeight - 30) { pdf.addPage(); yPos = 20; }
          const plantName = plant?.name || plant?.plantName || 'Planta desconocida';
          pdf.text(`• ${plantName}`, margin, yPos);
          yPos += lineHeight;
        });
      } else {
        pdf.text('No hay plantas disponibles en esta categoría', margin, yPos);
        yPos += lineHeight;
      }
      
      return yPos;
    };

    return {
      isExporting,
      exportToPDF,
      exportToICS
    };
  }
};
</script>

<style scoped>
.calendar-export {
  margin: 1rem 0;
}

.calendar-export.compact {
  margin: 0;
}

.export-section h3 {
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.export-section p {
  color: #718096;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.export-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.export-icons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  font-size: 0.9rem;
  min-width: 140px;
  justify-content: center;
}

.export-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.export-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.export-btn.pdf {
  background: #e53e3e;
  color: white;
}

.export-btn.pdf:hover:not(:disabled) {
  background: #c53030;
}

.export-btn.ics {
  background: #3182ce;
  color: white;
}

.export-btn.ics:hover:not(:disabled) {
  background: #2b77cb;
}

.btn-icon {
  font-size: 1.1rem;
}

.btn-text {
  font-weight: 600;
}

.loading {
  font-size: 0.8rem;
  opacity: 0.8;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 0.4; }
}

@media (max-width: 768px) {
  .export-buttons {
    flex-direction: column;
  }
  
  .export-btn {
    width: 100%;
  }
}
</style>