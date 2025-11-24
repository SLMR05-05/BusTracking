import React from 'react';
import { AlertOctagon } from 'lucide-react';

const EmergencyModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-red-900/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border-t-8 border-red-600">
        <div className="p-6 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <AlertOctagon size={48} className="text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">CẢNH BÁO KHẨN CẤP!</h3>
          <p className="text-gray-600 mb-6">
            Bạn sắp gửi tín hiệu SOS đến quản lý và phụ huynh. <br/>
            Chỉ sử dụng trong trường hợp cực kỳ khẩn cấp (Tai nạn nghiêm trọng, đe dọa an ninh...).
          </p>
          
          <div className="space-y-3">
            <button 
              onClick={onConfirm}
              disabled={isLoading}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-lg shadow-lg transform transition hover:scale-[1.02] active:scale-95 flex justify-center items-center gap-2"
            >
              {isLoading ? 'Đang gửi...' : 'XÁC NHẬN GỬI SOS'}
            </button>
            <button 
              onClick={onClose}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium"
            >
              Hủy bỏ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyModal;