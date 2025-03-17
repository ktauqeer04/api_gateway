const express = require('express');
const cors = require('cors');
// const { createProxyMiddleware } = require('http-proxy-middleware');
const { Limiter } = require('./utils/commons');
const { ServerConfig } = require('./config');
const { FLIGHT_SERVICE, BOOKING_SERVICE } = ServerConfig;
const apiRoutes = require('./routes');
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer();


const app = express();

app.use(cors());
app.use(express.json());
// app.use(Limiter);

console.log(FLIGHT_SERVICE);

app.use('/flightService', (req, res) => {
    console.log(`Incoming request to /flightService: ${req.method} ${req.url}`);

    proxy.web(req, res, { 
        target: FLIGHT_SERVICE, 
        changeOrigin: true, 
        selfHandleResponse: false,
        pathRewrite: { '^/flightService': '/api/v1' }  // Ensure correct path mapping
    }, (err) => {
        console.error(`Error forwarding request to FLIGHT_SERVICE: ${err.message}`);
        res.status(500).send('Internal Server Error');
    });
});



proxy.on('proxyReq', function (proxyReq, req, res, options) {
    console.log(`Received request to ${options.target.href}: ${req.method} ${req.url}`);
});
  

// app.use('/bookings', createProxyMiddleware({
//     target: BOOKING_SERVICE,
//     changeOrigin: true,
//     pathRewrite: {
//         '^/bookings': '/v1/api/booking',
//     }
// }));

app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
});
