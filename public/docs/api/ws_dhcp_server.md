# Websocket API | DHCP Server

## clients

Send

```json
{
  "name": "/dhcp/server/v1",
  "event": "clients"
}
```

Subscribes to "/dhcp/server/v1"

Receive event updates

```json
{
  "name": "/dhcp/server/v1",
  "event": "clients",
  "body": [
    {
      "address": "192.168.1.196",
      "leasePeriod": 120,
      "server": "192.168.1.9",
      "state": "BOUND",
      "bindTime": "2022-12-28T00:44:23.700Z",
      "mac": "34-20-03-4B-AC-9B"
    }
  ]
}
```

## running

Send

```json
{
  "name": "/dhcp/server/v1",
  "event": "running"
}
```

Subscribes to "/dhcp/server/v1"

Receive event updates

```json
{
  "name": "/dhcp/server/v1",
  "event": "running",
  "body": false
}
```

## getOptions

Send

```json
{
  "name": "/dhcp/server/v1",
  "event": "getOptions"
}
```

Subscribes to "/dhcp/server/v1"

Receive event updates

```json
{
  "name": "/dhcp/server/v1",
  "event": "options",
  "body": {
    "range": [
      "192.168.1.100",
      "192.168.1.200"
    ],
    "netmask": "255.255.255.0",
    "router": [
      "192.168.1.1"
    ],
    "dns": [
      "192.168.1.1",
      "1.1.1.1"
    ],
    "server": "192.168.1.9",
    "leaseTime": 120,
    "renewalTime": 60,
    "rebindingTime": 120,
    "hostname": "yo-dhcp-server-here",
    "domainName": "lan"
  }
}
```

## state

Send

```json
{
  "name": "/dhcp/server/v1",
  "event": "state"
}
```

Subscribes to "/dhcp/server/v1"

Receive event updates

```json
{
  "name": "/dhcp/server/v1",
  "event": "state",
  "body": {
    "running": false,
    "options": {
      "range": [
        "192.168.1.100",
        "192.168.1.200"
      ],
      "netmask": "255.255.255.0",
      "router": [
        "192.168.1.1"
      ],
      "dns": [
        "192.168.1.1",
        "1.1.1.1"
      ],
      "server": "192.168.1.9",
      "leaseTime": 120,
      "renewalTime": 60,
      "rebindingTime": 120,
      "hostname": "yo-dhcp-server-here",
      "domainName": "lan"
    },
    "clients": []
  }
}
```

## start

Send

```json
{
  "name": "/dhcp/server/v1",
  "event": "start"
}
```

Subscribes to "/dhcp/server/v1"

Receive event updates

```json
{
  "name": "/dhcp/server/v1",
  "event": "start",
  "body": true
}
```

## stop

Send

```json
{
  "name": "/dhcp/server/v1",
  "event": "stop"
}
```

Subscribes to "/dhcp/server/v1"

Receive event updates

```json
{
  "name": "/dhcp/server/v1",
  "event": "stop",
  "body": false
}
```

## options

Send

```json
{
  "name": "/dhcp/server/v1",
  "event": "options",
  "body": {
    "ip": "192.168.1.9",
    "rangeStart": "192.168.1.100",
    "rangeEnd": "192.168.1.200",
    "mask": "255.255.255.0",
    "gateway": "192.168.1.254",
    "dns1": "192.168.1.1",
    "dns2": "1.1.1.1",
    "leasePeriod": 120
  }
}
```

Subscribes to "/dhcp/server/v1"

Receive event updates

```json
{
  "name": "/dhcp/server/v1",
  "event": "options",
  "body": "OPTIONS SET"
}
```

Error

```json
{
  "name": "/dhcp/server/v1",
  "event": "options",
  "body": "OPTIONS FAILED VALIDATION"
}
```

```json
{
  "name": "/dhcp/server/v1",
  "event": "options",
  "body": "STOP DHCP SERVER FIRST"
}
```

