const container = document.getElementById('container');
let movieType = "";

const dataRecieved = (data) => {
  data.Search.forEach((media) => {
    const mediaElement = document.createElement('div');
    const mediaTitleElement = document.createElement('h1');
    const mediaImgElement = document.createElement('img');

    mediaElement.className = 'media';
    mediaTitleElement.className = 'movie';

    mediaTitleElement.innerHTML = media.Title;
    mediaImgElement.src = media.Poster;

    container.appendChild(mediaElement);
    mediaElement.appendChild(mediaTitleElement);
    mediaElement.appendChild(mediaImgElement);

    mediaElement.addEventListener('click', () => {
      const movie = mediaElement.firstElementChild.innerHTML;
      sendMovieRequest(movie);
    });
    container.setAttribute('id', 'container');
  });
};

const movieRecieved = (movie) => {
  const mediaTitleElement = document.createElement('h1');
  const mediaYearElement = document.createElement('p');
  const mediaPosterElement = document.createElement('img');
  const mediaDirectorElement = document.createElement('p');
  const mediaPlotElement = document.createElement('p');
  const mediaRatingElement = document.createElement('div');

  mediaTitleElement.innerHTML = movie.Title;
  mediaYearElement.innerHTML = movie.Year;
  mediaPosterElement.src = movie.Poster;
  mediaDirectorElement.innerHTML = movie.Director;
  mediaPlotElement.innerHTML = movie.Plot;

  movie.Ratings.forEach((r) => {
    const ratingContainer = document.createElement('div');
    const srcElement = document.createElement('p');
    const valueElement = document.createElement('p');

    srcElement.innerHTML = r.Source;
    valueElement.innerHTML = r.Value;

    ratingContainer.appendChild(srcElement);
    ratingContainer.appendChild(valueElement);

    mediaRatingElement.appendChild(ratingContainer);

    container.setAttribute('id', 'containerClicked');
  });

  container.replaceChildren();
  // container.appendChild(mediaTitleElement);
  // container.appendChild(mediaYearElement);
  // container.appendChild(mediaPosterElement);
  // container.appendChild(mediaDirectorElement);
  // container.appendChild(mediaPlotElement);
  // container.appendChild(mediaRatingElement);

  appendMultipleElements(
    container,
    mediaTitleElement,
    mediaYearElement,
    mediaPosterElement,
    mediaDirectorElement,
    mediaPlotElement,
    mediaRatingElement
  );
};

const sendTitleRequest = (title) => {
  const movieYearElement = document.querySelector(
    'input[name="movieYear"]:checked'
  );
  const movieYear = movieYearElement != null ? movieYearElement.value : null;
  const apiURL = `http://localhost:3000/omdb?s=${title}${
    movieYear != "all" && movieYear != null ? `&y=${movieYear}` : ''
  }${movieType != "" ? `&type=${movieType}` : ''}`;

  console.log(apiURL);
  fetch(
    apiURL,
    {
      method: 'GET',
    }
  )
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      }
    })
    .then((data) => {
      console.log(data);
      dataRecieved(data);
    })
    .catch((er) => {
      console.error(er);
    });
};

const sendMovieRequest = (movie) => {
  fetch(`http://localhost:3000/omdb?t=${movie}`, {
    method: 'GET',
  })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      }
    })
    .then((data) => {
      movieRecieved(data);
    })
    .catch((er) => {
      console.error(er);
    });
};

(function () {
  // your page initialization code here
  // the DOM will be available here
  document.getElementById('form').addEventListener('submit', (e) => {
    e.preventDefault();
    loadMovie();
  });
  document.querySelectorAll('input[name="movieYear"]').forEach((movieYears) => {
    movieYears.addEventListener('change', () => {
      loadMovie();
    });
  });

  document.querySelectorAll('.btn').forEach((button) => {
    const type = button.value;
    button.addEventListener('click', () => {
      if (type === 'movie') {
        movieType = "movie";
      }
      else if (type === 'series') {
        movieType = "series";
      }
      loadMovie();
    });
  });
})();

function appendMultipleElements(container, ...args) {
  args.forEach((elem) => {
    container.appendChild(elem);
  });
}

const loadMovie = () => {
  const movie = document.getElementById('movie').value;
  sendTitleRequest(movie);

  container.replaceChildren();
};