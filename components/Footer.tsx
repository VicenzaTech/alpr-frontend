'use client';

import { Shield, Mail, Phone, MapPin } from 'lucide-react';
import styles from '@/styles/Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Company Info */}
        <div className={styles.footerSection}>
          <div className={styles.footerLogo}>
            <div className={styles.footerLogoIcon}>
              <Shield size={24} />
            </div>
            <div>
              <h3 className={styles.footerLogoTitle}>Barrier System</h3>
              <p className={styles.footerLogoSubtitle}>ALPR Management</p>
            </div>
          </div>
          <p className={styles.footerDescription}>
            Hệ thống quản lý phương tiện ra vào khu vực khai thác đá với công nghệ nhận diện biển số tự động.
          </p>
        </div>

        {/* Quick Links */}
        <div className={styles.footerSection}>
          <h4 className={styles.footerTitle}>Liên kết nhanh</h4>
          <ul className={styles.footerLinks}>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/user-management">Quản lý người dùng</a></li>
            <li><a href="/reports">Báo cáo</a></li>
            <li><a href="/settings">Cài đặt</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className={styles.footerSection}>
          <h4 className={styles.footerTitle}>Liên hệ</h4>
          <ul className={styles.footerContact}>
            <li>
              <MapPin size={16} />
              <span>Khu vực khai thác đá, Việt Nam</span>
            </li>
            <li>
              <Phone size={16} />
              <span>+84 123 456 789</span>
            </li>
            <li>
              <Mail size={16} />
              <span>support@barriersystem.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.footerBottom}>
        <p className={styles.footerCopyright}>
          © {currentYear} Barrier Management System. All rights reserved.
        </p>
        <div className={styles.footerBottomLinks}>
          <a href="/privacy">Chính sách bảo mật</a>
          <a href="/terms">Điều khoản sử dụng</a>
        </div>
      </div>
    </footer>
  );
}