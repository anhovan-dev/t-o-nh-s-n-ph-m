import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="py-6 bg-black/50 backdrop-blur-sm">
            <div className="container mx-auto px-4 flex flex-col items-center justify-center">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-pink-300 via-pink-500 to-fuchsia-600 drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)] text-center">
                    TẠO ẢNH SẢN PHẨM
                </h1>
                <div className="mt-4 text-center">
                    <p className="text-lg font-semibold text-fuchsia-200">PHAM VU - AI</p>
                    <p className="text-fuchsia-300">
                        Vào nhóm zalo giao lưu miễn phí: {' '}
                        <a href="https://zalo.me/g/jawgeo252" target="_blank" rel="noopener noreferrer" className="underline hover:text-pink-300 transition-colors">
                            https://zalo.me/g/jawgeo252
                        </a>
                    </p>
                </div>
            </div>
        </header>
    );
};

export default Header;
