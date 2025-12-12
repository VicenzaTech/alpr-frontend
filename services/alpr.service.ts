import axiosInstance from "@/libs/axios";

export interface Detection {
    id: number;
    plate_text: string;
    formatted_text: string;
    confidence: number;
    detection_confidence: number;
    bbox: { x1: number; y1: number; x2: number; y2: number };
    camera_id: string;
    sensor_id: string;
    timestamp: string;
    status: 'pending_approval' | 'approved' | 'rejected';
    full_image_url: string;
    cropped_image_url: string;
    image_path: string;
    metadata: any;
    createdAt: string;
    updatedAt: string;
}

export interface DetectionResponse {
    data: Detection[];
    total: number;
    page: number;
    limit: number;
}

const ALPR_BASE_URL = '/api/alpr';

export const alprService = {
    // Lấy danh sách detections
    getDetections: async (page: number = 1, limit: number = 6): Promise<DetectionResponse> => {
        const response = await axiosInstance.get<DetectionResponse>(
            `${ALPR_BASE_URL}/detections`,
            {
                params: { page, limit },
            }
        );

        return response;
    },

    // Lấy chi tiết detection
    getDetectionById: async (id: number): Promise<Detection> => {
        const response = await axiosInstance.get<Detection>(
            `${ALPR_BASE_URL}/detections/${id}`
        );
        return response;
    },

    // Phê duyệt detection
    approveDetection: async (id: number): Promise<Detection> => {
        const response = await axiosInstance.patch<Detection>(
            `${ALPR_BASE_URL}/detections/${id}/approve`
        );
        return response;
    },

    // Từ chối detection
    rejectDetection: async (id: number): Promise<Detection> => {
        const response = await axiosInstance.patch<Detection>(
            `${ALPR_BASE_URL}/detections/${id}/reject`
        );
        return response;
    },
};

export default alprService;