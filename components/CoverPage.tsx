'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 定义教学风格
const teachingStyles = [
  { id: 'strict', name: '严厉型', description: '注重纪律，要求严格' },
  { id: 'encouraging', name: '鼓励型', description: '积极正向，善于表扬' },
  { id: 'humorous', name: '幽默型', description: '轻松活泼，善于调节' },
  { id: 'socratic', name: '苏格拉底式', description: '启发引导，善于提问' },
];

// 定义学生性格
const studentPersonalities = [
  { id: 'active', name: '活跃型', description: '积极参与，乐于表达' },
  { id: 'thoughtful', name: '思考型', description: '深入思考，回答深刻' },
  { id: 'shy', name: '内向型', description: '安静专注，需要鼓励' },
  { id: 'creative', name: '创造型', description: '思维发散，富有创意' },
];

const CoverPage = () => {
  const navigate = useNavigate();
  const [selectedTeachingStyle, setSelectedTeachingStyle] = useState('encouraging');
  const [selectedStudents, setSelectedStudents] = useState(['active', 'thoughtful', 'shy']);
  const [teachingMode, setTeachingMode] = useState<'1v1' | '1vn'>('1v1');

  const handleStartClass = () => {
    const queryParams = new URLSearchParams({
      style: selectedTeachingStyle,
      students: selectedStudents.join(','),
    });
    
    // 根据模式选择不同的路由
    console.log(teachingMode)
    const route = teachingMode === '1v1' ? '/teaching' : '/teaching-multiple';
    navigate(`${route}?${queryParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#0D1117] overflow-y-auto">
      {/* 动态背景 - 增强版 */}
      <div className="fixed inset-0">
        {/* 主背景渐变 */}
        <motion.div 
          className="absolute inset-0 bg-gradient-radial from-[#1C2128] via-[#0D1117] to-[#0D1117]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)']
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* 动态网格 - 增加动画 */}
        <motion.div 
          className="absolute inset-0"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(56, 189, 248, 0.1) 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}
        />

        {/* 多层渐变光晕 */}
        <motion.div
          className="absolute top-0 -left-1/2 w-[200%] h-[200%] bg-gradient-conic from-blue-500/10 via-cyan-500/10 to-blue-500/10"
          animate={{ rotate: 360 }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* 额外的装饰元素 */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-500/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0.5, 1.5, 0.5],
              opacity: [0.3, 0.7, 0.3],
              y: [0, 30, 0]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* 主内容容器 */}
      <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center p-8">
        {/* 标题区域 - 增强效果 */}
        <motion.div 
          className="text-center mb-16 relative"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="absolute -inset-10 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <h1 className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 [text-shadow:0_0_30px_rgba(56,189,248,0.2)]">
            AI 模拟课堂
          </h1>
          <motion.p 
            className="mt-4 text-xl text-cyan-300/70"
            animate={{
              textShadow: [
                "0 0 8px rgba(56,189,248,0.3)",
                "0 0 16px rgba(56,189,248,0.5)",
                "0 0 8px rgba(56,189,248,0.3)"
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            探索未来教育的无限可能
          </motion.p>
          
          {/* 添加副标题 */}
          <motion.div
            className="mt-6 flex gap-4 justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {["智能交互", "个性化教学", "实时反馈"].map((text, index) => (
              <div
                key={index}
                className="px-4 py-2 rounded-full bg-white/5 border border-cyan-500/20 text-cyan-300/80 text-sm"
              >
                {text}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* 设置面板 */}
        <motion.div
          className="w-full max-w-4xl backdrop-blur-2xl bg-[#1C2128]/30 rounded-3xl border border-cyan-500/10 p-8 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            boxShadow: `
              0 0 50px rgba(56,189,248,0.1),
              inset 0 0 30px rgba(56,189,248,0.05)
            `
          }}
        >
          {/* 教学模式选择 */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-cyan-300 mb-6">选择教学模式</h3>
            <div className="grid grid-cols-2 gap-6">
              <motion.button
                className={`
                  relative p-6 rounded-2xl border transition-all duration-300
                  ${teachingMode === '1v1'
                    ? 'bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-purple-500/20 border-cyan-500/30'
                    : 'bg-[#1C2128]/50 hover:bg-[#1C2128]/70 border-white/5'
                  }
                `}
                style={{
                  boxShadow: teachingMode === '1v1'
                    ? '0 0 20px rgba(56,189,248,0.2), inset 0 0 20px rgba(56,189,248,0.1)'
                    : 'inset 0 2px 4px rgba(255,255,255,0.05)'
                }}
                onClick={() => setTeachingMode('1v1')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col items-center">
                  <div className="text-4xl mb-4">👨‍🏫</div>
                  <h4 className="text-lg font-bold text-white mb-2">一对一教学</h4>
                  <p className="text-sm text-cyan-300/70">专注个性化辅导，深入交流互动</p>
                </div>
              </motion.button>

              <motion.button
                className={`
                  relative p-6 rounded-2xl border transition-all duration-300
                  ${teachingMode === '1vn'
                    ? 'bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-purple-500/20 border-cyan-500/30'
                    : 'bg-[#1C2128]/50 hover:bg-[#1C2128]/70 border-white/5'
                  }
                `}
                style={{
                  boxShadow: teachingMode === '1vn'
                    ? '0 0 20px rgba(56,189,248,0.2), inset 0 0 20px rgba(56,189,248,0.1)'
                    : 'inset 0 2px 4px rgba(255,255,255,0.05)'
                }}
                onClick={() => setTeachingMode('1vn')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col items-center">
                  <div className="text-4xl mb-4">👨‍🏫👥</div>
                  <h4 className="text-lg font-bold text-white mb-2">小组教学</h4>
                  <p className="text-sm text-cyan-300/70">促进群体互动，培养协作能力</p>
                </div>
              </motion.button>
            </div>
          </div>

          {/* 教学风格选择 */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-cyan-300 mb-6">选择教学风格</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {teachingStyles.map((style, index) => (
                <motion.button
                  key={style.id}
                  className={`
                    relative p-4 rounded-2xl border transition-all duration-300
                    ${selectedTeachingStyle === style.id
                      ? 'bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-purple-500/20 border-cyan-500/30'
                      : 'bg-[#1C2128]/50 hover:bg-[#1C2128]/70 border-white/5'
                    }
                  `}
                  style={{
                    boxShadow: selectedTeachingStyle === style.id
                      ? '0 0 20px rgba(56,189,248,0.2), inset 0 0 20px rgba(56,189,248,0.1)'
                      : 'inset 0 2px 4px rgba(255,255,255,0.05)'
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedTeachingStyle(style.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <h4 className="text-lg font-bold text-white mb-2">{style.name}</h4>
                  <p className="text-sm text-cyan-300/70">{style.description}</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* 学生性格选择 */}
          <div>
            <h3 className="text-xl font-bold text-cyan-300 mb-6">
              选择学生性格 {teachingMode === '1v1' && '(单选)'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {studentPersonalities.map((personality, index) => (
                <motion.button
                  key={personality.id}
                  className={`
                    relative p-4 rounded-2xl border transition-all duration-300
                    ${(teachingMode === '1v1' ? selectedStudents[0] === personality.id : selectedStudents.includes(personality.id))
                      ? 'bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-blue-500/20 border-purple-500/30'
                      : 'bg-[#1C2128]/50 hover:bg-[#1C2128]/70 border-white/5'
                    }
                  `}
                  style={{
                    boxShadow: (teachingMode === '1v1' ? selectedStudents[0] === personality.id : selectedStudents.includes(personality.id))
                      ? '0 0 20px rgba(168,85,247,0.2), inset 0 0 20px rgba(168,85,247,0.1)'
                      : 'inset 0 2px 4px rgba(255,255,255,0.05)'
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    if (teachingMode === '1v1') {
                      setSelectedStudents([personality.id]);
                    } else {
                      setSelectedStudents(prev =>
                        prev.includes(personality.id)
                          ? prev.filter(id => id !== personality.id)
                          : [...prev, personality.id]
                      );
                    }
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <h4 className="text-lg font-bold text-white mb-2">{personality.name}</h4>
                  <p className="text-sm text-purple-300/70">{personality.description}</p>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 开始按钮 */}
        <motion.button
          onClick={handleStartClass}
          className="relative group px-16 py-4 rounded-2xl overflow-hidden transform hover:scale-105 transition-transform"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* 按钮背景 */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500" />
          
          {/* 发光效果 */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/50 to-blue-400/50 blur-md" />
          </div>
          
          {/* 按钮文字 */}
          <div className="relative z-10 flex items-center justify-center space-x-2">
            <span className="text-xl font-bold text-white tracking-wider">开始课程</span>
            <motion.svg 
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              animate={{ x: [0, 5, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <path 
                d="M5 12H19M19 12L12 5M19 12L12 19" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </motion.svg>
          </div>
        </motion.button>
      </div>
    </div>
  );
};

export default CoverPage;