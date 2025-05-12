import { useState } from "react";
import { ISuperheroInput } from "../types/Superhero";

export default function SuperheroForm({
  initialValues,
  onSubmit,
}: {
  initialValues?: ISuperheroInput;
  onSubmit: (data: ISuperheroInput) => void;
}) {
  const [form, setForm] = useState<ISuperheroInput>(
    initialValues || {
      nickname: "",
      real_name: "",
      origin_description: "",
      superpowers: "",
      catch_phrase: "",
    },
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <form
        className='space-y-4'
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(form);
        }}
      >
        {Object.entries(form).map(([key, value]) => (
          <div key={key}>
            <label className='block font-medium capitalize'>
              {key.replace("_", " ")}
            </label>
            <input
              name={key}
              value={value}
              onChange={handleChange}
              className='border border-gray-300 rounded p-2 w-full'
            />
          </div>
        ))}
        <button
          className='bg-blue-600 text-white px-4 py-2 rounded'
          type='submit'
        >
          Save
        </button>
      </form>
    </div>
  );
}
