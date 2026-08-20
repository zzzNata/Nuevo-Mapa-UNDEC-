
    const subjects = [
      // AÑO 1 - CUATRIMESTRE 1
      { id: 111, name: "Matemática I",                      year: 1, sem: 1, prereqsCursar: [], prereqsRendir: [] },
      { id: 112, name: "Algoritmos y Estructuras de Datos", year: 1, sem: 1, prereqsCursar: [], prereqsRendir: [] },
      { id: 113, name: "Inglés",                            year: 1, sem: 1, prereqsCursar: [], prereqsRendir: [] },
      { id: 114, name: "Sistemas I",                        year: 1, sem: 1, prereqsCursar: [], prereqsRendir: [] },
      // AÑO 1 - CUATRIMESTRE 2
      { id: 121, name: "Bases de Datos I - Relacional",         year: 1, sem: 2, prereqsCursar: [114], prereqsRendir: [114] },
      { id: 122, name: "Programación Orientada a Objetos",      year: 1, sem: 2, prereqsCursar: [112], prereqsRendir: [112] },
      { id: 123, name: "Arquitectura de Computadoras",          year: 1, sem: 2, prereqsCursar: [],    prereqsRendir: [] },
      { id: 124, name: "Ética y Legislación",                   year: 1, sem: 2, prereqsCursar: [],    prereqsRendir: [] },
      // AÑO 2 - CUATRIMESTRE 1
      { id: 211, name: "Bases de Datos II - No Relacionales",   year: 2, sem: 1, prereqsCursar: [121],      prereqsRendir: [121] },
      { id: 212, name: "Sistemas Operativos",                   year: 2, sem: 1, prereqsCursar: [123],      prereqsRendir: [123] },
      { id: 213, name: "Diseño de Aplicaciones Web I",          year: 2, sem: 1, prereqsCursar: [122],      prereqsRendir: [122] },
      { id: 214, name: "Tecnología de Comunicaciones",          year: 2, sem: 1, prereqsCursar: [123],      prereqsRendir: [123] },
      // AÑO 2 - CUATRIMESTRE 2
      { id: 221, name: "Diseño de Aplicaciones Web II",         year: 2, sem: 2, prereqsCursar: [213], prereqsRendir: [213] },
      { id: 222, name: "Seguridad y Testing en Apps Web",       year: 2, sem: 2, prereqsCursar: [213], prereqsRendir: [213] },
      { id: 223, name: "Desarrollo Móvil",                      year: 2, sem: 2, prereqsCursar: [213], prereqsRendir: [213] },
      { id: 224, name: "Taller Integrador",                     year: 2, sem: 2, prereqsCursar: [111, 112, 113, 114, 121, 122, 123, 124],    prereqsRendir: [111, 112, 113, 114, 121, 122, 123, 124, 211, 212, 213, 214] }, // Para cursar pide todas las materias de 1er año aprobadas. Para rendir pide todas las materias anteriores aprobadas (incluyendo las de 2do año)
    ];

    const horariosIniciales = [
    {
        materia: "Arquitectura de Computadoras",
        dia: "Lunes",
        inicio: "18:00",
        fin: "20:00",
        modalidad: "Virtual"
    },
    {
        materia: "Bases de Datos I - Relacional",
        dia: "Lunes",
        inicio: "20:00",
        fin: "22:00",
        modalidad: "Virtual"
    },
    {
        materia: "Ética y Legislación",
        dia: "Martes",
        inicio: "20:00",
        fin: "22:00",
        modalidad: "Virtual"
    },
    {
        materia: "Programación Orientada a Objetos",
        dia: "Miércoles",
        inicio: "18:00",
        fin: "20:00",
        modalidad: "Virtual"
    }
  ];

    // Build unlocks map (combinando ambos tipos de prereqs)
    const unlocks = {};
    subjects.forEach(s => { unlocks[s.id] = []; });
    subjects.forEach(s => {
      const allPrereqs = [...new Set([...s.prereqsCursar, ...s.prereqsRendir])];
      allPrereqs.forEach(p => {
        if (!unlocks[p].includes(s.id)) unlocks[p].push(s.id);
      });
    });

    function getSubject(id) { return subjects.find(s => s.id === id); }

    const yearColors  = { 1: 'y1', 2: 'y2' };
    const yearAccents = { 1: '#00d4ff', 2: '#00ff9d' };

    function buildMap() {
      document.getElementById("yearsGrid").innerHTML = "";
      const grid = document.getElementById('yearsGrid');
      for (let y = 1; y <= 2; y++) {
        const col = document.createElement('div');
        col.className = `year-col ${yearColors[y]}`;
        col.innerHTML = `<div class="year-header" style="color:${yearAccents[y]};border-color:${yearAccents[y]}">Año ${y}</div>`;
        for (let sem = 1; sem <= 2; sem++) {
          const group = document.createElement('div');
          group.className = 'semester-group';
          group.style.borderColor = `${yearAccents[y]}33`;
          group.innerHTML = `<div class="semester-label">${sem === 1 ? '1er' : '2do'} Cuatrimestre</div>`;
          const subs = subjects.filter(s => s.year === y && s.sem === sem);
          subs.forEach(s => {
            const card = document.createElement('div');
            card.className = 'subject-card';
            card.id = `card-${s.id}`;
            const allPrereqs = [...new Set([...s.prereqsCursar, ...s.prereqsRendir])];
            const freeLabel = allPrereqs.length === 0 ? '<span class="badge badge-free">Libre</span>' : '';
            const prereqLabel = allPrereqs.length > 0 ? `<span class="badge badge-prereq">Req: ${allPrereqs.join(', ')}</span>` : '';
            const unlocksLabel = unlocks[s.id].length > 0 ? `<span class="badge badge-unlocks">→ ${unlocks[s.id].join(', ')}</span>` : '';
            card.innerHTML = `
              <div class="card-num">${s.id}</div>
              <div class="card-info">
                <div class="card-name">${s.name}</div>
                <div class="card-meta">
                  ${freeLabel}${prereqLabel}${unlocksLabel}
                </div>
              </div>`;
            card.addEventListener('click', () => showDetail(s.id));
            group.appendChild(card);
          });
          col.appendChild(group);
        }
        grid.appendChild(col);
      }
    }

    function mostrarHorarios() {
  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

  dias.forEach(dia => {
    const contenedor = document.querySelector(`.dia-contenido[data-dia="${dia}"]`);
    if (!contenedor) return;

    contenedor.innerHTML = "";

    const horariosDelDia = estudiante.horarios.filter(horario => horario.dia === dia);

    if (horariosDelDia.length === 0) {
      contenedor.innerHTML = `<div class="dia-vacio">Sin clases</div>`;
      return;
    }

    horariosDelDia.sort((a, b) => a.inicio.localeCompare(b.inicio));

    horariosDelDia.forEach(horario => {
      const clase = document.createElement("div");
      clase.className = "clase-agenda";

      clase.innerHTML = `
        <div class="clase-hora">${horario.inicio} — ${horario.fin}</div>
        <div class="clase-materia">${horario.materia}</div>
        <div class="clase-modalidad">${horario.modalidad}</div>
      `;

      const materia = subjects.find(subject => subject.name === horario.materia);
      if (materia) {
        clase.onclick = () => showDetail(materia.id);
      }

      contenedor.appendChild(clase);
    });
  });
}
  


    let activeId = null;

    function highlightRelated(id) {
      const s = getSubject(id);
      const allPrereqs = [...new Set([...s.prereqsCursar, ...s.prereqsRendir])];
      const prereqSet = new Set(allPrereqs);
      const unlocksSet = new Set(unlocks[id]);
      subjects.forEach(sub => {
        const card = document.getElementById(`card-${sub.id}`);
        if (!card) return;
        card.classList.remove('highlighted', 'prereq', 'unlocks', 'dimmed');
        if (sub.id === id) card.classList.add('highlighted');
        else if (prereqSet.has(sub.id)) card.classList.add('prereq');
        else if (unlocksSet.has(sub.id)) card.classList.add('unlocks');
        else card.classList.add('dimmed');
      });
    }

    function clearHighlights() {
      subjects.forEach(sub => {
        const card = document.getElementById(`card-${sub.id}`);
        if (!card) return;
        card.classList.remove('highlighted', 'prereq', 'unlocks', 'dimmed');
      });
    }

    function showDetail(id) {
      activeId = id;
      const s = getSubject(id);
      highlightRelated(id);
      updateStateButtons(id);

      document.getElementById('dNum').textContent = s.id;
      document.getElementById('dName').textContent = s.name;
      document.getElementById('dMeta').textContent = `AÑO ${s.year}  ·  ${s.sem === 1 ? '1° CUATRIMESTRE' : '2° CUATRIMESTRE'}`;

      // Para cursar
      const cursarSec = document.getElementById('dCursarSection');
      if (s.prereqsCursar.length > 0) {
        const pills = s.prereqsCursar.map(pid => {
          const ps = getSubject(pid);
          return `<div class="detail-pill pill-prereq" onclick="showDetail(${pid})"><span class="pill-num">${pid}</span><span class="pill-name">${ps.name}</span></div>`;
        }).join('');
        cursarSec.innerHTML = `<div class="detail-section-title">Para cursar (regular)</div><div class="detail-pills">${pills}</div>`;
      } else {
        cursarSec.innerHTML = `<div class="detail-section-title">Para cursar</div><div class="detail-pills"><div class="detail-pill" style="background:rgba(255,255,255,0.03);border:1px solid #1a3a5c;color:#4a7a9b">Sin requisitos — libre cursada</div></div>`;
      }

      // Para rendir
      const rendirSec = document.getElementById('dRendirSection');
      if (s.prereqsRendir.length > 0) {
        const pills = s.prereqsRendir.map(pid => {
          const ps = getSubject(pid);
          return `<div class="detail-pill pill-rendir" onclick="showDetail(${pid})"><span class="pill-num">${pid}</span><span class="pill-name">${ps.name}</span></div>`;
        }).join('');
        rendirSec.innerHTML = `<div class="detail-section-title">Para rendir (aprobada)</div><div class="detail-pills">${pills}</div>`;
      } else {
        rendirSec.innerHTML = `<div class="detail-section-title">Para rendir</div><div class="detail-pills"><div class="detail-pill" style="background:rgba(255,255,255,0.03);border:1px solid #1a3a5c;color:#4a7a9b">Sin requisitos previos</div></div>`;
      }

      // Desbloquea
      const unlocksSec = document.getElementById('dUnlocksSection');
      const ul = unlocks[id];
      if (ul.length > 0) {
        const pills = ul.map(uid => {
          const us = getSubject(uid);
          return `<div class="detail-pill pill-unlocks" onclick="showDetail(${uid})"><span class="pill-num">${uid}</span><span class="pill-name">${us.name}</span></div>`;
        }).join('');
        unlocksSec.innerHTML = `<div class="detail-section-title">Al aprobar, desbloquea</div><div class="detail-pills">${pills}</div>`;
      } else {
        unlocksSec.innerHTML = `<div class="detail-section-title">Al aprobar, desbloquea</div><div class="detail-pills"><div class="detail-pill" style="background:rgba(255,255,255,0.03);border:1px solid #1a3a5c;color:#4a7a9b">No desbloquea otras materias</div></div>`;
      }

      document.getElementById('overlay').classList.add('visible');
      document.getElementById('detailPanel').classList.add('visible');
    }

    function closeDetail() {
      activeId = null;
      clearHighlights();
      document.getElementById('overlay').classList.remove('visible');
      document.getElementById('detailPanel').classList.remove('visible');
    }

    let estudiante = null;
    let modoEdicionHorarios = false;

    function registrar() {
      let nombre = document.getElementById("nombre").value;
      let apellido = document.getElementById("apellido").value;
      if (nombre === "" || apellido === "") {
        alert("Por favor completá nombre y apellido");
        return;
      }
      
      let nuevoEstudiante = {
        id: Date.now(),
        nombre,
        apellido,

        materias: {
        aprobadas: [],
        sin_cursar: [],
        cursando: [],
        reprobadas: []
        },

        horarios: [...horariosIniciales]
      };

      subjects.forEach(s => nuevoEstudiante.materias.sin_cursar.push(s.id));
      let usuarios = JSON.parse(localStorage.getItem("usuarios_dw")) || [];
      usuarios.push(nuevoEstudiante);
      localStorage.setItem("usuarios_dw", JSON.stringify(usuarios));
      localStorage.setItem("usuarioActivo_dw", nuevoEstudiante.id);
      location.reload();
    }

    function setMateriaState(nuevoEstado) {
      if (!activeId) return;
      const s = getSubject(activeId);

      if (nuevoEstado === "cursando") {
        // Para cursar: prereqsCursar deben estar en cursando o aprobadas
        const faltantes = s.prereqsCursar.filter(id =>
          !estudiante.materias.aprobadas.includes(id) &&
          !estudiante.materias.cursando.includes(id)
        );
        if (faltantes.length > 0) {
          const nombres = faltantes.map(id => getSubject(id).name);
          alert(`Para cursar esta materia primero debés regularizar:\n${nombres.join(", ")}`);
          return;
        }
      }

      if (nuevoEstado === "aprobadas") {
        // Para rendir: prereqsRendir deben estar aprobadas
        const faltantes = s.prereqsRendir.filter(id =>
          !estudiante.materias.aprobadas.includes(id)
        );
        if (faltantes.length > 0) {
          const nombres = faltantes.map(id => getSubject(id).name);
          alert(`Para aprobar esta materia primero debés tener aprobadas:\n${nombres.join(", ")}`);
          return;
        }
      }

      for (let key in estudiante.materias) {
        estudiante.materias[key] = estudiante.materias[key].filter(id => id !== activeId);
      }
      estudiante.materias[nuevoEstado].push(activeId);

      let usuarios = JSON.parse(localStorage.getItem("usuarios_dw"));
      let idx = usuarios.findIndex(u => u.id === estudiante.id);
      usuarios[idx] = estudiante;
      localStorage.setItem("usuarios_dw", JSON.stringify(usuarios));
      actualizarEstilosMaterias();
      updateStateButtons(activeId);
      actualizarContadores();
    }

    function updateStateButtons(id) {
      document.querySelectorAll('.state-btn').forEach(btn => btn.classList.remove('active'));
      let estadoActual = 'sin_cursar';
      if (estudiante.materias.aprobadas.includes(id)) estadoActual = 'aprobadas';
      else if (estudiante.materias.cursando.includes(id)) estadoActual = 'cursando';
      else if (estudiante.materias.reprobadas.includes(id)) estadoActual = 'reprobadas';
      const btnActivo = document.querySelector(`.state-btn[data-state="${estadoActual}"]`);
      if (btnActivo) btnActivo.classList.add('active');
    }

    function actualizarEstilosMaterias() {
      subjects.forEach(m => {
        const card = document.getElementById(`card-${m.id}`);
        if (!card) return;
        card.classList.remove('state-aprobadas', 'state-cursando', 'state-reprobadas');
        if (estudiante.materias.aprobadas.includes(m.id)) card.classList.add('state-aprobadas');
        else if (estudiante.materias.cursando.includes(m.id)) card.classList.add('state-cursando');
        else if (estudiante.materias.reprobadas.includes(m.id)) card.classList.add('state-reprobadas');
      });
    }

    function actualizarContadores() {
      const numAprobadas = estudiante.materias.aprobadas.length;
      document.getElementById('statAprobadas').textContent = `${numAprobadas} / 16`;
    }

    
    function mostrarMapa() {
      document.getElementById("pantallaLogin").style.display = "none";
      document.getElementById("mapaMaterias").style.display = "none";
      document.getElementById("menuPrincipal").style.display = "flex";
    }
     
    function entrarMaterias() {

    document.getElementById("menuPrincipal").style.display = "none";
    document.getElementById("mapaMaterias").style.display = "block";

    buildMap();
    actualizarEstilosMaterias();
    actualizarContadores();
    }
    
    function entrarHorarios() {

      document.getElementById("menuPrincipal").style.display = "none";
      document.getElementById("pantallaHorarios").style.display = "block";

      mostrarHorarios();
    }

    function activarEdicionHorarios() {

      modoEdicionHorarios = !modoEdicionHorarios;

      const agenda = document.getElementById("agendaSemanal");
      const boton = document.getElementById("botonEditarHorarios");

      if (modoEdicionHorarios) {

        agenda.classList.add("modo-edicion");

        boton.textContent = "✓ Terminar edición";

      } else {

        agenda.classList.remove("modo-edicion");

        boton.textContent = "✎ Editar horarios";
      }

    mostrarHorarios();
  }
    
    function volverMenu() {

      document.getElementById("mapaMaterias").style.display = "none";
      document.getElementById("pantallaHorarios").style.display = "none";
      document.getElementById("menuPrincipal").style.display = "flex";
    }

    // LÓGICA DE GESTIÓN Y EDICIÓN DE HORARIOS

