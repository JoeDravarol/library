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
  toggleDisplayProperty(eventHandlers.form.modalBtn, eventHandlers.form.modalForm)
});

eventHandlers.form.cancelFormBtn.addEventListener('click', () => {
  // Hide Form
  toggleDisplayProperty(eventHandlers.form.modalBtn, eventHandlers.form.modalForm)
});

// Toggle display value from block to none and vice versa
const toggleDisplayProperty = (...events) => {

  [...events].forEach((event) => {
    const eventDisplayValue = window.getComputedStyle(event).getPropertyValue('display');

    // If display is empty
    if (!eventDisplayValue || eventDisplayValue === "block") {
      event.style.display = "none";
    } else {
      event.style.display = "block";
    }
  });

};