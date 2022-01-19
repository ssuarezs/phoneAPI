module.exports = (err, req, res, next) => {
	console.error(err)
	if(err.name === 'CastError'){
		return res.status(400).send({ error: 'id user is malformed' })
	} else if(err.name === 'ValidationError') {
		return res.status(400).json({ error: err.message })
	}
	res.status(500).end()
}
