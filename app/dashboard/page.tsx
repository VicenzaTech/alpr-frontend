'use client';

import { useState, useEffect } from 'react';
import {
    Camera,
    Car,
    Clock,
    AlertCircle,
} from 'lucide-react';
import styles from './page.module.css';
import { useAppSelector } from '@/app/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import alprService, { Detection } from '@/services/alpr.service';

interface Stats {
    totalDetections: number;
    recentDetections: number;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5555';

export default function HomePage() {
    const { user } = useAppSelector((state) => state.auth);
    const [detections, setDetections] = useState<Detection[]>([]);
    const [stats, setStats] = useState<Stats>({
        totalDetections: 0,
        recentDetections: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch detections
    useEffect(() => {
        console.log('---fetching')
        fetchDetections();
        const interval = setInterval(fetchDetections, 5000); // Auto refresh every 5s
        return () => clearInterval(interval);
    }, []);

    const fetchDetections = async () => {
        try {
            setError(null);
            const data = await alprService.getDetections(1, 6);
            console.log(`data:::`, data)
            setDetections(data.data);
            setStats({
                totalDetections: data.total || 0,
                recentDetections: data.data.length,
            });
            setLoading(false);
        } catch (err) {
            console.error('Error fetching detections:', err);
            setError('Không thể tải dữ liệu. Vui lòng thử lại.');
            setDetections([]);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <ProtectedRoute>
                <div className={styles.container}>
                    <div className={styles.loading}>Đang tải dữ liệu...</div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div className={styles.container}>
                <header className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Dashboard ALPR</h1>
                        <p className={styles.subtitle}>
                            Chào mừng, {user?.fullName || 'Admin'}
                        </p>
                    </div>
                </header>

                {error && (
                    <div className={styles.errorBanner}>
                        <AlertCircle size={20} />
                        <p>{error}</p>
                    </div>
                )}

                {/* Stats Cards */}
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon} style={{ backgroundColor: '#3b82f6' }}>
                            <Car size={24} />
                        </div>
                        <div className={styles.statContent}>
                            <p className={styles.statLabel}>Tổng phát hiện</p>
                            <p className={styles.statValue}>{stats.totalDetections}</p>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statIcon} style={{ backgroundColor: '#10b981' }}>
                            <Clock size={24} />
                        </div>
                        <div className={styles.statContent}>
                            <p className={styles.statLabel}>Hiển thị gần đây</p>
                            <p className={styles.statValue}>{stats.recentDetections}</p>
                        </div>
                    </div>
                </div>

                {/* Detections Grid */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>6 Nhận diện biển số gần nhất</h2>

                    {detections.length === 0 ? (
                        <div className={styles.emptyState}>
                            <AlertCircle size={48} />
                            <p>Chưa có dữ liệu phát hiện biển số</p>
                        </div>
                    ) : (
                        <div className={styles.detectionsGrid}>
                            {detections.length && detections.map((detection) => (
                                <div key={detection.id} className={styles.detectionCard}>
                                    {/* Full Image */}
                                    <div className={styles.imageContainer}>
                                        {detection.full_image_url ? (
                                            <img
                                                src={`${BACKEND_URL}${detection.full_image_url}`}
                                                alt="Vehicle"
                                                className={styles.fullImage}
                                            />
                                        ) : (
                                            <div className={styles.noImage}>
                                                <Camera size={48} />
                                                <p>Không có ảnh</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Detection Info */}
                                    <div className={styles.detectionInfo}>
                                        <div className={styles.plateInfo}>
                                            <div className={styles.plateText}>
                                                {detection.formatted_text || detection.plate_text}
                                            </div>
                                        </div>

                                        {/* Cropped Plate Image */}
                                        {detection.cropped_image_url && (
                                            <div className={styles.croppedImageContainer}>
                                                <img
                                                    src={`${BACKEND_URL}${detection.cropped_image_url}`}
                                                    alt="License Plate"
                                                    className={styles.croppedImage}
                                                />
                                            </div>
                                        )}

                                        {/* Metadata */}
                                        <div className={styles.metadata}>
                                            <div className={styles.metadataItem}>
                                                <span className={styles.metadataLabel}>Độ tin cậy:</span>
                                                <span className={styles.metadataValue}>
                                                    {(detection.confidence * 100).toFixed(1)}%
                                                </span>
                                            </div>
                                            <div className={styles.metadataItem}>
                                                <span className={styles.metadataLabel}>Camera:</span>
                                                <span className={styles.metadataValue}>{detection.camera_id}</span>
                                            </div>
                                            <div className={styles.metadataItem}>
                                                <span className={styles.metadataLabel}>Thời gian:</span>
                                                <span className={styles.metadataValue}>
                                                    {new Date(detection.timestamp).toLocaleString('vi-VN')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}