function poblarSelectMaterias() {
  const select = document.getElementById("selectMateria");
  if (!select) return;
  select.innerHTML = "";
  subjects.forEach(s => {
    const opt = document.createElement("option");
    opt.value = s.name;
    opt.textContent = s.name;
    select.appendChild(opt);
  });
}

function abrirPanelEdicionHorarios() {
  poblarSelectMaterias();
  renderizarListaHorariosAdmin();
  resetearFormularioHorario();
  
  document.getElementById("overlayHorarios").classList.add("visible");
  document.getElementById("modalEdicionHorarios").classList.add("visible");
}

function cerrarPanelEdicionHorarios() {
  document.getElementById("overlayHorarios").classList.remove("visible");
  document.getElementById("modalEdicionHorarios").classList.remove("visible");
  resetearFormularioHorario();
}

function resetearFormularioHorario() {
  document.getElementById("horarioEditIndex").value = "-1";
  document.getElementById("formHorario").reset();
  document.getElementById("tituloFormHorario").textContent = "// AGREGAR NUEVA CLASE";
  document.getElementById("btnGuardarHorario").textContent = "+ Agregar Clase";
  document.getElementById("btnCancelarEdicion").style.display = "none";
}

function renderizarListaHorariosAdmin() {
  const contenedor = document.getElementById("contenedorListaHorarios");
  if (!contenedor) return;
  contenedor.innerHTML = "";

  if (!estudiante.horarios || estudiante.horarios.length === 0) {
    contenedor.innerHTML = `<div style="color:var(--muted); font-size:11px; font-family:'Share Tech Mono'; text-align:center; padding:10px;">No tenés clases cargadas.</div>`;
    return;
  }

  estudiante.horarios.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "item-horario-admin";
    div.innerHTML = `
      <div class="item-horario-info">
        <span class="item-horario-titulo">${item.materia}</span>
        <span class="item-horario-sub">${item.dia} | ${item.inicio} - ${item.fin} | ${item.modalidad}</span>
      </div>
      <div class="item-horario-acciones">
        <button class="btn-item-edit" onclick="cargarHorarioParaEditar(${index})">✎</button>
        <button class="btn-item-del" onclick="eliminarHorarioDirecto(${index})">🗑</button>
      </div>
    `;
    contenedor.appendChild(div);
  });
}

