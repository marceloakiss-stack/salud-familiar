import { useState, useEffect } from 'react'
import './styles/App.css'
import './styles/Home.css'
import './styles/Personas.css'
import './styles/Historial.css'

// Variable corregida y usada en TODAS las peticiones
const API = 'https://salud-familiar-backend.onrender.com';

function App() {
  const [vista, setVista] = useState('home')
  const [personaSeleccionada, setPersonaSeleccionada] = useState(null)

  return (
    <div>
      {vista !== 'home' && (
        <nav className="nav">
          <h1>Salud Familiar</h1>
          <button className="btn-nav" onClick={() => setVista('home')}>
            ← Volver al Inicio
          </button>
        </nav>
      )}

      {vista === 'home' && <Home onIngresar={() => setVista('personas')} />}
      {vista === 'personas' && <Personas onVerHistorial={(p) => {
        setPersonaSeleccionada(p)
        setVista('historial')
      }} />}
      {vista === 'historial' && personaSeleccionada && (
        <Historial
          persona={personaSeleccionada}
          onVolver={() => setVista('personas')}
        />
      )}
    </div>
  )
}

function Home({ onIngresar }) {
  return (
    <div className="home-container">
      <h1>🏥 Salud Familiar</h1>
      <p>Sistema de Control de Peso y Nutrición</p>
      <button className="btn-primary" onClick={onIngresar}>
        Ingresar al Sistema
      </button>
    </div>
  )
}

