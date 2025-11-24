import React from 'react';
import { AlertTriangle, X, Clock, MessageSquare } from 'lucide-react';

const IncidentModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      type: formData.get('type'),
      description: formData.get('description'),
      severity: formData.get('severity')
    };
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header Modal */}
        <div className="bg-orange-500 p-4 flex justify-between items-center text-white">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <AlertTriangle size={24} /> Báo cáo sự cố
          </h3>
          <button onClick={onClose} className="hover:bg-orange-600 p-1 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>
        
        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loại sự cố</label>
            <select name="type" required className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 outline-none">
              <option value="">-- Chọn loại sự cố --</option>
              <option value="tac_duong">Tắc đường / Kẹt xe</option>
              <option value="hong_xe">Hỏng xe / Sự cố kỹ thuật</option>
              <option value="tai_nan">Va chạm / Tai nạn</option>
              <option value="suc_khoe">Vấn đề sức khỏe học sinh</option>
              <option value="thoi_tiet">Thời tiết xấu</option>
              <option value="khac">Khác</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mức độ nghiêm trọng</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="severity" value="low" defaultChecked className="text-orange-600 focus:ring-orange-500" />
                <span className="text-gray-600">Thấp</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="severity" value="medium" className="text-orange-600 focus:ring-orange-500" />
                <span className="text-gray-600">Trung bình</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="severity" value="high" className="text-red-600 focus:ring-red-500" />
                <span className="text-red-600 font-medium">Cao</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
            <textarea 
              name="description" 
              rows="4" 
              required
              placeholder="Mô tả chi tiết tình huống, vị trí hiện tại..."
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 outline-none"
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
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
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