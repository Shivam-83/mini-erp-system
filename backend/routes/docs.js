const express = require('express');
const router = express.Router();
const fs = require('fs');
const yaml = require('js-yaml');

const specPath = __dirname + '/../openapi.yaml';

// Serve the spec as JSON (Swagger UI will be served by a CDN link or separate endpoint)
router.get('/spec', (req, res) => {
  try {
    const file = fs.readFileSync(specPath, 'utf8');
    const spec = yaml.load(file);
    res.json(spec);
  } catch (e) {
    console.error('Failed to load openapi.yaml', e.message);
    res.status(500).json({ error: 'Failed to load API spec' });
  }
});

// Basic HTML page that references Swagger UI CDN
router.get('/', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>API Docs</title>
        <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@3/swagger-ui.css">
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@3/swagger-ui-bundle.js"></script>
        <script>
          SwaggerUIBundle({
            url: '/api/docs/spec',
            dom_id: '#swagger-ui',
            presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset],
            layout: "BaseLayout"
          });
        </script>
      </body>
    </html>
  `;
  res.send(html);
});

module.exports = router;
