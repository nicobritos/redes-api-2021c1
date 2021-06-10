import {
    BaseEntity,
    Column,
    Entity,
    Index,
    PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * TypeORM Schema Config
 */
@Entity('posts')
export class PostSchema extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    public id?: string;

    @Column({ nullable: false })
    public author: string;

    @Column({ nullable: false })
    public title: string;

    @Column({ nullable: false })
    public body: string;
}
