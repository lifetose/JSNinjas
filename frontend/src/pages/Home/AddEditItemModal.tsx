import { useState, useEffect } from "react";
import ImageCropDialog from "./ImageCropDialog";
import Modal from "@/components/Modal";
import { ISuperhero } from "@/types/Superhero";

export interface IItemEdit {
  nickname: string;
  real_name: string;
  origin_description: string;
  superpowers: string;
  catch_phrase: string;
  image?: File | Blob | null;
  deleteImage?: boolean;
}

interface AddEditItemModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: IItemEdit) => void;
  item?: ISuperhero | null;
  errorMessage?: string | null;
}

const AddEditItemModal: React.FC<AddEditItemModalProps> = ({
  open,
  onClose,
  onSave,
  item,
  errorMessage,
}) => {
  const [formData, setFormData] = useState<IItemEdit>({
    nickname: "",
    real_name: "",
    origin_description: "",
    superpowers: "",
    catch_phrase: "",
    image: null,
    deleteImage: false,
  });

  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setFormData({
        nickname: item.nickname,
        real_name: item.real_name,
        origin_description: item.origin_description,
        superpowers: item.superpowers,
        catch_phrase: item.catch_phrase,
        image: null,
        deleteImage: false,
      });
    } else {
      setFormData({
        nickname: "",
        real_name: "",
        origin_description: "",
        superpowers: "",
        catch_phrase: "",
        image: null,
        deleteImage: false,
      });
    }
    setImageSrc(null);
    setCroppedImage(null);
  }, [item]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result && typeof reader.result === "string") {
          setImageSrc(reader.result);
          setCropDialogOpen(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    const croppedImageUrl = URL.createObjectURL(croppedBlob);
    setCroppedImage(croppedImageUrl);
    setFormData((prev) => ({
      ...prev,
      image: new File([croppedBlob], "cropped-image.png", {
        type: croppedBlob.type,
      }),
      deleteImage: false,
    }));
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleRemoveImage = () => {
    setCroppedImage(null);
    setFormData((prev) => ({ ...prev, image: null, deleteImage: true }));
  };

  const handleResetNewImage = () => {
    setCroppedImage(null);
    setFormData((prev) => ({
      ...prev,
      image: null,
      deleteImage: item?.image ? false : prev.deleteImage,
    }));
  };

  const handleRevertRemoval = () => {
    setFormData((prev) => ({ ...prev, deleteImage: false }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!open) return null;

  return (
    <Modal open={open}>
      <h2 className='text-2xl font-bold mb-4'>
        {item ? "Edit Item" : "Add New Item"}
      </h2>
      {errorMessage && (
        <div className='bg-red-100 text-red-700 border border-red-400 p-2 rounded-md mb-4'>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label htmlFor='nickname' className='block'>
            nickname
          </label>
          <input
            type='text'
            name='nickname'
            id='nickname'
            value={formData.nickname}
            onChange={handleChange}
            className='border border-gray-300 p-2 w-full rounded-md'
            placeholder='nickname'
            autoFocus
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='real_name' className='block'>
            real_name
          </label>
          <input
            type='text'
            name='real_name'
            id='real_name'
            value={formData.real_name}
            onChange={handleChange}
            className='border border-gray-300 p-2 w-full rounded-md'
            placeholder='real_name'
          />
        </div>

        <div className='mb-4'>
          <label htmlFor='origin_description' className='block'>
            origin_description
          </label>
          <input
            type='text'
            name='origin_description'
            id='origin_description'
            value={formData.origin_description}
            onChange={handleChange}
            className='border border-gray-300 p-2 w-full rounded-md'
            placeholder='origin_description'
          />
        </div>

        <div className='mb-4'>
          <label htmlFor='superpowers' className='block'>
            superpowers
          </label>
          <input
            type='string'
            name='superpowers'
            id='superpowers'
            value={formData.superpowers}
            onChange={handleChange}
            className='border border-gray-300 p-2 w-full rounded-md'
            placeholder='superpowers'
          />
        </div>

        <div className='mb-4'>
          <label htmlFor='catch_phrase' className='block'>
            catch_phrase
          </label>
          <textarea
            name='catch_phrase'
            id='catch_phrase'
            value={formData.catch_phrase}
            onChange={handleChange}
            className='border border-gray-300 p-2 w-full rounded-md'
            placeholder='catch_phrase'
            rows={4}
          />
        </div>

        <input
          accept='image/*'
          style={{ display: "none" }}
          id='icon-button-file'
          type='file'
          onChange={handleImageChange}
        />
        <label
          htmlFor='icon-button-file'
          className='cursor-pointer bg-blue-500 text-white p-2 rounded-md inline-block mb-4'
        >
          Upload Image
        </label>

        <div className='mt-2'>
          {croppedImage ? (
            <div>
              <img src={croppedImage} alt='New Preview' className='w-full' />
              <button
                type='button'
                onClick={handleResetNewImage}
                className='text-red-500 underline mt-1'
              >
                Cancel New Image
              </button>
            </div>
          ) : (
            <>
              {item?.image && !formData.deleteImage ? (
                <div>
                  <img src={item.image} alt='Current' className='w-full' />
                  <button
                    type='button'
                    onClick={handleRemoveImage}
                    className='text-red-500 underline mt-1'
                  >
                    Remove Image
                  </button>
                </div>
              ) : item?.image && formData.deleteImage ? (
                <button
                  type='button'
                  onClick={handleRevertRemoval}
                  className='text-green-500 underline mt-1'
                >
                  Revert Removal (Use Original Image)
                </button>
              ) : null}
            </>
          )}
        </div>

        <ImageCropDialog
          open={cropDialogOpen}
          onClose={() => setCropDialogOpen(false)}
          onCropComplete={handleCropComplete}
          imageSrc={imageSrc || ""}
        />

        <div className='flex justify-end gap-4 mt-4'>
          <button
            type='button'
            onClick={onClose}
            className='bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600'
          >
            Cancel
          </button>
          <button
            type='submit'
            className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
          >
            {item ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEditItemModal;