function Personas({ onVerHistorial }) {
  const [personas, setPersonas] = useState([])
  const [formulario, setFormulario] = useState({
    id: 0,
    nombre: '',
    sexo: 'M',
    fechaNacimiento: '',
    altura: ''
  })
  const [editando, setEditando] = useState(null)

  const cargarPersonas = async () => {
    try {
      const res = await fetch(`${API}/api/Personas`)
      const data = await res.json()
      setPersonas(data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    cargarPersonas()
  }, [])

  const calcularEdad = (fechaNac) => {
    const hoy = new Date()
    const nac = new Date(fechaNac)
    let edad = hoy.getFullYear() - nac.getFullYear()
    const mes = hoy.getMonth() - nac.getMonth()
    if (mes < 0 || (mes === 0 && hoy.getDate() < nac.getDate())) {
      edad--
    }
    return edad
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const datos = {
        id: editando ? editando.id : 0,
        nombre: formulario.nombre.toUpperCase(),
        sexo: formulario.sexo,
        fechaNacimiento: formulario.fechaNacimiento,
        altura: parseInt(formulario.altura)
      }

      if (editando) {
        await fetch(`${API}/api/Personas/${editando.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datos)
        })
      } else {
        await fetch(`${API}/api/Personas`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datos)
        })
      }

      setFormulario({ id: 0, nombre: '', sexo: 'M', fechaNacimiento: '', altura: '' })
      setEditando(null)
      cargarPersonas()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const editar = (persona) => {
    setFormulario({
      id: persona.id,
      nombre: persona.nombre,
      sexo: persona.sexo,
      fechaNacimiento: persona.fechaNacimiento.split('T')[0],
      altura: persona.altura.toString()
    })
    setEditando(persona)
  }

  const eliminar = async (id) => {
    if (confirm('¿Está seguro de eliminar esta persona y todos sus registros?')) {
      await fetch(`${API}/api/Personas/${id}`, { method: 'DELETE' })
      cargarPersonas()
    }
  }

  return (
    <div className="personas-container">
      <h2>📋 ABM de Personas</h2>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Apellido y Nombres</label>
              <input
                type="text"
                value={formulario.nombre}
                onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value.toUpperCase() })}
                required
              />
            </div>
            <div className="form-group">
              <label>Sexo</label>
              <select
                value={formulario.sexo}
                onChange={(e) => setFormulario({ ...formulario, sexo: e.target.value })}
              >
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>
            <div className="form-group">
              <label>Fecha de Nacimiento</label>
              <input
                type="date"
                value={formulario.fechaNacimiento}
                onChange={(e) => setFormulario({ ...formulario, fechaNacimiento: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Altura (cm)</label>
              <input
                type="number"
                value={formulario.altura}
                onChange={(e) => setFormulario({ ...formulario, altura: e.target.value })}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn-add">
            {editando ? '✏️ Actualizar' : '➕ Agregar Persona'}
          </button>
        </form>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Apellido y Nombres</th>
              <th>Sexo</th>
              <th>Fecha Nacimiento</th>
              <th>Edad</th>
              <th>Altura</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {personas.map(p => (
              <tr key={p.id}>
                <td data-label="ID">{p.id}</td>
                <td data-label="Nombre">{p.nombre}</td>
                <td data-label="Sexo">{p.sexo === 'M' ? 'Masculino' : 'Femenino'}</td>
                <td data-label="Fecha Nac.">{new Date(p.fechaNacimiento).toLocaleDateString()}</td>
                <td data-label="Edad">{calcularEdad(p.fechaNacimiento)} años</td>
                <td data-label="Altura">{p.altura} cm</td>
                <td data-label="Acciones">
                  <button className="btn-action btn-edit" onClick={() => editar(p)}>✏️</button>
                  <button className="btn-action btn-delete" onClick={() => eliminar(p.id)}>🗑️</button>
                  <button className="btn-action btn-historial" onClick={() => onVerHistorial(p)}>📊 Historial</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Historial({ persona, onVolver }) {
  const [registros, setRegistros] = useState([])
  const [formulario, setFormulario] = useState({
    peso: '',
    diagnostico: ''
  })

  const cargarRegistros = async () => {
    try {
      const res = await fetch(`${API}/api/Registros/persona/${persona.id}`)
      if (res.ok) {
        const data = await res.json()
        setRegistros(data)
      } else {
        setRegistros([])
      }
    } catch (error) {
      console.error('Error:', error)
      setRegistros([])
    }
  }

  useEffect(() => {
    cargarRegistros()
  }, [persona.id])

  const getDiagnosticoIMC = (imc) => {
    if (imc < 18.5) return { texto: 'Bajo Peso', clase: 'imc-bajo' }
    if (imc < 25) return { texto: 'Peso Normal', clase: 'imc-normal' }
    if (imc < 30) return { texto: 'Sobrepeso', clase: 'imc-sobrepeso' }
    if (imc < 35) return { texto: 'Obesidad Grado 1', clase: 'imc-obesidad1' }
    if (imc < 40) return { texto: 'Obesidad Grado 2', clase: 'imc-obesidad2' }
    return { texto: 'Obesidad Grado 3', clase: 'imc-obesidad3' }
  }

  const calcularPesoIdeal = (altura, sexo) => {
    if (sexo === 'M') {
      return altura - 100 - ((altura - 150) / 4)
    } else {
      return altura - 100 - ((altura - 150) / 2.5)
    }
  }

  const calcularRangoSaludable = (altura) => {
    const alturaM = altura / 100
    const min = (18.5 * alturaM * alturaM).toFixed(1)
    const max = (24.9 * alturaM * alturaM).toFixed(1)
    return { min, max }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await fetch(`${API}/api/Registros`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personaId: persona.id,
          peso: parseFloat(formulario.peso),
          diagnostico: formulario.diagnostico
        })
      })
      setFormulario({ peso: '', diagnostico: '' })
      cargarRegistros()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const imprimirHistorial = () => {
    window.print()
  }

  return (
    <div className="historial-container">
      <button className="btn-back" onClick={onVolver}>
        ← Volver a Personas
      </button>

      <h2>📊 Historial de {persona.nombre}</h2>

      <div className="persona-info">
        <strong>Edad:</strong> {new Date().getFullYear() - new Date(persona.fechaNacimiento).getFullYear()} años |
        <strong> Altura:</strong> {persona.altura} cm
      </div>

      <div className="peso-ideal-card">
        <h3>🎯 Tu Objetivo</h3>
        <div className="peso-ideal-info">
          <div>
            <strong>Peso ideal (Lorentz):</strong>
            <span className="peso-ideal-numero">
              {calcularPesoIdeal(persona.altura, persona.sexo).toFixed(1)} kg
            </span>
          </div>
          <div>
            <strong>Rango saludable (OMS):</strong>
            <span className="peso-rango">
              {(() => {
                const rango = calcularRangoSaludable(persona.altura)
                return `${rango.min} kg - ${rango.max} kg`
              })()}
            </span>
          </div>
        </div>
      </div>

      <div className="registro-form">
        <h3>Agregar Nuevo Registro</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Peso (kg)</label>
              <input
                type="number"
                step="0.1"
                value={formulario.peso}
                onChange={(e) => setFormulario({ ...formulario, peso: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Observaciones</label>
              <input
                type="text"
                value={formulario.diagnostico}
                onChange={(e) => setFormulario({ ...formulario, diagnostico: e.target.value })}
                placeholder="Ej: Control mensual"
              />
            </div>
          </div>
          <button type="submit" className="btn-add">💾 Guardar Registro</button>
          <button type="button" className="btn-print" onClick={imprimirHistorial}>
            🖨️ Imprimir/Exportar
          </button>
        </form>
      </div>

      <div className="table-container">
        <h3>Historial de Pesajes</h3>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Peso</th>
              <th>IMC</th>
              <th>Diagnóstico IMC</th>
              <th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {registros.length === 0 ? (
              <tr><td colSpan="5">No hay registros</td></tr>
            ) : (
              registros.map(r => {
                const diag = getDiagnosticoIMC(r.imc)
                return (
                  <tr key={r.id}>
                    <td data-label="Fecha">{new Date(r.fecha).toLocaleDateString()}</td>
                    <td data-label="Peso">{r.peso} kg</td>
                    <td data-label="IMC"><strong>{r.imc}</strong></td>
                    <td data-label="Diagnóstico">
                      <span className={`imc-indicator ${diag.clase}`}>
                        {diag.texto}
                      </span>
                    </td>
                    <td data-label="Obs.">{r.diagnostico || '-'}</td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App