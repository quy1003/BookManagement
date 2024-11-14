const categoryRouter = require('./category')
const bookRouter =  require('./book')
const authorRouter = require('./author')
function route(app:any) {
    app.use('/categories/', categoryRouter)
    app.use('/books/', bookRouter)
    app.use('/authors/', authorRouter)
}
module.exports = route;