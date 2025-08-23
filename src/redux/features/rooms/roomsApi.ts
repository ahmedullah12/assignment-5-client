import { baseApi } from "@/redux/api/baseApi";

const roomApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllRooms: builder.query({
      query: ({ searchTerm, price, capacity, sort, page, limit }) => {
        const params = new URLSearchParams();
        if (searchTerm) params.append("searchTerm", searchTerm);
        if (price) params.append("price", price);
        if (capacity) params.append("capacity", capacity);
        if (sort) params.append("sort", sort);
        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);

        return {
          url: `/rooms?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Rooms"],
    }),
    getSingleRoom: builder.query({
      query: (id) => ({
        url: `/rooms/${id}`,
        method: "GET",
      }),
      providesTags: ["Rooms"],
    }),
    createRoom: builder.mutation({
      query: (payload) => ({
        url: `/rooms`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Rooms"],
    }),
    updateRoom: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/rooms/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Rooms"],
    }),
    deleteRoom: builder.mutation({
      query: (id) => ({
        url: `/rooms/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Rooms"],
    }),
    getAllMessages: builder.query({
      query: ({ userId }) => ({
        url: `/rooms/chat/messages/${userId}`,
        method: "GET",
      }),
      providesTags: ["ChatMessages"],
    }),
    sendMessage: builder.mutation({
      query: (payload) => {
        console.log(payload);
        return {
          url: "/rooms/chat/message",
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["ChatMessages"],
    }),
  }),
});

export const {
  useGetAllRoomsQuery,
  useGetSingleRoomQuery,
  useCreateRoomMutation,
  useDeleteRoomMutation,
  useUpdateRoomMutation,
  useGetAllMessagesQuery,
  useSendMessageMutation,
} = roomApi;
