import { apiSlice } from "./apiSlice";
import { SUPERHEROES_URL } from "../constants/api";
import { ISuperhero, ISuperheroes } from "@/types/Superhero";

export const itemApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSuperheroes: builder.query<
      ISuperheroes,
      { page?: number; limit?: number }
    >({
      query: (args) => {
        const { page, limit } = args;

        const params = {
          page,
          limit,
        };

        return {
          url: `${SUPERHEROES_URL}`,
          params,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Superheroes" as const,
                id,
              })),
              { type: "Superheroes", id: "LIST" },
            ]
          : [{ type: "Superheroes", id: "LIST" }],
      keepUnusedDataFor: 30,
    }),

    getSuperheroByID: builder.query<ISuperhero, string>({
      query: (id) => ({
        url: `${SUPERHEROES_URL}/${id}`,
      }),
      providesTags: (_result, _error, id) => [
        { type: "Superheroes" as const, id },
      ],
      keepUnusedDataFor: 30,
    }),

    addSuperhero: builder.mutation({
      query: (data) => ({
        url: `${SUPERHEROES_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Superheroes"],
    }),

    updateSuperhero: builder.mutation({
      query: ({ id, data }) => ({
        url: `${SUPERHEROES_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Superheroes"],
    }),
    deleteSuperhero: builder.mutation({
      query: (id) => ({
        url: `${SUPERHEROES_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Superheroes"],
    }),
  }),
});

export const {
  useGetSuperheroesQuery,
  useGetSuperheroByIDQuery,
  useAddSuperheroMutation,
  useUpdateSuperheroMutation,
  useDeleteSuperheroMutation,
} = itemApiSlice;
