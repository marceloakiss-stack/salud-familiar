using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("personas")]
    public class Persona
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("nombre")]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        [MaxLength(1)] 
        [Column("sexo")]
        public string Sexo { get; set; } = string.Empty;

        [Required]
        [Column("fecha_nacimiento")]
        public DateTime FechaNacimiento { get; set; }

        [Required]
        [Column("altura")]
        public int Altura { get; set; }

        public ICollection<Registro> Registros { get; set; } = new List<Registro>();
    }
}
