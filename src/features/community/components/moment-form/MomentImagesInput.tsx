'use client';

import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/shared/components';
import { useToast } from '@/shared/hooks';

interface MomentImagesInputProps {
  images?: (File | string)[];
  onChange: (files: (File | string)[]) => void;
  maxFiles?: number;
  disabled?: boolean;
}

export function MomentImagesInput({
  images = [],
  onChange,
  maxFiles = 3,
  disabled = false,
}: MomentImagesInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { showErrorToast } = useToast();
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    const newImagePreviews = images.map((image) => {
      if (typeof image === 'string') {
        return image;
      }
      return URL.createObjectURL(image);
    });
    setImagePreviews(newImagePreviews);

    return () => {
      newImagePreviews.forEach((preview, i) => {
        if (i < images.length && typeof images[i] !== 'string') {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [images]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > maxFiles) {
      showErrorToast(`이미지는 최대 ${maxFiles}개까지 추가할 수 있습니다.`);
      return;
    }
    onChange([...images, ...files]);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {imagePreviews.map((imageUrl, index) => (
            <div key={index} className="relative flex-shrink-0">
              <div className="relative h-24 w-24 overflow-hidden rounded-lg">
                <img
                  src={imageUrl}
                  alt={`이미지 ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="bg-background absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                onClick={() => removeImage(index)}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {images.length < maxFiles && (
            <div
              className="border-muted flex h-24 w-24 flex-shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed"
              onClick={() => inputRef.current?.click()}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageChange}
                disabled={disabled}
              />
              <div className="text-muted-foreground text-center text-sm">
                <p>이미지 추가</p>
                <p className="text-xs">
                  ({images.length}/{maxFiles})
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
