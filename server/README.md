# Structure

/core is the top level server (depend on anything)
/modules contains base level modules (depend only on other /modules files or 3rd parth libraries)
- files
- logger
- programs
- state
- system
- users
/tools contains the modules build on /modules (depend on anything in /modules)
- http-client
- http-server
- serial
- tcp-client
- tcp-server
- udp-client
- udp-server
- websocket-client
- websocket-server
