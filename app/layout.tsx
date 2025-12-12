import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import styles from '@/styles/Layout.module.css'
export const metadata: Metadata = {
    title: 'Barrier Management System',
    description: 'Hệ thống quản lý phương tiện ra vào khu vực khai thác',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="vi">
            <body>
                <Providers>
                    <Navbar/>
                    <main className={styles.main}>
                        {children}
                    </main>
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}