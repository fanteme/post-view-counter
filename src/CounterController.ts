import {Context} from 'koa'
import {getManager, Repository} from 'typeorm'
import CounterEntity from './CounterEntity'

export default class CounterController {

    private counterRepository: Repository<CounterEntity>

    constructor() {
        this.counterRepository = getManager().getRepository(CounterEntity)
    }

    async add(e: CounterEntity) {
        await this.counterRepository.updateById(e.id, {
            pv: e.pv + 1
        })
    }

    async get(ctx: Context) {
        if (await this.checkSlugExist(ctx)) {
            const entity = await this.counterRepository.findOne({
                select: ['id', 'slug', 'pv'],
                where: {
                    slug: ctx.params.slug
                }
            })
            await this.add(entity)
            return entity
        } else {
            return await this.insertRecord(ctx)
        }
    }

    protected async checkSlugExist(ctx: Context) {
        const entity = await this.counterRepository.find({
            where: {
               slug: ctx.params.slug
            }
        })
        return entity.length? true : false
    }

    protected async insertRecord(ctx: Context) {
        const entity = await this.counterRepository.create({
            slug: ctx.params.slug,
            pv: 1
        })
        await this.counterRepository.save(entity)
        return entity
    }
}