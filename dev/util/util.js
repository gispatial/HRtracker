//! UTIL FUNCTION : Add .catch() block to asynchronous functions
// const catchAsync = fn => {
//   return (...arg) => {
//     try {
//       fn(...arg);
//     } catch (err) {
//       const error = new Error(
//         "🚨 Error occured from database or prompt! Please try again later or report the issue."
//       );
//       throw error;
//     }
//   };
// };

const catchAsync = fn => {
  return (...arg) => {
    fn(...arg).catch(err => {
      const error = new Error(
        "🚨 Error occured from database or prompt! Please try again later or report the issue."
      );
      throw error;
    });
  };
};

//! UTILL FUNCTION : Get a query result and print it
const showTable = catchAsync(async (db, choice, query, args) => {
  const result = await db.query(query, args);

  const firstWordOfAnswer = choice.split(" ")[0];

  // CASE 1. View & Check : print a query result in table
  if (firstWordOfAnswer === "View" || firstWordOfAnswer === "Check") {
    console.table("\n", result);
  } else {
    // CASE 2. Add, Update, Delete : no print a query result but general alert
    const action = firstWordOfAnswer.endsWith("e")
      ? firstWordOfAnswer + "d"
      : firstWordOfAnswer + "ed";

    console.log(`👍 Successfully ${action}!`);
  }
});

module.exports = { catchAsync, showTable };
