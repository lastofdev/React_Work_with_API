import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

const url = 'https://api.chucknorris.io/jokes/random';

async function getJoke() {
  try {
    const response = await axios.get(url);
    return response;
  } catch (error) {
    console.error(error);
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jokes: [],
      favs: [],
      isReady: false,
      isLoadedFirst: false,
      timerIsActive: false,
      timerTime: 0,
      errors: [],
    };
  }

  componentDidMount() {
    let storageFavs = localStorage.getItem('favs');
    storageFavs !== null && this.setState({ favs: JSON.parse(storageFavs) });
    console.log(storageFavs);
    let response = getJoke();
    response.then((response) => {
      if (response.status === 200) {
        const jokes = this.state.jokes;
        jokes.push(response.data);

        this.setState({ jokes, isReady: true, isLoadedFirst: true });
      } else {
        this.setState({ errors: response.code });
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { timerTime, favs } = this.state;
    if (favs !== prevState.favs) {
      localStorage.setItem('favs', JSON.stringify(favs));
    }
    if (timerTime >= 3) {
      this.handleAddJoke();
      this.setState({ timerTime: 0 });
    }
  }

  handleAddJoke() {
    let response = getJoke();
    response.then((response) => {
      if (response.status === 200) {
        const jokes = this.state.jokes;
        jokes.push(response.data);

        this.setState({ jokes });
      } else {
        this.setState({ errors: response.code });
      }
    });
  }

  handleAddJokeThreeSec() {
    const timerIsActive = this.state.timerIsActive;
    this.setState({ timerIsActive: !timerIsActive }, () => {
      if (this.state.timerIsActive) {
        this.timer = setInterval(() => {
          this.setState({ timerTime: this.state.timerTime + 1 });
        }, 1000);
      } else {
        clearInterval(this.timer);
      }
    });
  }

  handleAddFav(joke) {
    const favs = [...this.state.favs];
    let filter = favs.filter((item) => {
      if (joke === item) {
        return item;
      } else {
        return null;
      }
    });
    if (filter.length === 0) {
      if (favs.length >= 10) {
        favs.splice(0, 1);
      }
      favs.push(joke);
    } else {
      favs.splice(favs.indexOf(joke), 1);
    }
    this.setState({ favs });
  }

  handleDelFav(joke) {
    const favs = [...this.state.favs];
    favs.splice(favs.indexOf(joke), 1);
    this.setState({ favs });
  }

  render() {
    const { favs, jokes } = this.state;
    return (
      <>
        {this.state.isReady ? (
          <>
            <div >
              {jokes.map((joke, index) => {
                return (
                  <div key={index + 'joke'} className="joke">
                    <div className="container">
                      <div className="containerJoke">
                        {joke.value}
                      </div>
                      <button className="buttonAdd"
                      onClick={this.handleAddFav.bind(this, joke.value)}>Добавить</button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="controls">
              <button className="buttonAdd" onClick={this.handleAddJoke.bind(this)}>Шутка</button>
              <button className="buttonAdd" onClick={this.handleAddJokeThreeSec.bind(this)}>
                Шутка каждые 3 сек
              </button>
            </div>
            <div className="favs">
              {favs.length > 0 ? (
                <>
                  <h2>Любимые шутки</h2>
                  <div className="favs">
                    {favs.map((fav, index) => {
                      return (
                        <div key={index + 'fav'} >
                          <div className="container">
                            <div className="containerJoke loveJoke">
                              {fav}
                            </div>
                            <button
                              className="buttonAdd remove"
                              onClick={this.handleDelFav.bind(this, fav)}
                            >Удалить</button>
                            </div>
                        </div>
                      );
                    })}
                  </div>
                  <button className="buttonAdd remove"
                  onClick={() => this.setState({ favs: [] })}>
                    Очистить
                  </button>
                </>
              ) : null}
            </div>
          </>
        ) : null}
      </>
    );
  }
}

export default App;