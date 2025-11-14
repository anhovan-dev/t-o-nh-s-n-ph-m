import React, { useRef } from 'react';
import type { UploadedImage } from '../types';

interface InputPanelProps {
    uploadedImage: UploadedImage | null;
    characterImage: UploadedImage | null;
    activeStyle: string;
    prompt: string;
    aspectRatio: string;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveImage: () => void;
    onCharacterFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveCharacterImage: () => void;
    onActiveStyleChange: (style: string) => void;
    onPromptChange: (prompt: string) => void;
    onAspectRatioChange: (ratio: string) => void;
    onGenerate: () => void;
    isLoading: boolean;
    isGeneratingPrompt: boolean;
    onGetPrompt: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBrowseTemplates: () => void;
}

const FileUpload: React.FC<{ 
    uploadedImage: UploadedImage | null; 
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
    onRemoveImage: () => void; 
    label: string;
    id: string;
}> = ({ uploadedImage, onFileChange, onRemoveImage, label, id }) => (
    <div className="mb-4">
        {uploadedImage ? (
            <div className="relative group border-2 border-dashed border-fuchsia-400/50 rounded-lg p-4 h-48 flex items-center justify-center bg-fuchsia-800/20">
                <img src={uploadedImage.base64} alt="Preview" className="max-h-full max-w-full object-contain rounded-md" />
                <div className="absolute bottom-2 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                    <button className="bg-gray-800/80 text-white text-xs px-2 py-1 rounded hover:bg-gray-700/90 transition-colors backdrop-blur-sm">Cắt</button>
                    <button onClick={onRemoveImage} className="bg-rose-600/80 text-white text-xs px-2 py-1 rounded hover:bg-rose-500/90 transition-colors font-bold backdrop-blur-sm">x</button>
                </div>
           </div>
        ) : (
             <label htmlFor={id} className="cursor-pointer">
                <div className="border-2 border-dashed border-fuchsia-400/50 rounded-lg p-4 text-center h-48 flex flex-col items-center justify-center bg-fuchsia-800/20 hover:bg-fuchsia-800/40 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-fuchsia-300/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <p className="mt-2 text-sm text-fuchsia-300/70">{label}</p>
                </div>
            </label>
        )}
        <input id={id} name={id} type="file" className="sr-only" onChange={onFileChange} accept="image/*" />
    </div>
);

const InputPanel: React.FC<InputPanelProps> = ({
    uploadedImage,
    characterImage,
    activeStyle,
    prompt,
    aspectRatio,
    onFileChange,
    onRemoveImage,
    onCharacterFileChange,
    onRemoveCharacterImage,
    onActiveStyleChange,
    onPromptChange,
    onAspectRatioChange,
    onGenerate,
    isLoading,
    isGeneratingPrompt,
    onGetPrompt,
    onBrowseTemplates
}) => {
    const styles = ['Ứng dụng thực tế', 'Poster tự động', 'Retouch Sản Phẩm'];
    const getPromptInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="space-y-4 text-sm">
            <div>
                <h3 className="font-semibold mb-2 text-fuchsia-200">1. Tải ảnh sản phẩm &amp; nhân vật (tùy chọn)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FileUpload uploadedImage={uploadedImage} onFileChange={onFileChange} onRemoveImage={onRemoveImage} label="Tải ảnh sản phẩm" id="file-upload" />
                    <FileUpload uploadedImage={characterImage} onFileChange={onCharacterFileChange} onRemoveImage={onRemoveCharacterImage} label="Tải ảnh nhân vật" id="character-file-upload"/>
                </div>
            </div>

            <div>
                <h3 className="font-semibold mb-2 text-fuchsia-200">2. Chọn phong cách hoặc mẫu</h3>
                <div className="grid grid-cols-3 gap-2">
                    {styles.map(style => (
                        <button
                            key={style}
                            onClick={() => onActiveStyleChange(style)}
                            className={`px-3 py-2 rounded-md transition-all text-xs sm:text-sm ${
                                activeStyle === style
                                    ? 'bg-pink-500 text-white font-bold border-2 border-pink-300 shadow-md'
                                    : 'bg-fuchsia-700/50 hover:bg-fuchsia-700/80 text-fuchsia-200 border-2 border-transparent'
                            }`}
                        >
                            {style}
                        </button>
                    ))}
                </div>
            </div>

            <button onClick={onBrowseTemplates} className="w-full py-2 rounded-md bg-fuchsia-700/50 hover:bg-fuchsia-700/80 text-fuchsia-200 transition-colors">
                DUYỆT MẪU CÓ SẴN
            </button>

            <div>
                 <h3 className="font-semibold mb-2 text-fuchsia-200">3. Tùy chỉnh</h3>
                 <label htmlFor="aspect-ratio" className="font-semibold mb-2 text-fuchsia-200 block">Tỉ lệ ảnh</label>
                 <select 
                    id="aspect-ratio"
                    className="w-full p-2 rounded-md bg-fuchsia-700/50 text-fuchsia-200 border border-fuchsia-600/50 focus:ring-pink-500 focus:border-pink-500"
                    value={aspectRatio}
                    onChange={(e) => onAspectRatioChange(e.target.value)}
                 >
                     <option>Giữ nguyên tỉ lệ gốc</option>
                     <option>Vuông (1:1)</option>
                     <option>Chân dung (3:4)</option>
                     <option>Ngang (4:3)</option>
                     <option>Dọc (9:16)</option>
                     <option>Rộng (16:9)</option>
                 </select>
            </div>
             <div>
                <label htmlFor="prompt" className="font-semibold mb-2 text-fuchsia-200 block">Hoặc tự nhập prompt của bạn</label>
                 <textarea
                     id="prompt"
                     rows={3}
                     value={prompt}
                     onChange={(e) => onPromptChange(e.target.value)}
                     placeholder="Nhập mô tả chi tiết tại đây..."
                     className="w-full p-2 rounded-md bg-fuchsia-700/50 text-fuchsia-200 border border-fuchsia-600/50 focus:ring-pink-500 focus:border-pink-500 placeholder-fuchsia-300/50"
                 />
                 <div className="flex gap-2 mt-2">
                    <a 
                      href="https://www.pinterest.com/pin/19281104649320225/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 rounded-md bg-fuchsia-700/50 hover:bg-fuchsia-700/80 text-fuchsia-200 transition-colors flex items-center justify-center"
                    >
                        TÌM CẢM HỨNG
                    </a>
                    <button 
                        onClick={() => getPromptInputRef.current?.click()}
                        disabled={isGeneratingPrompt || !uploadedImage}
                        className="flex-1 py-2 rounded-md bg-fuchsia-700/50 hover:bg-fuchsia-700/80 text-fuchsia-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isGeneratingPrompt ? (
                             <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Đang lấy...
                             </>
                        ) : 'LẤY PROMPT'}
                    </button>
                    <input
                        type="file"
                        ref={getPromptInputRef}
                        onChange={onGetPrompt}
                        accept="image/*"
                        className="sr-only"
                    />
                </div>
                 <p className="text-xs text-fuchsia-300/80 mt-2">Nếu bạn nhập vào đây, các lựa chọn phong cách ở trên sẽ bị bỏ qua.</p>
             </div>
             
             <button onClick={onGenerate} disabled={isLoading || !uploadedImage} className="w-full mt-4 py-3 rounded-md font-bold text-lg bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white hover:from-pink-400 hover:to-fuchsia-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center">
                 {isLoading ? (
                     <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang tạo...
                     </>
                 ) : 'TẠO ẢNH'}
             </button>

        </div>
    );
};

export default InputPanel;