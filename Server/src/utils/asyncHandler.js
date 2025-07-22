// this functio is used to make one async function which will be reusable so ni need to 
// write again and again same async syntax.

const asyncHandler = (fn) => async(req, res, next) =>{
    try {
      await fn(req, res, next)
    } catch (error) {
        res.status(error.code || 500).json({
            success: false,
            message: error.message
    })
    }
}

export default asyncHandler;