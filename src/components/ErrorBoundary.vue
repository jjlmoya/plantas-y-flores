<template>
  <div class="error-boundary">
    <div v-if="hasError" class="error-state">
      <div class="error-icon">⚠️</div>
      <h3>{{ errorTitle || 'Algo salió mal' }}</h3>
      <p>{{ errorMessage || 'Se produjo un error inesperado. Por favor, recarga la página o vuelve más tarde.' }}</p>
      
      <div class="error-actions">
        <button @click="handleRetry" class="btn btn-primary" v-if="canRetry">
          🔄 Intentar de nuevo
        </button>
        <button @click="handleGoBack" class="btn btn-secondary">
          ← Volver
        </button>
      </div>
      
      <details v-if="isDevelopment && errorDetails" class="error-details">
        <summary>Detalles técnicos</summary>
        <pre>{{ errorDetails }}</pre>
      </details>
    </div>
    
    <slot v-else />
  </div>
</template>

<script>
export default {
  name: 'ErrorBoundary',
  props: {
    errorTitle: {
      type: String,
      default: null
    },
    errorMessage: {
      type: String,
      default: null
    },
    canRetry: {
      type: Boolean,
      default: false
    },
    onRetry: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      hasError: false,
      errorDetails: null,
      isDevelopment: import.meta.env.DEV
    }
  },
  errorCaptured(error, instance, errorInfo) {
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error info:', errorInfo);
    
    this.hasError = true;
    this.errorDetails = {
      error: error.toString(),
      errorInfo,
      stack: error.stack
    };
    
    // Prevent error propagation
    return false;
  },
  methods: {
    handleRetry() {
      if (this.onRetry) {
        this.onRetry();
      }
      this.hasError = false;
      this.errorDetails = null;
    },
    handleGoBack() {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = '/calendario/';
      }
    },
    // Method to trigger error state externally
    setError(error, message = null, title = null) {
      this.hasError = true;
      this.errorDetails = error;
      
      if (message) {
        this.$emit('update:errorMessage', message);
      }
      if (title) {
        this.$emit('update:errorTitle', title);
      }
    },
    // Method to clear error state
    clearError() {
      this.hasError = false;
      this.errorDetails = null;
    }
  }
}
</script>

<style scoped>
.error-boundary {
  width: 100%;
}

.error-state {
  background: var(--bg-card);
  border: 2px solid var(--color-error);
  border-radius: var(--radius-md);
  padding: var(--space-xl);
  text-align: center;
  max-width: 600px;
  margin: var(--space-xl) auto;
  box-shadow: var(--shadow-lg);
}

.error-icon {
  font-size: 3rem;
  margin-bottom: var(--space-md);
}

.error-state h3 {
  color: var(--color-error);
  font-size: var(--font-size-xl);
  margin-bottom: var(--space-sm);
}

.error-state p {
  color: var(--color-text-secondary);
  margin-bottom: var(--space-lg);
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: var(--space-sm);
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: var(--space-lg);
}

.error-details {
  text-align: left;
  margin-top: var(--space-lg);
  padding: var(--space-md);
  background: var(--bg-subtle);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
}

.error-details summary {
  cursor: pointer;
  font-weight: 600;
  margin-bottom: var(--space-sm);
  color: var(--color-text-primary);
}

.error-details pre {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
  padding: var(--space-sm);
  background: white;
  border-radius: var(--radius-sm);
  overflow: auto;
  max-height: 200px;
}

@media (max-width: 768px) {
  .error-state {
    margin: var(--space-lg) var(--space-sm);
    padding: var(--space-lg);
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .error-actions .btn {
    width: 100%;
    max-width: 250px;
  }
}
</style>