import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // For demo purposes, always succeed
      setIsSuccess(true);
    } catch (err) {
      setError("Có lỗi xảy ra khi gửi email. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#00083B] via-[#1a1a2e] to-[#16213e] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg mb-6">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h2 className="text-3xl font-extrabold text-white mb-4">
                Email đã được gửi!
              </h2>

              <p className="text-white/80 mb-6">
                Chúng tôi đã gửi link đặt lại mật khẩu đến email{" "}
                <span className="font-semibold text-blue-300">{email}</span>
              </p>

              <div className="space-y-4">
                <p className="text-sm text-white/60">
                  Vui lòng kiểm tra hộp thư và làm theo hướng dẫn để đặt lại mật
                  khẩu.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/login"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-3 rounded-lg font-medium text-center transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Quay lại đăng nhập
                  </Link>

                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setEmail("");
                    }}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 border border-white/20"
                  >
                    Gửi lại email
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00083B] via-[#1a1a2e] to-[#16213e] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <div>
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-600 shadow-lg">
              <svg
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              Quên mật khẩu?
            </h2>
            <p className="mt-2 text-center text-sm text-white/80">
              Nhập email của bạn để nhận link đặt lại mật khẩu
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white/90 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-white/20 bg-white/10 text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 sm:text-sm"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-400/50 text-red-200 px-4 py-3 rounded-lg backdrop-blur-sm">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang gửi email...
                  </div>
                ) : (
                  "Gửi link đặt lại mật khẩu"
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-white/80">
                Nhớ mật khẩu?{" "}
                <Link
                  to="/login"
                  className="font-medium text-orange-300 hover:text-orange-200 transition-colors"
                >
                  Đăng nhập ngay
                </Link>
              </p>
            </div>

            <div className="mt-6 p-4 bg-orange-500/20 rounded-lg border border-orange-400/30 backdrop-blur-sm">
              <p className="text-sm text-orange-200 font-semibold mb-2">
                💡 Lưu ý:
              </p>
              <ul className="text-xs text-orange-100 space-y-1">
                <li>• Kiểm tra cả hộp thư spam</li>
                <li>• Link có hiệu lực trong 24 giờ</li>
                <li>• Liên hệ hỗ trợ nếu không nhận được email</li>
              </ul>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

