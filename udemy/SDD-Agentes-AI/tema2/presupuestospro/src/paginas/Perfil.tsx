import { useState } from 'react'
import { useDatos } from '../almacen/useDatos'
import { Aviso } from '../componentes/Aviso'
import { Boton } from '../componentes/Boton'
import { CampoTexto } from '../componentes/CampoTexto'

/** Tamaño máximo del logo: el almacenamiento del navegador es limitado. */
const MAXIMO_LOGO_BYTES = 1024 * 1024
const FORMATOS_LOGO = ['image/png', 'image/jpeg']

/** Datos y marca del freelancer. Se rellenan una vez y salen solos en cada PDF. */
export function Perfil() {
  const { datos, guardarPerfil } = useDatos()

  // El logo se guarda al momento; los textos, al pulsar "Guardar".
  const [nombre, setNombre] = useState(datos.perfil.nombre)
  const [nif, setNif] = useState(datos.perfil.nif)
  const [contacto, setContacto] = useState(datos.perfil.contacto)
  const [guardadoOk, setGuardadoOk] = useState(false)
  const [errorLogo, setErrorLogo] = useState<string | null>(null)

  function guardarTextos() {
    guardarPerfil({ ...datos.perfil, nombre, nif, contacto })
    setGuardadoOk(true)
  }

  function elegirLogo(archivo: File | undefined) {
    setErrorLogo(null)
    if (!archivo) return

    if (!FORMATOS_LOGO.includes(archivo.type)) {
      setErrorLogo('El logo tiene que ser una imagen PNG o JPG.')
      return
    }

    if (archivo.size > MAXIMO_LOGO_BYTES) {
      setErrorLogo(
        'Ese logo pesa más de 1 MB y no cabe en el almacenamiento del navegador. Prueba con una imagen más ligera: para el PDF basta con unos 600 píxeles de ancho.',
      )
      return
    }

    const lector = new FileReader()
    lector.onerror = () => setErrorLogo('No se ha podido leer el archivo. Prueba con otra imagen.')
    lector.onload = () => {
      const contenido = String(lector.result)
      const imagen = new Image()
      imagen.onerror = () =>
        setErrorLogo('Esa imagen no se ha podido abrir. Prueba con otro archivo PNG o JPG.')
      // Se guardan las medidas originales para respetar la proporción en el PDF.
      imagen.onload = () => {
        guardarPerfil({
          ...datos.perfil,
          logo: { datos: contenido, ancho: imagen.naturalWidth, alto: imagen.naturalHeight },
        })
      }
      imagen.src = contenido
    }
    lector.readAsDataURL(archivo)
  }

  return (
    <>
      <div className="tarjeta">
        <h1>Mi perfil</h1>
        <p className="subtitulo">
          Estos datos aparecen en todos tus PDFs. Si los cambias, los presupuestos que descargues a
          partir de ahora saldrán con la marca nueva.
        </p>

        <div className="rejilla-doble">
          <CampoTexto
            etiqueta="Nombre o razón social"
            valor={nombre}
            onCambiar={(valor) => {
              setNombre(valor)
              setGuardadoOk(false)
            }}
          />
          <CampoTexto
            etiqueta="NIF"
            valor={nif}
            ayuda="Se imprime tal y como lo escribas."
            onCambiar={(valor) => {
              setNif(valor)
              setGuardadoOk(false)
            }}
          />
        </div>

        <CampoTexto
          etiqueta="Datos de contacto"
          valor={contacto}
          multilinea
          ayuda="Dirección, correo y teléfono, cada cosa en una línea."
          onCambiar={(valor) => {
            setContacto(valor)
            setGuardadoOk(false)
          }}
        />

        <Boton variante="principal" ancho onClick={guardarTextos}>
          Guardar
        </Boton>

        {guardadoOk && <p className="campo-ayuda">Guardado. Tus datos ya están en este navegador.</p>}
      </div>

      <div className="tarjeta">
        <h2>Mi logo</h2>
        <p className="subtitulo">
          Opcional: si no pones logo, el PDF se genera igual, solo que sin imagen.
        </p>

        {datos.perfil.logo && (
          <p>
            <img
              className="logo-vista-previa"
              src={datos.perfil.logo.datos}
              alt="Vista previa de tu logo"
            />
          </p>
        )}

        <label className="campo">
          <span className="campo-etiqueta">
            {datos.perfil.logo ? 'Cambiar el logo' : 'Subir un logo'}
          </span>
          <input
            type="file"
            accept="image/png,image/jpeg"
            onChange={(e) => elegirLogo(e.target.files?.[0])}
          />
          <span className="campo-ayuda">PNG o JPG, hasta 1 MB.</span>
        </label>

        {errorLogo && (
          <Aviso tono="error" onCerrar={() => setErrorLogo(null)}>
            {errorLogo}
          </Aviso>
        )}

        {datos.perfil.logo && (
          <Boton
            variante="peligro"
            onClick={() => guardarPerfil({ ...datos.perfil, logo: null })}
          >
            Quitar el logo
          </Boton>
        )}
      </div>
    </>
  )
}
