import React, { useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import {
  libraryAPI,
  useUpdateBookMutation,
} from "../redux/features/api/apiSlice/apiSlice";
import { useConfirm } from "@omit/react-confirm-dialog";
import { store } from "../redux/store";
import { toast } from "react-toastify";

type Genre =
  | "FICTION"
  | "NON_FICTION"
  | "SCIENCE"
  | "HISTORY"
  | "BIOGRAPHY"
  | "FANTASY";
const genres: Genre[] = [
  "FICTION",
  "NON_FICTION",
  "SCIENCE",
  "HISTORY",
  "BIOGRAPHY",
  "FANTASY",
];

interface Book {
  _id: string;
  title: string;
  author: string;
  genre: Genre;
  isbn: string;
  description: string;
  copies: number;
  available: boolean;
}

export const editBookLoader = async ({ params }: any) => {
  const { id } = params;
  if (!id) {
    throw new Response("Book ID not provided", { status: 400 });
  }
  try {
    const result = await libraryAPI.endpoints.getBookById
      .initiate(id)(store.dispatch, store.getState, null)
      .unwrap();
    return result;
  } catch (error) {
    throw new Response("Failed to fetch book", {
      status: (error as any)?.status ?? 500,
    });
  }
};

const EditBook: React.FC = () => {
  const book: Book | null = useLoaderData();
  const navigate = useNavigate();
  const [
    updateBook,
    { isLoading: isUpdating, isError: isUpdateError, error: updateError },
  ] = useUpdateBookMutation();
  const confirm = useConfirm();

  const [title, setTitle] = useState(book?.title || "");
  const [author, setAuthor] = useState(book?.author || "");
  const [genre, setGenre] = useState<Genre | "">(book?.genre || "");
  const [isbn, setIsbn] = useState(book?.isbn || "");
  const [description, setDescription] = useState(book?.description || "");
  const [copies, setCopies] = useState(book?.copies || 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author || !genre || !isbn || !description || copies < 1) {
      toast.error("Please fill in all fields with valid values", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    const isConfirmed = await confirm({
      title: "Update Book",
      description: `Are you sure you want to update "${title}"?`,
      confirmText: "Yes",
      cancelText: "No",
    });

    if (isConfirmed) {
      try {
        await updateBook({
          _id: book!._id,
          title,
          author,
          genre,
          isbn,
          description,
          copies,
          available: copies > 0,
        }).unwrap();
        toast.success("Book updated successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        navigate("/books");
      } catch (err) {
        toast.error("Failed to update book", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  };

  const handleCancel = () => {
    navigate("/books");
  };

  if (!book) {
    return (
      <div className="text-center p-4 text-red-600">Error: Book not found</div>
    );
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit Book</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter book title"
            required
          />
        </div>
        <div>
          <label
            htmlFor="author"
            className="block text-sm font-medium text-gray-700"
          >
            Author
          </label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter author name"
            required
          />
        </div>
        <div>
          <label
            htmlFor="genre"
            className="block text-sm font-medium text-gray-700"
          >
            Genre
          </label>
          <select
            id="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value as Genre)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="" disabled>
              Select a genre
            </option>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g.charAt(0) + g.slice(1).toLowerCase().replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="isbn"
            className="block text-sm font-medium text-gray-700"
          >
            ISBN
          </label>
          <input
            type="text"
            id="isbn"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter ISBN"
            required
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter book description"
            rows={4}
            required
          />
        </div>
        <div>
          <label
            htmlFor="copies"
            className="block text-sm font-medium text-gray-700"
          >
            Copies
          </label>
          <input
            type="number"
            id="copies"
            value={copies}
            onChange={(e) => setCopies(Number(e.target.value))}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter number of copies"
            min="1"
            required
          />
        </div>
        {isUpdateError && (
          <div className="text-red-600 text-sm">
            Error:{" "}
            {(updateError as any)?.data?.message || "Failed to update book"}
          </div>
        )}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isUpdating}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isUpdating ? "Updating..." : "Update Book"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBook;
