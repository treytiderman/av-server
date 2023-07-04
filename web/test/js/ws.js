// Log to page
function log(text) {
  const section = document.body.querySelector('section');
  const element = document.createElement('div');
  element.style.fontFamily = 'monospace';
  element.style.color = 'limegreen';
  element.style.margin = 0;
  element.innerText = text;
  if (typeof text === 'object' && !Array.isArray(text)) {
    element.innerText = JSON.stringify(text, null, 2);
    element.style.color = 'mediumslateblue';
  }
  if (Array.isArray(text)) {
    element.style.color = 'coral';
  }
  section.appendChild(element);
  section.scrollTop = section.scrollHeight;
}

// WebSockets
let ws;
let reconnectInterval;
// Subscriptions expected as an array of objects with two properties
// EX: [ { name: 'hi', callbackFunction: () => {} } ]
function connect(subscriptions, reconnectTimeout_ms = 5*1000) {
  // WebSocket URL
  const host = document.location.host;
  const path = '';
  const url = `ws://${host}/${path}`
  // Connection request
  log('WebSocket: REQUESTED')
  ws = new WebSocket(url);
  // Failed to Connect
  reconnectInterval = setTimeout(() => {
    log('WebSocket: FAILED TO CONNECT');
    log('WebSocket: PLEASE REFRESH');
  }, reconnectTimeout_ms);
  // Events
  ws.addEventListener('open', (event) => {
    clearTimeout(reconnectInterval);
    log('WebSocket: OPEN');
    subscriptions.forEach(subscription => {
      log(`WebSocket: SUBSCRIBING TO ${subscription.name}`);
      publish(subscription.name, 'subscribe');
    });
  });
  ws.addEventListener('message', (event) => {
    // Message expected as an objects with two properties 
    // EX: { name: 'hi', data: {} }
    const newData = JSON.parse(event.data);
    subscriptions.forEach(subscription => {
      if (newData.name === subscription.name) {
        subscription.callbackFunction(newData.data);
      };
    });
  });
  ws.addEventListener('error', (event) => {
    log('WebSocket: ERROR')
    console.log(event);
  });
  ws.addEventListener('close', (event) => {
    log('WebSocket: CLOSE')
    setTimeout(() => connect(subscriptions), reconnectTimeout_ms);
  });
};
function publish(name, data) {
  const obj = {
    name: name,
    data: data
  }
  ws.send(JSON.stringify(obj));
}

export { connect, publish, log };

/*

import * as ws from "./ws.js";

let subs = [
  {
    name: 'connected',
    callbackFunction: (data) => {
      ws.log(`WebSocket/connected: ${JSON.stringify(data)}`);
    }
  },
  {
    name: 'dataTest',
    callbackFunction: (data) => {
      ws.log(`WebSocket/dataTest: ${JSON.stringify(data)}`);
    }
  },
  // {
  //   name: 'serverUptime',
  //   callbackFunction: (data) => {
  //     ws.log(`WebSocket/serverUptime: ${JSON.stringify(data)}`);
  //   }
  // },
  // {
  //   name: 'uptime',
  //   callbackFunction: (data) => {
  //     log(`WebSocket/uptime: ${JSON.stringify(data)}`);
  //   }
  // },
  // {
    //   name: 'dataStore',
  //   callbackFunction: (data) => {
  //     log(`WebSocket/dataStore: ${JSON.stringify(data)}`);
  //   }
  // },
];

ws.connect(subs);

const button = document.querySelector('button');
button.addEventListener('click', () => {
  ws.publish('test', 'data9');
})


// If possible
subscribe(subscription, callbackFunction);
subscribe('data3', (data) => {
  console.log(data);
});

*/
