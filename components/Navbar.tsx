'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/app/hooks/useAuth';
import { logout } from '@/app/features/auth/authSlice';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import styles from '@/styles/Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = user ? [
    { name: 'Trang chủ', href: '/dashboard' },
    { name: 'Quản lý', href: '/management' },
    { name: 'Báo cáo', href: '/reports' },
  ] : [];

  const handleLogout = async () => {
    await dispatch(logout());
    setIsMenuOpen(false);
    router.push('/auth/login');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo */}
        <div className={styles.logo}>
          <Link href="/" className="text-white font-bold text-xl">
            VicenzaTech
          </Link>
        </div>

        {/* Desktop Navigation */}
        {user && (
          <div className={styles.navLinks}>
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${styles.navLink} ${
                  pathname === item.href ? styles.active : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}

        {/* Desktop User Section */}
        <div className={styles.userSection}>
          {user && (
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user.fullName}</span>
              <button
                onClick={handleLogout}
                className={styles.logoutButton}
                title="Đăng xuất"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={styles.menuButton}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileNav}>
            {user && navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${styles.mobileLink} ${
                  pathname === item.href ? styles.active : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {user ? (
              <div className={styles.mobileUserSection}>
                <div className={styles.mobileUserInfo}>
                  <span className={styles.mobileUserName}>
                    {user.fullName}
                  </span>
                  <button
                    onClick={handleLogout}
                    className={styles.mobileLogoutButton}
                  >
                    <LogOut size={18} />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className={styles.mobileLoginButton}
                onClick={() => setIsMenuOpen(false)}
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}