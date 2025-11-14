import React, { useState } from 'react';
import type { UploadedImage, SocialContent } from '../types';
import InputPanel from './InputPanel';
import OutputPanel from './OutputPanel';
import { generateProductImage, generateSocialContent, generatePromptFromImages } from '../services/geminiService';
import TemplateModal from './TemplateModal';

const Generator: React.FC = () => {
    const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
    const [characterImage, setCharacterImage] = useState<UploadedImage | null>(null);
    const [activeStyle, setActiveStyle] = useState<string>('Ứng dụng thực tế');
    const [prompt, setPrompt] = useState<string>('');
    const [aspectRatio, setAspectRatio] = useState<string>('Giữ nguyên tỉ lệ gốc');
    
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [generatedHistory, setGeneratedHistory] = useState<string[]>([]);
    
    const [socialContent, setSocialContent] = useState<SocialContent | null>(null);
    const [showSocialContent, setShowSocialContent] = useState<boolean>(false);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isGeneratingContent, setIsGeneratingContent] = useState<boolean>(false);
    const [isGeneratingPrompt, setIsGeneratingPrompt] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState<boolean>(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage({ file, base64: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCharacterFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCharacterImage({ file, base64: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleRemoveCharacterImage = () => {
        setCharacterImage(null);
    };

    const handleRemoveImage = () => {
        setUploadedImage(null);
    };

    const handleDeleteSocialContent = () => {
        setSocialContent(null);
        setShowSocialContent(false);
    }

    const handleDeleteCurrentOutput = () => {
        setGeneratedImage(null);
        setError(null);
        handleDeleteSocialContent();
    };
    
    const handleDeleteFromHistory = (indexToDelete: number) => {
        setGeneratedHistory(prev => prev.filter((_, index) => index !== indexToDelete));
    };

    const handleDownload = (imageUrl: string) => {
        if (!imageUrl) return;
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = 'generated-product-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSelectFromHistory = async (imageUrl: string) => {
        if (!imageUrl) return;
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const file = new File([blob], "generated-image.png", { type: blob.type });
            setUploadedImage({ file, base64: imageUrl });
        } catch (err) {
            console.error("Error selecting image from history:", err);
            setError("Không thể chọn ảnh từ lịch sử. Vui lòng thử lại.");
        }
    };

    const handleTemplateSelect = (selectedPrompt: string) => {
        setPrompt(selectedPrompt);
        setIsTemplateModalOpen(false);
    };

    const handleGetPrompt = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!uploadedImage) {
            setError('Vui lòng tải ảnh sản phẩm trước khi lấy prompt.');
            e.target.value = ''; // Reset file input
            return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
            const referenceImage: UploadedImage = { file, base64: reader.result as string };
            setIsGeneratingPrompt(true);
            setError(null);
            try {
                const newPrompt = await generatePromptFromImages(uploadedImage, referenceImage, characterImage);
                setPrompt(newPrompt);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
                setError(`Không thể tạo prompt. Lỗi: ${errorMessage}`);
                console.error(err);
            } finally {
                setIsGeneratingPrompt(false);
                e.target.value = ''; // Reset file input
            }
        };
        reader.readAsDataURL(file);
    };

    const handleGenerateContent = async () => {
        if (!generatedImage) {
            setError('Không có ảnh để tạo nội dung.');
            return;
        }
        setIsGeneratingContent(true);
        setError(null);
        try {
            const [header, base64Data] = generatedImage.split(',');
            if (!base64Data) {
                throw new Error("Invalid base64 string from generated image.");
            }
            const mimeType = header.match(/:(.*?);/)?.[1] || 'image/png';
            const content = await generateSocialContent(base64Data, mimeType);
            setSocialContent(content);
            setShowSocialContent(true);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Không thể tạo nội dung. Vui lòng thử lại. Lỗi: ${errorMessage}`);
            console.error(err);
        } finally {
            setIsGeneratingContent(false);
        }
    };

    const handleGenerate = async () => {
        if (!uploadedImage) {
            setError('Vui lòng tải lên ảnh sản phẩm.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);
        handleDeleteSocialContent();

        try {
            let finalPrompt = prompt;
            if (!finalPrompt) {
                switch (activeStyle) {
                    case 'Ứng dụng thực tế':
                        finalPrompt = "Analyze the uploaded product image. Create a new photorealistic lifestyle photo featuring a suitable model holding or interacting with the product. The model, their attire, and the background environment should be contextually appropriate and enhance the product's appeal. For instance, a luxury men's fragrance could feature a sophisticated man in a library, while a sports drink could show an athlete post-workout. The original product from the image must be seamlessly integrated into the scene.";
                        break;
                    case 'Poster tự động':
                        finalPrompt = "Analyze the uploaded product image. Design a compelling and professional advertising poster. The product should be the main focus, placed in a creative and relevant background with dynamic lighting. The overall composition should be eye-catching and suitable for marketing campaigns.";
                        break;
                    case 'Retouch Sản Phẩm':
                        finalPrompt = "Retouch this product photo. Isolate the main product on a clean, plain white studio background. Remove any distractions, hands, or other objects from the background. Enhance lighting and shadows on the product itself to make it look professional and high-quality.";
                        break;
                    default:
                        finalPrompt = `Create a new photorealistic product shot using the style: '${activeStyle}'. Keep the original product intact but change the background and lighting.`;
                }
            }
            
            if (aspectRatio !== 'Giữ nguyên tỉ lệ gốc') {
                const ratioValue = aspectRatio.match(/\(([^)]+)\)/)?.[1] || 'original';
                finalPrompt += ` The output image must have an aspect ratio of ${ratioValue}.`;
            }

            const [header, base64Data] = uploadedImage.base64.split(',');
            if (!base64Data) {
                throw new Error("Invalid base64 string from uploaded file.");
            }
            const mimeType = header.match(/:(.*?);/)?.[1] || 'image/png';

            let characterBase64Data: string | null = null;
            let characterMimeType: string | null = null;
            if (characterImage) {
                const [charHeader, charBase64] = characterImage.base64.split(',');
                if (!charBase64) {
                    throw new Error("Invalid base64 string from character file.");
                }
                characterBase64Data = charBase64;
                characterMimeType = charHeader.match(/:(.*?);/)?.[1] || 'image/png';
            }

            const newImageBase64 = await generateProductImage(base64Data, mimeType, finalPrompt, characterBase64Data, characterMimeType);
            const newImageUrl = `data:image/png;base64,${newImageBase64}`;
            setGeneratedImage(newImageUrl);
            setGeneratedHistory(prev => [newImageUrl, ...prev]);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Không thể tạo ảnh. Vui lòng thử lại. Lỗi: ${errorMessage}`);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#4a043a] p-4 sm:p-6 rounded-lg border border-fuchsia-800/50 shadow-lg shadow-fuchsia-900/20">
            <div className="text-center mb-4">
                <p className="text-fuchsia-300">« TẠO ẢNH SẢN PHẨM »</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <InputPanel
                    uploadedImage={uploadedImage}
                    characterImage={characterImage}
                    activeStyle={activeStyle}
                    prompt={prompt}
                    aspectRatio={aspectRatio}
                    onFileChange={handleFileChange}
                    onRemoveImage={handleRemoveImage}
                    onCharacterFileChange={handleCharacterFileChange}
                    onRemoveCharacterImage={handleRemoveCharacterImage}
                    onActiveStyleChange={setActiveStyle}
                    onPromptChange={setPrompt}
                    onAspectRatioChange={setAspectRatio}
                    onGenerate={handleGenerate}
                    isLoading={isLoading}
                    isGeneratingPrompt={isGeneratingPrompt}
                    onGetPrompt={handleGetPrompt}
                    onBrowseTemplates={() => setIsTemplateModalOpen(true)}
                />
                <OutputPanel
                    generatedImage={generatedImage}
                    generatedHistory={generatedHistory}
                    isLoading={isLoading}
                    error={error}
                    socialContent={socialContent}
                    isGeneratingContent={isGeneratingContent}
                    showSocialContent={showSocialContent}
                    onRegenerate={handleGenerate}
                    onDownload={handleDownload}
                    onDeleteCurrent={handleDeleteCurrentOutput}
                    onDeleteFromHistory={handleDeleteFromHistory}
                    onSelectFromHistory={handleSelectFromHistory}
                    onGenerateContent={handleGenerateContent}
                    onDeleteSocialContent={handleDeleteSocialContent}
                />
            </div>
            <TemplateModal
                isOpen={isTemplateModalOpen}
                onClose={() => setIsTemplateModalOpen(false)}
                onSelectTemplate={handleTemplateSelect}
            />
        </div>
    );
};

export default Generator;