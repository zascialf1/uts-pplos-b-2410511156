const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,
    on: {
        error: (err, req, res) => {
            res.status(500).json({ status: 'error', message: 'Auth service tidak tersedia' });
        }
    }
});