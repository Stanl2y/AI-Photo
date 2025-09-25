
import React from 'react';
import PhotoStudio from './components/PhotoStudio';
import { CameraIcon } from './components/icons';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-6xl text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-2">
          <CameraIcon className="w-8 h-8 text-slate-700" />
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
            AI 만화 증명사진 생성기
          </h1>
        </div>
        <p className="text-slate-600">
          원하는 캐릭터를 텍스트로 입력하면 AI가 만화 스타일 증명사진으로 만들어 드립니다.
        </p>
      </header>
      <main className="w-full flex-grow">
        <PhotoStudio />
      </main>
      <footer className="w-full max-w-6xl text-center mt-8 text-sm text-slate-500">
        <p>&copy; 2024 AI ID Photo Pro. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default App;
