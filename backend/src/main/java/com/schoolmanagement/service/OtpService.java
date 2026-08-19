package com.schoolmanagement.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private static final Logger logger = LoggerFactory.getLogger(OtpService.class);
    private static final int OTP_VALIDITY_MINUTES = 10;
    private final SecureRandom secureRandom = new SecureRandom();

    public static class OtpData {
        private final String code;
        private final LocalDateTime expiresAt;

        public OtpData(String code, LocalDateTime expiresAt) {
            this.code = code;
            this.expiresAt = expiresAt;
        }

        public String getCode() {
            return code;
        }

        public boolean isExpired() {
            return LocalDateTime.now().isAfter(expiresAt);
        }
    }

    private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();

    public String generateOtp(String email) {
        String sanitizedEmail = email.trim().toLowerCase();
        int randomPin = 100000 + secureRandom.nextInt(900000);
        String code = String.valueOf(randomPin);
        
        otpStorage.put(sanitizedEmail, new OtpData(code, LocalDateTime.now().plusMinutes(OTP_VALIDITY_MINUTES)));
        logger.info("Generated 6-digit OTP for [{}]: {}", sanitizedEmail, code);
        return code;
    }

    public boolean verifyOtp(String email, String code) {
        if (email == null || code == null) {
            return false;
        }
        String sanitizedEmail = email.trim().toLowerCase();
        OtpData data = otpStorage.get(sanitizedEmail);

        if (data == null) {
            logger.warn("No OTP record found for email: {}", sanitizedEmail);
            return false;
        }

        if (data.isExpired()) {
            logger.warn("OTP expired for email: {}", sanitizedEmail);
            otpStorage.remove(sanitizedEmail);
            return false;
        }

        if (data.getCode().equals(code.trim())) {
            logger.info("OTP verified successfully for email: {}", sanitizedEmail);
            return true;
        }

        logger.warn("Invalid OTP entered for email: {}", sanitizedEmail);
        return false;
    }

    public void clearOtp(String email) {
        if (email != null) {
            otpStorage.remove(email.trim().toLowerCase());
        }
    }
}
