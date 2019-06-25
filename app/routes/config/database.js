// Configures Database parameters and connection

module.exports = {
	url: 'z',
	options: { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } }
}