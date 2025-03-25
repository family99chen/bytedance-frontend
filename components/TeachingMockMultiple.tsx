'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';  // 替换 next/navigation
import ChatBox from './chatbox';


var flag = 0;
let globalChatHistory: Array<{ role: string; content: string; }> = [];
let globalDialogueCount = 0;  // 添加全局对话计数
let isPause = false;  // 添加暂停状态全局变量
let breakPoint: 'teacher' | 'student' | null = null;  // 添加断点全局变量

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

// 模拟对话内容
const dialogues = {
  strict: {
    teacher: [
      "请保持安静，认真听讲。",
      "这个问题很重要，都记下来。",
      "谁能回答这个问题？",
    ],
    student: [
      "我明白了，我会认真回答。",
      "我会尽力回答。",
      "这个问题很重要，我会记住。",
    ]
  },
  encouraging: {
    teacher: [
      "很好的观点，继续说下去！",
      "不要怕错，大胆尝试。",
      "这个想法非常有创意！",
    ],
    student: [
      "我明白了，我会认真回答。",
      "我会尽力回答。",
      "这个问题很重要，我会记住。",
    ]
  },
  humorous: {
    teacher: [
      "今天我们来点有趣的！",
      "这个问题就像昨天的晚餐一样有意思...",
      "谁想来分享个有趣的观点？",
    ],
    student: [
      "我明白了，我会认真回答。",
      "我会尽力回答。",
      "这个问题很重要，我会记住。",
    ]
  },
  socratic: {
    teacher: [
      "这个现象背后的原因是什么呢？",
      "我们能从哪些角度来思考这个问题？",
      "如果换个场景，会有什么不同吗？",
    ],
    student: [
      "我明白了，我会认真回答。",
      "我会尽力回答。",
      "这个问题很重要，我会记住。",
    ]
  }
};


const TeachingMock = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isClassStarted, setIsClassStarted] = useState(true);
  const [selectedTeachingStyle, setSelectedTeachingStyle] = useState('encouraging');
  const [selectedStudents, setSelectedStudents] = useState(['active', 'thoughtful', 'shy']);
  const [messages, setMessages] = useState<Array<{
    sender: 'teacher' | 'student1' | 'student2' | 'student3' | 'student4';
    content: string;
  }>>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [dialogueCount, setDialogueCount] = useState(0);
  const maxDialogues = 20;
  // 添加老师思考状态
  const [isTeacherThinking, setIsTeacherThinking] = useState(false);
  const [isStudentThinking, setIsStudentThinking] = useState(false);

  // 添加课程时间相关状态
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timeIntervalId, setTimeIntervalId] = useState<NodeJS.Timeout | null>(null);

  // 添加时间格式化函数
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndClass = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    if (timeIntervalId) {
      clearInterval(timeIntervalId);
      setTimeIntervalId(null);
    }
    setIsClassStarted(false);
    setMessages([]);
    setProgress(0);
    setDialogueCount(0);
    setElapsedTime(0);
    navigate('/');
  };

  const handleStartClass = () => {
    if (intervalId) return;
    setElapsedTime(0);
    setMessages([]); 
    setDialogueCount(0);
    setProgress(0);
    globalChatHistory = []; 
    globalDialogueCount = 0;  // 重置全局对话计数
    
    // 立即设置一个临时的intervalId来更新按钮状态
    setIntervalId(setTimeout(() => {}, 0));
    
    // 创建课程时间计时器（只在课程开始时创建一次）
    if (!timeIntervalId) {
      const newTimeIntervalId = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      setTimeIntervalId(null);
    }
  
    // 开始第一轮对话
    startConversation();
  };

  // 修改 startConversation 函数中的结束逻辑
  const startConversation = async () => {
    try {
      // 使用全局历史记录
      if (globalChatHistory.length === 0) {
        globalChatHistory.push({
          role: 'system',
          content: `这是一节${teachingStyles.find(style => style.id === selectedTeachingStyle)?.name}风格的课程开始，请以老师的身份开始上课。`
        });
      }
  
      // 老师发言前检查断点
      if (breakPoint !== 'student') {
        setIsTeacherThinking(true);
        const teacherResponse = await fetch('http://localhost:8000/api/chat-stream', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            history: globalChatHistory,  // 使用全局历史记录
            role: "老师",
            student_type: null
          })
        });
  
        if (!teacherResponse.ok) throw new Error('Teacher API request failed');
  
        const teacherReader = teacherResponse.body?.getReader();
        let teacherMessage = '';
  
        if (teacherReader) {
          while (true) {
            const { done, value } = await teacherReader.read();
            if (done) break;
  
            const chunk = new TextDecoder().decode(value);
            if (chunk) {
              teacherMessage += chunk;
              setMessages(prev => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage?.sender === 'teacher') {
                  return [...prev.slice(0, -1), {
                    sender: 'teacher',
                    content: teacherMessage
                  }];
                } else {
                  return [...prev, {
                    sender: 'teacher',
                    content: teacherMessage
                  }];
                }
              });
            }
          }
        }
        setIsTeacherThinking(false);
        globalChatHistory.push({
          role: 'assistant',
          content: teacherMessage
        });
  
        console.log('学生发言前的历史记录:', globalChatHistory);
        
        // 学生回应
        setIsStudentThinking(true);
        const studentResponse = await fetch('http://localhost:8000/api/chat-stream', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            history: globalChatHistory,
            role: "学生",
            student_type: selectedStudents[0]
          })
        });
  
        if (!studentResponse.ok) throw new Error('Student API request failed');
  
        const studentReader = studentResponse.body?.getReader();
        let studentMessage = '';
  
        if (studentReader) {
          while (true) {
            const { done, value } = await studentReader.read();
            if (done) break;
  
            const chunk = new TextDecoder().decode(value);
            if (chunk) {
              studentMessage += chunk;
              setMessages(prev => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage?.sender === 'student1') {
                  return [...prev.slice(0, -1), {
                    sender: 'student1',
                    content: studentMessage
                  }];
                } else {
                  return [...prev, {
                    sender: 'student1',
                    content: studentMessage
                  }];
                }
              });
            }
          }
        }
        setIsStudentThinking(false);
        globalChatHistory.push({
          role: 'user',
          content: studentMessage
        });
  
        // 更新最终的消息状态，确保包含完整的对话历史
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage?.sender === 'student1' && lastMessage.content === studentMessage) {
            return prev;
          }
          return [...prev, {
            sender: 'student1',
            content: studentMessage
          }];
        });
  
        // 更新对话计数和进度
        globalDialogueCount += 1;
        setDialogueCount(globalDialogueCount);
        setProgress((globalDialogueCount / maxDialogues) * 100);
        
        // 检查是否需要结束课程
        if (globalDialogueCount >= maxDialogues) {
          if (timeIntervalId) {
            clearInterval(timeIntervalId);
            setTimeIntervalId(null);
          }
          if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
          }
          setIsClassStarted(false);
          return;
        }
        
        // 继续下一轮对话
        const nextDialogueTimeout = setTimeout(() => {
          startConversation();
        }, 1000);
        setIntervalId(nextDialogueTimeout);
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  // 修改 handlePauseResume 函数
  const handlePauseResume = () => {
    if (isPaused) {
      // 继续对话
      isPause = false;  // 使用全局变量
      breakPoint = null;  // 使用全局变量
      startConversation();
    } else {
      // 暂停对话
      isPause = true;  // 使用全局变量
      // 只清理对话计时器，不清理课程时间计时器
      if (intervalId) {
        clearTimeout(intervalId);
        setIntervalId(null);
      }
    }
    setIsPaused(!isPaused);
  };

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
      if (timeIntervalId) clearInterval(timeIntervalId);
    };
  }, [intervalId, timeIntervalId]);

  // 修改进度条组件
  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#0D1117]">
      {/* 背景效果保持不变 */}
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
        
        {/* 动态网格 */}
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

        {/* 装饰元素 */}
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

      {/* 主内容 */}
      <div className="relative z-10 w-full min-h-screen flex flex-col p-8">
        {/* 顶部导航栏 */}
        <motion.div 
          className="w-full flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-medium text-white">
              {teachingStyles.find(style => style.id === selectedTeachingStyle)?.name} 教学
            </h2>
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-sm">
              进行中
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white/60">课程时长: {formatTime(elapsedTime)}</span>
            <motion.button
              onClick={handleEndClass}
              className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              结束课程
            </motion.button>
          </div>
        </motion.div>

        {/* 课堂主体 */}
        <div className="flex-1 grid grid-cols-3 gap-8">
          {/* 左侧教师区域 */}
          <motion.div
            className="col-span-1 backdrop-blur-xl bg-[#1C2128]/30 rounded-3xl border border-cyan-500/10 p-6 flex flex-col"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-2xl mb-6">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=teacher"
                alt="Teacher Avatar"
                className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 p-0.5"
              />
              <div>
                <h3 className="text-lg font-semibold text-white">AI 教师</h3>
                <p className="text-cyan-400/70 text-sm">专业辅导老师</p>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="p-4 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-2xl">
                <h4 className="text-white/80 text-sm mb-2">当前教学目标</h4>
                <p className="text-white font-medium">提高学生的口语表达能力和思维逻辑</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-2xl">
                <h4 className="text-white/80 text-sm mb-2">教学进度 ({Math.min(globalDialogueCount, maxDialogues)}/{maxDialogues})</h4>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    initial={{ width: "0%" }}
                    animate={{ width: `${(globalDialogueCount / maxDialogues) * 100}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
              <motion.button
                onClick={handleStartClass}
                className={`w-full px-4 py-3 rounded-lg font-medium relative overflow-hidden group ${
                  intervalId || dialogueCount >= maxDialogues
                    ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/20'
                }`}
                whileHover={!intervalId && dialogueCount < maxDialogues ? { scale: 1.02 } : {}}
                whileTap={!intervalId && dialogueCount < maxDialogues ? { scale: 0.98 } : {}}
                disabled={!!intervalId || dialogueCount >= maxDialogues}
              >
                <motion.span
                  className={`absolute inset-0 ${!intervalId && dialogueCount < maxDialogues ? 'bg-gradient-to-r from-cyan-400/20 to-blue-400/20' : ''}`}
                  animate={!intervalId && dialogueCount < maxDialogues ? {
                    x: ['-100%', '100%'],
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {intervalId ? (
                    <>
                      <span className="text-gray-400">课堂进行中</span>
                      <span className="text-gray-500">•••</span>
                    </>
                  ) : dialogueCount >= maxDialogues ? (
                    <>
                      <span>课堂结束</span>
                      <span className="text-xl">←</span>
                    </>
                  ) : (
                    <>
                      <span>开始课堂</span>
                      <span className="text-xl">→</span>
                    </>
                  )}
                </span>
              </motion.button>
            </div>
          </motion.div>

          {/* 中间互动区域 */}
          <motion.div
            className="col-span-2 backdrop-blur-xl bg-[#1C2128]/30 rounded-3xl border border-cyan-500/10 p-6 flex flex-col"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ChatBox messages={messages} />

            {/* 工具栏 */}
            <div className="flex items-center justify-between px-4 py-3 bg-white/5 rounded-xl">
              <div className="flex space-x-2">
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <span className="text-white/60">📝</span>
                </button>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <span className="text-white/60">🎨</span>
                </button>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <span className="text-white/60">📊</span>
                </button>
              </div>
              {/* 注释掉暂停对话按钮 */}
              {/* <button 
                onClick={handlePauseResume}
                className={`px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-white font-medium ${
                  (!isClassStarted || dialogueCount >= maxDialogues) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={!isClassStarted || dialogueCount >= maxDialogues}
              >
                {isPaused ? '继续对话' : '暂停对话'}
              </button> */}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TeachingMock;
