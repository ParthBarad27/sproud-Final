import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const DocumentUploadForm = ({ onUploadComplete, userRole }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const documentTypes = {
    student: [
      { type: 'college_id', label: 'College ID Card', required: true, icon: 'CreditCard' },
      { type: 'enrollment_proof', label: 'Enrollment Certificate', required: false, icon: 'FileText' }
    ],
    consultant: [
      { type: 'license', label: 'Professional License', required: true, icon: 'Award' },
      { type: 'degree', label: 'Degree Certificate', required: true, icon: 'GraduationCap' },
      { type: 'background_check', label: 'Background Check', required: true, icon: 'Shield' }
    ],
    faculty: [
      { type: 'faculty_id', label: 'Faculty ID Card', required: true, icon: 'CreditCard' },
      { type: 'appointment_letter', label: 'Appointment Letter', required: true, icon: 'FileText' }
    ],
    admin: [
      { type: 'admin_id', label: 'Administrative ID', required: true, icon: 'CreditCard' },
      { type: 'authorization', label: 'Role Authorization', required: true, icon: 'Shield' }
    ]
  };

  const requiredDocs = documentTypes?.[userRole] || [];

  const handleDrag = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === 'dragenter' || e?.type === 'dragover') {
      setDragActive(true);
    } else if (e?.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
    
    if (e?.dataTransfer?.files && e?.dataTransfer?.files?.[0]) {
      handleFiles(e?.dataTransfer?.files);
    }
  };

  const handleChange = (e) => {
    e?.preventDefault();
    if (e?.target?.files && e?.target?.files?.[0]) {
      handleFiles(e?.target?.files);
    }
  };

  const handleFiles = (files) => {
    const file = files?.[0];
    if (file && (file?.type?.startsWith('image/') || file?.type === 'application/pdf')) {
      processFile(file);
    }
  };

  const processFile = async (file) => {
    setIsProcessing(true);
    
    // Simulate OCR processing
    setTimeout(() => {
      const newFile = {
        id: Date.now(),
        name: file?.name,
        size: file?.size,
        type: file?.type,
        url: URL.createObjectURL(file),
        status: 'processed',
        extractedData: {
          name: 'John Doe',
          id: 'STU123456',
          institution: 'Sample University',
          validUntil: '2025-12-31'
        }
      };
      
      setUploadedFiles(prev => [...prev, newFile]);
      setIsProcessing(false);
    }, 3000);
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev?.filter(file => file?.id !== fileId));
  };

  const handleSubmit = () => {
    const requiredCount = requiredDocs?.filter(doc => doc?.required)?.length;
    if (uploadedFiles?.length >= requiredCount) {
      onUploadComplete({ documents: uploadedFiles, verified: true });
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
          <Icon name="Upload" size={20} className="text-secondary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">Document Upload</h3>
          <p className="text-sm text-muted-foreground">
            Upload required documents for verification with OCR processing
          </p>
        </div>
      </div>
      {/* Required Documents List */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-foreground mb-3">Required Documents:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {requiredDocs?.map((doc) => (
            <div key={doc?.type} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <Icon name={doc?.icon} size={16} className="text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{doc?.label}</p>
                <p className="text-xs text-muted-foreground">
                  {doc?.required ? 'Required' : 'Optional'}
                </p>
              </div>
              {uploadedFiles?.some(file => file?.name?.toLowerCase()?.includes(doc?.type)) && (
                <Icon name="CheckCircle" size={16} className="text-success" />
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleChange}
          accept="image/*,.pdf"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Icon name="Upload" size={24} className="text-primary" />
          </div>
          
          <div>
            <p className="text-lg font-medium text-foreground mb-2">
              Drop files here or click to upload
            </p>
            <p className="text-sm text-muted-foreground">
              Supports JPG, PNG, PDF files up to 10MB
            </p>
          </div>
          
          <Button
            variant="outline"
            onClick={() => fileInputRef?.current?.click()}
            iconName="FolderOpen"
            iconPosition="left"
          >
            Browse Files
          </Button>
        </div>
      </div>
      {/* Processing Indicator */}
      {isProcessing && (
        <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="animate-spin">
              <Icon name="Loader2" size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-primary">Processing Document...</p>
              <p className="text-xs text-muted-foreground">
                Using OCR to extract and verify information
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Uploaded Files */}
      {uploadedFiles?.length > 0 && (
        <div className="mt-6 space-y-4">
          <h4 className="text-sm font-medium text-foreground">Uploaded Documents:</h4>
          {uploadedFiles?.map((file) => (
            <div key={file?.id} className="p-4 bg-success/10 border border-success/20 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {file?.type?.startsWith('image/') ? (
                    <Image
                      src={file?.url}
                      alt={file?.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                      <Icon name="FileText" size={20} className="text-muted-foreground" />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{file?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file?.size / 1024 / 1024)?.toFixed(2)} MB
                    </p>
                    
                    {file?.extractedData && (
                      <div className="mt-2 p-2 bg-background rounded text-xs">
                        <p><strong>Name:</strong> {file?.extractedData?.name}</p>
                        <p><strong>ID:</strong> {file?.extractedData?.id}</p>
                        <p><strong>Institution:</strong> {file?.extractedData?.institution}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file?.id)}
                  iconName="X"
                  iconSize={16}
                  className="text-muted-foreground hover:text-destructive"
                />
              </div>
            </div>
          ))}
          
          <Button
            variant="default"
            onClick={handleSubmit}
            disabled={uploadedFiles?.length === 0}
            iconName="CheckCircle"
            iconPosition="right"
            className="w-full"
          >
            Complete Document Verification
          </Button>
        </div>
      )}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Shield" size={16} className="text-muted-foreground mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <p className="font-medium mb-1">Privacy & Security:</p>
            <p>All documents are encrypted and processed securely. OCR data extraction helps verify authenticity while maintaining your privacy.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadForm;