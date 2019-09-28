let myLibrary = [new Book("The Nature of Lies", "Danny Lin", "123"), new Book("An Introduction to Neural Science", "Christa Hausmann", "200", true), new Book("The Play Book", "Rahul Rajendran", "500")];
let colorIndex = 0;
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
  renderNewBook();
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
            ${generateBookReadBtn(book)}

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

const renderNewBook = () => {
  const book = myLibrary[myLibrary.length - 1];
  eventHandlers.library.mainContainer.insertAdjacentHTML("beforeend", `
      <div class="book-cover ${bookColors[colorIndex]}" data-index="${myLibrary.indexOf(book)}">
        <div class="cover-info">
          <h2>
            ${book.title}
            <span>${book.author}</span>
          </h2>

          <div class="btn-container">
            ${generateBookReadBtn(book)}

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
}

const generateBookReadBtn = (book) => {
  let attributes = generateReadBtnAttributes(book.read)

  return `<button id="read-status" class="btn btn-read" tooltip="${attributes.tooltip}" data-read="${book.read}">
            <img src="./assets/images/${attributes.img}" alt="${attributes.alt}">
          </button>`
};

const generateReadBtnAttributes = (isRead) => {
  let attributes = {
    tooltip: "Book Not Read",
    img: "closed-book.svg",
    alt: "Closed book icon"
  }

  if (isRead) {
    attributes.tooltip = "Book Read",
    attributes.img = "open-book.svg",
    attributes.alt = "Open book icon"
  }

  return attributes;
};



document.querySelector('main').addEventListener('click', (e) => {
  let parent, bookIndex;  

  // Remove book button
  if (e.target.id === "remove-book") {
    parent = e.target.parentNode;

    while (!parent.dataset.index) {
      parent = parent.parentNode;
    };

    bookIndex = parent.dataset.index;
    myLibrary.splice(bookIndex, 1)
    
    e.currentTarget.removeChild(parent)
  };

});

renderLibrary();
