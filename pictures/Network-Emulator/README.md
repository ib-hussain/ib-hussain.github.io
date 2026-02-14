# Network Emulator

The **Network Emulator** simulates a computer network consisting of routers and end machines (e.g., computers). Messages are sent from one device to another using destination addresses and follow a routing path across multiple routers. This project aims to simulate routing, queuing, and message handling in a simplified network.

---
<p align="center">
  <img src="pictures/network_emulaotr.jpg" alt="Network Emulator">
</p>
<!-- <p align="center">
  <img src="pictures/demo1.png" alt="Network Emulator">
</p> -->

## 📡 Overview

- Each device in the network (router/computer) has a unique address.
- Messages are routed using **routing tables** which decide the next hop based on the destination address.
- The emulator supports routing table updates and message forwarding with priority handling and trace logging.

---

## 🧱 Components

### 🔁 Router

Each router contains:

- **Incoming Queue** (binary heap): Stores incoming messages in priority order (0-10).
- **Routing Table**: Maps each destination to the appropriate outgoing queue (next hop).
- **Outgoing Queues** (FIFO): Messages are stored before being passed on to the next router/device.

### 📊 Routing Table Example

| Destination | Outgoing Queue |
| ----------- | -------------- |
| M4          | R1             |
| M2          | R1             |
| M1          | R2             |
| M3          | R1             |
| M5          | R4             |

---

## ✉️ Message Format

Each message includes:

- `MSG ID (int)` – Unique identifier
- `PRIORITY (int)` – 0 to 10, higher = higher priority
- `SRC (string)` – Source address (e.g., M6)
- `DEST (string)` – Destination address (e.g., M9)
- `PAYLOAD (string)` – Message contents (e.g., "Hello World!")
- `TRACE (string)` – Updated path of the message (auto-filled)

---

## 🛠️ Commands Supported

Your program should support the following commands:

- **Send Message**
  send msg filename.txt

or directly:
send msg 3:6:M6:M9:Hello World!


- **Change Routing Table**
  change RT R1 add rt_1.csv
  change RT R2 remove rt_2.csv


- **Print Path**
  print path M6 to M9
  print path M6 to _
  print path _ to M9


---

## 🗺️ Phase 2: Network Construction

- The full network is defined in `network.csv` as a weighted adjacency matrix.
- Each machine is connected to a single router.
- Routers are connected to each other with weighted edges.
- Uses **Dijkstra’s algorithm** to generate routing tables from each router to every destination.

### Sample Matrix Format (`network.csv`)

- A `?` indicates no connection.
- Numbers indicate weight between routers/machines.

Example:
?,3,2
3,?,1
2,1,?



---

## ⚙️ Features

- Support for binary heap (priority queue) and FIFO queue management
- Traceable message routing from source to destination
- Dynamic routing table updates via CLI or file
- Optional data structure: **Linear list** or **Splay Tree** for routing table

---

## 📁 File Structure

- `network_emulator.cpp`: Main logic
- `network.csv`: Defines network topology
- `*.txt / *.csv`: Input files for messages and routing table updates
- `.vscode/`: (Ignored via `.gitignore`)

---

## 🚀 Getting Started

1. Clone the repository:
   git clone https://github.com/ib-hussain/Network-Emulator.git
   cd Network-Emulator


2. Run the program (depending on your language):
   python main.py

or
g++ main.cpp -o emulator && ./emulator


---

## 👨‍💻 Contributors

- [@ib-hussain](https://github.com/ib-hussain)
- [@wajeeeha16](https://github.com/wajeeeha16)
- [@aleesha-10](https://github.com/aleesha-10)

---

## 📜 License

This project is licensed for academic and educational use only. Commercial use is prohibited without prior permission.
