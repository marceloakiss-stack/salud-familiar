using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("registros")]
    public class Registro
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("persona_id")]
        public int PersonaId { get; set; }

        [Required]
        [Column("fecha")]
        public DateTime Fecha { get; set; }

        [Required]
        [Column("peso", TypeName = "numeric(5,2)")]
        public decimal Peso { get; set; }

        [Required]
        [Column("imc", TypeName = "numeric(5,2)")]
        public decimal IMC { get; set; }

        [MaxLength(255)]
        [Column("diagnostico")]
        public string? Diagnostico { get; set; }

        [ForeignKey("PersonaId")]
        public Persona Persona { get; set; } = null!;
    }
}
