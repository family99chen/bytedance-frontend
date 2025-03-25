'use client';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CoverPage from '@/components/CoverPage';
import TeachingMock from '@/components/TeachingMock';
import TeachingMockMultiple from '@/components/TeachingMockMultiple';  // 添加导入

export default function App() {
  return (
    <Router>
      <div className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<CoverPage />} />
          <Route path="/teaching" element={<TeachingMock />} />
          <Route path="/teaching-multiple" element={<TeachingMockMultiple />} />  {/* 添加多人教学路由 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}