# Wellsmart Technologies Interview Challenge
A Wellsmart Technologies Interview challenge utilizing realtime data streams.

## How to Run
- Run `npm install`
- Run `npm run dev`
- Click the "Connect" button at http://localhost:5173/ when ready.

### Challenge as Stated
- Connect to the WebSocket feed at the WebSocket URL 
- Parse the JSON payload 
- Build a small HMI-like component or mini-dashboard that displays the incoming values 
- Handle reconnection or error states gracefully 
- Present the data in a way that feels clean, intuitive, and real-time 
- Add any UI polish or enhancements you think make sense

### Challenges I Interpreted
- Connecting to a Websocket
  - I have not used websockets before, so I had to learn how to use them in JS.
- Displaying data in real time
  - I have displayed data in graphs & other useful displays before, but never in real time.

### Steps to Complete Challenge
1) I decided to use Vite to create a React + TypeScript project because it is what I knew best & gave me access to some 
helpful starting code. TypeScript also contains types, so I am able to manage the data coming in a more organized manner.
2) I then made the connection to the websocket. Connecting was easy, but managing it in React took a bit of time. Luckily,
once I had it set up properly, I was able to store the incoming information in an array.
3) How to display the data? This requires interpreting the data:
   - flow_gpm, power_kW, pressure_psi, pressure_bar: These were all numeric data points that easily could be placed on
   a graph. Unfortunately, the four values are all very different ranges & definitely could not be on the same graph as
   it would likely show changes in flow, but fail to represent the pressure in Bar.
   - timestamp: This was simple as it was just the current time from the incoming data. A Date object was handy here.
   - sensor_alarm: This is a boolean with no clear indication of the severity of said alarm. I assume that someone may 
   want to know when it is true. Therefore, I made a green circle for true & red for false. I also decided to display
   the last time the alarm was true.
   - message_type: This one always seemed to be the same value & more important for knowing what information is being 
   received, but I don't believe it is useful to display.
4) Next, I decided to go with Recharts as it is a package I am familiar with, but I had to figure out how to update it
in real time. This problem took the bulk of my time.
5) To finish up, I styled the webpage & cleaned up any unused code.

### Challenges Along the Way
- Creating a connect/disconnect was the most difficult part of the websocket. I was learning, but at first I was just
connecting to the websocket with infinite connections & then later able to stop, but not reconnect. Ultimately, it just
took putting the connect & disconnect in two separate functions.
- For the graphs, I wanted to add a dropdown to choose the number of data points being viewed on the graphs. This
significantly lagged the application. Therefore, I removed that functionality to keep the integrity of the app.

### Possible Improvements
- Move away from Recharts: I think it works well, but there is definitely a better package out there to display real time data.
- Options for number of data points: As stated above, I had tried to implement this, but I don't think Recharts handles
it well. I believe it would be helpful to see 10-50 data points on the graph depending on what you need to know.
- Possibly change the display of the sensor_alarm: Without knowing the severity of the alarm, it is hard to tell what to
display for it. If really important, I would display all data pertaining to when it was a certain value.
- Data Ranges: Assuming this is just a small example for what could be a much larger data set; I believe that it would
be imperative to set start & end times of what to show. I would have to change how the data is stored (as a simple array
with all the data would be really inefficient for large data) and probably use a more performant graphing tool.
