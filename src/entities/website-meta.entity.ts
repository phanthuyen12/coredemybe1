import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('website_meta')
@Index(['domain'], { unique: true })
export class WebsiteMeta extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500, nullable: true })
  url?: string;

  @Column({ length: 255 })
  domain: string; // unique per website

  @Column({ length: 500, nullable: true })
  title?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ length: 500, nullable: true })
  logo?: string;

  @Column({ name: 'cover_image', length: 500, nullable: true })
  cover_image?: string;

  @Column({ length: 500, nullable: true })
  favicon?: string;

  @Column({ type: 'text', nullable: true })
  hashtags?: string; // comma-separated

  @Column({ length: 255, nullable: true })
  author?: string;

  @Column({ name: 'site_name', length: 255, nullable: true })
  site_name?: string;

  @Column({ name: 'published_time', type: 'datetime', nullable: true })
  published_time?: Date;

  @Column({ type: 'text', nullable: true })
  tags?: string; // comma-separated

  @Column({ type: 'json', nullable: true })
  metadata?: any;

  @CreateDateColumn({ name: 'createDate' })
  createDate: Date;

  @UpdateDateColumn({ name: 'updateDate' })
  updateDate: Date;
}



