import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BiometricVerificationForm = ({ onVerificationComplete }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream?.getTracks()?.forEach(track => track?.stop());
      }
    };
  }, [cameraStream]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices?.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      });
      setCameraStream(stream);
      if (videoRef?.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCapturing(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream?.getTracks()?.forEach(track => track?.stop());
      setCameraStream(null);
    }
    setIsCapturing(false);
  };

  const captureImage = () => {
    if (videoRef?.current && canvasRef?.current) {
      const canvas = canvasRef?.current;
      const video = videoRef?.current;
      const context = canvas?.getContext('2d');
      
      canvas.width = video?.videoWidth;
      canvas.height = video?.videoHeight;
      context?.drawImage(video, 0, 0);
      
      const imageData = canvas?.toDataURL('image/jpeg');
      setCapturedImage(imageData);
      stopCamera();
      processImage(imageData);
    }
  };

  const processImage = async (imageData) => {
    setIsProcessing(true);
    
    // Simulate face recognition processing
    setTimeout(() => {
      const mockResult = {
        success: true,
        confidence: 0.95,
        livenessCheck: true,
        faceDetected: true,
        qualityScore: 0.88
      };
      
      setVerificationResult(mockResult);
      setIsProcessing(false);
      
      if (mockResult?.success) {
        onVerificationComplete({ 
          biometric: true, 
          verified: true,
          confidence: mockResult?.confidence 
        });
      }
    }, 3000);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setVerificationResult(null);
    startCamera();
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
          <Icon name="Scan" size={20} className="text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">Biometric Verification</h3>
          <p className="text-sm text-muted-foreground">
            Face recognition for secure identity verification
          </p>
        </div>
      </div>
      <div className="space-y-6">
        {/* Camera/Capture Area */}
        <div className="relative">
          <div className="w-full max-w-md mx-auto bg-muted rounded-lg overflow-hidden">
            {!isCapturing && !capturedImage && (
              <div className="aspect-[4/3] flex items-center justify-center bg-muted">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                    <Icon name="Camera" size={32} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-foreground">Ready for Capture</p>
                    <p className="text-sm text-muted-foreground">
                      Position your face in the frame
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isCapturing && (
              <div className="relative aspect-[4/3]">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                
                {/* Face Detection Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-60 border-2 border-accent rounded-lg relative">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-accent"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-accent"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-accent"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-accent"></div>
                  </div>
                </div>
                
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <p className="text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                    Position your face in the frame
                  </p>
                </div>
              </div>
            )}

            {capturedImage && (
              <div className="aspect-[4/3] relative">
                <img
                  src={capturedImage}
                  alt="Captured face"
                  className="w-full h-full object-cover"
                />
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="animate-spin mb-2">
                        <Icon name="Loader2" size={32} />
                      </div>
                      <p className="text-sm">Processing...</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-3">
          {!isCapturing && !capturedImage && (
            <Button
              variant="default"
              onClick={startCamera}
              iconName="Camera"
              iconPosition="left"
              className="px-8"
            >
              Start Camera
            </Button>
          )}

          {isCapturing && (
            <>
              <Button
                variant="outline"
                onClick={stopCamera}
                iconName="X"
                iconPosition="left"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={captureImage}
                iconName="Camera"
                iconPosition="left"
                className="px-8"
              >
                Capture
              </Button>
            </>
          )}

          {capturedImage && !isProcessing && (
            <Button
              variant="outline"
              onClick={retakePhoto}
              iconName="RotateCcw"
              iconPosition="left"
            >
              Retake
            </Button>
          )}
        </div>

        {/* Verification Result */}
        {verificationResult && (
          <div className={`p-4 rounded-lg border ${
            verificationResult?.success 
              ? 'bg-success/10 border-success/20' :'bg-destructive/10 border-destructive/20'
          }`}>
            <div className="flex items-center space-x-3">
              <Icon 
                name={verificationResult?.success ? "CheckCircle" : "XCircle"} 
                size={20} 
                className={verificationResult?.success ? "text-success" : "text-destructive"} 
              />
              <div className="flex-1">
                <p className={`font-medium ${
                  verificationResult?.success ? "text-success" : "text-destructive"
                }`}>
                  {verificationResult?.success ? "Verification Successful" : "Verification Failed"}
                </p>
                <div className="text-xs text-muted-foreground mt-1 space-y-1">
                  <p>Confidence: {(verificationResult?.confidence * 100)?.toFixed(1)}%</p>
                  <p>Quality Score: {(verificationResult?.qualityScore * 100)?.toFixed(1)}%</p>
                  <p>Liveness Check: {verificationResult?.livenessCheck ? "Passed" : "Failed"}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-muted-foreground mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-2">Biometric Verification Tips:</p>
              <ul className="space-y-1">
                <li>• Ensure good lighting on your face</li>
                <li>• Look directly at the camera</li>
                <li>• Remove glasses or hats if possible</li>
                <li>• Keep your face within the frame</li>
                <li>• Stay still during capture</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiometricVerificationForm;