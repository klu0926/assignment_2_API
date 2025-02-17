// using JokeAPI 
// url 
// https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,explicit&amount=10


class Model {
  constructor() {
    this.nameKey = 'name'
    this.jokeAPI = 'https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,explicit&type=single'

  }
  saveName(value) {
    localStorage.setItem(this.nameKey, value.trim())
  }
  getName() {
    return localStorage.getItem(this.nameKey) || ''
  }
  clearName() {
    localStorage.removeItem(this.nameKey)
  }
  async fetchJoke() {
    try {
      // get response
      const response = await fetch(this.jokeAPI)
      if (!response.ok) throw new Error('Can not get response')

      // parse json
      const object = await response.json()
      if (!object) throw new Error('Can not get joke object')

      // get joke
      const joke = object.joke
      if (!joke || joke === '') throw new Error('Can not get string')
      return joke

    } catch (err) {
      console.log('fetch joke err :', err.message)
      return "I’d tell you a joke about callbacks, but you’d have to wait for it."
    }
  }
}

class View {
  constructor() {
    this.nameInput = document.querySelector('#username')
    this.display = document.querySelector('#display-name')
    this.headerName = document.querySelector('#header-name')
    this.headerWelcome = document.querySelector('#header-welcome')
  }
  setInputValue(value) {
    this.nameInput.value = value
  }
  setDisplayValue(name, text) {
    if (!name || name === '') {
      this.display.innerText = ''
    } else {
      const message = `Hi ${name} ! <br> ${text}`
      this.display.innerHTML = message
    }
  }
  setHeaderName(value) {
    if (value === '') {
      value = 'User'
    }
    this.headerName.innerText = value
  }
  setHeaderWelcome(value) {
    if (value === '') {
      value = 'Welcome'
    }
    this.headerWelcome.innerText = value
  }
}


class Controller {
  constructor(model, view) {
    this.model = model
    this.view = view
    this.nameInput = document.querySelector('#username')
    this.saveBtn = document.querySelector('#save-btn')
    this.clearBtn = document.querySelector('#clear-btn')
  }

  init() {
    // event (use arrow function to preserves 'this')
    this.setEvent('click', this.saveBtn, () => this.saveOnClick())
    this.setEvent('click', this.clearBtn, () => this.clearOnClick())
    this.setEvent('input', this.nameInput, (e) => this.nameOnInput(e))
    // init input
    this.updateView()
    this.updateWelcomeMessage()
  }
  // Set Event
  setEvent(eventString, node, callBackFnc) {
    node.addEventListener(eventString, callBackFnc)
  }
  // Event Trigger
  saveOnClick() {
    this.model.saveName(this.nameInput.value)
    this.updateView()
  }
  clearOnClick() {
    this.model.clearName()
    this.updateView()
  }
  nameOnInput(e) {
    // wip for later
  }
  // View
  async updateView() {
    this.view.setInputValue(this.model.getName())
    this.view.setHeaderName(this.model.getName())

    const message = await this.model.fetchJoke()
    this.view.setDisplayValue(this.model.getName(), message)
  }
  // Time
  updateWelcomeMessage() {
    // get current hour
    const hour = new Date().getHours();

    // welcome message
    let welcomeMesage = 'Welcome'
    if (hour >= 5 && hour < 12) {
      welcomeMesage = 'Good Morning,'
    } else if (hour >= 12 && hour <= 17) {
      welcomeMesage = 'Good Afternoon,'
    } else {
      welcomeMesage = 'Good Night,'
    }
    this.view.setHeaderWelcome(welcomeMesage)
  }
}


document.addEventListener("DOMContentLoaded", () => {
  const model = new Model()
  const view = new View()
  const controller = new Controller(model, view)
  controller.init()


  // testing joke
  model.fetchJoke()
})