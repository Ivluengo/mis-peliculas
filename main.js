import Movie from './classes/Movie.js';

class App {
  movies = [];
  inputMovie = document.getElementById('movie');
  checkMovie = document.getElementById('seen');
  rankMovie = document.getElementById('rank');
  genderMovie = document.getElementById('gender');
  genderFilter = document.getElementById('genderFilter');
  btnAdd = document.getElementById('btnAdd');
  btnSort = document.getElementById('sort');
  btnUnseen = document.getElementById('unseen');
  movieList = document.querySelector('.movie-list');
  

  isEditing = false;
  editingId = 0;

  
  constructor() {
    this.btnAdd.addEventListener('click', () => this.handleClick());
    this.btnSort.addEventListener('click', () => this.sortMovies());
    this.btnUnseen.addEventListener('click', () => this.showUnseen());
    this.genderFilter.addEventListener('change', () => this.filterByGender());

    // Recuperar datos de localStorage
    this.getMoviesLocalStorage();
  }


  filterByGender() {
    const filteredMovies = this.movies.filter( (movie)=>{return movie.gender === this.genderFilter.value} );

    if(this.genderFilter.value === ''){
      this.readMovies();
      return;
    }

    this.readMovies(filteredMovies);
  }


  
  showUnseen() {
    const unseenMovies = this.movies.filter( (movie)=>{return movie.isSeen === false} );
    // console.log(unseenMovies);

    this.readMovies(unseenMovies);
  }


  sortMovies() {
    this.movies.sort((movieA, movieB) => {
      if(movieA.title > movieB.title) {
        return 1;
      }else {
        return -1;
      }
    });

    this.readMovies();

  }



  // cuando haga click al boton añadir 
  handleClick() {
    
    // capturar lo que me escriban en el input
    const movieTitle = this.inputMovie.value;
    const rankInput = this.rankMovie.value;
    const genderInput = this.genderMovie.value;

    if((!isNaN(movieTitle) || !movieTitle) || !rankInput || !genderInput){
      return;
    }

    // capturar el checkbox de si la han visto o no
    const movieSeen = this.checkMovie.checked;

    if(this.isEditing) {
      this.updateMovie(movieTitle, rankInput, genderInput, movieSeen);

    }else {
      this.addMovie(movieTitle, rankInput, genderInput, movieSeen);
    }

    // borra los input de serie
    this.inputMovie.value = '';
    this.inputMovie.focus();
    this.rankMovie.value= '';
    this.genderMovie.value = '';
    this.checkMovie.checked = false;

  }

  getMoviesLocalStorage() {
    if(localStorage.getItem('MOVIES')) {

      const moviesLS = JSON.parse( localStorage.getItem('MOVIES') );
      moviesLS.forEach((movie)=>{
        const realMovie = new Movie(movie.title, movie.rank, movie.gender, movie.isSeen);
        realMovie.id = movie.id;
        this.movies.push(realMovie);
      });

      this.readMovies();
    }else {
      localStorage.setItem('MOVIES', '[]');
    }
  }

  updateLocalStorage() {
    localStorage.setItem('MOVIES', JSON.stringify(this.movies));
  }

  addMovie(movieTitle, rankMovie, genderMovie, movieSeen) {
    // crear una película                       
    const newMovie = new Movie(movieTitle, rankMovie, genderMovie, movieSeen);
    // añadirla en el array de películas
    this.movies.push(newMovie);
    console.log(this.movies);
    // añadir el array de películas al localStorage       
    this.updateLocalStorage();

    // añadirla al DOM
    this.readMovies();
  }


  updateMovie(movieTitle, rankInput, genderInput, movieSeen) {
    this.movies = this.movies.map((movie) => {
      if(movie.id === this.editingId) {
        const editedMovie = new Movie(movieTitle, rankInput, genderInput, movieSeen);
        editedMovie.id = movie.id;

        return editedMovie;
      }else {
        return movie;
      }      
    });
    console.log(this.movies);
    
    this.updateLocalStorage();
    this.readMovies();

    // Volvemos a resetear todo en modo añadir
    this.isEditing = false;
    this.editingId = 0;

    this.btnAdd.innerText = 'Añadir';
    this.btnAdd.classList.replace('btn-primary', 'btn-warning');




  }

