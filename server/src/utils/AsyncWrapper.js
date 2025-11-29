const AsyncWrapper = (fn)=>{
    return (req,res,next)=> {
        Promise.resolve(fn(req,res,next)).catch((err)=>next(err)) // error goes to global error handler middleware
    }
} 
module.exports = AsyncWrapper;