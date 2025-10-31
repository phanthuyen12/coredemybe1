import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Course } from './course.entity';

@Entity('enrollments')
export class Enrollment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  courseId: number;

  @Column({ default: 'active' })
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  start_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_at: Date;

  @Column({ default: 'unpaid' })
  payment_status: string;

  @Column({ nullable: true })
  voucher_code: string;

  @Column({ type: 'text', nullable: true })
  note: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, { eager: false })
  user: User;

  @ManyToOne(() => Course, (course) => course.enrollments, { eager: false })
  course: Course;
}
