# Websocket API | Network

## Network Cards (NICS)

> Get a list of all network cards this computer has

Send

```json
{
  "name": "/network/v1",
  "event": "nics"
}
```

Subscribes to "/network/v1"

Receive event updates

```json
{
  "name": "/network/v1",
  "event": "nics",
  "body": [
    {
      "name": "Ethernet",
      "interfaceMetric": "25",
      "ipIsDhcp": false,
      "ip": "192.168.1.9",
      "mask": "255.255.255.0",
      "slash": "24",
      "gateway": "192.168.1.1",
      "dnsIsDhcp": false,
      "dns": [
        "192.168.1.1",
        "8.8.8.8"
      ],
      "ipsAdded": []
    }
  ]
}
```

If too soon after ip change

```json
{
  "name": "/network/v1",
  "event": "nics",
  "body": [
    {
      "name": "Ethernet",
      "interfaceMetric": "25",
      "ipIsDhcp": true,
      "ip": null,
      "mask": null,
      "slash": null,
      "gateway": null,
      "dnsIsDhcp": true,
      "dns": [
        "None"
      ],
      "ipsAdded": []
    }
  ]
}
```

## DHCP

> Set "nic" to DHCP for both IP address and DNS servers

Send

```json
{
  "name": "/network/v1",
  "event": "dhcp",
  "body": {
    "nic": "Ethernet"
  }
}
```

Subscribes to "/network/v1"

Receive event updates

```json
{
  "name": "/network/v1",
  "event": "dhcp",
  "body": {
    "ip": "\r\n",
    "dns": "\r\n",
    "nic": "Ethernet"
  }
}
```

Errors

```json
{
  "name": "/network/v1",
  "event": "dhcp",
  "body": {
    "ip": "already DHCP",
    "dns": "\r\n",
    "nic": "Ethernet"
  }
}
```

## DHCP / IP

> Set "nic" to DHCP for IP address

Send

```json
{
  "name": "/network/v1",
  "event": "dhcp/ip",
  "body": {
    "nic": "Ethernet"
  }
}
```

Subscribes to "/network/v1"

Receive event updates

```json
{
  "name": "/network/v1",
  "event": "dhcp/ip",
  "body": {
    "ip": "\r\n",
    "nic": "Ethernet"
  }
}
```

Errors

```json
{
  "name": "/network/v1",
  "event": "dhcp/ip",
  "body": {
    "ip": "already DHCP",
    "nic": "Ethernet"
  }
}
```

## DHCP / DNS

> Set "nic" to DHCP for DNS servers

Send

```json
{
  "name": "/network/v1",
  "event": "dhcp/dns",
  "body": {
    "nic": "Ethernet"
  }
}
```

Subscribes to "/network/v1"

Receive event updates

```json
{
  "name": "/network/v1",
  "event": "dhcp/dns",
  "body": {
    "ip": "\r\n",
    "nic": "Ethernet"
  }
}
```

Errors

```json
{
  "name": "/network/v1",
  "event": "dhcp/dns",
  "body": {
    "ip": "already DHCP",
    "nic": "Ethernet"
  }
}
```

## Static

> Set "nic" to DHCP for DNS servers

Send

```json
{
  "name": "/network/v1",
  "event": "static",
  "body": {
    "nic": "Ethernet",
    "ip": "192.168.1.9",
    "mask": "255.255.255.0",
    "gateway": "192.168.1.254",
    "dns": [
      "192.168.1.1",
      "8.8.8.8"
    ]
  }
}
```

Subscribes to "/network/v1"

Receive event updates

```json
{
  "name": "/network/v1",
  "event": "static",
  "body": {
    "ip": "\r\n",
    "dns": [
      "\r\nThe configured DNS server is incorrect or does not exist.\r\n\r\n",
      "\r\nThe configured DNS server is incorrect or does not exist.\r\n\r\n"
    ],
    "nic": "Ethernet"
  }
}
```

## Static / IP

> Set "nic" to DHCP for DNS servers

Send

```json
{
  "name": "/network/v1",
  "event": "static/ip",
  "body": {
    "nic": "Ethernet",
    "ip": "192.168.1.9",
    "mask": "255.255.255.0",
    "gateway": "192.168.1.1"
  }
}
```

Subscribes to "/network/v1"

Receive event updates

```json
{
  "name": "/network/v1",
  "event": "static/ip",
  "body": {
    "ip": "\r\n",
    "nic": "Ethernet"
  }
}
```

## Static / Add

> Set "nic" to DHCP for DNS servers

Send

```json
{
  "name": "/network/v1",
  "event": "static/add",
  "body": {
    "nic": "Ethernet",
    "ip": "192.168.1.9",
    "mask": "255.255.255.0"
  }
}
```

Subscribes to "/network/v1"

Receive event updates

```json
{
  "name": "/network/v1",
  "event": "static/add",
  "body": {
    "ip": "\r\n",
    "nic": "Ethernet"
  }
}
```

## Static / DNS

> Set "nic" to DHCP for DNS servers

Send

```json
{
  "name": "/network/v1",
  "event": "static/dns",
  "body": {
    "dns": "\r\n",
    "nic": "Ethernet"
  }
}
```

Subscribes to "/network/v1"

Receive event updates

```json
{
  "name": "/network/v1",
  "event": "static/dns",
  "body": {
    "ip": "\r\n",
    "dns": [
      "\r\nThe configured DNS server is incorrect or does not exist.\r\n\r\n",
      "\r\nThe configured DNS server is incorrect or does not exist.\r\n\r\n"
    ],
    "nic": "Ethernet"
  }
}
```

