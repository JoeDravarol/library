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

const incrementColorIndex = () => {
  if (colorIndex < bookColors.length - 1) {
    colorIndex++;
  } else if (colorIndex === bookColors.length -1) {
    colorIndex = 0;
  };
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

const generateBookHTML = (book) => {

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

  while (mainContainer.firstChild) {
    mainContainer.removeChild(mainContainer.firstChild);
  };

  myLibrary.forEach((book) => {
    generateBookHTML(book);
    incrementColorIndex();
  });
};

const renderNewBook = () => {
  const book = myLibrary[myLibrary.length - 1];

  generateBookHTML(book);
  incrementColorIndex();
};

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

const toggleReadStatus = (bookIndex) => {
  const readStatus = myLibrary[bookIndex].read;
  myLibrary[bookIndex].read = readStatus === true ? false : true;
};

const findBookElement = (event) => {
  let parent;

  parent = event.target.parentNode;

  // While data-index doesn't exist
  while (!parent.dataset.index) {
    parent = parent.parentNode;
  };

  return parent;
};

document.querySelector('main').addEventListener('click', (e) => {

  // Read Status button
  if (e.target.id === "read-status") {
    const bookIndex = findBookElement(e).dataset.index;

    toggleReadStatus(bookIndex);
    
    let btnAttributes = generateReadBtnAttributes(myLibrary[bookIndex].read);
    let btnImgElement = e.target.childNodes[1];
    
    // Update button & Img tag attributes
    e.target.attributes.tooltip.value = btnAttributes.tooltip;
    e.target.dataset.read = myLibrary[bookIndex].read;
    btnImgElement.attributes.src.value = `./assets/images/${btnAttributes.img}`;
    btnImgElement.attributes.alt.value = btnAttributes.alt;
  };

  // Remove book button
  if (e.target.id === "remove-book") {
    const bookElement = findBookElement(e);
    const bookIndex = bookElement.dataset.index;

    myLibrary.splice(bookIndex, 1);
    
    e.currentTarget.removeChild(bookElement);
  };
});

renderLibrary();