function guardarHorario(e) {
  e.preventDefault();

  const editIndex = parseInt(document.getElementById("horarioEditIndex").value);
  const materia = document.getElementById("selectMateria").value;
  const dia = document.getElementById("selectDia").value;
  const modalidad = document.getElementById("selectModalidad").value;
  const inicio = document.getElementById("inputInicio").value;
  const fin = document.getElementById("inputFin").value;

  if (inicio >= fin) {
    alert("La hora de inicio debe ser anterior a la hora de fin.");
    return;
  }

  const nuevoHorario = { materia, dia, inicio, fin, modalidad };

  if (editIndex === -1) {
    // Agregar nuevo
    estudiante.horarios.push(nuevoHorario);
  } else {
    // Editar existente
    estudiante.horarios[editIndex] = nuevoHorario;
  }

  guardarEstudianteEnLocalStorage();
  mostrarHorarios();
  renderizarListaHorariosAdmin();
  resetearFormularioHorario();
}

function cargarHorarioParaEditar(index) {
  const h = estudiante.horarios[index];
  if (!h) return;

  document.getElementById("horarioEditIndex").value = index;
  document.getElementById("selectMateria").value = h.materia;
  document.getElementById("selectDia").value = h.dia;
  document.getElementById("selectModalidad").value = h.modalidad;
  document.getElementById("inputInicio").value = h.inicio;
  document.getElementById("inputFin").value = h.fin;

  document.getElementById("tituloFormHorario").textContent = "// EDITAR CLASE SELECCIONADA";
  document.getElementById("btnGuardarHorario").textContent = "✓ Guardar Cambios";
  document.getElementById("btnCancelarEdicion").style.display = "inline-block";
}

