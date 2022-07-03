# Features

## IP Presets

## DHCP server 

## TCP server/client

## Serial TX/RX

## Test Patterns
White, Black, Color Bars, Animations, Screen tearing

## Midi DMX
https://github.com/node-dmx/dmx
https://github.com/andypotato/dmx-controller-demo
https://medium.com/swlh/connect-your-interactive-experiences-to-a-dmx-lighting-controller-with-node-js-ce8a8bb15f8b
https://github.com/mmckegg/loop-drop-app

## mDNS

## DNS server

## Port Scanner
https://github.com/eviltik/evilscan
https://stackoverflow.com/questions/15031625/can-i-scan-my-local-network-for-specific-open-ports-quickly

## Packet Capture | PCAP
https://www.npmjs.com/package/pcap

## NTP Server
## Calculators
ADA, TV Size, Rack Units
## EDID Reader?
## Noise Generator
## Webcam viewer

## QR Code Gen
## OCR from screen shots

## Screen Saver
https://github.com/muffinista/before-dawn

# How to run
Right click app.js and Open in Integrated Termainal
```
npm init
npm install express
npm install jsonwebtoken
sudo npm install -g nodemon
npm run start
npm run dev
```

# How to pkg (package.json has options)
```
pkg app.js
pkg -t node16-win-x64 app.js
```

# get network interface config
```
netsh interface ipv4 show config
```
```

Configuration for interface "vEthernet (WSL)"
    DHCP enabled:                         No
    IP Address:                           172.31.160.1
    Subnet Prefix:                        172.31.160.0/20 (mask 255.255.240.0)
    InterfaceMetric:                      15
    Statically Configured DNS Servers:    None
    Register with which suffix:           None
    Statically Configured WINS Servers:   None

Configuration for interface "Ethernet"
    DHCP enabled:                         Yes
    IP Address:                           192.168.1.110
    Subnet Prefix:                        192.168.1.0/24 (mask 255.255.255.0)
    Default Gateway:                      192.168.1.254
    Gateway Metric:                       0
    InterfaceMetric:                      25
    DNS servers configured through DHCP:  192.168.1.1
    Register with which suffix:           None
    WINS servers configured through DHCP: None

Configuration for interface "Ethernet2"
    DHCP enabled:                         No
    IP Address:                           192.168.1.9
    Subnet Prefix:                        192.168.1.0/24 (mask 255.255.255.0)
    IP Address:                           192.168.1.92
    Subnet Prefix:                        192.168.1.0/24 (mask 255.255.255.0)
    Default Gateway:                      192.168.1.254
    Gateway Metric:                       1
    InterfaceMetric:                      25
    Statically Configured DNS Servers:    None
    Register with which suffix:           None
    Statically Configured WINS Servers:   None

Configuration for interface "VirtualBox Host-Only Network"
    DHCP enabled:                         No
    IP Address:                           192.168.56.1
    Subnet Prefix:                        192.168.56.0/24 (mask 255.255.255.0)
    InterfaceMetric:                      25
    Statically Configured DNS Servers:    None
    Register with which suffix:           Primary only
    Statically Configured WINS Servers:   None

Configuration for interface "Local Area Connection"
    DHCP enabled:                         Yes
    InterfaceMetric:                      25
    DNS servers configured through DHCP:  None
    Register with which suffix:           Primary only
    WINS servers configured through DHCP: None

Configuration for interface "Loopback Pseudo-Interface 1"
    DHCP enabled:                         No
    IP Address:                           127.0.0.1
    Subnet Prefix:                        127.0.0.0/8 (mask 255.0.0.0)
    InterfaceMetric:                      75
    Statically Configured DNS Servers:    None
    Register with which suffix:           None
    Statically Configured WINS Servers:   None
```

# set network interface address to dhcp
```
netsh interface ipv4 set address name="Ethernet" source=dhcp
```

# set network interface address to static
```
netsh interface ipv4 set address name="Ethernet" static 192.168.1.9 255.255.255.0 192.168.1.254
```

# add network interface address to nic
```
netsh interface ipv4 add address name="Ethernet" 192.168.1.92 255.255.255.0
```

# set network interface dns to dhcp
```
netsh interface ipv4 set dns name="Ethernet" source=dhcp
```

# set network interface dns to static
```
netsh interface ipv4 set dns name="Ethernet" static 192.168.1.1
netsh interface ipv4 add dns name="Ethernet" 1.1.1.1 index=2
```



```
netsh interface ipv4 set address name="YOUR INTERFACE NAME" static IP_ADDRESS SUBNET_MASK GATEWAY
netsh interface ipv4 set address name=”YOUR INTERFACE NAME” source=dhcp

netsh interface ipv4 set address name="Ethernet" static 192.168.1.9 255.255.255.0 192.168.1.254
netsh interface ipv4 set address name="Ethernet" static 192.168.1.99 255.255.255.0 192.168.1.254
netsh interface ipv4 set address name="Ethernet" source=dhcp


netsh interface ipv4 set dns name="YOUR INTERFACE NAME" static DNS_SERVER
netsh interface ipv4 set dns name="YOUR INTERFACE NAME" static DNS_SERVER index=2
netsh interface ipv4 set dnsservers name"YOUR INTERFACE NAME" source=dhcp

netsh interface ipv4 set dns name="Ethernet" static 192.168.1.1
netsh interface ipv4 add dns name="Ethernet" 1.1.1.1 index=2
netsh interface ipv4 set dns name="Ethernet" source=dhcp

```




# set interface metric
```
netsh interface ipv4 set interface Ethernet metric=3
netsh interface ipv4 set interface Ethernet metric=auto
```
```
Ok.

```



# How to Show Multicast Joins for all Network Interfaces
```
netsh interface ip show joins
```

# Show all routes
```
netsh interface ip show route
```
