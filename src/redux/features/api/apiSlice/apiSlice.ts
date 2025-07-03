// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  isbn: string;
  description: string;
  copies: number;
  available: boolean;
}

interface BookResponse {
  success: boolean;
  message: string;
  data: Book[];
}

interface BookByIDResponse {
  success: boolean;
  message: string;
  data: Book;
}

interface Borrow {
  book: string;
  quantity: number;
  dueDate: Date;
}

interface BorrowSummary {
  totalQuantity: number;
  book: {
    title: string;
    isbn: string;
  };
}

interface BorrowSummariesResponse {
  success: boolean;
  message: string;
  data: BorrowSummary[];
}

// Define a service using a base URL and expected endpoints
export const libraryAPI = createApi({
  reducerPath: "libraryAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://library-eight-dun.vercel.app/api/",
    // baseUrl: "http://localhost:8888/api/",
  }),
  tagTypes: ["Book", "Borrow"],
  endpoints: (builder) => ({
    getAllBooks: builder.query<Book[], void>({
      query: () => `books`,
      providesTags: ["Book"],
      transformResponse: (response: BookResponse) => response.data,
    }),
    addBook: builder.mutation<Book, Omit<Book, "_id">>({
      query: (newBook) => ({
        url: `books`,
        method: "POST",
        body: newBook,
      }),
      invalidatesTags: ["Book"], // Invalidate cache after adding a book
    }),
    getBookById: builder.query<Book, string>({
      query: (id) => `books/${id}`,
      providesTags: ["Book"],
      transformResponse: (response: BookByIDResponse) => response.data,
    }),
    updateBook: builder.mutation<Book, Book>({
      query: (updatedBook) => ({
        url: `books/${updatedBook._id}`,
        method: "PUT",
        body: updatedBook,
      }),
      invalidatesTags: ["Book"],
    }),
    deleteBook: builder.mutation<void, string>({
      query: (id) => ({
        url: `books/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Book"], // Invalidate cache after deletion
    }),
    borrowABook: builder.mutation<Borrow, Borrow>({
      query: (borrowDetails) => ({
        url: `borrow`,
        method: "POST",
        body: {
          ...borrowDetails,
          dueDate: borrowDetails.dueDate.toISOString(), // Convert Date to ISO string for API
        },
      }),
      invalidatesTags: ["Book", "Borrow"], // Invalidate book and borrow caches after borrowing
    }),
    borrowSummaries: builder.query<BorrowSummary[], void>({
      query: () => `borrow`,
      providesTags: ["Borrow"],
      transformResponse: (response: BorrowSummariesResponse) => response.data,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAllBooksQuery,
  useGetBookByIdQuery,
  useDeleteBookMutation,
  useAddBookMutation,
  useUpdateBookMutation,
  useBorrowABookMutation,
  useBorrowSummariesQuery,
} = libraryAPI;
