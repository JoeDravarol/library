let myLibrary = [];

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
};

function addBookToLibrary() {

};

const eventHandlers = {
  form: {
    modalBtn: document.getElementById('open-form'),
    modalForm: document.querySelector('.form-overlay'),
    saveFormBtn: document.getElementById('save'),
    cancelFormBtn: document.getElementById('cancel')
  }  
}

// Events Listener
// Form Modal Button
eventHandlers.form.modalBtn.addEventListener('click', () => {
  // Display form
  toggleDisplayProperty(eventHandlers.form.modalBtn)
  toggleDisplayProperty(eventHandlers.form.modalForm)
});

eventHandlers.form.cancelFormBtn.addEventListener('click', () => {

  toggleDisplayProperty(eventHandlers.form.modalForm)
  toggleDisplayProperty(eventHandlers.form.modalBtn)
});

// Toggle display value from block to none and vice versa
const toggleDisplayProperty = (event) => {
  const eventDisplayValue = window.getComputedStyle(event).getPropertyValue('display');

  if (!eventDisplayValue || eventDisplayValue === "block") {
    event.style.display = "none";
  } else {
    event.style.display = "block";
  }
};