<template>
  <div class="calendar-export">
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
</template>

<script>
import { ref } from 'vue';

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
    }
  },
  setup(props) {
    const isExporting = ref(false);

    const exportToPDF = async () => {
      isExporting.value = 'pdf';
      
      try {
        // Dynamic import for better performance
        const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
          import('jspdf'),
          import('html2canvas')
        ]);

        // Find the main content area to export
        const element = document.querySelector('.calendar-export-content') || 
                       document.querySelector('.month-view') ||
                       document.querySelector('.plant-calendar-view') ||
                       document.querySelector('main') ||
                       document.body;

        // Create canvas from the element
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          height: element.scrollHeight,
          width: element.scrollWidth
        });

        // Calculate PDF dimensions
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const finalWidth = imgWidth * ratio;
        const finalHeight = imgHeight * ratio;
        
        // Center the image on the page
        const x = (pdfWidth - finalWidth) / 2;
        const y = (pdfHeight - finalHeight) / 2;

        // Add image to PDF
        pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);

        // Generate filename
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `calendario-${props.title.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.pdf`;

        // Save PDF
        pdf.save(filename);

      } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error al generar el PDF. Por favor, inténtalo de nuevo.');
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
          events = generateMonthEvents(props.exportData, currentYear);
        } else if (props.exportType === 'plant') {
          events = generatePlantEvents(props.exportData, currentYear);
        } else if (props.exportType === 'category') {
          events = generateCategoryEvents(props.exportData, currentYear);
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
        alert('Error al generar el archivo de calendario. Por favor, inténtalo de nuevo.');
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

.export-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
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