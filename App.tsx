
import React from 'react';
import Header from './components/Header';
import Generator from './components/Generator';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-200 bg-black/30">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Generator />
      </main>
      <Footer />
    </div>
  );
};

export default App;
