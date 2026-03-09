import React from 'react';
import { Send } from 'lucide-react';
import { useLocation } from 'react-router-dom';

function ShareButton() {
  const location = useLocation();

  // ✅ ONLY check if the PDF Viewer is open
  const isPdfViewerOpen = location.search.includes('pdf=');

  const handleShare = async () => {
    const currentUrl = window.location.href;
    
    const shareData = {
      title: 'FYIMP HUB',
      text: 'Check out these study materials on FYIMP HUB!',
      url: currentUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(currentUrl);
        alert('Link copied to clipboard!'); 
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    }
  };

  return (
    <button 
      className="global-share-btn" 
      onClick={handleShare} 
      aria-label="Share this page"
      style={{
        // ✅ Drop to 1.5rem ONLY when viewing a PDF. Otherwise, stay at 5.5rem.
        bottom: isPdfViewerOpen ? '1.3rem' : '5.5rem',
        transition: 'bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <Send size={24} color="white" />
    </button>
  );
}

export default ShareButton;
