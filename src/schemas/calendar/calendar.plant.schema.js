/**
 * Schema.org structured data for individual plant calendar pages
 */
export function generatePlantCalendarSchema(plantName, plantInfo, categoryName, schemaFAQ) {
  return {
    "@context": "https://schema.org",
    "@type": ["FAQPage", "HowTo"],
    "name": `Cómo cultivar ${plantName}: calendario de siembra y cosecha`,
    "description": `Guía paso a paso para cultivar ${plantName} con calendario detallado de siembra, trasplante y cosecha`,
    "totalTime": "PT365D",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "EUR",
      "value": "5-15"
    },
    "tool": [
      {
        "@type": "HowToTool",
        "name": `Semillas de ${plantName}`
      },
      {
        "@type": "HowToTool", 
        "name": "Tierra de cultivo"
      },
      {
        "@type": "HowToTool",
        "name": "Regadera"
      }
    ],
    "step": [
      {
        "@type": "HowToStep",
        "name": "Preparación y siembra",
        "text": `Planifica la siembra según el calendario estacional específico para ${plantName}`,
        "image": "https://plantasyflores.online/wp-content/uploads/semillas.webp"
      },
      {
        "@type": "HowToStep", 
        "name": "Trasplante",
        "text": "Trasplanta las plántulas en el momento óptimo según las condiciones climáticas",
        "image": "https://plantasyflores.online/wp-content/uploads/trasplante.webp"
      },
      {
        "@type": "HowToStep",
        "name": "Cuidados y mantenimiento", 
        "text": "Proporciona los cuidados necesarios durante el ciclo de crecimiento",
        "image": "https://plantasyflores.online/wp-content/uploads/cuidados.webp"
      },
      {
        "@type": "HowToStep",
        "name": "Cosecha",
        "text": "Cosecha en el momento óptimo para obtener la mejor calidad",
        "image": "https://plantasyflores.online/wp-content/uploads/cosecha.webp"
      }
    ],
    "mainEntity": schemaFAQ.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    })),
    "about": {
      "@type": "Thing",
      "name": plantName,
      ...(plantInfo.scientific_name ? { "scientificName": plantInfo.scientific_name } : {}),
      "category": categoryName
    },
    "author": {
      "@type": "Organization",
      "name": "Plantas y Flores",
      "url": "https://plantasyflores.online"
    },
    "datePublished": new Date().toISOString(),
    "dateModified": new Date().toISOString()
  };
}