<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-content">
        <!-- Logo and Brand -->
        <div class="footer-brand">
          <div class="footer-logo">
            <img src="/brand/logo-64.webp" alt="Plantas y Flores" class="footer-logo-img">
            <span class="footer-brand-name">Plantas y Flores</span>
          </div>
          <p class="footer-tagline">Tu guía personal para el mundo de las plantas</p>
          <p class="footer-mission">"Poner una planta en cada hogar"</p>
        </div>
        
        <!-- Quick Links -->
        <div class="footer-section">
          <h3 class="footer-title">Categorías</h3>
          <ul class="footer-links">
            <li><a href="/plantas-medicinales/" class="footer-link">Plantas Medicinales</a></li>
            <li><a href="/plantas-exterior/" class="footer-link">Plantas de Exterior</a></li>
            <li><a href="/plantas-interior/" class="footer-link">Plantas de Interior</a></li>
            <li><a href="/plantas-aromaticas/" class="footer-link">Plantas Aromáticas</a></li>
            <li><a href="/plantas-comestibles/" class="footer-link">Plantas Comestibles</a></li>
          </ul>
        </div>
        
        <!-- Resources -->
        <div class="footer-section">
          <h3 class="footer-title">Recursos</h3>
          <ul class="footer-links">
            <li><a href="/plantas/" class="footer-link">Todas las Plantas</a></li>
            <li><a href="/tienda-de-semillas/" class="footer-link">Tienda de Semillas</a></li>
            <li><a href="/colaboraciones/" class="footer-link">Colaboraciones</a></li>
            <li><a href="/contacto/" class="footer-link">Contacto</a></li>
          </ul>
        </div>
        
        <!-- Social Media -->
        <div class="footer-section">
          <h3 class="footer-title">Síguenos</h3>
          <div class="social-links">
            <a href="https://twitter.com/JardineraAmable" target="_blank" rel="noopener noreferrer" class="social-link twitter" title="Twitter">
              <svg viewBox="0 0 24 24" class="social-icon">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              Twitter
            </a>
            <a href="https://instagram.com/jardineraamable" target="_blank" rel="noopener noreferrer" class="social-link instagram" title="Instagram">
              <svg viewBox="0 0 24 24" class="social-icon">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Instagram
            </a>
            <a href="https://pinterest.com/PlantasyFloresOnline" target="_blank" rel="noopener noreferrer" class="social-link pinterest" title="Pinterest">
              <svg viewBox="0 0 24 24" class="social-icon">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001.017.001z"/>
              </svg>
              Pinterest
            </a>
            <a href="mailto:contacto@plantasyflores.online" class="social-link email" title="Email">
              <svg viewBox="0 0 24 24" class="social-icon">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              Email
            </a>
          </div>
        </div>
      </div>
      
      <!-- Bottom Bar -->
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <div class="footer-copyright">
            <p>&copy; {{ new Date().getFullYear() }} Plantas y Flores - jardineraamable. Todos los derechos reservados.</p>
          </div>
          <div class="footer-legal">
            <a href="/politica-de-cookies/" class="legal-link">Política de Cookies y Privacidad</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Version available via console: window.getVersion()
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, #2d5016 0%, #1a2f0a 100%);
  color: white;
  margin-top: 4rem;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem 0;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 3rem;
  margin-bottom: 2rem;
}

.footer-brand {
  max-width: 300px;
}

.footer-logo {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.footer-logo-img {
  width: 40px;
  height: 40px;
  margin-right: 0.75rem;
}

.footer-brand-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.footer-tagline {
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 0.5rem 0;
  font-style: italic;
}

.footer-mission {
  color: #8bc34a;
  font-weight: 500;
  margin: 0;
  font-size: 0.95rem;
}

.footer-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: #8bc34a;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 0.9rem;
}

.footer-link:hover {
  color: #8bc34a;
}

.social-links {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.social-link {
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.social-link:hover {
  color: #8bc34a;
  transform: translateX(4px);
}

.social-icon {
  width: 18px;
  height: 18px;
  margin-right: 0.5rem;
  fill: currentColor;
}

.social-link.twitter:hover {
  color: #1da1f2;
}

.social-link.instagram:hover {
  color: #e4405f;
}

.social-link.pinterest:hover {
  color: #bd081c;
}

.social-link.email:hover {
  color: #8bc34a;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem 0;
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-copyright {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
}

.footer-copyright p {
  margin: 0;
}


.legal-link {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.3s ease;
}

.legal-link:hover {
  color: #8bc34a;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .footer-container {
    padding: 2rem 1rem 0;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
  
  .footer-brand {
    max-width: none;
  }
  
  .footer-logo {
    justify-content: center;
  }
  
  .social-links {
    align-items: center;
  }
  
  .footer-bottom-content {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .footer-content {
    gap: 1.5rem;
  }
  
  .social-links {
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .social-link {
    flex-direction: column;
    align-items: center;
    font-size: 0.8rem;
  }
  
  .social-icon {
    margin-right: 0;
    margin-bottom: 0.25rem;
  }
}
</style>