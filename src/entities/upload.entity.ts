import { IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class Upload extends BaseEntity {
  @IsString()
  @Column()
  title?: string;

  @IsString()
  @Column()
  alt?: string;

  @IsString()
  @Column({ type: 'varchar', length: 255, unique: true })
  image: string;

  @IsString()
  @Column()
  mimeType: string;
}
