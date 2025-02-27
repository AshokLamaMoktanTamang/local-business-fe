"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useController } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, File } from "lucide-react";

interface FileUploaderProps {
  name: string;
  control: any;
  multiple?: boolean;
  accept?: string;
  maxSize?: number;
}

export function FileUploader({
  name,
  control,
  multiple = false,
  maxSize = 5 * 1024 * 1024, // 5MB
}: FileUploaderProps) {
  const {
    field: { value, onChange },
  } = useController({ name, control });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (multiple) {
        onChange([...(value || []), ...acceptedFiles]);
      } else {
        onChange(acceptedFiles[0]);
      }
    },
    [multiple, onChange, value]
  );

  const removeFile = (file: File) => {
    onChange(
      multiple ? value?.filter((f: File) => f.name !== file.name) : null
    );
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    maxSize,
  });

  return (
    <Card className="w-full">
      <CardContent className="p-4 space-y-3">
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-all",
            isDragActive ? "border-primary bg-accent" : "border-border"
          )}
        >
          <input {...getInputProps()} />
          <p className="text-sm text-muted-foreground">
            {isDragActive
              ? "Drop the files here..."
              : "Drag & drop files here or click to select"}
          </p>
        </div>

        {value && (
          <div className="space-y-2">
            {Array.isArray(value) ? (
              value.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 border rounded-md"
                >
                  <div className="flex items-center space-x-2">
                    <File className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm">{file.name}</span>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeFile(file)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex items-center space-x-2">
                  <File className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm">{value.name}</span>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onChange(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
