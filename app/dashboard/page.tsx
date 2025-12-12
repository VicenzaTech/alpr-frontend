'use client';

import { useState, useEffect, FormEvent } from 'react';
import {
    Camera,
    Car,
    Clock,
    AlertCircle,
    RefreshCwIcon,
    FileWarning,
    MailWarning,
} from 'lucide-react';
import styles from './page.module.css';
import { useAppSelector } from '@/app/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import alprService, { Detection } from '@/services/alpr.service';
import WhepPlayer from '@/components/WhepPlayer';

interface Stats {
    totalDetections: number;
    recentDetections: number;
}

interface ProcessFormState {
    driverName: string;
    vehicleType: string;
    phoneNumber: string;
    note: string;
}

type DetectionCardVariant = 'new' | 'alert';

const createEmptyProcessForm = (): ProcessFormState => ({
    driverName: '',
    vehicleType: '',
    phoneNumber: '',
    note: '',
});

const getDetectionCardVariant = (detection: Detection): DetectionCardVariant => {
    const metadata = detection.metadata || {};

    if (metadata.registrationStatus && metadata.registrationStatus !== 'registered') {
        return 'alert';
    }

    if (metadata.alertType || metadata.isWarning || detection.status === 'rejected') {
        return 'alert';
    }

    if (metadata.vehicleStatus === 'new_vehicle' || detection.status === 'pending_approval') {
        return 'new';
    }

    return 'new';
};

const getWarningMessage = (detection: Detection): string => {
    const metadata = detection.metadata || {};

    if (typeof metadata.warningMessage === 'string' && metadata.warningMessage.trim().length > 0) {
        return metadata.warningMessage;
    }

    if (metadata.registrationStatus && metadata.registrationStatus !== 'registered') {
        return 'Canh bao: Xe chua dang ky';
    }

    return 'Canh bao: Vui long kiem tra';
};

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
    const [processFormDetection, setProcessFormDetection] = useState<Detection | null>(null);
    const [processFormData, setProcessFormData] = useState<ProcessFormState>(() => createEmptyProcessForm());

    useEffect(() => {
        fetchDetections();
        const interval = setInterval(fetchDetections, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchDetections = async () => {
        try {
            setError(null);
            const data = await alprService.getDetections(1, 6);
            setDetections(data.data);
            setStats({
                totalDetections: data.total || 0,
                recentDetections: data.data.length,
            });
            setLoading(false);
        } catch (err) {
            console.error('Error fetching detections:', err);
            setError('Khong the tai du lieu. Vui long thu lai.');
            setDetections([]);
            setLoading(false);
        }
    };

    const resetProcessForm = () => {
        setProcessFormData(createEmptyProcessForm());
    };

    const handleProcessNow = (detection: Detection) => {
        setProcessFormDetection(detection);
        resetProcessForm();
    };

    const handleProcessFieldChange = (field: keyof ProcessFormState, value: string) => {
        setProcessFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const closeProcessForm = () => {
        setProcessFormDetection(null);
        resetProcessForm();
    };

    const handleProcessFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        closeProcessForm();
    };

    const activeDetection = detections[0] || null;
    const queueDetections = detections.slice(1);
    const formattedPlate = activeDetection ? (activeDetection.formatted_text || activeDetection.plate_text) : '-- --';

    if (loading) {
        return (
            <ProtectedRoute>
                <div className={styles.dashboard}>
                    <div className={styles.loading}>Dang tai du lieu...</div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div className={styles.dashboard}>
                {/* <header className={styles.pageHeader}>
                    <div className={styles.pageIntro}>
                        <p className={styles.systemTag}>GateControl AI</p>
                        <h1 className={styles.pageTitle}>Giam sat - Cong so 1</h1>
                        <p className={styles.pageSubtitle}>
                            Ca truc: {user?.fullName || 'Admin'} | He thong hoat dong on dinh
                        </p>
                    </div>
                    <div className={styles.headerStats}>
                        <div className={styles.headerStat}>
                            <span>Tong phat hien</span>
                            <strong>{stats.totalDetections}</strong>
                        </div>
                        <div className={styles.headerStat}>
                            <span>Trong 5s gan nhat</span>
                            <strong>{stats.recentDetections}</strong>
                        </div>
                    </div>
                </header> */}

                {error && (
                    <div className={styles.errorBanner}>
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <div className={styles.workspace}>
                    <section className={styles.liveSection}>
                        <div className={styles.liveToolbar}>
                            <div className={styles.liveTitleRow}>
                                <span className={styles.liveBadge}>Live</span>
                                <span className={styles.liveCamera}>CAM-01: Cổng chính | Làn xe vào</span>
                            </div>
                            <p className={styles.streamMeta}>
                                50 FPS | 1080p | {activeDetection ? new Date(activeDetection.timestamp).toLocaleTimeString('vi-VN') : '--:--'}
                            </p>

                        </div>

                        <div className={styles.liveViewport}>
                            {activeDetection?.full_image_url ? (
                                <WhepPlayer whepUrl='http://localhost:8889/cam01/whep'/>
                            ) : (
                                <div className={styles.emptyViewport}>
                                    <Camera size={56} />
                                    <p>Chưa có khung hình</p>
                                </div>
                            )}

                            {activeDetection && (
                                <div className={styles.focusBox}>
                                    <span className={styles.focusBadge}>
                                        Confidence {(activeDetection.confidence * 100).toFixed(0)}%
                                    </span>
                                </div>
                            )}
                        </div>
                    </section>

                    <aside className={styles.sidePanel}>
                        <div className={styles.panelHeader}>
                            <div>
                                <p className={styles.panelTitle}>Phương tiện cần xử lý</p>
                                <span className={styles.panelSubTitle}>Phát hiện {detections.length} phương tiện</span>
                            </div>
                            <button type="button" className={styles.autoButton} onClick={fetchDetections}>
                                <RefreshCwIcon size={22} className={styles.autoButton} />
                            </button>
                        </div>

                        {activeDetection ? (
                            <div className={styles.primaryCard}>
                                <div className={styles.primaryCardHeader}>
                                    <span className={styles.newBadge}>Mới</span>
                                    <span>{new Date(activeDetection.timestamp).toLocaleTimeString('vi-VN')}</span>
                                </div>

                                <div className={styles.plateInformationWrapper}>
                                    {activeDetection.cropped_image_url && (
                                        <div className={styles.platePreview}>
                                            <img
                                                src={`${BACKEND_URL}${activeDetection.cropped_image_url}`}
                                                alt="Bang so"
                                            />
                                        </div>
                                    )}
                                    <div className={styles.primaryPlate}>
                                        <h4>Biển số nhận diện</h4>
                                        <h5>{formattedPlate}</h5>
                                    </div>
                                </div>
                                <div className={styles.autoConfirmRow}>
                                    <div className={styles.autoConfirmRowTitle}>
                                        <span>Xác nhận trong </span>
                                        <span>24s</span>
                                    </div>
                                    <div className={styles.progressBar}>
                                        <span style={{ width: '70%' }} />
                                    </div>
                                </div>

                                <div className={styles.infoGrid}>
                                    <div className={styles.vehicleInfo}>
                                        <label htmlFor="" className={styles.vehicleLabel}>Loại xe</label>
                                        <select className={styles.vehicleSelect}>
                                            <option value="">Xe công ty</option>
                                            <option value="">Xe khai thác</option>
                                            <option value="">Xe cân dịch vụ</option>
                                        </select>
                                    </div>

                                    <div className={styles.vehicleInfo}>
                                        <label htmlFor="" className={styles.vehicleLabel}>Khách hàng</label>
                                        <select className={styles.vehicleSelect}>
                                            <option value="">Xe công ty</option>
                                            <option value="">Xe khai thác</option>
                                            <option value="">Xe cân dịch vụ</option>
                                        </select>
                                    </div>
                                </div>

                                <div className={styles.actionRow}>
                                    <button type="button" className={styles.secondaryButton}>Chỉnh sửa</button>
                                    <button type="button" className={styles.primaryButton}>Xác nhận vào</button>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.panelEmpty}>
                                <AlertCircle size={32} />
                                <p>Chua ghi nhan phat hien moi.</p>
                            </div>
                        )}

                        {queueDetections.length > 0 && (
                            <div className={styles.queueList}>
                                {queueDetections.map((item) => {
                                    const cardVariant = getDetectionCardVariant(item);
                                    const isAlertCard = cardVariant === 'alert';

                                    return (
                                        <div
                                            key={item.id}
                                            className={`${styles.queueCard} ${isAlertCard ? styles.queueCardAlert : styles.queueCardNew}`}
                                        >
                                            <div className={styles.plateInformationWrapper}>
                                                {item.cropped_image_url && (
                                                    <div className={styles.platePreview}>
                                                        <img
                                                            src={`${BACKEND_URL}${item.cropped_image_url}`}
                                                            alt="Bang so"
                                                        />
                                                    </div>
                                                )}
                                                <div className={styles.primaryPlate}>
                                                    <h4>Biển số nhận diện</h4>
                                                    <p className={styles.queuePlate}>{item.formatted_text || item.plate_text}</p>
                                                </div>
                                            </div>

                                            {isAlertCard ? (
                                                <div className={styles.queueCardWarning}>
                                                    <AlertCircle size={16} />
                                                    <span>{getWarningMessage(item)}</span>
                                                </div>
                                            ) : (
                                                <p className={styles.queueCardInfo}>
                                                    <MailWarning /> Xe chưa qua đăng ký
                                                </p>
                                            )}

                                            <div className={styles.queueMeta}>
                                                <span>Camera {item.camera_id || 'N/A'}</span>
                                                <span>Confidence {(item.confidence * 100).toFixed(0)}%</span>
                                            </div>

                                            <div className={styles.queueCardActions}>
                                                <button type="button" className={styles.queueActionButton}>
                                                    Chi tiết
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`${styles.queueActionButton} ${styles.queueActionPrimary}`}
                                                    onClick={() => handleProcessNow(item)}
                                                >
                                                    Xử lý ngay
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </aside>
                </div>

                <div className={styles.summaryStrip}>
                    <div className={styles.summaryItem}>
                        <Car size={18} />
                        <div>
                            <span>Xe vao</span>
                            <strong>{stats.totalDetections}</strong>
                        </div>
                    </div>
                    <div className={styles.summaryItem}>
                        <Clock size={18} />
                        <div>
                            <span>Xe ra</span>
                            <strong>{stats.recentDetections}</strong>
                        </div>
                    </div>
                    <div className={styles.summaryItem}>
                        <AlertCircle size={18} />
                        <div>
                            <span>Vi pham nghi van</span>
                            <strong>{Math.max(stats.totalDetections - stats.recentDetections, 0)}</strong>
                        </div>
                    </div>
                </div>

                {processFormDetection && (
                    <div className={styles.processFormOverlay}>
                        <form className={styles.processForm} onSubmit={handleProcessFormSubmit}>
                            <div className={styles.processFormHeader}>
                                <div>
                                    <p className={styles.processFormBadge}>Xu ly xe moi</p>
                                    <h4>{processFormDetection.formatted_text || processFormDetection.plate_text}</h4>
                                    <span>Bo sung thong tin truoc khi cho phep vao ben trong</span>
                                </div>
                                <button type="button" className={styles.processFormClose} onClick={closeProcessForm}>
                                    x
                                </button>
                            </div>

                            <div className={styles.processFormGrid}>
                                <label className={styles.processFormControl}>
                                    <span>Loai xe</span>
                                    <select
                                        value={processFormData.vehicleType}
                                        onChange={(event) => handleProcessFieldChange('vehicleType', event.target.value)}
                                    >
                                        <option value="">Chon loai xe</option>
                                        <option value="car">Xe con</option>
                                        <option value="truck">Xe tai</option>
                                        <option value="guest">Xe khach</option>
                                    </select>
                                </label>

                                <label className={styles.processFormControl}>
                                    <span>Tai xe</span>
                                    <input
                                        type="text"
                                        placeholder="Ho ten"
                                        value={processFormData.driverName}
                                        onChange={(event) => handleProcessFieldChange('driverName', event.target.value)}
                                    />
                                </label>

                                <label className={styles.processFormControl}>
                                    <span>Lien he</span>
                                    <input
                                        type="text"
                                        placeholder="So dien thoai"
                                        value={processFormData.phoneNumber}
                                        onChange={(event) => handleProcessFieldChange('phoneNumber', event.target.value)}
                                    />
                                </label>

                                <label className={`${styles.processFormControl} ${styles.processFormControlFull}`}>
                                    <span>Ghi chu</span>
                                    <textarea
                                        placeholder="Thong tin bo sung"
                                        value={processFormData.note}
                                        onChange={(event) => handleProcessFieldChange('note', event.target.value)}
                                    />
                                </label>
                            </div>

                            <div className={styles.processFormActions}>
                                <button type="button" onClick={closeProcessForm}>Huy</button>
                                <button type="submit">Luu nhap</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
