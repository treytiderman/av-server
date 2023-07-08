// Overview: get all av-server modules and tools

// Imports
import * as db from '../server/modules/database'
import * as files from '../server/modules/files'
import * as logger from '../server/modules/logger'
import * as programs from '../server/modules/programs'
import * as system from '../server/modules/system'
import * as users from '../server/modules/users'

import * as httpClient from '../server/tools/http-client'
import * as httpServer from '../server/tools/http-server'
import * as serial from '../server/tools/serial'
import * as tcpClient from '../server/tools/tcp-client'
import * as tcpServer from '../server/tools/tcp-server'
import * as udpClient from '../server/tools/udp-client'
import * as udpServer from '../server/tools/udp-server'
import * as websocketClient from '../server/tools/websocket-client'
import * as websocketServer from '../server/tools/websocket-server'

// Variables
const helper = {

    // Modules
    db,
    files,
    logger,
    programs,
    system,
    users,
    
    // Tools
    httpClient,
    httpServer,
    serial,
    tcpClient,
    tcpServer,
    udpClient,
    udpServer,
    websocketClient,
    websocketServer,

}

// Exports
export { helper }
