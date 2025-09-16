let películas = [];

// 1. Fetch para obtener datos de las películas
fetch("https://japceibal.github.io/japflix_api/movies-data.json")
  .then(response => {
    if(!response.ok) {
        throw new Error('HTTP error ' + response.status);
    }
    return response.json();
  })
  .then(data => {
    console.log("Datos de películas:", data);
    películas = data; // ← aca se guardan los datos
    console.log(`Se cargaron ${películas.length} películas`);
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
  });

// 2. Funcion para buscar películas
function buscarPelículas(término) {
  if (!término || término.trim() === '') {
    document.getElementById('lista').innerHTML = '';
    return;
  }
  
  const términoLower = término.toLowerCase();
  
  const películasFiltradas = películas.filter(película => {
    const título = película.title?.toLowerCase() || '';
    const overview = película.overview?.toLowerCase() || '';
    const géneros = película.genres?.map(g => g.name?.toLowerCase()).join(' ') || '';
    
    return título.includes(términoLower) || 
           overview.includes(términoLower) || 
           géneros.includes(términoLower);
  });
  
  mostrarResultados(películasFiltradas);
}

// 3. Funcion para mostrar resultados
function mostrarResultados(películasFiltradas) {
  const lista = document.getElementById('lista');
  
  if (películasFiltradas.length === 0) {
    lista.innerHTML = '<li class="list-group-item bg-dark text-white text-center">No se encontraron resultados</li>';
    return;
  }
  
  let html = '';
  
  películasFiltradas.forEach((película, index) => {
    const año = película.release_date ? new Date(película.release_date).getFullYear() : 'N/A';
    const géneros = película.genres ? película.genres.map(g => g.name).join(', ') : '';
    const estrellas = generarEstrellas(película.vote_average || 0);
    const duración = película.runtime ? `${película.runtime} min` : 'N/A';
    const presupuesto = película.budget ? `$${película.budget.toLocaleString()}` : 'N/A';
    const ganancias = película.revenue ? `$${película.revenue.toLocaleString()}` : 'N/A';
    
    html += `
      <li class="list-group-item bg-dark text-white border-secondary movie-item" data-movie-index="${index}" style="cursor: pointer;">
        <div class="row">
          <div class="col-md-8">
            <h5 class="mb-1">${película.title || 'Sin título'}</h5>
            <p class="mb-1">${película.tagline || ''}</p>
            <small class="text-muted">${géneros}</small>
          </div>
          <div class="col-md-4 text-end">
            <div class="mb-2">${estrellas}</div>
            <small class="text-muted">${año}</small>
            <div class="dropdown mt-2" onclick="event.stopPropagation();">
              <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" id="dropdownMenuButton${index}" data-bs-toggle="dropdown" aria-expanded="false">
                Más info
              </button>
              <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton${index}">
                <li><span class="dropdown-item-text"><strong>Año:</strong> ${año}</span></li>
                <li><span class="dropdown-item-text"><strong>Duración:</strong> ${duración}</span></li>
                <li><span class="dropdown-item-text"><strong>Presupuesto:</strong> ${presupuesto}</span></li>
                <li><span class="dropdown-item-text"><strong>Ganancias:</strong> ${ganancias}</span></li>
              </ul>
            </div>
          </div>
        </div>
      </li>
    `;
  });
  
  lista.innerHTML = html;
  
  // Añadir event listeners a las películas
  document.querySelectorAll('.movie-item').forEach((item, index) => {
    item.addEventListener('click', function() {
      mostrarDetallesPelicula(películasFiltradas[index]);
    });
  });
}

// 4. Funcióm que genera estrellas
function generarEstrellas(voteAverage) {
  const estrellas = Math.round(voteAverage / 2);
  let estrellasHTML = '';
  
  for (let i = 1; i <= 5; i++) {
    if (i <= estrellas) {
      estrellasHTML += '<span class="fa fa-star checked"></span>';
    } else {
      estrellasHTML += '<span class="fa fa-star"></span>';
    }
  }
  
  return estrellasHTML;
}

// 5. Función para mostrar detalles de las películas
function mostrarDetallesPelicula(película) {
  document.getElementById('movieTitle').textContent = película.title || 'Sin título';
  document.getElementById('movieOverview').textContent = película.overview || 'Sin descripción disponible';
  
  const géneros = película.genres ? película.genres.map(g => g.name).join(', ') : 'Sin géneros';
  document.getElementById('movieGenres').innerHTML = `<strong>Géneros:</strong> ${géneros}`;
  
  document.getElementById('offcanvas-container').style.display = 'block';
}

// 6. Funcion para cerrar los detalles
function cerrarDetalles() {
  document.getElementById('offcanvas-container').style.display = 'none';
}

// 5. Event listeners para buscar con boton y enter
document.addEventListener("DOMContentLoaded", function(){
  
  // Event listener para el BOTÓN específico
  const btnBuscar = document.getElementById("btnBuscar");
  if (btnBuscar) {
    btnBuscar.addEventListener("click", function(){
      let input = document.getElementById("inputBuscar").value;
      console.log("Buscando:", input);
      
      if (películas.length === 0) {
        alert('Los datos aún se están cargando...');
        return;
      }
      
      buscarPelículas(input);
    });
  }
  
  // Event listener para buscar con enter
  const inputBuscar = document.getElementById("inputBuscar");
  if (inputBuscar) {
    inputBuscar.addEventListener("keypress", function(e){
      if (e.key === 'Enter') {
        let input = this.value;
        console.log("Buscando con Enter:", input);
        
        if (películas.length === 0) {
          alert('Los datos aún se están cargando...');
          return;
        }
        
        buscarPelículas(input);
      }
    });
  }
  
});