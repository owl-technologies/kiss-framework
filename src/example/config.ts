export const config = {
    developmentMode: true,
    webRoute : "./dist/example/web/",
    port: 3000,
    enableHttps : false,
    keyFile: "../keys/privkey.pem", // Only needed if enableHttps is true
    certFile: "../keys/fullchain.pem" // Only needed if enableHttps is true
};