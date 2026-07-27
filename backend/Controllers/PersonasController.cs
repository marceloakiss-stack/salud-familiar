using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PersonasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PersonasController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Personas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Persona>>> GetPersonas()
        {
            return await _context.Personas.ToListAsync();
        }

        // GET: api/Personas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Persona>> GetPersona(int id)
        {
            var persona = await _context.Personas.FindAsync(id);
            if (persona == null) return NotFound();
            return persona;
        }

        // POST: api/Personas
        [HttpPost]
        public async Task<ActionResult<Persona>> PostPersona(Persona persona)
        {
            persona.FechaNacimiento = DateTime.SpecifyKind(persona.FechaNacimiento, DateTimeKind.Utc);
            _context.Personas.Add(persona);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetPersona), new { id = persona.Id }, persona);
        }

        // PUT: api/Personas/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPersona(int id, Persona persona)
        {
            if (id != persona.Id) return BadRequest();

            var personaExistente = await _context.Personas.FindAsync(id);
            if (personaExistente == null) return NotFound();

            personaExistente.Nombre = persona.Nombre;
            personaExistente.Sexo = persona.Sexo;
            personaExistente.FechaNacimiento = DateTime.SpecifyKind(persona.FechaNacimiento, DateTimeKind.Utc);
            personaExistente.Altura = persona.Altura;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Personas.Any(e => e.Id == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }


        // DELETE: api/Personas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePersona(int id)
        {
            var persona = await _context.Personas
                .Include(p => p.Registros)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (persona == null) return NotFound();

            // Primero eliminamos todos los registros de esta persona
            if (persona.Registros.Any())
            {
                _context.Registros.RemoveRange(persona.Registros);
            }

            // Luego eliminamos la persona
            _context.Personas.Remove(persona);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}