import {useEffect, useState} from 'react'
import './App.css'
import {CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";

// Known incoming data type
type webData = {
    flow_gpm: number;
    power_kW: number;
    pressure_psi: number;
    pressure_bar: number;
    sensor_alarm: boolean;
    timestamp: Date;
    message_type: string;
};

const webURL = "wss://frontend-dev-interview-challenge-production.up.railway.app/ws";

function App() {
    /* Initialized variables:
     * - open: Whether we should be connected to the websocket.
     * - webSocket: The websocket connection itself. Default to null to not connect before user is ready.
     * - messageHistory: The list of messages received as they come in.
     * - timeSince: The last time the sensor alarm was true.
     * - dataArray: The array of data to be displayed
     */
    const [open, setOpen] = useState(false);
    const [webSocket, setSocket] = useState<WebSocket | null>(null);
    const [messageHistory, setHistory] = useState<webData[]>([]);
    const [timeSince, setSince] = useState(new Date());
    const [dataArray, setDataArray] = useState<webData[]>([]);

    // Opens the connection to the socket
    const openSocket = () => {
        // Connect to the Websocket feed
        // If we had a secret, we could create a .env & use import.meta.env.{name}
        const socket = new WebSocket(webURL);

        socket.addEventListener("message", event => {
            // Parse the JSON payload
            const info = JSON.parse(event.data);
            const date = new Date(info.timestamp);

            // Add to the message history
            messageHistory.push({
                flow_gpm: info.flow_gpm,
                power_kW: info.power_kW,
                pressure_psi: info.pressure_psi,
                pressure_bar: info.pressure_bar,
                sensor_alarm: info.sensor_alarm,
                timestamp: date,
                message_type: info.message_type
            });

            // Change timeSince if the sensor alarm is true
            if (info.sensor_alarm) {
                setSince(date);
            }
        });

        socket.addEventListener("error", event => {
            console.error(event);
        });

        socket.addEventListener("close", () => {
            console.log("closed");
        });

        setSocket(socket);
    }

    // Close the socket
    const closeSocket = () => {
        if (webSocket) {
            webSocket.close();
        }
    }

    // Just simply listen for the button click on open
    useEffect(() => {
        if (open) {
            openSocket()
        } else {
            closeSocket()
        }
    }, [open]);

    // Update the graph data if open
    useEffect(() => {
        if (open) {
            setTimeout(() => {
                setDataArray((prevState) => ([...prevState, messageHistory[messageHistory.length-1]]).slice(-20));
            }, 500);
        }
    },[dataArray, open]);

    return (
        <>
            <button onClick={() => setOpen(!open)}>{open ? "Disconnect" : "Connect"}</button>
            <br/>
            <h3>Connection Status: {webSocket && !webSocket.CLOSED ? "Connected" : "Disconnected"}</h3>
            <br/>
            {/* UI for displaying the data */}
            {messageHistory.length > 0 ?
                <>
                    <button onClick={() => {
                        setHistory([]);
                        setDataArray([]);
                    }}>Clear History</button>
                    <br/>
                    <span>{messageHistory[0].timestamp.toTimeString()} - {messageHistory[messageHistory.length-1].timestamp.toTimeString()}</span>
                    <br/>
                    <br/>

                    {/* Info on the sensor alarm */}
                    <span style={{display: "flex", lineHeight: "20px", justifyContent: "center", fontWeight: "bold"}}>
                        Sensor Alarm:&nbsp;{messageHistory[messageHistory.length-1].sensor_alarm ?
                        <div style={{borderRadius: "50%", backgroundColor: "green", width: "20px", height: "20px"}}></div> :
                        <div style={{borderRadius: "50%", backgroundColor: "red", width: "20px", height: "20px"}}></div>
                    }</span>
                    <span>Time since last alarm: {timeSince.toTimeString()}</span>

                    {/* Graphs displaying the four numeric values */}
                    <div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-evenly"}}>
                        <div>
                            <h1>Flow (GPM)</h1>
                            <LineChart style={{ width: '500px', aspectRatio: 1.618, maxWidth: 800, margin: 'auto' }} responsive data={dataArray}>
                                <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
                                <XAxis dataKey={"timestamp"} />
                                <YAxis dataKey={"flow_gpm"} />
                                <Tooltip wrapperStyle={{color: "black"}}/>
                                <Line type="monotone" dataKey="flow_gpm" stroke="#eee" />
                            </LineChart>
                        </div>
                        <div>
                            <h1>Pressure (PSI)</h1>
                            <LineChart style={{ width: '500px', aspectRatio: 1.618, maxWidth: 800, margin: 'auto' }} responsive data={dataArray}>
                                <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
                                <XAxis dataKey={"timestamp"} />
                                <YAxis dataKey={"pressure_psi"} />
                                <Tooltip wrapperStyle={{color: "black"}}/>
                                <Line type="monotone" dataKey="pressure_psi" stroke="#eee" />
                            </LineChart>
                        </div>
                        <div>
                            <h1>Pressure (Bar)</h1>
                            <LineChart style={{ width: '500px', aspectRatio: 1.618, maxWidth: 800, margin: 'auto' }} responsive data={dataArray}>
                                <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
                                <XAxis dataKey={"timestamp"} />
                                <YAxis dataKey={"pressure_bar"} />
                                <Tooltip wrapperStyle={{color: "black"}}/>
                                <Line type="monotone" dataKey="pressure_bar" stroke="#eee" />
                            </LineChart>
                        </div>
                        <div>
                            <h1>Power (kW)</h1>
                            <LineChart style={{ width: '500px', aspectRatio: 1.618, maxWidth: 800, margin: 'auto' }} responsive data={dataArray}>
                                <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
                                <XAxis dataKey={"timestamp"} />
                                <YAxis dataKey={"power_kW"} />
                                <Tooltip wrapperStyle={{color: "black"}}/>
                                <Line type="monotone" dataKey="power_kW" stroke="#eee" />
                            </LineChart>
                        </div>
                    </div>
                </>
                : <>No message history</>}
        </>
    );
}

export default App
