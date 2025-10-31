import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Course } from './course.entity';
import { Category } from './category.entity';

@Entity('videos')
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  url: string; // lưu link hoặc objectURL tạm thời

  @Column({ nullable: true })
  fileName: string; // lưu tên file nếu upload

  @Column({ type: 'int', default: 0 })
  duration: number; // đơn vị giây

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ type: 'enum', enum: ['Free', 'Premium'], default: 'Free' })
  access: 'Free' | 'Premium';

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @Column({ default: 'Active' })
  status: 'Active' | 'Inactive';

  // Quan hệ với Category
  @ManyToOne(() => Category, (category) => category.videos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column()
  categoryId: number;

  // Quan hệ với Course
  @ManyToOne(() => Course, (course) => course.videos)
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Column()
  courseId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
