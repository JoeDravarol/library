let myLibrary = [];
const bookColors = ["yellow", "teal", "pink", "beige", "light-blue", "grey", "light-beige", "light-grey"]

const eventHandlers = {
  form: {
    modalBtn: document.getElementById('open-form'),
    modalForm: document.querySelector('.form-overlay'),
    saveFormBtn: document.getElementById('save'),
    cancelFormBtn: document.getElementById('cancel')
  }
}

function Book(title, author, pages, read = false) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
};

function addBookToLibrary(title, author, pages) {
  let book = new Book(title, author, pages)

  myLibrary.push(book);
};

const toggleFormModal = () => {
  clearInputFields();
  toggleDisplayProperty(eventHandlers.form.modalBtn, eventHandlers.form.modalForm);
};

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

const clearInputFields = () => {
  const inputs = document.querySelectorAll('input');

  inputs.forEach((input) => {
    input.value = "";
  });
};

// Events Listener
// Form Modal Button
eventHandlers.form.modalBtn.addEventListener('click', () => {
  // Display form
  toggleFormModal();
});

eventHandlers.form.cancelFormBtn.addEventListener('click', () => {
  // Hide Form
  toggleFormModal();
});

// Submit Form
document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault()
  const title = e.target.title.value;
  const author = e.target.author.value;
  const pages = e.target.pages.value;

  addBookToLibrary(title, author, pages);
  toggleFormModal();
});
