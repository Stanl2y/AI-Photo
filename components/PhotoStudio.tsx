
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { generateIdPhoto, generateCartoonIdPhotoFromText } from '../services/geminiService';
import { DownloadIcon, SparklesIcon, SpinnerIcon, WandIcon } from './icons';
import { CARTOON_ID_PHOTO_PROMPT } from '../constants';

const LOADING_MESSAGES = [
  'AI가 프롬프트를 분석하고 있습니다...',
  '캐릭터의 특징을 그리는 중입니다...',
  '만화 스타일을 적용하고 있습니다...',
  '증명사진 구도를 잡고 있습니다...',
  '최종 마무리 작업을 진행합니다...',
];

const PhotoPanel: React.FC<{ title: string; children: React.ReactNode; aspectRatioClass?: string }> = ({ title, children, aspectRatioClass }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 w-full flex-1 flex flex-col items-center">
    <h2 className="text-xl font-semibold text-slate-700 mb-4">{title}</h2>
    <div className={`w-full ${aspectRatioClass || 'aspect-[3/4]'} bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden border border-slate-200`}>
      {children}
    </div>
  </div>
);

const PhotoStudio: React.FC = () => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const [sizeOption, setSizeOption] = useState<'passport' | 'square' | 'profile'>('passport');
  const [generationPrompt, setGenerationPrompt] = useState<string>('');
  const [refinementPrompt, setRefinementPrompt] = useState<string>('');

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingMessage(prev => {
          const currentIndex = LOADING_MESSAGES.indexOf(prev);
          const nextIndex = (currentIndex + 1) % LOADING_MESSAGES.length;
          return LOADING_MESSAGES[nextIndex];
        });
      }, 2500);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isLoading]);

  const handleGenerate = useCallback(async () => {
    if (!generationPrompt.trim()) {
      setError('캐릭터 설명을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setRefinementPrompt('');
    setLoadingMessage(LOADING_MESSAGES[0]);

    try {
      const getAspectRatio = (): '3:4' | '1:1' | '9:16' => {
        switch (sizeOption) {
          case 'passport':
            return '3:4';
          case 'square':
            return '1:1';
          case 'profile':
            return '9:16';
          default:
            return '3:4';
        }
      };
      
      const finalPrompt = CARTOON_ID_PHOTO_PROMPT.replace('{user_prompt}', generationPrompt.trim());
      const aspectRatio = getAspectRatio();
      
      const newImageBase64 = await generateCartoonIdPhotoFromText(finalPrompt, aspectRatio);
      setGeneratedImage(`data:image/png;base64,${newImageBase64}`);
    } catch (err) {
      console.error(err);
      setError('증명사진 생성에 실패했습니다. 프롬프트를 수정하여 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  }, [generationPrompt, sizeOption]);

  const handleRefine = useCallback(async () => {
    if (!generatedImage || !refinementPrompt.trim()) {
      setError('수정할 사진과 지시사항이 필요합니다.');
      return;
    }

    setIsRefining(true);
    setError(null);

    try {
      const base64Data = generatedImage.split(',')[1];
      const newImageBase64 = await generateIdPhoto(base64Data, 'image/png', refinementPrompt);
      setGeneratedImage(`data:image/png;base64,${newImageBase64}`);
      setRefinementPrompt('');
    } catch (err) {
      console.error(err);
      setError('사진 수정에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsRefining(false);
    }
  }, [generatedImage, refinementPrompt]);
  
  const getAspectRatioClass = () => {
    switch (sizeOption) {
      case 'passport':
        return 'aspect-[3/4]';
      case 'square':
        return 'aspect-square';
      case 'profile':
        return 'aspect-[9/16]';
      default:
        return 'aspect-[3/4]';
    }
  };

  const generatedPhotoAspectRatioClass = getAspectRatioClass();

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8">
      <div className="w-full p-6 bg-white rounded-2xl shadow-lg">
        <fieldset disabled={isLoading || isRefining}>
            <legend className="text-lg font-semibold text-slate-800 mb-4">사진 사이즈 선택</legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <input type="radio" id="passport" name="sizeOption" value="passport" checked={sizeOption === 'passport'} onChange={() => setSizeOption('passport')} className="hidden peer" />
                    <label htmlFor="passport" className="block text-center p-4 rounded-lg border-2 border-slate-200 cursor-pointer peer-checked:border-indigo-600 peer-checked:text-indigo-600 peer-checked:font-semibold transition-all">
                        여권/증명사진
                        <span className="block text-sm text-slate-500">3:4 비율</span>
                    </label>
                </div>
                <div>
                    <input type="radio" id="square" name="sizeOption" value="square" checked={sizeOption === 'square'} onChange={() => setSizeOption('square')} className="hidden peer" />
                    <label htmlFor="square" className="block text-center p-4 rounded-lg border-2 border-slate-200 cursor-pointer peer-checked:border-indigo-600 peer-checked:text-indigo-600 peer-checked:font-semibold transition-all">
                        정방형 프로필
                        <span className="block text-sm text-slate-500">1:1 비율</span>
                    </label>
                </div>
                <div>
                    <input type="radio" id="profile" name="sizeOption" value="profile" checked={sizeOption === 'profile'} onChange={() => setSizeOption('profile')} className="hidden peer" />
                    <label htmlFor="profile" className="block text-center p-4 rounded-lg border-2 border-slate-200 cursor-pointer peer-checked:border-indigo-600 peer-checked:text-indigo-600 peer-checked:font-semibold transition-all">
                        SNS 프로필
                        <span className="block text-sm text-slate-500">9:16 비율</span>
                    </label>
                </div>
            </div>
        </fieldset>
      </div>

      <div className="w-full p-6 bg-white rounded-2xl shadow-lg">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          캐릭터 설명
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          생성하고 싶은 캐릭터를 자세히 설명해주세요. (예: 원피스 스타일의 검은 머리 남자 캐릭터)
        </p>
        <textarea 
          value={generationPrompt}
          onChange={(e) => setGenerationPrompt(e.target.value)}
          placeholder="AI에게 전달할 캐릭터 설명을 입력하세요..."
          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition min-h-[120px] text-base"
          disabled={isLoading || isRefining}
        />
      </div>
      
      <button
        onClick={handleGenerate}
        disabled={!generationPrompt.trim() || isLoading || isRefining}
        className="w-full max-w-sm bg-indigo-600 text-white font-bold py-4 px-6 rounded-full hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/50 transform hover:scale-105"
      >
        {isLoading ? (
          <>
            <SpinnerIcon className="w-5 h-5" />
            <span>생성 중...</span>
          </>
        ) : (
          <>
            <SparklesIcon className="w-5 h-5" />
            <span>AI 만화 증명사진 생성</span>
          </>
        )}
      </button>

      <div className="w-full max-w-lg">
        <PhotoPanel title="AI 생성 증명사진" aspectRatioClass={generatedPhotoAspectRatioClass}>
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-slate-600 p-4 text-center">
              <SpinnerIcon className="w-12 h-12 mb-4" />
              <p className="font-semibold">{loadingMessage}</p>
            </div>
          )}
          {isRefining && (
             <div className="relative w-full h-full">
                {generatedImage && <img src={generatedImage} alt="Refining ID" className="w-full h-full object-cover filter blur-sm" />}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-75 text-slate-600 p-4 text-center">
                    <SpinnerIcon className="w-12 h-12 mb-4" />
                    <p className="font-semibold">AI가 사진을 수정하고 있습니다...</p>
                </div>
            </div>
          )}
          {error && !isLoading && !isRefining && (
            <div className="flex flex-col items-center justify-center h-full text-red-600 p-4 text-center">
              <p className="font-semibold">오류 발생</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
          {generatedImage && !isLoading && !isRefining && (
             <img src={generatedImage} alt="Generated ID" className="w-full h-full object-cover" />
          )}
           {!generatedImage && !isLoading && !isRefining && !error && (
            <div className="text-center text-slate-500 p-4 flex flex-col items-center justify-center h-full">
              <p>생성된 AI 증명사진이 여기에 표시됩니다.</p>
            </div>
          )}
        </PhotoPanel>
      </div>

      {generatedImage && !isLoading && !isRefining && (
        <a
          href={generatedImage}
          download="AI_Cartoon_ID_Photo.png"
          className="bg-green-500 text-white font-bold py-3 px-6 rounded-full hover:bg-green-600 transition-colors duration-200 flex items-center gap-2 shadow-lg hover:shadow-green-500/50"
        >
          <DownloadIcon className="w-5 h-5" />
          <span>사진 다운로드</span>
        </a>
      )}

      {generatedImage && !isLoading && !isRefining && (
        <div className="w-full p-6 bg-white rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold text-slate-800 mb-3 text-center">AI에게 추가 수정 요청하기</h3>
          <div className="flex gap-3">
            <input 
              type="text"
              value={refinementPrompt}
              onChange={(e) => setRefinementPrompt(e.target.value)}
              placeholder="예: 머리 색깔을 파란색으로 바꿔주세요."
              className="flex-grow p-3 border border-slate-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              disabled={isRefining}
            />
            <button
              onClick={handleRefine}
              disabled={isRefining || !refinementPrompt.trim()}
              className="bg-indigo-500 text-white font-bold py-3 px-6 rounded-full hover:bg-indigo-600 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              <WandIcon className="w-5 h-5" />
              <span>수정하기</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoStudio;
