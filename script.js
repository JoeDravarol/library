let myLibrary = [new Book("The Nature of Lies", "Danny Lin", "123"), new Book("An Introduction to Neural Science", "Christa Hausmann", "200"), new Book("The Play Book", "Rahul Rajendran", "500")];
const bookColors = ["yellow", "teal", "pink", "beige", "light-blue", "grey", "light-beige", "light-grey"]

const eventHandlers = {
  library: {
    mainContainer: document.querySelector('main')
  },
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
  renderLibrary();
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

const renderLibrary = () => {
  const mainContainer = eventHandlers.library.mainContainer;
  let colorIndex = 0;

  while(mainContainer.firstChild) {
    mainContainer.removeChild(mainContainer.firstChild);
  }

  myLibrary.forEach((book, index) => {
    mainContainer.insertAdjacentHTML("beforeend", `
      <div class="book-cover ${bookColors[colorIndex]}" data-index="${index}">
        <div class="cover-info">
          <h2>
            ${book.title}
            <span>${book.author}</span>
          </h2>

          <div class="btn-container">
            <button id="read-status" class="btn btn-read" tooltip="Book Not Read" data-read="${book.read}}">
              <img src="./assets/images/closed-book.svg" alt="Closed book icon">
            </button>

            <button id="remove-book" class="btn btn-delete" tooltip="Remove Book">
              <img src="./assets/images/delete.svg" alt="Delete icon">
            </button>
          </div>

          <p>${book.pages} pages</p>
        </div>
      </div>
      `);
      if (colorIndex < bookColors.length - 1) {
        colorIndex++;
      } else if (colorIndex === bookColors.length -1) {
        colorIndex = 0;
      };

  });
};

renderLibrary()