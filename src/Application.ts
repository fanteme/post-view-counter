import 'reflect-metadata'
import {createConnection, Connection} from 'typeorm'
import * as Koa from 'koa'
import {Context} from 'koa'
import * as Router from 'koa-router'
import * as bodyParser from 'koa-bodyparser'
import CounterController from './CounterController'

export default class Application {
    koa: Koa
    router: Router
    connection: Connection
    controller: CounterController

    constructor(){
        this.koa = new Koa()
        this.router = new Router()
    }
    async start(){
        try {
            this.connection = await createConnection()
        } catch (error) {
            console.log('TypeORM connection error: ', error)
        }
        this.controller = new CounterController()
        this.router.get('/post-view-counter/:slug', async (ctx: Context, next) => {
            ctx.body = await this.controller.get(ctx)
        })
        this.koa.use(bodyParser())
        this.koa.use(this.router.routes())
        this.koa.use(this.router.allowedMethods())
        this.koa.listen(3600)
        console.log('Application is up and running on port 3600')
    }
}