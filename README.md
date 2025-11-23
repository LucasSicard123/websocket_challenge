# websocket_challenge
A Wellsmart Technologies Interview challenge utilizing realtime data streams.

### Initial websocket implementation
```
useEffect(() => {
    const socket = new WebSocket("wss://frontend-dev-interview-challenge-production.up.railway.app/ws");

    if (open) {
        socket.addEventListener("open", () => {
            socket.send("Connection established");
        });

        socket.addEventListener("message", event => {
            const info = JSON.parse(event.data);
            setData({
                flow_gpm: info.flow_gpm,
                power_kw: info.power_kw,
                pressure_psi: info.pressure_psi,
                pressure_bar: info.pressure_bar,
                sensor_alarm: info.sensor_alarm,
                timestamp: new Date(info.timestamp),
                message_type: info.message_type
            });
        });
    } else {
        socket.removeEventListener("message", () => {});
        socket.close();
    }
}, [open]);
```

