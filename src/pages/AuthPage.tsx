import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, User, Lock, LogIn, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useLearningStore } from '@/stores/useLearningStore';
import { usePetStore } from '@/stores/usePetStore';
import { useChildStore } from '@/stores/useChildStore';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const login = useAuthStore((s) => s.login);
  const signup = useAuthStore((s) => s.signup);
  const hasAccount = useAuthStore((s) => s.hasAccount);
  const loadLearningData = useLearningStore((s) => s.loadUserData);
  const loadPetData = usePetStore((s) => s.loadUserData);
  const loadChildData = useChildStore((s) => s.loadUserData);

  const handleSubmit = () => {
    setError('');
    setSuccess('');

    if (!username.trim()) {
      setError('请输入用户名');
      return;
    }

    if (!password) {
      setError('请输入密码');
      return;
    }

    if (mode === 'signup') {
      if (password.length < 4) {
        setError('密码至少需要4位');
        return;
      }
      if (password !== confirmPassword) {
        setError('两次密码不一致');
        return;
      }
      if (hasAccount(username)) {
        setError('该用户名已被注册');
        return;
      }
      const result = signup(username, password);
      if (result) {
        loadLearningData();
        loadPetData();
        loadChildData();
        setSuccess('注册成功！正在进入...');
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        setError('注册失败，请重试');
      }
    } else {
      const result = login(username, password);
      if (result) {
        loadLearningData();
        loadPetData();
        loadChildData();
        setSuccess('登录成功！正在进入...');
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        setError('用户名或密码错误');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F4FF] via-[#E0F2FE] to-[#FCE7F3] flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            🎈
          </motion.div>
          <h1 className="text-3xl font-extrabold text-[#1A1A2E] mb-2">
            {mode === 'login' ? '欢迎回来！' : '加入我们'}
          </h1>
          <p className="text-[#6B7280]">
            {mode === 'login' ? '登录账号继续学习' : '创建账号开启英语之旅'}
          </p>
        </div>

        <div className="space-y-5">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]">
              <User size={20} />
            </div>
            <input
              type="text"
              placeholder="用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-[#E5E7EB] focus:border-[#7C5CFC] focus:outline-none transition-all text-lg"
            />
          </div>

          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]">
              <Lock size={20} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-[#E5E7EB] focus:border-[#7C5CFC] focus:outline-none transition-all text-lg"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#7C5CFC]"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {mode === 'signup' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="确认密码"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-[#E5E7EB] focus:border-[#7C5CFC] focus:outline-none transition-all text-lg"
              />
            </motion.div>
          )}

          {error && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-red-500 font-semibold"
            >
              ❌ {error}
            </motion.p>
          )}

          {success && (
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center text-green-500 font-semibold text-lg"
            >
              ✅ {success}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#7C5CFC] to-[#FF6B9D] text-white font-bold text-lg shadow-lg flex items-center justify-center gap-2"
          >
            {mode === 'login' ? (
              <>
                <LogIn size={22} />
                登录
              </>
            ) : (
              <>
                <ArrowRight size={22} />
                注册
              </>
            )}
          </motion.button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setError('');
              setSuccess('');
              setPassword('');
              setConfirmPassword('');
            }}
            className="text-[#7C5CFC] font-semibold hover:underline"
          >
            {mode === 'login' ? '还没有账号？去注册' : '已有账号？去登录'}
          </button>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          {['🐰', '🐱', '🐶', '🦊', '🐻'].map((emoji, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2 + i * 0.3, repeat: Infinity }}
              className="text-2xl"
            >
              {emoji}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
