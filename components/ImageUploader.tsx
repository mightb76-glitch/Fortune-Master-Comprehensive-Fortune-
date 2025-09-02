
import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { ImageFile } from '../types';
import { UploadIcon, CameraIcon, CaptureIcon, SwitchCameraIcon } from './Icons';

interface ImageUploaderProps {
  onImageReady: (imageFile: ImageFile) => void;
}

export default function ImageUploader({ onImageReady }: ImageUploaderProps): React.JSX.Element {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isDragging, setIsDragging] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
        // Optionally, show an error to the user
        console.error("Invalid file type. Please upload an image.");
        return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = (e.target?.result as string).split(',')[1];
      if (base64) {
        onImageReady({ base64, mimeType: file.type });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };
  
  const stopCameraStream = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    stopCameraStream();
    setIsCameraOpen(true);
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      setCameraError('카메라에 접근할 수 없습니다. 브라우저 설정을 확인해주세요.');
      setIsCameraOpen(false);
    }
  }, [facingMode, stopCameraStream]);
  
  const handleCameraOpen = () => {
    startCamera();
  };

  const handleCameraClose = () => {
    stopCameraStream();
    setIsCameraOpen(false);
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/jpeg');
        const base64 = dataUrl.split(',')[1];
        if (base64) {
          onImageReady({ base64, mimeType: 'image/jpeg' });
          handleCameraClose();
        }
      }
    }
  };

  const handleSwitchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  // FIX: Import useEffect to handle camera start logic when facingMode or isCameraOpen changes.
  useEffect(() => {
    if (isCameraOpen) {
      startCamera();
    }
  }, [facingMode, isCameraOpen, startCamera]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
        processFile(files[0]);
    }
  };

  return (
    <div>
      {!isCameraOpen ? (
        <div 
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            className={`relative border-2 border-dashed border-gray-600 rounded-xl p-10 text-center transition-colors duration-300 ${isDragging ? 'border-indigo-500 bg-gray-900/50' : 'hover:border-gray-500'}`}
        >
            <div className="flex flex-col items-center justify-center space-y-6">
                {isDragging ? (
                    <>
                        <div className="p-4 bg-indigo-500/20 rounded-full animate-pulse">
                            <UploadIcon className="w-16 h-16 text-indigo-300" />
                        </div>
                        <p className="text-2xl font-semibold text-indigo-300">여기에 이미지를 드롭하세요</p>
                    </>
                ) : (
                    <>
                        <UploadIcon className="w-16 h-16 text-gray-500" />
                        <p className="text-xl text-gray-400">
                            여기에 이미지를 드래그 앤 드롭하거나<br/>아래에서 업로드 방식을 선택하세요.
                        </p>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs pt-4">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-indigo-500 rounded-lg text-base font-medium text-indigo-300 hover:bg-indigo-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-colors"
                            >
                                <UploadIcon />
                                파일에서 선택
                            </button>
                            <button
                                onClick={handleCameraOpen}
                                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-purple-500 rounded-lg text-base font-medium text-purple-300 hover:bg-purple-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 transition-colors"
                            >
                                <CameraIcon />
                                카메라로 촬영
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
            {cameraError ? (
                <p className="text-red-400">{cameraError}</p>
            ) : (
                <>
                <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg max-h-96" />
                <div className="flex items-center justify-center gap-4 mt-4">
                    <button onClick={handleCapture} className="p-4 bg-red-600 rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500 transition-colors">
                        <CaptureIcon />
                    </button>
                    <button onClick={handleSwitchCamera} className="p-3 bg-gray-600 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500 transition-colors">
                        <SwitchCameraIcon />
                    </button>
                </div>
                </>
            )}
            <button onClick={handleCameraClose} className="mt-4 text-sm text-gray-400 hover:text-white">닫기</button>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}