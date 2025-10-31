import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Video } from './video.entity';

@Entity('video_watches')
export class VideoWatch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  videoId: number;

  @Column({ type: 'int', default: 0 })
  watchTime: number; // Thời gian xem (giây)

  @Column({ type: 'int', default: 0 })
  duration: number; // Tổng thời lượng video (giây)

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  completionPercentage: number; // Phần trăm hoàn thành (0-100)

  @Column({ default: false })
  isCompleted: boolean; // Đã xem hết video chưa

  @Column({ type: 'timestamp', nullable: true })
  lastWatchedAt: Date; // Thời gian xem cuối cùng

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Video, (video) => video.id)
  @JoinColumn({ name: 'videoId' })
  video: Video;
}

