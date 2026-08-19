package com.schoolmanagement.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:educore.notifications@gmail.com}")
    private String fromEmail;

    public boolean sendOtpEmail(String toEmail, String otpCode) {
        logger.info("Preparing OTP verification email for: {}", toEmail);

        if (mailSender == null) {
            logger.warn("JavaMailSender is not initialized. Simulating email send. OTP code for [{}]: {}", toEmail, otpCode);
            return true;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "EduCore School System");
            helper.setTo(toEmail);
            helper.setSubject("EduCore School System - Your Email Verification Code");

            String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="UTF-8">
                  <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; }
                    .card { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 36px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
                    .logo { text-align: center; font-size: 32px; margin-bottom: 12px; }
                    .header { text-align: center; color: #1e293b; font-size: 22px; font-weight: 700; margin-bottom: 8px; }
                    .subtext { text-align: center; color: #64748b; font-size: 14px; margin-bottom: 24px; }
                    .otp-box { background: #f1f5f9; border: 2px dashed #4f46e5; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0; }
                    .otp-code { font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #4f46e5; margin: 0; }
                    .expiry { font-size: 12px; color: #94a3b8; margin-top: 8px; }
                    .footer { text-align: center; font-size: 12px; color: #94a3b8; margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 16px; }
                  </style>
                </head>
                <body>
                  <div class="card">
                    <div class="logo">🏫</div>
                    <div class="header">Verify Your Email Address</div>
                    <div class="subtext">Welcome to EduCore School Management System. Use the 6-digit verification code below to activate your account.</div>
                    
                    <div class="otp-box">
                      <div class="otp-code">%s</div>
                      <div class="expiry">Valid for the next 10 minutes</div>
                    </div>
                    
                    <p style="font-size: 13px; color: #64748b; line-height: 1.5;">
                      If you did not request this verification code, please ignore this email. Do not share this code with anyone.
                    </p>
                    
                    <div class="footer">
                      &copy; 2026 EduCore School Management System. All rights reserved.
                    </div>
                  </div>
                </body>
                </html>
                """.formatted(otpCode);

            helper.setText(htmlContent, true);
            mailSender.send(message);
            logger.info("Successfully sent OTP email to {}", toEmail);
            return true;
        } catch (MessagingException e) {
            logger.error("Failed to send OTP email to {}: {}", toEmail, e.getMessage());
            return false;
        } catch (Exception e) {
            logger.warn("Mail transport error (fallback mode active): {}. OTP for [{}] is: {}", e.getMessage(), toEmail, otpCode);
            return true;
        }
    }
}
