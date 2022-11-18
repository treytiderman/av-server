// Create Express router
const express = require('express');
const router = express.Router();
const routes = {
  'GET /': 'api.html',
  'GET /routes': 'JSON of all public http(s) routes',
  'GET /files': 'JSON of all publicly available files',
}
let routesAll = {}

// Require FS - File system
const fs = require('fs').promises;

// Functions
async function getClientFiles(folder) {
  const path = `../public${folder.name}`
  const files = await fs.readdir(path);
  for (const file of files) {
    const stat = await fs.stat(`${path}/${file}`);
    // Is directory
    if (stat.isDirectory()) {
      let folder2 = {
        name: `${folder.name}/${file}`,
        files: [],
        folders: []
      }
      await getClientFiles(folder2);
      folder.folders.push(folder2);
    }
    else {
      folder.files.push(file);
    }
  }
}

// Routes
router.get('/', async (req, res) => {
  res.send( await fs.readFile('./routes/api.html','utf8') );
});
router.get('/routes', async (req, res) => {
  res.json(routesAll);
});
router.get('/files', async (req, res) => {
  let folder = {
    name: '',
    files: [],
    folders: []
  }
  await getClientFiles(folder);
  res.json(folder);
});

// Export
exports.router = router;
exports.routes = routes;
exports.routesAll = routesAll;

/* Example

// Add to server.js
// Routes /api
const api = require('./routes/api');
app.use('/api', api.router);

// Add all routes to api.routesAll
api.routesAll['/'] = pages.routes;
api.routesAll['/api'] = api.routes;
api.routesAll['/test'] = tests.routes;
api.routesAll['/login'] = auth.routes;

*/

let test = {
  "/": {
    "GET /": "UI Home page"
  },
  "/api/v1": {
    "GET /": "api.html",
    "GET /routes": "JSON of all public http(s) routes",
    "GET /files": "JSON of all publicly available files"
  },
  "/api/v1/test": {
    "GET /time": "current server time",
    "GET /headers": "headers from your request",
    "GET /query": "return posted query, example /test/query?num=1&string=string&boolean=true",
    "GET /json": "return a JSON",
    "GET /download": "download a text file",
    "GET /:path": "return path after /test",
    "POST /body": "return posted body as JSON",
    "AUTH GET /auth": "return success if header 'Authorization: Bearer <TOKEN>' has the correct token"
  },
  "/api/v1/network": {
    "/nics": {
      "method": "GET",
      "description": "Return a JSON of all the servers network interfaces (NICs)"
    },
    "/dhcp": {
      "method": "POST",
      "description": "Set a NIC to DHCP IP address + DHCP DNS servers",
      "body (example)": {
        "nic": "Ethernet"
      }
    },
    "/dhcp/ip": {
      "method": "POST",
      "description": "Set a NIC to DHCP IP address",
      "body (example)": {
        "nic": "Ethernet"
      }
    },
    "/dhcp/dns": {
      "method": "POST",
      "description": "Set a NIC to DHCP DNS servers",
      "body (example)": {
        "nic": "Ethernet"
      }
    },
    "/static": {
      "method": "POST",
      "description": "Set a NIC to a static IP address + static DNS servers",
      "body (example)": {
        "nic": "Ethernet",
        "ip": "192.168.1.9",
        "mask": "255.255.255.0"
      },
      "body (optional)": {
        "gateway": "192.168.1.1",
        "dns": [
          "192.168.1.1",
          "8.8.8.8"
        ]
      }
    },
    "POST /static/ip": "",
    "POST /static/dns": "",
    "POST /metric": "",
    "POST /metric/auto": ""
  },
  "/api/v1/dhcp": {
    "GET /clients": "",
    "GET /serverRunning": "",
    "GET /serverOptions": "",
    "GET /start": "",
    "GET /stop": ""
  },
  "/api/v1/login": {
    "GET /": "login.html",
    "POST /": "login with password in the body, example { password: '1qaz!QAZ' }"
  }
}