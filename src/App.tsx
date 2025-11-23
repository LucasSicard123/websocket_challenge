import {useEffect, useState} from 'react'
import './App.css'

type webData = {
    flow_gpm: number;
    power_kw: number;
    pressure_psi: number;
    pressure_bar: number;
    sensor_alarm: boolean;
    timestamp: Date;
    message_type: string;
};

function App() {
    const [data, setData] = useState<webData | null>(null);
    const [open, setOpen] = useState(false);


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

    return (
        <>
            <button onClick={() => setOpen(!open)}>{open ? "True" : "False"}</button>
            {data ? (
                <div>
                    <p>Flow: {data.flow_gpm}</p>
                    <p>{data.power_kw}</p>
                    <p>{data.pressure_psi}</p>
                    <p>{data.pressure_bar}</p>
                    <p>{data.sensor_alarm ? "True" : "False"}</p>
                    <p>{data.timestamp.toDateString()}</p>
                    <p>{data.message_type}</p>
                </div>
            ) : <>No Data</>}
        </>
    );
}

export default App
