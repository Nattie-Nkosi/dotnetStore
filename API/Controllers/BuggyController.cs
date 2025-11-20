using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class BuggyController : BaseApiController
{
    [HttpGet("not-found")]
    public IActionResult GetNotFound()
    {
        return NotFound(new ProblemDetails { Title = "Resource not found" });
    }

    [HttpGet("bad-request")]
    public IActionResult GetBadRequest()
    {
        return BadRequest(new ProblemDetails { Title = "This is a bad request" });
    }

    [HttpGet("unauthorized")]
    public IActionResult GetUnauthorized()
    {
        return Unauthorized(new ProblemDetails { Title = "You are not authorized" });
    }

    [HttpGet("validation-error")]
    public IActionResult GetValidationError()
    {
        ModelState.AddModelError("Problem1", "This is the first error");
        ModelState.AddModelError("Problem2", "This is the second error");
        return ValidationProblem(); 
    }

    [HttpGet("server-error")]
    public IActionResult GetServerError()
    {
        throw new Exception("This is a server error");
    }

    [HttpGet("null-reference")]
    public ActionResult GetNullReference()
    {
        string? nullString = null;
        return Ok(nullString?.Length);
    }

    [HttpGet("divide-by-zero")]
    public ActionResult GetDivideByZero()
    {
        int zero = 0;
        int result = 100 / zero;
        return Ok(result);
    }

    [HttpGet("argument-null")]
    public ActionResult GetArgumentNull()
    {
        throw new ArgumentNullException("testParameter", "This parameter cannot be null");
    }

    [HttpGet("argument-exception")]
    public ActionResult GetArgumentException()
    {
        throw new ArgumentException("Invalid argument provided");
    }

    [HttpGet("invalid-operation")]
    public ActionResult GetInvalidOperation()
    {
        throw new InvalidOperationException("This operation is not valid in the current state");
    }
}