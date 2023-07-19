import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TMDB } from './TMDB/tmdb';
import { Movie } from './TMDB/types/movie_transform';
import { transformMovie } from './TMDB/utils/movieMapper';
import { handleStorage, getFavorites } from './TMDB/utils/handleStorage';

import './styles/styles.css';

// TODO render your app here
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MjY5YmJkMzU3ZTRhOGVkNGMwODhjZTYwNjJiNGYwYiIsInN1YiI6IjY0YjY5YWM1Mzc4MDYyMDBlMmFjZDUyZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2Lqx7pfYXH9ZnziQZ3NTBZ0rhFnuzh58WaP7FpHf__Q";
const IMAGE_ORIG_PATH = 'https://image.tmdb.org/t/p/original/';
const tmdb = new TMDB(ACCESS_TOKEN);

enum Category {
    Popular = "popular",
    TopRated = "top_rated",
    Upcoming = "upcoming",
}

let checkedCategory:string = Category.Popular;
let currentPage = 1;
let savedMovies: Movie[];
const filmContainer = document.getElementById('film-container') as HTMLDivElement;
const randomSection = document.getElementById('random-movie') as HTMLElement;
const submitBtn = document.getElementById('submit') as HTMLButtonElement;
const loadBtn = document.getElementById('load-more') as HTMLButtonElement;
const searchInput = document.getElementById('search') as HTMLInputElement;


document.addEventListener('DOMContentLoaded', () => {
    const categoryCheckboxes = document.querySelectorAll<HTMLInputElement>('input[name="btnradio"]');
    categoryCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', function() {
        if (this.checked) {
            searchInput.value = '';
            currentPage = 1;
            savedMovies = [];
          checkedCategory = this.id;
          getMovies(this.id, currentPage);
        }
      });
    });
    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
    
        const searchTerm = searchInput.value;
        currentPage = 1;
        savedMovies = [];
    
        if(!searchTerm){
            getMovies(checkedCategory, currentPage);
        } else {
            searchMovies(searchTerm, currentPage)
        }
    })
    loadBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const category = checkedCategory;
        currentPage+=1;
        if(!searchInput.value){
            getMovies(category, currentPage);
        } else {
            searchMovies(searchInput.value, currentPage)
        }
      });
  });

async function getMovies(category: string, pageNum:number){
    try {
        // eslint-disable-next-line no-nested-ternary
        const response = category === Category.TopRated ? await tmdb.movies.topRated({page: pageNum})
        : category === Category.Upcoming ? await tmdb.movies.upcoming({page: pageNum})
        : await tmdb.movies.popular({page: pageNum});
       const movies:Movie[] = response.results.map(transformMovie);
       savedMovies = pageNum === 1 ? movies : savedMovies.concat(movies);
       const randomMovie: Movie = savedMovies[(Math.floor(Math.random() * movies.length))];
       renderRandomMovie(randomMovie);
       renderMovies(savedMovies, filmContainer, ['col-lg-3', 'col-md-4', 'col-12', 'p-2']);
     } catch(err) {
        throw new Error("Something went wrong!");
     }
}

async function searchMovies(searchQuery:string, pageNum:number) {
    try {
        const response = await tmdb.search.movies({query: searchQuery, page: pageNum})
        const movies:Movie[] = response.results.map(transformMovie);
        savedMovies = pageNum === 1 ? movies : savedMovies.concat(movies);
        const randomMovie: Movie = savedMovies[(Math.floor(Math.random() * movies.length))];
        renderRandomMovie(randomMovie);
        renderMovies(savedMovies, filmContainer, ['col-lg-3', 'col-md-4', 'col-12', 'p-2']);
    } catch (error) {
        throw new Error("Something went wrong!");
    }
}
function renderMovies(movieList:Movie[], container: HTMLDivElement, classArr: Array<string>){
    const myConatiner = container;
    myConatiner.innerHTML = '';
    movieList.forEach(movie => {
        const movieEl = document.createElement('div');
        movieEl.classList.add(...classArr);
        const pathImage = movie.poster_path ? IMAGE_ORIG_PATH+movie.poster_path : 'https://developers.google.com/static/maps/documentation/maps-static/images/error-image-generic.png';

        movieEl.innerHTML = `
            <div class="card shadow-sm">
                <img
                    src="${pathImage}"
                    alt='img-movie'
                />
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="red"
                    width="50"
                    height="50"
                    class="bi bi-heart-fill position-absolute p-2"
                    data-id="${movie.id}"
                    viewBox="0 -2 18 22"
                >
                    <path
                        fill-rule="evenodd"
                        d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
                    />
                </svg>
                <div class="card-body">
                    <p class="card-text truncate">
                        ${movie.overview ? movie.overview : 'No description provided!'}
                    </p>
                    <div
                        class="
                            d-flex
                            justify-content-between
                            align-items-center
                        "
                    >
                        <small class="text-muted">${movie.release_date ? movie.release_date : 'No release date provided!'}</small>
                    </div>
                </div>
            </div>
        `
        myConatiner.appendChild(movieEl);
    })
    const likeBtns = document.querySelectorAll<HTMLElement>('.bi-heart-fill');
    const favoriteBtns = document.querySelectorAll<HTMLElement>('#favorite-movies .bi-heart-fill')
    if(classArr.length !== 2){
          likeBtns.forEach((btn) => {
            btn.addEventListener('click', function() {
                handleStorage(this.dataset.id)
                updateFavoritesList(); /// Here I have a bug! Like button doest update correctly when I repeat clicking!
            })
          })
    } else {
        favoriteBtns.forEach((btn) => {
            const button = btn;
            button.style.display = 'none';  
        })
    }
}
async function updateFavoritesList() {
    const favorites: Array<string> = getFavorites();
    const favoritesContainer = document.getElementById('favorite-movies') as HTMLDivElement;
    favoritesContainer.innerHTML = '';

    const fetchPromises = favorites.map(movieId => getMovieDetails(movieId));

    const responses = await Promise.all(fetchPromises);
    const movies:Movie[] = responses.map(transformMovie);
    renderMovies(movies, favoritesContainer, ['col-12', 'p-2'])
}

async function getMovieDetails(movieId:string){
    try {
        const response = await tmdb.movies.details(movieId);
        return response;
    } catch (error) {
        throw new Error("Something went wrong!");
    }
}
function renderRandomMovie(movie: Movie) {
    randomSection.style.background = `url("${IMAGE_ORIG_PATH+movie.poster_path}") no-repeat center`;
    randomSection.style.backgroundSize = 'cover'
    randomSection.innerHTML = `
        <div class="row py-lg-5">
            <div
                class="col-lg-6 col-md-8 mx-auto"
                style="background-color: #2525254f"
            >
                <h1 id="random-movie-name" class="fw-light text-light">${movie.title}</h1>
                <p id="random-movie-description" class="lead text-white">
                    ${movie.overview}
                </p>
            </div>
        </div>
    `
}

getMovies(checkedCategory, currentPage);