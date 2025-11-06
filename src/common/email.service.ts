import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor() {
    // Lấy thông tin cấu hình từ environment variables
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');
    const smtpUser = process.env.SMTP_USER?.trim();
    // Xóa tất cả khoảng trắng trong App Password (Gmail App Password thường có khoảng trắng)
    const smtpPass = process.env.SMTP_PASS?.trim().replace(/\s+/g, '');
    const smtpSecure = process.env.SMTP_SECURE === 'true' || smtpPort === 465;

    // Debug logging (ẩn password)
    this.logger.log(`SMTP Configuration: host=${smtpHost}, port=${smtpPort}, secure=${smtpSecure}`);
    this.logger.log(`SMTP User: ${smtpUser ? smtpUser.substring(0, 3) + '***' : 'NOT SET'}`);
    this.logger.log(`SMTP Pass: ${smtpPass ? '***SET***' : 'NOT SET'}`);

    // Kiểm tra cấu hình
    if (!smtpUser || !smtpPass) {
      this.logger.error(
        'SMTP chưa được cấu hình đầy đủ. Vui lòng thiết lập SMTP_USER và SMTP_PASS trong file .env',
      );
      this.logger.error(
        'Để sử dụng Gmail, bạn cần tạo App Password tại: https://myaccount.google.com/apppasswords',
      );
      throw new Error('SMTP configuration is missing. Please set SMTP_USER and SMTP_PASS in .env file');
    }

    // Cấu hình SMTP với auth bắt buộc
    const transportConfig: any = {
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      // Tùy chọn: Bỏ qua lỗi certificate (chỉ dùng trong development)
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production',
      },
    };

    // Đối với Gmail, cần thêm một số cấu hình đặc biệt
    if (smtpHost.includes('gmail.com')) {
      transportConfig.requireTLS = true;
      transportConfig.connectionTimeout = 10000; // 10 seconds
    }

    this.transporter = nodemailer.createTransport(transportConfig);

    // Verify connection configuration (async, không block constructor)
    this.verifyConnection().catch((err) => {
      this.logger.warn('SMTP verification failed on startup:', err.message);
    });
  }

  private async verifyConnection() {
    try {
      await this.transporter.verify();
      this.logger.log('SMTP connection verified successfully');
    } catch (error) {
      this.logger.error('SMTP connection failed:', error.message);
      if (error.code === 'EAUTH') {
        this.logger.error(
          'Lỗi xác thực SMTP. Vui lòng kiểm tra:',
        );
        this.logger.error('1. SMTP_USER và SMTP_PASS trong file .env');
        this.logger.error(
          '2. Nếu dùng Gmail, cần tạo App Password tại: https://myaccount.google.com/apppasswords',
        );
        this.logger.error(
          '3. Đảm bảo đã bật 2-Step Verification cho tài khoản Gmail',
        );
      }
    }
  }

  async sendPasswordResetEmail(email: string, resetLink: string): Promise<void> {
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@example.com',
      to: email,
      subject: 'Đặt lại mật khẩu',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Yêu cầu đặt lại mật khẩu</h2>
          <p>Xin chào,</p>
          <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
          <p>Vui lòng click vào link bên dưới để đặt lại mật khẩu mới:</p>
          <p style="margin: 20px 0;">
            <a href="${resetLink}" 
               style="background-color: #4CAF50; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 4px; display: inline-block;">
              Đặt lại mật khẩu
            </a>
          </p>
          <p>Hoặc copy và paste link sau vào trình duyệt:</p>
          <p style="word-break: break-all; color: #666;">${resetLink}</p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            Lưu ý: Link này sẽ hết hạn sau 1 giờ. Nếu bạn không yêu cầu đặt lại mật khẩu, 
            vui lòng bỏ qua email này.
          </p>
        </div>
      `,
    };

    try {
      // Kiểm tra lại cấu hình trước khi gửi
      const smtpUser = process.env.SMTP_USER?.trim();
      // Xóa tất cả khoảng trắng trong App Password
      const smtpPass = process.env.SMTP_PASS?.trim().replace(/\s+/g, '');
      
      if (!smtpUser || !smtpPass) {
        throw new Error('SMTP credentials not configured. Please check .env file');
      }

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Password reset email sent successfully to ${email}`);
    } catch (error) {
      this.logger.error('Error sending email:', error);
      this.logger.error('Error code:', error.code);
      this.logger.error('Error response:', error.response);
      
      // Xử lý các loại lỗi cụ thể
      if (error.code === 'EAUTH' || error.responseCode === 535 || error.message?.includes('Authentication Required')) {
        this.logger.error('═══════════════════════════════════════════════════════');
        this.logger.error('LỖI XÁC THỰC SMTP - Vui lòng kiểm tra:');
        this.logger.error('1. File .env có tồn tại và được load không?');
        this.logger.error('2. SMTP_USER và SMTP_PASS đã được set trong .env?');
        this.logger.error('3. Nếu dùng Gmail:');
        this.logger.error('   - Đã bật 2-Step Verification?');
        this.logger.error('   - Đã tạo App Password (KHÔNG dùng mật khẩu thường)?');
        this.logger.error('   - Link: https://myaccount.google.com/apppasswords');
        this.logger.error('4. App Password phải là 16 ký tự (xóa khoảng trắng nếu có)');
        this.logger.error('═══════════════════════════════════════════════════════');
        throw new Error(
          'Lỗi xác thực email. Vui lòng kiểm tra cấu hình SMTP trong file .env. Xem log trên để biết chi tiết.',
        );
      } else if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
        throw new Error('Không thể kết nối đến SMTP server. Vui lòng kiểm tra SMTP_HOST và SMTP_PORT');
      } else {
        throw new Error(`Không thể gửi email: ${error.message}`);
      }
    }
  }
}

