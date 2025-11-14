import React from 'react';
import { TEMPLATES } from '../constants/templates';

interface TemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectTemplate: (prompt: string) => void;
}

const TemplateModal: React.FC<TemplateModalProps> = ({ isOpen, onClose, onSelectTemplate }) => {
    if (!isOpen) return null;

    const handleSelect = (prompt: string) => {
        onSelectTemplate(prompt);
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 transition-opacity duration-300" 
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-[#1f0b2f] rounded-lg shadow-xl w-11/12 max-w-5xl h-[90vh] flex flex-col p-4 sm:p-6" 
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h2 className="text-xl font-bold text-white">Chọn một mẫu có sẵn</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-white text-4xl leading-none"
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {TEMPLATES.map(template => (
                            <div 
                                key={template.id} 
                                className="cursor-pointer group focus:outline-none focus:ring-2 focus:ring-pink-400 rounded-lg" 
                                onClick={() => handleSelect(template.prompt)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSelect(template.prompt)}
                                tabIndex={0}
                                role="button"
                                aria-label={`Select template: ${template.name}`}
                            >
                                <div className="aspect-[3/4] rounded-lg overflow-hidden border-2 border-gray-700/50 group-hover:border-pink-500 transition-all duration-200">
                                    <img src={template.imageUrl} alt={template.name} className="w-full h-full object-cover" loading="lazy" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplateModal;