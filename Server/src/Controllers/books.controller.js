import { Book } from "../Models/book.model.js";
import asyncHandler from "../utils/asyncHandler.js";

// 📚 Get all books
const getBooks = asyncHandler(async (req, res) => {
  const books = await Book.find(); 
  // populate -> if you want reviewer details

  if (!books || books.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No books found",
    });
  }

  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
  });
});

export { getBooks };