  changeSeen(e) {

    // Fijaros que lo que hacemos con la películas que queremos cambiar es llamar a su propio método que le cambia el estado de isSeen
    console.log(this.movies)
    this.movies = this.movies.map((movie)=>{
      if(movie.id === e.target.parentElement.dataset.id) {
        movie.changeSeen();
        return movie;
      }else {
        return movie;
      }
    });

    //Actualizamos local storage
    this.updateLocalStorage();  
    
    this.readMovies();

  }

  deleteMovie(id) {
    // Preguntar primero si queremos borrar de verdad
    const estasSeguro = confirm('Are you sure?');
    if(!estasSeguro) {
      return;
    }

    // recorremos el array de películas y filtramos todas aquellas que NO COINCIDAN con el Id que queremos
    this.movies = this.movies.filter((movie)=> {
      return movie.id !== id;
    });

    //Actualizamos localStorage
    this.updateLocalStorage();

    this.readMovies();

  }


  editMovie(id) {

    // Buscamos el objeto Movie que tenga el id al que le hemos dado
    const movieToUpdate = this.movies.find((movie)=>{ return movie.id === id });    

    // Cambiar los valores del formulario por los del objeto Movie al que le hemos hecho clic
    this.inputMovie.value = movieToUpdate.title;
    this.checkMovie.checked = movieToUpdate.isSeen;
    this.rankMovie.value = movieToUpdate.rank;
    this.genderMovie.value = movieToUpdate.gender;

    // cambiamos los valores de las variables globales para poner la App en modo editar y para tener el id del objeto a editar de forma global
    this.isEditing = true;
    this.editingId = movieToUpdate.id;

    // cambiamos la apariencia del boton
    this.btnAdd.innerText = 'Editar';
    this.btnAdd.classList.replace('btn-warning', 'btn-primary');
  }


  createMovie(movie) {
    
    // Primero creamos por cada una el h2 general
    const h2 = document.createElement('h2');
    h2.classList.add('text-white', 'd-flex');
    h2.innerHTML = `${movie.title}<span class="badge rounded-pill bg-warning ms-3">${movie.rank}</span><span class="badge bg-dark ms-3">${movie.gender}</span>`;
    h2.dataset.id = movie.id;

    // Creamos los 3 iconos
    const eyeIcon = document.createElement('i');
    const editIcon = document.createElement('i');
    const deleteIcon = document.createElement('i');

    // Añadirle listeners a los iconos
    //! En este caso voy a hacer el changeSeen enviando el evento para conseguir el id a traves del data-id y los otros dos, enviando directamente el id que me viene de "movie"
    eyeIcon.addEventListener('click', (e)=> this.changeSeen(e) );
    editIcon.addEventListener('click', ()=> this.editMovie(movie.id));
    deleteIcon.addEventListener('click', ()=> this.deleteMovie(movie.id) );


    // Ponemos las clases a los iconos   

    // El icono del ojo variará según me marquen que está vista o que no.
    // if(movie.isSeen) {
    //   eyeIcon.className = 'bi bi-eye text-warning ms-auto'
    // }else {
    //   eyeIcon.className = 'bi bi-eye-slash text-warning ms-auto'
    // }

    // forma corta de hacerlo
    eyeIcon.className = movie.isSeen ? 'bi bi-eye text-warning ms-auto' : 'bi bi-eye-slash text-warning ms-auto';


    editIcon.className = 'bi bi-pencil text-info mx-3';
    deleteIcon.className = 'bi bi-trash text-dark';

    // Añadimos los 3 iconos dentro del h2
    h2.append(eyeIcon, editIcon, deleteIcon);

    // retornamos el h2 que hemos creado
    return h2;

  }


  readMovies(array = this.movies){
    
    // Primero borramos las películas que ya hay en pantalla
    this.movieList.innerHTML = '';

    //recorremos nuestra "base de datos" de películas
    array.forEach((movie) => {

      const h2 = this.createMovie(movie);
      
      // Añadimos el h2 completado dentro del DOM
      this.movieList.append(h2);

    });

  }

}

const app = new App();
// console.log(app);
