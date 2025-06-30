'use client'

import React from 'react'

/**
 * Componente para prevenir errores de hidratación causados por extensiones del navegador
 * que modifican el DOM (como ColorZilla, LastPass, etc.)
 * 
 * Este script limpia automáticamente atributos problemáticos que pueden causar
 * discrepancias entre el SSR y el cliente en Next.js
 */
export function HydrationFix(): React.JSX.Element {
  return (
    <script
      id="hydration-fix-sistema-sc"
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            'use strict';
            
            // Lista de atributos problemáticos conocidos
            const problematicAttributes = [
              'cz-shortcut-listen',
              'data-lastpass-icon-root',
              'data-1p-ignore',
              'data-gramm',
              'spellcheck'
            ];
            
            // Función para limpiar atributos problemáticos
            function cleanProblematicAttributes() {
              problematicAttributes.forEach(attr => {
                if (document.body.hasAttribute(attr)) {
                  document.body.removeAttribute(attr);
                }
              });
            }
            
            // Limpieza inicial
            cleanProblematicAttributes();
            
            // Observer para limpieza continua
            const observer = new MutationObserver((mutations) => {
              mutations.forEach((mutation) => {
                if (
                  mutation.type === 'attributes' &&
                  problematicAttributes.includes(mutation.attributeName)
                ) {
                  cleanProblematicAttributes();
                }
              });
            });
            
            // Iniciar observación
            observer.observe(document.body, {
              attributes: true,
              attributeFilter: problematicAttributes
            });
            
            // Limpieza adicional después de que la página esté completamente cargada
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', cleanProblematicAttributes);
            } else {
              cleanProblematicAttributes();
            }
            
            // Debug para desarrollo (solo en modo dev)
            if (process.env.NODE_ENV === 'development') {
              console.log('🔧 Sistema SC: HydrationFix inicializado');
            }
          })();
        `,
      }}
    />
  )
}

export default HydrationFix