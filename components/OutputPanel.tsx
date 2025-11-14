import React, { useState } from 'react';
import type { SocialContent } from '../types';
import SocialContentPanel from './SocialContentPanel';

interface OutputPanelProps {
    generatedImage: string | null;
    generatedHistory: string[];
    isLoading: boolean;
    error: string | null;
    socialContent: SocialContent | null;
    isGeneratingContent: boolean;
    showSocialContent: boolean;
    onRegenerate: () => void;
    onDownload: (imageUrl: string) => void;
    onDeleteCurrent: () => void;
    onDeleteFromHistory: (index: number) => void;
    onSelectFromHistory: (imageUrl: string) => void;
    onGenerateContent: () => void;
    onDeleteSocialContent: () => void;
}

const OutputPanel: React.FC<OutputPanelProps> = ({ 
    generatedImage, 
    generatedHistory, 
    isLoading, 
    error,
    socialContent,
    isGeneratingContent,
    showSocialContent,
    onRegenerate, 
    onDownload, 
    onDeleteCurrent,
    onDeleteFromHistory,
    onSelectFromHistory,
    onGenerateContent,
    onDeleteSocialContent
}) => {
    const [activeTab, setActiveTab] = useState('KẾT QUẢ');

    const ActionButton: React.FC<{ onClick?: () => void, children: React.ReactNode, disabled?: boolean }> = ({ onClick, children, disabled }) => (
        <button
            onClick={onClick}
            disabled={disabled}
            className="px-3 py-1.5 rounded-md transition-all text-xs sm:text-sm bg-fuchsia-700/50 hover:bg-fuchsia-700/80 text-fuchsia-200 border border-fuchsia-600/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
            {children}
        </button>
    );

    const renderResultTab = () => (
        <>
            <div className="flex-grow bg-fuchsia-800/20 rounded-lg p-4 flex items-center justify-center min-h-[400px] lg:min-h-0">
                {isLoading && (
                    <div className="text-center text-fuchsia-200">
                        <svg className="animate-spin h-10 w-10 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="font-semibold">Đang tạo ảnh của bạn...</p>
                        <p className="text-sm text-fuchsia-300/80">Quá trình này có thể mất một vài phút.</p>
                    </div>
                )}
                {error && !isLoading && (
                    <div className="text-center text-pink-300 p-4 border border-pink-500 bg-pink-900/50 rounded-lg">
                        <p className="font-bold mb-2">Lỗi!</p>
                        <p className="text-sm">{error}</p>
                    </div>
                )}
                {!isLoading && !error && generatedImage && (
                    <img src={generatedImage} alt="Generated product" className="max-h-full max-w-full object-contain rounded-md" />
                )}
                {!isLoading && !error && !generatedImage && (
                    <p className="text-fuchsia-300/70 text-center">Ảnh của bạn sẽ xuất hiện ở đây.</p>
                )}
            </div>
            {generatedImage && !isLoading && !error && (
                <div className="mt-4">
                    <div className="flex flex-wrap gap-2 justify-center mb-2">
                        <ActionButton onClick={onRegenerate}>Tạo lại</ActionButton>
                        <ActionButton onClick={onGenerateContent} disabled={isGeneratingContent}>
                            {isGeneratingContent ? (
                                <>
                                 <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                 </svg>
                                 Đang tạo...
                                </>
                            ) : "TẠO NỘI DUNG"}
                        </ActionButton>
                        <ActionButton onClick={() => onDownload(generatedImage)}>Tải xuống</ActionButton>
                        <ActionButton onClick={() => onDownload(generatedImage)}>Tải xuống (đã đổi kích thước)</ActionButton>
                    </div>
                    <div className="text-center">
                        <button onClick={onDeleteCurrent} className="text-fuchsia-300/80 hover:text-fuchsia-200 text-sm underline">Xóa</button>
                    </div>
                </div>
            )}
            {showSocialContent && socialContent && (
                <SocialContentPanel
                    content={socialContent}
                    onDelete={onDeleteSocialContent}
                />
            )}
        </>
    );

    const renderHistoryTab = () => (
        <div className="flex-grow bg-fuchsia-800/20 rounded-lg p-4 min-h-[400px] max-h-[490px] lg:max-h-full lg:min-h-0">
            {generatedHistory.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                    <p className="text-fuchsia-300/70">Chưa có ảnh nào được tạo.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 h-full overflow-y-auto pr-2">
                    {generatedHistory.map((imageSrc, index) => (
                        <div key={index} className="relative group aspect-square bg-fuchsia-900/50 rounded-md">
                            <img src={imageSrc} alt={`Generated image ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-2">
                                <button onClick={() => { onSelectFromHistory(imageSrc); setActiveTab('KẾT QUẢ'); }} className="w-full text-center bg-blue-500 text-white text-xs px-2 py-1.5 rounded hover:bg-blue-400 transition-colors font-semibold">Sử dụng lại</button>
                                <button onClick={() => onDownload(imageSrc)} className="w-full text-center bg-pink-500 text-white text-xs px-2 py-1.5 rounded hover:bg-pink-400 transition-colors font-semibold">Tải xuống</button>
                                <button onClick={() => onDeleteFromHistory(index)} className="w-full text-center bg-rose-600 text-white text-xs px-2 py-1.5 rounded hover:bg-rose-500 transition-colors font-semibold">Xóa</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between border-b-2 border-fuchsia-700/50 mb-4">
                <div className="flex space-x-4">
                    <button
                        onClick={() => setActiveTab('KẾT QUẢ')}
                        className={`py-2 px-4 font-semibold ${
                            activeTab === 'KẾT QUẢ' ? 'text-pink-400 border-b-2 border-pink-400' : 'text-fuchsia-300'
                        }`}
                    >
                        KẾT QUẢ
                    </button>
                    <button
                        onClick={() => setActiveTab('ẢNH ĐÃ TẠO')}
                        className={`py-2 px-4 font-semibold ${
                            activeTab === 'ẢNH ĐÃ TẠO' ? 'text-pink-400 border-b-2 border-pink-400' : 'text-fuchsia-300'
                        }`}
                    >
                        ẢNH ĐÃ TẠO
                    </button>
                </div>
                <span className="text-xs text-fuchsia-300/80">Lượt Tạo ảnh: 50/50</span>
            </div>
            
            <div className="flex flex-col flex-grow">
               {activeTab === 'KẾT QUẢ' ? renderResultTab() : renderHistoryTab()}
            </div>

        </div>
    );
};

export default OutputPanel;