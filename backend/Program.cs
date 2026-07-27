using backend.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// 1. Habilitar CORS para Swagger
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

// 2. Conexión a la base de datos (Neon)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));

// 3. Controladores + SOLUCIÓN AL CICLO INFINITO DE JSON
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Esto le dice a JSON: "Si ves que Persona tiene Registros y Registro tiene Persona, IGNORA la vuelta y cortá el ciclo"
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.WriteIndented = true; // Para que se vea ordenado en Swagger
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();
}

app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

app.Run();