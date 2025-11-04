'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, AlertCircle } from 'lucide-react';
import { useAppDispatch } from '@/app/hooks/useAuth';
import { setCredentials } from '@/app/features/auth/authSlice';
import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5555/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }

      // Save token and user data from API response
      const { token, user } = data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      dispatch(setCredentials({ user, token }));
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Đã xảy ra lỗi. Vui lòng thử lại sau.';
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Animated Background Blobs */}
      <div className={styles.bgBlobs}>
        <div className={`${styles.blob} ${styles.blob1}`} />
        <div className={`${styles.blob} ${styles.blob2}`} />
        <div className={`${styles.blob} ${styles.blob3}`} />
      </div>

      {/* Main Container */}
      <div className={styles.mainContainer}>
        {/* Logo & Title */}
        <div className={styles.header}>
          <div className={styles.logoContainer}>
            <img src="/logo-company.png" alt="Logo công ty" />
          </div>

          <h1 className={styles.title}>Hệ thống quản lý Barrier</h1>
          <p className={styles.subtitle}>Khu vực khai thác đá</p>
        </div>

        {/* Login Form */}
        <div className={styles.formCard}>
          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div className={styles.formGroup}>
              <label htmlFor="username" className={styles.label}>
                Tên đăng nhập
              </label>
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="Nhập tên đăng nhập"
                required
                className={styles.input}
              />
            </div>

            {/* Password */}
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                Mật khẩu
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Nhập mật khẩu"
                required
                className={styles.input}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className={styles.errorBox}>
                <AlertCircle />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={styles.submitBtn}
            >
              {loading ? (
                <>
                  <svg
                    className={styles.spinner}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className={styles.spinnerCircle}
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className={styles.spinnerPath}
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Đang đăng nhập...
                </>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className={styles.demoBox}>
            <p className={styles.demoTitle}>
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              Thông tin đăng nhập demo:
            </p>
            <div className={styles.demoContent}>
              <p>
                <span className={styles.demoLabel}>Username:</span>
                <span className={styles.demoValue}>admin</span>
              </p>
              <p>
                <span className={styles.demoLabel}>Password:</span>
                <span className={styles.demoValue}>admin123</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className={styles.footer}>
          2025 Hệ thống quản lý Barrier. All rights reserved.
        </p>
      </div>
    </div>
  );
}