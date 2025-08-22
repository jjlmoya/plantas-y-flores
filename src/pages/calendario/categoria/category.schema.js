/**
 * Schema.org structured data for category calendar pages
 */
export function generateCategorySchema(category, categoryName, totalPlants) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `Calendario de Cultivo - ${categoryName}`,
    "description": `Calendario completo de cultivo para ${categoryName.toLowerCase()} con ${totalPlants} variedades`,
    "url": `https://plantasyflores.online/calendario/categoria/${category}/`,
    "mainEntity": {
      "@type": "ItemList",
      "name": `Plantas de ${categoryName}`,
      "numberOfItems": totalPlants,
      "itemListOrder": "Alphabetical"
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Inicio",
          "item": "https://plantasyflores.online/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Calendario",
          "item": "https://plantasyflores.online/calendario/"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": categoryName,
          "item": `https://plantasyflores.online/calendario/categoria/${category}/`
        }
      ]
    },
    "publisher": {
      "@type": "Organization",
      "name": "Plantas y Flores",
      "url": "https://plantasyflores.online"
    }
  };
}