function eliminarHorarioDirecto(index) {
  if (confirm("¿Seguro que querés eliminar esta clase?")) {
    estudiante.horarios.splice(index, 1);
    guardarEstudianteEnLocalStorage();
    mostrarHorarios();
    renderizarListaHorariosAdmin();
  }
}

function guardarEstudianteEnLocalStorage() {
  let usuarios = JSON.parse(localStorage.getItem("usuarios_dw")) || [];
  let idx = usuarios.findIndex(u => u.id === estudiante.id);
  if (idx !== -1) {
    usuarios[idx] = estudiante;
    localStorage.setItem("usuarios_dw", JSON.stringify(usuarios));
  }
}

    if (localStorage.getItem("usuarioActivo_dw")) {
      let usuarios = JSON.parse(localStorage.getItem("usuarios_dw")) || [];
      let idActivo = parseInt(localStorage.getItem("usuarioActivo_dw"));
      estudiante = usuarios.find(u => u.id === idActivo);

    if (!estudiante.horarios) {
      estudiante.horarios = [...horariosIniciales];

    let indice = usuarios.findIndex(
        u => u.id === estudiante.id
    );

    usuarios[indice] = estudiante;

    localStorage.setItem(
        "usuarios_dw",
        JSON.stringify(usuarios)
    );
  }
    buildMap();
    actualizarEstilosMaterias(); 

      mostrarMapa();
    } else {
      document.getElementById("pantallaLogin").style.display = "flex";
      document.getElementById("mapaMaterias").style.display = "none";
    }

    function cerrarSesion() {
      localStorage.removeItem("usuarioActivo_dw");
      location.reload();
    }

    function mostrarUsuarios() {
      let usuarios = JSON.parse(localStorage.getItem("usuarios_dw")) || [];
      if (usuarios.length === 0) {
        alert("No existen usuarios registrados");
      } else {
        const lista = document.getElementById("listaUsuarios");
        document.getElementById("yaTengoBtn").style.display = "none";
        for (let usuario of usuarios) {
          const btn = document.createElement("button");
          btn.className = "usuario-btn";
          btn.textContent = `${usuario.nombre} ${usuario.apellido}`;
          btn.onclick = function() {
            localStorage.setItem("usuarioActivo_dw", usuario.id);
            location.reload();
          };
          lista.appendChild(btn);
        }
      }
    }

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(() => console.log('PWA Service Worker listo.'))
      .catch((err) => console.error('Error en Service Worker:', err));
  });
}