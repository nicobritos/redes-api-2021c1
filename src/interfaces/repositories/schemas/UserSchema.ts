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
@Entity('users')
export class UserSchema extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    public id?: string;

    @Column({ nullable: false })
    public password: string;

    @Column({ nullable: false })
    @Index({ unique: true })
    public email: string;

    @Column({ nullable: false })
    public firstName: string;

    @Column({ nullable: false })
    public lastName: string;

    @Column({ nullable: true })
    public ip: string;
}
