import { useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { getCroppedImg } from "./getCroppedImg";
import Modal from "@/components/Modal";

interface ImageCropDialogProps {
  open: boolean;
  onClose: () => void;
  onCropComplete: (croppedImageBlob: Blob) => void;
  imageSrc: string;
}

const ImageCropDialog: React.FC<ImageCropDialogProps> = ({
  open,
  onClose,
  onCropComplete,
  imageSrc,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const handleCropComplete = (_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleSaveCrop = async () => {
    if (!croppedAreaPixels) {
      console.error("Cropped area is not set");
      return;
    }

    try {
      const croppedImageBlob = (await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        1200,
        1200,
      )) as Blob;

      onCropComplete(croppedImageBlob);
      onClose();
    } catch (err) {
      console.error("Failed to crop image:", err);
    }
  };

  if (!open) return null;

  return (
    <Modal open={open}>
      <h2 className='text-xl font-semibold text-gray-700 mb-4'>Crop Image</h2>
      <div className='relative w-full h-96'>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={handleCropComplete}
        />
      </div>
      <div className='mt-4'>
        <input
          type='range'
          min='1'
          max='3'
          step='0.01'
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className='w-full'
        />
      </div>
      <div className='mt-4 flex justify-end gap-3'>
        <button
          type='button'
          onClick={onClose}
          className='px-4 py-2 bg-gray-300 rounded-lg text-gray-700 hover:bg-gray-400 transition'
        >
          Cancel
        </button>
        <button
          type='button'
          onClick={handleSaveCrop}
          className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'
        >
          Crop
        </button>
      </div>
    </Modal>
  );
};

export default ImageCropDialog;
