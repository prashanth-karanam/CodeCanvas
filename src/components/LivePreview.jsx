import React from 'react';

export function LivePreview({ html, css, js }) {
  const htmlContent = `
    <html>
      <head>
        <script>
          (function() {
            const originalLog = console.log;
            const originalWarn = console.warn;
            const originalError = console.error;
            
            function postLog(type, args) {
              const message = Array.from(args).map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
              ).join(' ');
              window.parent.postMessage({ type: 'CONSOLE_LOG', level: type, payload: message }, '*');
            }
            
            console.log = function() { postLog('info', arguments); originalLog.apply(console, arguments); };
            console.warn = function() { postLog('warn', arguments); originalWarn.apply(console, arguments); };
            console.error = function() { postLog('error', arguments); originalError.apply(console, arguments); };
            
            window.onerror = function(msg, url, line) {
              window.parent.postMessage({ type: 'CONSOLE_LOG', level: 'error', payload: msg + ' (Line ' + line + ')' }, '*');
              return false;
            };
          })();
        </script>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            margin: 16px;
          }
          ${css}
        </style>
      </head>
      <body>
        ${html}
        <script>
          try {
            ${js}
          } catch (e) {
            console.error(e.message);
          }
        </script>
      </body>
    </html>
  `;

  return (
    <iframe
      title="Live Preview"
      sandbox="allow-scripts allow-modals allow-same-origin"
      srcDoc={htmlContent}
      style={{
        width: '100%',
        height: '100%',
        border: 'none',
        backgroundColor: '#fff'
      }}
    />
  );
}
