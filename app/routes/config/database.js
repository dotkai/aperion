// Configures Database parameters and connection

module.exports = {
	url: 'mongodb://admin:littleboxofhorrors@ds157987.mlab.com:57987/apeiron',
	options: { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } }
}