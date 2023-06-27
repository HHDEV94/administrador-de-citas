const formulario = document.querySelector('#nueva-cita')
const mascotaInput = document.querySelector('#mascota')
const propietarioInput = document.querySelector('#propietario')
const telefonoInput = document.querySelector('#telefono')
const fechaInput = document.querySelector('#fecha')
const horaInput = document.querySelector('#hora')
const sintomasInput = document.querySelector('#sintomas')

const listadoCitas = document.querySelector('#citas')

let editMode = false

class Citas {
  constructor() {
    this.citas = []
  }

  agregarCita(cita) {
    this.citas = [...this.citas, cita]
  }

  deleteAppoinment(id) {
    this.citas = this.citas.filter(cita => cita.id !== id)
  }

  editCita(citaUpdated) {
    this.citas = this.citas.map(cita => (cita.id === citaUpdated.id ? citaUpdated : cita))
  }
}

class UI {
  showAlert(msg, type) {
    const divMsg = document.createElement('div')
    divMsg.textContent = msg
    divMsg.classList.add('text-center', 'alert', 'd-block', 'col-12')

    if (type === 'error') {
      divMsg.classList.add('alert-danger')
    } else {
      divMsg.classList.add('alert-success')
    }

    formulario.appendChild(divMsg)

    setTimeout(() => {
      divMsg.remove()
    }, 2500)
  }

  showCitas({ citas }) {
    this.clearHtml()
    citas.forEach(cita => {
      const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita
      const iconDelete = `
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          stroke-width='1.5'
          stroke='currentColor'
          class='w-6 h-6'
        >
          <path
            stroke-linecap='round'
            stroke-linejoin='round'
            d='M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
      `
      const iconEdit = `
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          stroke-width='1.5'
          stroke='currentColor'
          class='w-6 h-6'
        >
          <path
            stroke-linecap='round'
            stroke-linejoin='round'
            d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10'
          />
        </svg>
      `

      const divCita = document.createElement('div')
      divCita.dataset.id = id
      divCita.classList.add('cita', 'p-3')

      const mascotaParrafo = document.createElement('h2')
      mascotaParrafo.classList.add('card-title', 'font-weight-bolder')
      mascotaParrafo.textContent = mascota

      const propietarioParrafo = this.factoryElement('Propietario', propietario)
      const telefonoParrafo = this.factoryElement('Telefono', telefono)
      const fechaParrafo = this.factoryElement('Fecha', fecha)
      const horaParrafo = this.factoryElement('Hora', hora)
      const sintomasParrafo = this.factoryElement('Sintomas', sintomas)

      const btnDelete = this.factoryButton('Delete', 'delete', deleteCita, id, iconDelete)
      const btnEdit = this.factoryButton('Edit', 'edit', editCita, cita, iconEdit)

      divCita.appendChild(mascotaParrafo)
      divCita.appendChild(propietarioParrafo)
      divCita.appendChild(telefonoParrafo)
      divCita.appendChild(fechaParrafo)
      divCita.appendChild(horaParrafo)
      divCita.appendChild(sintomasParrafo)
      divCita.appendChild(btnDelete)
      divCita.appendChild(btnEdit)

      listadoCitas.appendChild(divCita)
    })
  }

  factoryElement(label, name) {
    const elem = document.createElement('p')

    elem.innerHTML = `
      <span class="font-weight-bolder">${label}: ${name}</span>
    `

    return elem
  }

  factoryButton(name, type, fn, fnParameter, icon) {
    const btn = document.createElement('button')
    btn.innerHTML = `${name} ${icon}`
    btn.onclick = () => fn(fnParameter)

    if (type === 'delete') {
      btn.classList.add('btn', 'btn-danger', 'mr-2')
      return btn
    } else {
      btn.classList.add('btn', 'btn-info')
      return btn
    }
  }

  clearHtml() {
    while (listadoCitas.firstChild) {
      listadoCitas.removeChild(listadoCitas.firstChild)
    }
  }
}

const ui = new UI()
const adminCitas = new Citas()

eventListeners()
function eventListeners() {
  formulario.addEventListener('submit', nuevaCita)

  mascotaInput.addEventListener('input', datosCita)
  propietarioInput.addEventListener('input', datosCita)
  telefonoInput.addEventListener('input', datosCita)
  fechaInput.addEventListener('input', datosCita)
  horaInput.addEventListener('input', datosCita)
  sintomasInput.addEventListener('input', datosCita)
}

const citasObj = {
  mascota: '',
  propietario: '',
  telefono: '',
  fecha: '',
  hora: '',
  sintomas: ''
}

function datosCita(e) {
  citasObj[e.target.name] = e.target.value
}

function nuevaCita(e) {
  e.preventDefault()

  const { mascota, propietario, telefono, fecha, hora, sintomas } = citasObj
  if ([mascota, propietario, telefono, fecha, hora, sintomas].includes('')) {
    ui.showAlert('There is at least an empty field!', 'error')

    return
  }

  if (editMode) {
    ui.showAlert('Editado correctamente!')
    adminCitas.editCita({ ...citasObj })

    formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita'

    editMode = false
  } else {
    citasObj.id = Date.now()

    adminCitas.agregarCita({ ...citasObj })
    ui.showAlert('Se agregó correctamente!')
  }

  ui.showCitas(adminCitas)

  formulario.reset()
  resetObj()
}

function deleteCita(id) {
  adminCitas.deleteAppoinment(id)

  ui.showCitas(adminCitas)
}

function editCita(cita) {
  editMode = true
  const { mascota, propietario, telefono, fecha, hora, sintomas } = cita

  mascotaInput.value = mascota
  propietarioInput.value = propietario
  telefonoInput.value = telefono
  fechaInput.value = fecha
  horaInput.value = hora
  sintomasInput.value = sintomas

  citasObj.mascota = mascota
  citasObj.propietario = propietario
  citasObj.telefono = telefono
  citasObj.fecha = fecha
  citasObj.hora = hora
  citasObj.sintomas = sintomas

  formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios'
}

function resetObj() {
  citasObj.mascota = ''
  citasObj.propietario = ''
  citasObj.telefono = ''
  citasObj.fecha = ''
  citasObj.hora = ''
  citasObj.sintomas = ''
}
