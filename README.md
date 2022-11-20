# AV-Tools

Download a release to the right

Demo: [link](https://trey.app/html/av/ip.html)

## Versions

nodejs  18.12.1

npm     8.19.2

## Tools

Network v1.1
- [x] Set IP address of the computer
- [x] Save presets to recall
- [ ] Custom routing
- Windows: Running as administrator is required

DHCP v1
- [x] Start a DHCP server hosted on your computer and view the ip addresses it hands out
- Make sure port 53 traffic isn't blocked by your firewall or virus protection software

Serial v1
- [x] Open an available serial port and send / receive data from it
- [ ] Other send methods, Device saving, Visca tool
- Linux: The USER needs added to the dialout group to open serial connections
  ```
  sudo gpasswd --add ${USER} dialout
  sudo reboot
  ```
