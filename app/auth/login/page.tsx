'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, AlertCircle } from 'lucide-react';
import { useAppDispatch } from '@/app/hooks/useAuth';
import { setCredentials } from '@/app/features/auth/authSlice';

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
      console.log(data)

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
    <>
      <style jsx>{`
        :root {
          --primary: #3b82f6;
          --primary-dark: #2563eb;
          --secondary: #06b6d4;
          --secondary-dark: #0891b2;
          --bg-gradient: linear-gradient(135deg, #1e293b 0%, #1e40af 50%, #1e293b 100%);
          --glass-bg: rgba(255, 255, 255, 0.15);
          --glass-border: rgba(255, 255, 255, 0.2);
          --text-primary: #ffffff;
          --text-secondary: #dbeafe;
          --input-bg: #f8fafc;
          --input-border: #e2e8f0;
          --error-bg: #fef2f2;
          --error-border: #fecaca;
          --error-text: #dc2626;
          --demo-bg: linear-gradient(135deg, #dbeafe 0%, #a5f3fc 100%);
        }

        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .glass {
          background: var(--glass-bg);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--glass-border);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37);
        }

        .btn-primary {
          background: linear-gradient(to right, var(--primary), var(--secondary));
          transition: all 0.2s ease;
        }

        .btn-primary:hover:not(:disabled) {
          background: linear-gradient(to right, var(--primary-dark), var(--secondary-dark));
          transform: scale(1.02);
          box-shadow: 0 10px 20px rgba(59, 130, 246, 0.4);
        }

        .btn-primary:active:not(:disabled) {
          transform: scale(0.98);
        }

        .btn-primary:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .input-focus:focus {
          outline: none;
          border-color: var(--primary);
          background: white;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
        }

        .logo-container {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          border-radius: 24px;
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.5);
          transition: transform 0.3s ease;
        }

        .logo-container:hover {
          transform: scale(1.08);
        }
      `}</style>

      <div
        style={{
          minHeight: '100vh',
          background: 'var(--bg-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        {/* Animated Background Blobs */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <div
            className="animate-blob"
            style={{
              position: 'absolute',
              top: '-160px',
              right: '-160px',
              width: '320px',
              height: '320px',
              background: '#3b82f6',
              borderRadius: '50%',
              filter: 'blur(80px)',
              opacity: 0.2,
            }}
          />
          <div
            className="animate-blob animation-delay-2000"
            style={{
              position: 'absolute',
              bottom: '-160px',
              left: '-160px',
              width: '320px',
              height: '320px',
              background: '#a78bfa',
              borderRadius: '50%',
              filter: 'blur(80px)',
              opacity: 0.2,
            }}
          />
          <div
            className="animate-blob animation-delay-4000"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '320px',
              height: '320px',
              background: '#06b6d4',
              borderRadius: '50%',
              filter: 'blur(80px)',
              opacity: 0.2,
            }}
          />
        </div>

        {/* Main Container */}
        <div style={{ width: '100%', maxWidth: '448px', position: 'relative', zIndex: 10 }}>
          {/* Logo & Title */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            {/* Vùng chèn LOGO CÔNG TY */}
            <div
              className="logo-container"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
              }}
            >
              {/* Thay thế bằng logo công ty của bạn */}
              {/* <Shield style={{ width: '40px', height: '40px', color: 'white' }} /> */}
              <img src="/logo-company.png" alt="Logo công ty" style={{ width: '48px', height: '48px' }} />
              {/* Ví dụ: <img src="/logo-company.png" alt="Logo công ty" style={{ width: '48px', height: '48px' }} /> */}
            </div>

            <h1
              style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: 'var(--text-primary)',
                marginBottom: '0.75rem',
                letterSpacing: '-0.025em',
              }}
            >
              Hệ thống quản lý Barrier
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)' }}>
              Khu vực khai thác đá
            </p>
          </div>

          {/* Login Form - Glassmorphism */}
          <div
            className="glass"
            style={{
              padding: '2rem',
              borderRadius: '24px',
              background: 'var(--glass-bg)',
            }}
          >
            <form onSubmit={handleSubmit}>
              {/* Username */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label
                  htmlFor="username"
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem',
                  }}
                >
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
                  className="input-focus"
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    background: 'var(--input-bg)',
                    border: '1px solid var(--input-border)',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    color: '#1f2937',
                    transition: 'all 0.2s ease',
                  }}
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label
                  htmlFor="password"
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem',
                  }}
                >
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
                  className="input-focus"
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    background: 'var(--input-bg)',
                    border: '1px solid var(--input-border)',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    color: '#1f2937',
                    transition: 'all 0.2s ease',
                  }}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div
                  className="animate-shake"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    background: 'var(--error-bg)',
                    border: '1px solid var(--error-border)',
                    borderRadius: '12px',
                    color: 'var(--error-text)',
                    fontSize: '0.875rem',
                    marginBottom: '1.25rem',
                  }}
                >
                  <AlertCircle style={{ width: '20px', height: '20px', flexShrink: 0 }} />
                  <span style={{ fontWeight: '500' }}>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                }}
              >
                {loading ? (
                  <>
                    <svg
                      style={{ animation: 'spin 1s linear infinite', width: '20px', height: '20px' }}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        style={{ opacity: 0.25 }}
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        style={{ opacity: 0.75 }}
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
            <div
              style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: 'var(--demo-bg)',
                borderRadius: '12px',
                border: '1px solid #93c5fd',
              }}
            >
              <p
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#1e40af',
                  marginBottom: '0.625rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <svg style={{ width: '16px', height: '16px' }} fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Thông tin đăng nhập demo:
              </p>
              <div style={{ fontSize: '0.75rem', color: '#1e3a8a' }}>
                <p>
                  <span style={{ fontWeight: '500' }}>Username:</span>{' '}
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontWeight: 'bold',
                      background: 'white',
                      padding: '0.125rem 0.5rem',
                      borderRadius: '4px',
                    }}
                  >
                    admin
                  </span>
                </p>
                <p style={{ marginTop: '0.25rem' }}>
                  <span style={{ fontWeight: '500' }}>Password:</span>{' '}
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontWeight: 'bold',
                      background: 'white',
                      padding: '0.125rem 0.5rem',
                      borderRadius: '4px',
                    }}
                  >
                    admin123
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p
            style={{
              textAlign: 'center',
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              marginTop: '2rem',
            }}
          >
            2025 Hệ thống quản lý Barrier. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}

// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAppDispatch } from '@/app/hooks/useAuth';
// import { setCredentials } from '@/app/features/auth/authSlice';

// export default function LoginPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const router = useRouter();
//   const dispatch = useAppDispatch();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');

//     try {
//       // Replace with your actual API call
//       const response = await fetch('http://localhost:5555/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });

//       if (!response.ok) {
//         throw new Error('Đăng nhập thất bại');
//       }

//       const { user, token } = await response.json();
//       dispatch(setCredentials({ user, token }));
//       router.push('/dashboard');
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             Đăng nhập hệ thống
//           </h2>
//         </div>
//         {error && (
//           <div className="bg-red-50 border-l-4 border-red-400 p-4">
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 <svg
//                   className="h-5 w-5 text-red-400"
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-red-700">{error}</p>
//               </div>
//             </div>
//           </div>
//         )}
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="rounded-md shadow-sm -space-y-px">
//             <div>
//               <label htmlFor="email" className="sr-only">
//                 Email
//               </label>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 autoComplete="email"
//                 required
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                 placeholder="Email"
//               />
//             </div>
//             <div>
//               <label htmlFor="password" className="sr-only">
//                 Mật khẩu
//               </label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 autoComplete="current-password"
//                 required
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                 placeholder="Mật khẩu"
//               />
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
//             >
//               {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }