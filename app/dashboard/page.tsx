'use client';

import { useState, useEffect } from 'react';
import { 
  Camera, 
  Car, 
  TrendingUp, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import styles from './page.module.css';
import { useAppSelector } from '@/app/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Gate {
  id: string;
  name: string;
  type: 'entry' | 'exit';
  status: 'online' | 'offline' | 'error';
  currentVehicle?: {
    plate: string;
    confidence: number;
    timestamp: string;
  };
}

interface Stats {
  vehiclesIn: number;
  vehiclesOut: number;
  totalWeight: number;
  activeGates: number;
}

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: string;
}

export default function HomePage() {
  const { user } = useAppSelector((state) => state.auth);
  const [gates, setGates] = useState<Gate[]>([
    {
      id: '1',
      name: 'Cổng 1 (Vào)',
      type: 'entry',
      status: 'online',
      currentVehicle: {
        plate: '30A-12345',
        confidence: 95,
        timestamp: new Date().toISOString(),
      },
    },
    {
      id: '2',
      name: 'Cổng 2 (Ra)',
      type: 'exit',
      status: 'online',
      currentVehicle: {
        plate: '29B-67890',
        confidence: 88,
        timestamp: new Date().toISOString(),
      },
    },
    {
      id: '3',
      name: 'Cổng 3 (Vào)',
      type: 'entry',
      status: 'online',
    },
  ]);

  const [stats] = useState<Stats>({
    vehiclesIn: 45,
    vehiclesOut: 42,
    totalWeight: 325.5,
    activeGates: 3,
  });

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'info',
      message: 'Xe 29B-67890 đến cổng 2',
      timestamp: new Date().toISOString(),
    },
    {
      id: '2',
      type: 'success',
      message: 'Operator mở barrier cổng 1',
      timestamp: new Date(Date.now() - 60000).toISOString(),
    },
    {
      id: '3',
      type: 'warning',
      message: 'Độ tin cậy OCR thấp tại cổng 2 (88%)',
      timestamp: new Date(Date.now() - 120000).toISOString(),
    },
  ]);

  const handleOpenBarrier = (gateId: string) => {
    const gate = gates.find(g => g.id === gateId);
    if (gate && gate.currentVehicle) {
      const confirmed = window.confirm(
        `Xác nhận mở barrier ${gate.name}?\nBiển số: ${gate.currentVehicle.plate}`
      );
      
      if (confirmed) {
        alert(`Đã gửi lệnh mở barrier ${gate.name}`);
        
        // Add notification
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: 'success',
          message: `Operator mở barrier ${gate.name}`,
          timestamp: new Date().toISOString(),
        };
        setNotifications([newNotification, ...notifications.slice(0, 9)]);
      }
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle size={16} />;
      case 'offline':
        return <XCircle size={16} />;
      case 'error':
        return <AlertCircle size={16} />;
      default:
        return null;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'online':
        return styles.statusOnline;
      case 'offline':
        return styles.statusOffline;
      case 'error':
        return styles.statusError;
      default:
        return '';
    }
  };

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className={styles.container}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Dashboard</h1>
            <p className={styles.pageSubtitle}>Giám sát hệ thống real-time</p>
          </div>
          <div className={styles.currentTime}>
            <Clock size={20} />
            <span>{new Date().toLocaleDateString('vi-VN')}</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ backgroundColor: '#dbeafe' }}>
              <Car size={24} color="#2563eb" />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Xe vào hôm nay</p>
              <p className={styles.statValue}>{stats.vehiclesIn}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ backgroundColor: '#dcfce7' }}>
              <Car size={24} color="#16a34a" />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Xe ra hôm nay</p>
              <p className={styles.statValue}>{stats.vehiclesOut}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ backgroundColor: '#fef3c7' }}>
              <TrendingUp size={24} color="#ca8a04" />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Tổng khối lượng (tấn)</p>
              <p className={styles.statValue}>{stats.totalWeight}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ backgroundColor: '#e0e7ff' }}>
              <CheckCircle size={24} color="#4f46e5" />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Cổng hoạt động</p>
              <p className={styles.statValue}>{stats.activeGates}/3</p>
            </div>
          </div>
        </div>

        {/* Gates Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Điều khiển Barrier</h2>
          <div className={styles.gatesGrid}>
            {gates.map((gate) => (
              <div key={gate.id} className={styles.gateCard}>
                <div className={styles.gateHeader}>
                  <h3 className={styles.gateName}>{gate.name}</h3>
                  <div className={`${styles.gateStatus} ${getStatusClass(gate.status)}`}>
                    {getStatusIcon(gate.status)}
                    <span>{gate.status === 'online' ? 'Hoạt động' : 'Offline'}</span>
                  </div>
                </div>

                <div className={styles.gateCamera}>
                  <Camera size={48} />
                  <p>Live Camera</p>
                </div>

                {gate.currentVehicle ? (
                  <div className={styles.vehicleInfo}>
                    <div className={styles.vehicleInfoRow}>
                      <span className={styles.vehicleLabel}>Biển số:</span>
                      <span className={styles.vehiclePlate}>{gate.currentVehicle.plate}</span>
                    </div>
                    <div className={styles.vehicleInfoRow}>
                      <span className={styles.vehicleLabel}>Độ tin cậy:</span>
                      <span className={styles.vehicleConfidence}>
                        {gate.currentVehicle.confidence}%
                      </span>
                    </div>
                    <div className={styles.vehicleInfoRow}>
                      <span className={styles.vehicleLabel}>Thời gian:</span>
                      <span>{formatTime(gate.currentVehicle.timestamp)}</span>
                    </div>
                  </div>
                ) : (
                  <div className={styles.noVehicle}>
                    <p>Không có xe</p>
                  </div>
                )}

                <button
                  className={styles.openButton}
                  onClick={() => handleOpenBarrier(gate.id)}
                  disabled={!gate.currentVehicle || gate.status !== 'online'}
                >
                  Mở Barrier
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Thông báo gần đây</h2>
          <div className={styles.notificationsList}>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`${styles.notificationItem} ${styles[`notification${notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}`]}`}
              >
                <div className={styles.notificationContent}>
                  <p className={styles.notificationMessage}>{notification.message}</p>
                  <p className={styles.notificationTime}>{formatTime(notification.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </ProtectedRoute>
    
  );
}