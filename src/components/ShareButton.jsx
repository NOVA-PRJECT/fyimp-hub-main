import React from 'react';
import { Send } from 'lucide-react';

function ShareButton() {
  const handleShare = async () => {
    // Grab the exact URL the user is currently looking at
    const currentUrl = window.location.href;
    
    const shareData = {
      title: 'FYIMP HUB',
      text: 'Check out these study materials on FYIMP HUB!',
      url: currentUrl,
    };

    // Check if the device supports native sharing (most modern phones do)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled the share, fail silently
        console.log('Share cancelled', err);
      }
    } else {
      // FALLBACK for Desktop: Copy to clipboard
      try {
        await navigator.clipboard.writeText(currentUrl);
        alert('Link copied to clipboard!'); 
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    }
  };

  return (
    <button className="global-share-btn" onClick={handleShare} aria-label="Share this page">
      <Send size={24} color="white" />
    </button>
  );
}

export default ShareButton;
