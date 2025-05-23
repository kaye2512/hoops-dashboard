"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

export default function ImageUpload({
  disabled,
  onChange,
  onRemove,
  value,
}: ImageUploadProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: CloudinaryUploadWidgetResults) => {
    if (result.info && typeof result.info !== "string") {
      onChange(result.info.secure_url);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className={"mb-4 flex items-center gap-4"}>
        {value.map((url) => (
          <div
            key={url}
            className={
              "relative w-[200px] h-[200px] rounded-md overflow-hidden"
            }
          >
            <div className={"z-10 absolute top-2 right-2"}>
              <Button
                type={"button"}
                onClick={() => onRemove(url)}
                variant={"destructive"}
                size={"icon"}
              >
                <Trash className={"h-4 w-4"} />
              </Button>
            </div>
            <Image fill className={"object-cover"} src={url} alt={"Image"} />
          </div>
        ))}
      </div>
      <CldUploadWidget onSuccess={onUpload} uploadPreset={"k4y4m4n"}>
        {({ open }) => {
          const onClick = () => {
            open();
          };
          return (
            <Button
              type={"button"}
              disabled={disabled}
              variant={"secondary"}
              onClick={onClick}
            >
              <ImagePlus className={"h-4 w-4 mr-2"} />
              Upload an Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}
