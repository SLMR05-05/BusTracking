import React from 'react';
import { AlertTriangle, X, Clock, MessageSquare } from 'lucide-react';

const IncidentModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      description: formData.get('description')
    };
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header Modal */}
        <div className="bg-gray-800 p-4 flex justify-between items-center text-white">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <AlertTriangle size={24} /> Báo cáo sự cố
          </h3>
          <button onClick={onClose} className="hover:bg-gray-700 p-1 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>
        
        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung sự cố</label>
            <textarea 
              name="description" 
              rows="6" 
              required
              placeholder="Mô tả chi tiết sự cố đang gặp phải..."
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-400 outline-none"
            ></textarea>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
            >
              Hủy bỏ
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? <Clock className="animate-spin" size={18} /> : <MessageSquare size={18} />}
              Gửi báo cáo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IncidentModal;