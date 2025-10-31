import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Video } from './video.entity';
import {Enrollment} from './enrollment.entity';
import { Category } from './category.entity';
@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column()
  description: string;

  @Column()
  thumbnail: string;
@Column({ type: 'int', default: 1 })
active: number;

  @Column()
  code: string;

  @OneToMany(() => Video, (video) => video.course, { cascade: true })
  videos: Video[];

  // 👇 Thêm quan hệ này

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
enrollments: Enrollment[];

 @OneToMany(() => Category, (category) => category.course, { cascade: true })
categories: Category[];

  @Column({ type: 'boolean', nullable: true, default: null })
  isHeadOfice: boolean | null;


}
