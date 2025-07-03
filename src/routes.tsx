import { createBrowserRouter } from "react-router";
import App from "./App";
import AllBooks from "./components/AllBooks";
import CreateABook from "./components/CreateABook";
import BorrowSummary from "./components/BorrowSummary";
import EditBook, { editBookLoader } from "./components/EditBook";
import ABook, { bookLoader } from "./components/ABook";
import BorrowABook, { borrowBookLoader } from "./components/BorrowABook";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <AllBooks />,
      },
      {
        path: "books",
        element: <AllBooks />,
      },
      {
        path: "create-book",
        element: <CreateABook />,
      },
      {
        path: "books/:id",
        element: <ABook />,
        loader: bookLoader,
      },
      {
        path: "edit-book/:id",
        element: <EditBook />,
        loader: editBookLoader,
      },
      {
        path: "borrow/:id",
        element: <BorrowABook />,
        loader: borrowBookLoader,
      },
      {
        path: "borrow-summary",
        element: <BorrowSummary />,
      },
    ],
  },
]);

export default router;
