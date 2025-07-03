import React, { useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { useBorrowABookMutation } from "../redux/features/api/apiSlice/apiSlice";
import { useConfirm } from "@omit/react-confirm-dialog";
import { libraryAPI } from "../redux/features/api/apiSlice/apiSlice";
import { store } from "../redux/store";
import { toast } from "react-toastify";

type Genre =
  | "FICTION"
  | "NON_FICTION"
  | "SCIENCE"
  | "HISTORY"
  | "BIOGRAPHY"
  | "FANTASY";

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

export const borrowBookLoader = async ({ params }: any) => {
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

const BorrowABook: React.FC = () => {
  const book = useLoaderData() as Book | null;
  const navigate = useNavigate();
  const [
    borrowBook,
    { isLoading: isBorrowing, isError: isBorrowError, error: borrowError },
  ] = useBorrowABookMutation();
  const confirm = useConfirm();

  const [quantity, setQuantity] = useState(1);
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quantity || quantity < 1 || !dueDate) {
      toast.error("Please provide a valid quantity and due date", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      return;
    }
    if (book && quantity > book.copies) {
      toast.error(`Quantity cannot exceed available copies (${book.copies})`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      return;
    }
    const selectedDate = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    if (selectedDate < today) {
      toast.error("Due date must be today or in the future", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      return;
    }

    const isConfirmed = await confirm({
      title: "Borrow Book",
      description: `Are you sure you want to borrow ${quantity} copy(ies) of "${book?.title}"?`,
      confirmText: "Borrow",
      cancelText: "Cancel",
    });

    if (isConfirmed) {
      try {
        await borrowBook({
          book: book!._id,
          quantity,
          dueDate: selectedDate,
        }).unwrap();
        toast.success("Book borrowed successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        navigate("/books");
      } catch (err) {
        toast.error(
          "Failed to borrow book: " +
            ((err as any)?.data?.message || "Unknown error"),
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          }
        );
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
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Borrow Book: {book.title}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-gray-700"
          >
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter quantity to borrow"
            min="1"
            max={book.copies}
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Available copies: {book.copies}
          </p>
        </div>
        <div>
          <label
            htmlFor="dueDate"
            className="block text-sm font-medium text-gray-700"
          >
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        {isBorrowError && (
          <div className="text-red-600 text-sm">
            Error:{" "}
            {(borrowError as any)?.data?.message || "Failed to borrow book"}
          </div>
        )}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isBorrowing || !book.available}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
          >
            {isBorrowing ? "Borrowing..." : "Borrow Book"}
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

export default BorrowABook;
