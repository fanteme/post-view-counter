import {
    Entity,
    Column,
    PrimaryGeneratedColumn
} from 'typeorm'

@Entity()
export default class CounterEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    slug: string
    
    @Column()
    pv: number
}