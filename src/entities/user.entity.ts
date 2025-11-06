import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('user')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ unique: true })
    username: string;

    @Column({ default: 'user' })
    role: string;  // 'ctv', 'admin', 'user', etc.

    @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
    balance: number; // Số dư khả dụng

    @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
    totalTopup: number; // Tổng nạp

    @Column({ default: '0%' })
    discount: string; // Chiết khấu

    @Column({ default: false })
    admin: boolean; // Admin hay không

    @Column({ default: 'Active' })
    status: string; // Active, Banned, etc.

    @Column({ default: 'Offline' })
    activity: string; // Hoạt động: Online/Offline

    @Column({ nullable: true })
    utm_source: string; // Nguồn UTMs

    @Column({ nullable: true })
    resetToken: string; // Token để reset mật khẩu

    @Column({ nullable: true })
    resetTokenExpiry: Date; // Thời gian hết hạn của token

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}
