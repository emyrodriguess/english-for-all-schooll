"use client";

import { useRef, useState } from "react";
import { FileTextIcon, Trash2Icon, UploadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FileUploadInputProps = {
  accept: string;
  description?: string;
  id: string;
  name: string;
  required?: boolean;
};

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUploadInput({
  accept,
  description = "PDF, JPG ou PNG · máximo de 10 MB",
  id,
  name,
  required = false,
}: FileUploadInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const setSelectedFile = (nextFile: File | null) => {
    setFile(nextFile);
    if (!inputRef.current) return;
    if (!nextFile) {
      inputRef.current.value = "";
      return;
    }
    const transfer = new DataTransfer();
    transfer.items.add(nextFile);
    inputRef.current.files = transfer.files;
  };

  return (
    <div className="admin-file-upload">
      <input
        accept={accept}
        className="sr-only"
        id={id}
        name={name}
        onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
        ref={inputRef}
        required={required}
        type="file"
      />
      {file ? (
        <div className="admin-file-selected">
          <FileTextIcon aria-hidden="true" />
          <div>
            <strong>{file.name}</strong>
            <span>{formatFileSize(file.size)}</span>
          </div>
          <Button
            aria-label="Remover arquivo selecionado"
            onClick={() => setSelectedFile(null)}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <Trash2Icon />
          </Button>
        </div>
      ) : (
        <label
          className={cn("admin-file-dropzone", isDragging && "is-dragging")}
          htmlFor={id}
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            setSelectedFile(event.dataTransfer.files?.[0] ?? null);
          }}
        >
          <UploadIcon aria-hidden="true" />
          <span>
            <strong>Clique para escolher</strong> ou arraste o arquivo aqui
          </span>
          <small>{description}</small>
        </label>
      )}
    </div>
  );
}
