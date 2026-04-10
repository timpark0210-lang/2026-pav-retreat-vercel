"use client";

import React, { useState, useTransition } from "react";
import { PenLine, X, Lock, Send, User } from "lucide-react";
import { addNoticeAction } from "@/app/actions/notice";

export default function NoticeWriteButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"auth" | "write">("auth");
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
  });

  const handleOpen = () => {
    setIsOpen(true);
    setStep("auth");
    setPassword("");
    setError("");
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "pav2026") {
      setStep("write");
      setError("");
    } else {
      setError("비밀번호가 올바르지 않습니다.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      const result = await addNoticeAction({
        ...formData,
        password,
      });

      if (result.success) {
        setIsOpen(false);
        setFormData({ title: "", content: "", author: "" });
        // 목록 새로고침은 Server Action의 revalidatePath에서 처리됨
      } else {
        setError(result.error || "등록 중 오류가 발생했습니다.");
      }
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={handleOpen}
        className="fixed bottom-10 right-10 z-40 bg-primary text-white p-6 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center gap-3 group animate-bounce-subtle"
      >
        <PenLine size={24} className="group-hover:rotate-12 transition-transform" />
        <span className="font-bold text-lg hidden md:block">글쓰기</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
        >
          <X size={24} />
        </button>

        {step === "auth" ? (
          <div className="p-10 space-y-8">
            <div className="space-y-2">
              <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-4">
                <Lock size={32} />
              </div>
              <h2 className="text-3xl font-black tracking-tight">ADMIN ACCESS</h2>
              <p className="text-slate-400 font-bold text-sm">관리자 확인을 위해 비밀번호를 입력해 주세요.</p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  autoFocus
                  className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
                {error && <p className="text-red-500 text-xs font-bold pl-2">{error}</p>}
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                확인
              </button>
            </form>
          </div>
        ) : (
          <div className="p-10 space-y-8 max-h-[90vh] overflow-y-auto">
            <div className="space-y-2">
              <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-4">
                <PenLine size={32} />
              </div>
              <h2 className="text-3xl font-black tracking-tight">NEW NOTICE</h2>
              <p className="text-slate-400 font-bold text-sm">수련회 공지사항을 등록합니다.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Title</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="공지 제목을 입력하세요"
                    className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl font-black text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Author</label>
                  <div className="relative">
                    <User size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="운영팀"
                      className="w-full bg-slate-50 border-none pl-14 pr-6 py-4 rounded-2xl font-bold text-slate-600 focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Content</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="내용을 상세히 적어주세요..."
                    className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl font-bold text-slate-600 focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-xs font-bold pl-2">{error}</p>}

              <button
                disabled={isPending}
                type="submit"
                className="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
              >
                {isPending ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={20} />
                    등록하기
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
      
      <style jsx global>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
