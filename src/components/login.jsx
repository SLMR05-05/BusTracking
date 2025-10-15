import React from "react";

export function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 text-gray-800">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="text-blue-600 text-3xl">🚌</div>
          <h1 className="text-lg font-semibold text-gray-800">SSB 1.0</h1>
        </div>
        <p className="text-sm text-blue-600 font-medium">
          Smart School Bus Tracking System
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Hệ thống quản lý xe buýt đưa đón học sinh
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-white w-[380px] rounded-2xl shadow-md p-6 border border-gray-200">
        <h2 className="text-center font-semibold mb-6 text-gray-700">
          Đăng nhập hệ thống
        </h2>

        {/* Tabs */}
        <div className="flex justify-between mb-4 text-sm bg-gray-100 rounded-full p-1">
          <button className="flex-1 py-2 bg-white rounded-full font-medium shadow-sm">
            Đăng nhập 
          </button>
          <button className="flex-1 py-2 text-gray-500">Đăng kí</button>
        </div>

        {/* Form */}
        <form className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Tên đăng nhập
            </label>
            <input
              type="text"
              placeholder="Nhập tên đăng nhập"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-black text-white py-2 rounded-lg hover:bg-gray-800 flex items-center justify-center gap-2"
          >
            <span>⇨</span> Đăng nhập
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-3">
          Quên mật khẩu?{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Khôi phục tài khoản
          </a>
        </p>
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-400 mt-6">
        © 2025 Truong DCEF - SSB 1.0 System
      </p>
    </div>
  );
}
