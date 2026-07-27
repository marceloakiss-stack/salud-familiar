using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegistrosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RegistrosController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Registros
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Registro>>> GetRegistros()
        {
            return await _context.Registros.Include(r => r.Persona).ToListAsync();
        }

        // GET: api/Registros/persona/5
        [HttpGet("persona/{personaId}")]
        public async Task<ActionResult<IEnumerable<Registro>>> GetRegistrosPorPersona(int personaId)
        {
            var registros = await _context.Registros
                .Where(r => r.PersonaId == personaId)
                .OrderByDescending(r => r.Fecha)
                .ToListAsync();

            return registros;
        }

        // POST: api/Registros
        [HttpPost]
        public async Task<ActionResult<Registro>> PostRegistro(RegistroInput dto)
        {
            var persona = await _context.Personas.FindAsync(dto.PersonaId);
            if (persona == null) return NotFound("Persona no encontrada");

            decimal alturaEnMetros = persona.Altura / 100m;
            decimal imc = dto.Peso / (alturaEnMetros * alturaEnMetros);

            var registro = new Registro
            {
                PersonaId = dto.PersonaId,
                Peso = dto.Peso,
                IMC = Math.Round(imc, 2),
                Diagnostico = dto.Diagnostico,
                Fecha = DateTime.UtcNow
            };

            _context.Registros.Add(registro);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRegistros), new { id = registro.Id }, registro);
        }
    }

    public class RegistroInput
    {
        public int PersonaId { get; set; }
        public decimal Peso { get; set; }
        public string? Diagnostico { get; set; }
    }
}