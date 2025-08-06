import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const PhotoAttachment = ({ photos, onPhotosChange }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = (files) => {
    const newPhotos = Array.from(files)?.map(file => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file),
      name: file?.name,
      size: file?.size
    }));
    
    onPhotosChange([...photos, ...newPhotos]);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e?.dataTransfer?.files)?.filter(file => 
      file?.type?.startsWith('image/')
    );
    
    if (files?.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
  };

  const removePhoto = (photoId) => {
    const updatedPhotos = photos?.filter(photo => photo?.id !== photoId);
    onPhotosChange(updatedPhotos);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium text-foreground">
        Receipt Photos
      </label>
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
          isDragOver
            ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
        }`}
      >
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
              <Icon name="Camera" size={24} className="text-muted-foreground" />
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-foreground font-medium">
              Add receipt photos
            </p>
            <p className="text-sm text-muted-foreground">
              Drag and drop images here, or click to select
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('photo-input')?.click()}
            >
              <Icon name="Upload" size={16} className="mr-2" />
              Choose Files
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('camera-input')?.click()}
            >
              <Icon name="Camera" size={16} className="mr-2" />
              Take Photo
            </Button>
          </div>
        </div>
        
        <input
          id="photo-input"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e?.target?.files)}
        />
        
        <input
          id="camera-input"
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => handleFileSelect(e?.target?.files)}
        />
      </div>
      {/* Photo Preview Grid */}
      {photos?.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">
            Attached Photos ({photos?.length})
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {photos?.map((photo) => (
              <div key={photo?.id} className="relative group">
                <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                  <Image
                    src={photo?.url}
                    alt={photo?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <button
                  type="button"
                  onClick={() => removePhoto(photo?.id)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-error text-error-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-soft"
                >
                  <Icon name="X" size={12} />
                </button>
                
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-foreground font-medium truncate">
                    {photo?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(photo?.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoAttachment;