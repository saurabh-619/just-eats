import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/Core.entity';
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './User.entity';
import { v4 as uuid } from 'uuid';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Verification extends CoreEntity {
  @Column()
  @Field(() => String)
  code: string;

  @OneToOne((type) => User, { onDelete: 'CASCADE' }) // delete the verification doc if user has been deleted
  @JoinColumn()
  @Field(() => User)
  user: User;

  @BeforeInsert()
  async createCode() {
    this.code = uuid();
  }
}
