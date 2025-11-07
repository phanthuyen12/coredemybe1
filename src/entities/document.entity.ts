import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { DocumentCategory } from './document-category.entity';
import { User } from './user.entity';

@Entity('documents')
export class Document {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => DocumentCategory, (category) => category.documents, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'categoryId' })
    category: DocumentCategory | null;

    @Column({ type: 'int', nullable: true })
    categoryId: number | null;

    @Column({ length: 255 })
    title: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ length: 500 })
    link: string;

    @Column({ length: 50 })
    type: string;

    @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'uploadedBy' })
    uploadedByUser?: User | null;

    @Column({ type: 'int', nullable: true })
    uploadedBy: number | null;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;
}





