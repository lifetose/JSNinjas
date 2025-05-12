import SuperheroCard from "../../components/SuperheroCard";
import { useState } from "react";
import AddEditItemModal, { IItemEdit } from "./AddEditItemModal";
import {
  useAddSuperheroMutation,
  useDeleteSuperheroMutation,
  useGetSuperheroesQuery,
  useUpdateSuperheroMutation,
} from "@/api/superHeroApiSlice";
import { ISuperhero } from "@/types/Superhero";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { getErrorMessage } from "@/api/apiSlice";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<ISuperhero | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, error, refetch } =
    useGetSuperheroesQuery({ page });

  const [addItem] = useAddSuperheroMutation();
  const [deleteItem] = useDeleteSuperheroMutation();
  const [updateItem] = useUpdateSuperheroMutation();

  const handleOpenModal = (item: ISuperhero | null = null) => {
    setCurrentItem(item);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setCurrentItem(null);
    setModalOpen(false);
  };

  const openDeleteModal = (id: number) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteItem = async () => {
    if (!deleteId) return;
    try {
      await deleteItem(deleteId).unwrap();
      setDeleteId(null);
      setDeleteModalOpen(false);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveItem = async (itemData: IItemEdit) => {
    try {
      setErrorMessage(null);

      const formData = new FormData();
      formData.append("nickname", itemData.nickname);
      formData.append("real_name", String(itemData.real_name));
      formData.append(
        "origin_description",
        String(itemData.origin_description),
      );
      formData.append("superpowers", String(itemData.superpowers));
      formData.append("catch_phrase", String(itemData.catch_phrase));

      if (itemData.image) {
        formData.append("image", itemData.image, "image");
      } else {
        formData.append("deleteImage", String(itemData.deleteImage));
      }

      if (currentItem) {
        await updateItem({ id: currentItem.id, data: formData }).unwrap();
      } else {
        await addItem(formData).unwrap();
      }

      handleCloseModal();
    } catch (err: unknown) {
      console.error("Error saving item:", err);
      setErrorMessage(getErrorMessage(err));
    }
  };

  if (isLoading || isFetching) return <div>Loading...</div>;
  if (error) return <h3 className='text-red-400'>{getErrorMessage(error)}</h3>;

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold'>Superhero List</h1>
        <button
          onClick={() => handleOpenModal()}
          className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 self-start'
        >
          Add Item
        </button>
      </div>
      {data && data?.data.length > 0 ? (
        <div className='grid p-[10px] gap-[15px] md:gap-[30px] grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mx-auto max-w-[1350px]'>
          {data?.data.map((hero: ISuperhero) => (
            <div key={hero.id} className='flex flex-col gap-2'>
              <div className='flex justify-end'>
                <button
                  onClick={() => handleOpenModal(hero)}
                  className='bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 mx-1'
                >
                  Edit
                </button>
                <button
                  onClick={() => openDeleteModal(hero.id)}
                  className='bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 mx-1'
                >
                  Delete
                </button>
              </div>

              <SuperheroCard hero={hero} />
            </div>
          ))}
        </div>
      ) : (
        <h3>No data found</h3>
      )}

      <div className='flex justify-center mt-4 gap-2'>
        {[...Array(data?.totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${
              page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
      {modalOpen ? (
        <AddEditItemModal
          open={modalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveItem}
          item={currentItem}
          errorMessage={errorMessage}
        />
      ) : null}

      {deleteModalOpen ? (
        <ConfirmDeleteModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteItem}
        />
      ) : null}
    </div>
  );
}
