import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const PdfViewer = ({ fileUrl, onClose }) => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    return (
        <div style={{
            position: 'fixed',
            top: 0, // Changed from 4rem to 0
            left: 0,
            width: '100%',
            height: '100dvh', // Use dvh to account for mobile browser bars
            backgroundColor: '#121212',
            zIndex: 999999, // Ensure this is higher than your header/footer
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Toolbar Area */}
            <div style={{
                height: '55px',
                padding: '0 15px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#1a1a1a',
                borderBottom: '1px solid #333',
                color: 'white'
            }}>
                <button 
                    onClick={onClose}
                    style={{
                        background: '#333',
                        border: 'none',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        fontSize: '14px'
                    }}
                >
                    Back
                </button>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Syllabus Viewer</span>
                <div style={{ width: '45px' }}></div> 
            </div>

            {/* Rendering Area */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                    <Viewer 
                        fileUrl={fileUrl} 
                        plugins={[defaultLayoutPluginInstance]}
                        theme="dark"
                    />
                </Worker>
            </div>
        </div>
    );
};

export default PdfViewer;
