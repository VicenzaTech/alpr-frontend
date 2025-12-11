'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppSelector } from '@/app/hooks/useAuth';

export default function ProtectedRoute({
    children,
    requiredRole,
}: {
    children: React.ReactNode;
    requiredRole?: string;
}) {
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);
    const router = useRouter();
    return <>{children}</>;
}