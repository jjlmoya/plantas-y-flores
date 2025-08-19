<template>
  <div class="category-grid">
    <a 
      v-for="category in categories"
      :key="category.slug || category.name"
      :href="getCategoryLink(category)"
      class="category-card"
    >
      <span class="category-icon" v-html="getCategoryIcon(category)"></span>
      <span class="category-name">{{ getCategoryName(category) }}</span>
      <span class="category-count" v-if="showCount && category.count">
        {{ category.count }}
      </span>
    </a>
  </div>
</template>

<script>
export default {
  name: 'CategoryGrid',
  props: {
    categories: {
      type: Array,
      required: true
    },
    baseUrl: {
      type: String,
      default: '/calendario/categoria/'
    },
    showCount: {
      type: Boolean,
      default: false
    },
    columns: {
      type: String,
      default: 'auto-fill',
      validator: value => ['auto-fill', 'auto-fit', '2', '3', '4', '5', '6'].includes(value)
    },
    minWidth: {
      type: String,
      default: '120px'
    }
  },
  setup(props) {
    const getCategoryLink = (category) => {
      const slug = category.slug || category.name || category;
      return `${props.baseUrl}${slug}/`;
    };

    const getCategoryName = (category) => {
      if (typeof category === 'string') return formatCategoryName(category);
      return category.displayName || category.name || formatCategoryName(category.slug || '');
    };

    const getCategoryIcon = (category) => {
      // Default icons for common categories
      const defaultIcons = {
        rosa: '🌹',
        hibiscus: '🌺',
        lirios: '🌷',
        amapola: '🌸',
        tomate: '🍅',
        albahaca: '🌿',
        hortensias: '💐',
        fresa: '🍓',
        chili: '🌶️',
        margarita: '🌼',
        pensamiento: '💜',
        patata: '🥔',
        manzanilla: '🌼',
        piña: '🍍',
        'plantas-comestibles': '🥬',
        azalea: '🌸',
        tomillo: '🌿',
        lavanda: '💜',
        tulipán: '🌷',
        orquídea: '🌺',
        plátano: '🍌',
        col: '🥬',
        mango: '🥭',
        cosmos: '🌼'
      };

      if (typeof category === 'string') {
        return defaultIcons[category] || '🌱';
      }
      
      return category.icon || defaultIcons[category.slug] || defaultIcons[category.name] || '🌱';
    };

    const formatCategoryName = (name) => {
      if (!name) return '';
      return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');
    };

    return {
      getCategoryLink,
      getCategoryName, 
      getCategoryIcon
    };
  }
};
</script>

<style scoped>
.category-grid {
  display: grid;
  grid-template-columns: repeat(v-bind(columns === 'auto-fill' ? 'auto-fill' : columns === 'auto-fit' ? 'auto-fit' : columns), minmax(v-bind(minWidth), 1fr));
  gap: var(--space-sm);
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-sm);
  background: var(--bg-card);
  border-radius: var(--radius-sm);
  text-decoration: none;
  color: var(--color-text-primary);
  transition: all 0.3s ease;
  border: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-sm);
  position: relative;
}

.category-card:hover {
  background: var(--bg-subtle);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary-light);
  color: var(--color-text-primary);
}

.category-icon {
  font-size: var(--font-size-3xl);
  margin-bottom: var(--space-xs);
  display: block;
}

.category-name {
  font-weight: 500;
  font-size: var(--font-size-sm);
  text-align: center;
  line-height: 1.2;
}

.category-count {
  position: absolute;
  top: var(--space-xs);
  right: var(--space-xs);
  background: var(--color-primary);
  color: white;
  font-size: var(--font-size-xs);
  font-weight: 600;
  padding: calc(var(--space-xs) * 0.25) calc(var(--space-xs) * 0.5);
  border-radius: var(--radius-xl);
  min-width: 20px;
  text-align: center;
  line-height: 1;
}

/* Grid variations */
.category-grid[data-columns="2"] {
  grid-template-columns: repeat(2, 1fr);
}

.category-grid[data-columns="3"] {
  grid-template-columns: repeat(3, 1fr);
}

.category-grid[data-columns="4"] {
  grid-template-columns: repeat(4, 1fr);
}

.category-grid[data-columns="5"] {
  grid-template-columns: repeat(5, 1fr);
}

.category-grid[data-columns="6"] {
  grid-template-columns: repeat(6, 1fr);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .category-grid[data-columns="2"],
  .category-grid[data-columns="3"],
  .category-grid[data-columns="4"],
  .category-grid[data-columns="5"],
  .category-grid[data-columns="6"] {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .category-card {
    padding: calc(var(--space-sm) * 0.75);
  }
  
  .category-icon {
    font-size: var(--font-size-2xl);
  }
}

@media (max-width: 480px) {
  .category-grid {
    grid-template-columns: 1fr;
  }
}
</style>