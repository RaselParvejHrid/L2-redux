import React from "react";
import { useLoaderData, useNavigate } from "react-router";
import { libraryAPI } from "../redux/features/api/apiSlice/apiSlice";
import { store } from "../redux/store";

export const bookLoader = async ({ params }: any) => {
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

const ABook: React.FC = () => {
  const book = useLoaderData();
  const navigate = useNavigate();

  if (!book) {
    return (
      <div className="text-center p-4 text-red-600">Error: Book not found</div>
    );
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Book Details</h2>
      <div className="bg-white border border-gray-200 rounded-md p-6 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700">Title</h3>
          <p className="mt-1 text-gray-600">{book.title}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700">Author</h3>
          <p className="mt-1 text-gray-600">{book.author}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700">Genre</h3>
          <p className="mt-1 text-gray-600">
            {book.genre.charAt(0) +
              book.genre.slice(1).toLowerCase().replace("_", " ")}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700">ISBN</h3>
          <p className="mt-1 text-gray-600">{book.isbn}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700">Description</h3>
          <p className="mt-1 text-gray-600">{book.description}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700">Copies</h3>
          <p className="mt-1 text-gray-600">{book.copies}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700">Available</h3>
          <p className="mt-1 text-gray-600">{book.available ? "Yes" : "No"}</p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => navigate("/books")}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Back to Books
          </button>
        </div>
      </div>
    </div>
  );
};

export default ABook;
