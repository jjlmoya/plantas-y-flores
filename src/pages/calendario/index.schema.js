/**
 * Schema.org structured data for main calendar page
 */
export function generateCalendarMainSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calendario de Plantación",
    "description": "Calendario completo de plantación para planificar tu huerto y jardín mes a mes",
    "url": "https://plantasyflores.online/calendario/",
    "applicationCategory": "LifestyleApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR"
    },
    "featureList": [
      "Calendario mensual de plantación",
      "Guías de siembra y trasplante",
      "Cronograma de cosecha",
      "Consejos de cuidado de plantas",
      "Filtros por actividad y categoría"
    ],
    "publisher": {
      "@type": "Organization",
      "name": "Plantas y Flores",
      "url": "https://plantasyflores.online"
    }
  };
}