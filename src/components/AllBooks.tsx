import React from "react";
import { Link } from "react-router";
import { useConfirm } from "@omit/react-confirm-dialog";
import {
  useGetAllBooksQuery,
  useDeleteBookMutation,
} from "../redux/features/api/apiSlice/apiSlice";
import { toast } from "react-toastify";

const AllBooks: React.FC = () => {
  const { data: books, isLoading, isError, error } = useGetAllBooksQuery();
  const [deleteBook, { isLoading: isDeleting }] = useDeleteBookMutation();
  const confirm = useConfirm();

  const handleDelete = async (id: string, title: string) => {
    const isConfirmed = await confirm({
      title: "Delete Book",
      description: `Are you sure you want to delete "${title}"? This action is permanent.`,
      confirmText: "Yes",
      cancelText: "No",
    });
    if (isConfirmed) {
      try {
        await deleteBook(id).unwrap();
        toast.success("Book Deleted!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } catch (err) {
        console.log(err);
        toast.error("Failed to delete book!", {
          position: "bottom-right",
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

  if (isLoading) return <div className="text-center p-4">Loading books...</div>;
  if (isError)
    return (
      <div className="text-center p-4 text-red-600">
        Error: {JSON.stringify(error)}
      </div>
    );

  return (
    <div className="p-4 max-w-full">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">All Books</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">
                Title
              </th>
              <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">
                Author
              </th>
              <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">
                Genre
              </th>
              <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">
                ISBN
              </th>
              <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">
                Description
              </th>
              <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">
                Copies
              </th>
              <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">
                Available
              </th>
              <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {books && books.length > 0 ? (
              books.map((book) => (
                <tr key={book._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 text-sm text-gray-600">
                    {book.title}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-600">
                    {book.author}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-600">
                    {book.genre}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-600">
                    {book.isbn}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-600 max-w-xs truncate">
                    {book.description}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-600">
                    {book.copies}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-600">
                    {book.available ? "Yes" : "No"}
                  </td>
                  <td className="py-2 px-4 text-sm">
                    <div className="flex gap-2">
                      <Link
                        to={`/books/${book._id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Details
                      </Link>
                      <button
                        onClick={() => handleDelete(book._id, book.title)}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        Delete
                      </button>
                      <Link
                        to={`/edit-book/${book._id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/borrow/${book._id}`}
                        className={`text-green-600 hover:text-green-800 ${
                          !book.available
                            ? "opacity-50 pointer-events-none"
                            : ""
                        }`}
                      >
                        Borrow
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-4 px-4 text-center text-gray-600">
                  No books available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllBooks;
