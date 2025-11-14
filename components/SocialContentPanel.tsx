import React, { useState } from 'react';
import type { SocialContent } from '../types';

interface SocialContentPanelProps {
    content: SocialContent;
    onDelete: () => void;
}

const SocialContentPanel: React.FC<SocialContentPanelProps> = ({ content, onDelete }) => {
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const handleCopy = (text: string, fieldName: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(fieldName);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const CopyButton: React.FC<{ textToCopy: string, fieldName: string }> = ({ textToCopy, fieldName }) => (
        <button
            onClick={() => handleCopy(textToCopy, fieldName)}
            className="text-sm bg-fuchsia-800 hover:bg-fuchsia-700 text-fuchsia-100 px-3 py-1 rounded-md transition-colors border border-fuchsia-600/70 flex-shrink-0"
        >
            {copiedField === fieldName ? 'Đã sao chép!' : 'Sao chép'}
        </button>
    );

    return (
        <div className="mt-6 p-4 sm:p-6 rounded-lg bg-[#2a0a20] border border-fuchsia-800/50 shadow-lg shadow-black/30">
            <h3 className="text-xl font-bold mb-4 text-pink-500 tracking-wide">Nội dung Social</h3>

            {/* Title Section */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-base font-semibold text-fuchsia-100">Tiêu đề</label>
                    <CopyButton textToCopy={content.title} fieldName="title" />
                </div>
                <textarea
                    readOnly
                    value={content.title}
                    rows={1}
                    className="w-full p-3 rounded-md bg-[#1c0716] text-gray-200 border border-fuchsia-800/60 text-base resize-none focus:ring-1 focus:ring-pink-600 focus:border-pink-600"
                />
            </div>

            {/* Two Column Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Description Column */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-base font-semibold text-fuchsia-100">Mô tả & Hashtags</label>
                        <CopyButton textToCopy={content.descriptionAndHashtags} fieldName="description" />
                    </div>
                    <textarea
                        readOnly
                        value={content.descriptionAndHashtags}
                        className="w-full h-56 p-3 rounded-md bg-[#1c0716] text-gray-200 border border-fuchsia-800/60 text-base resize-none overflow-y-auto focus:ring-1 focus:ring-pink-600 focus:border-pink-600"
                    />
                </div>

                {/* Motion Prompt Column */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-base font-semibold text-fuchsia-100">Prompt Chuyển động gợi ý</label>
                        <CopyButton textToCopy={content.motionPrompt} fieldName="motion" />
                    </div>
                    <textarea
                        readOnly
                        value={content.motionPrompt}
                        className="w-full h-56 p-3 rounded-md bg-[#1c0716] text-gray-200 border border-fuchsia-800/60 text-base resize-none overflow-y-auto focus:ring-1 focus:ring-pink-600 focus:border-pink-600"
                    />
                </div>
            </div>

            {/* Delete Button */}
            <div className="text-center mt-6">
                <button onClick={onDelete} className="text-fuchsia-300/80 hover:text-fuchsia-200 text-sm underline transition-colors">Xóa</button>
            </div>
        </div>
    );
};

export default SocialContentPanel;