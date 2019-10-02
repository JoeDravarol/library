/*
** Data
*/
const bookColors = ["yellow", "teal", "pink", "beige", "light-blue", "grey", "light-beige", "light-grey"];

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
};

// Firebase
const db = firebase.firestore();
const increment = firebase.firestore.FieldValue.increment(1);

// Document References
const colorIndexRef = db.doc('libraryData/colorIndex');
const myLibraryRef = db.doc('libraryData/myLibrary');

/*
** Scripts
*/
function Book(title, author, pages, read = false) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
};

function createBook(title, author, pages) {
  let book = new Book(title, author, pages);

  colorIndexRef.get().then((doc) => {
    book.colorIndex = doc.data().index;
  });

  return book;
};

// Update books array on Firebase
const updateBooksArray = (booksArray) => {

  const newBooksArray = booksArray.map((value) => {
    if (value === null) {
      return value;
    } else if (typeof value === 'object') {
      // Firebase can't store pure javascript object
      // so you have to use object.assign
      return Object.assign({}, value);
    };
  });

  myLibraryRef.update({
    books: newBooksArray
  });
};

function addBookToLibrary(book) {
  myLibraryRef.get().then((doc) => {
    let booksArray = doc.data().books;

    const nullIndex = booksArray.indexOf(null);

    if (nullIndex === -1) {
      book.id = booksArray.length;
      booksArray.push(book);
    } else {
      book.id = nullIndex;
      booksArray[nullIndex] = book;
    };

    updateBooksArray(booksArray);
  });
};

const incrementColorIndex = () => {
  colorIndexRef.get().then((doc) => {
    let colorIndex = doc.data().index;

    if (colorIndex < bookColors.length -1) {
      colorIndexRef.update({ index: increment });
    } else {
      colorIndexRef.update({ index: 0 });
    };
  });
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
    };
  });
};

const clearInputFields = () => {
  const inputs = document.querySelectorAll('input');

  inputs.forEach((input) => {
    input.value = "";
  });
};

const toggleFormModal = () => {
  clearInputFields();
  toggleDisplayProperty(eventHandlers.form.modalBtn, eventHandlers.form.modalForm);
};

const findBookElement = (event) => {
  let parent = event.target.parentNode;

  // While data-index doesn't exist
  while (!parent.dataset.index) {
    parent = parent.parentNode;
  };

  return parent;
};

const generateBookHTML = (book) => {

  eventHandlers.library.mainContainer.insertAdjacentHTML("beforeend", `
    <div class="book-cover ${bookColors[book.colorIndex]}" data-index="${book.id}">
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

const renderLibrary = () => {
  const mainContainer = eventHandlers.library.mainContainer;
  
  while (mainContainer.firstChild) {
    mainContainer.removeChild(mainContainer.firstChild);
  };

  myLibraryRef.get().then((doc) => {
    let booksArray = doc.data().books;

    booksArray.forEach((book) => {
      if (book !== null) {
        generateBookHTML(book);
      };
    });
  });
};

const generateBookReadBtn = (book) => {
  let attributes = generateReadBtnAttributes(book.read);

  return `<button id="read-status" class="btn btn-read" tooltip="${attributes.tooltip}" data-read="${book.read}">
            <img src="./assets/images/${attributes.img}" alt="${attributes.alt}">
          </button>`;
};

const generateReadBtnAttributes = (isRead) => {
  let attributes = {
    tooltip: "Book Not Read",
    img: "closed-book.svg",
    alt: "Closed book icon"
  };

  if (isRead) {
    attributes.tooltip = "Book Read",
    attributes.img = "open-book.svg",
    attributes.alt = "Open book icon"
  };

  return attributes;
};

const toggleReadStatus = (bookIndex) => {
  const readStatus = myLibrary[bookIndex].read;

  myLibrary[bookIndex].read = readStatus === true ? false : true;
};

/*
** Events Listener
*/ 
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
  e.preventDefault();
  const title = e.target.title.value;
  const author = e.target.author.value;
  const pages = e.target.pages.value;
  let book = createBook(title, author, pages);
  
  addBookToLibrary(book);
  incrementColorIndex();
  toggleFormModal();
});

// Main container for displaying books
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

    myLibrary[bookIndex] = null;
    
    e.currentTarget.removeChild(bookElement);
  };
});

// Firebase real time listener
db.collection('libraryData').onSnapshot((snapshot) => {
  let changes = snapshot.docChanges();
  
  for(let change of changes) {
    if (change.type == 'added') {
      renderLibrary();
      break;
    } else if (change.type == 'modified') {
        if (change.newIndex !== 0) {
          renderLibrary();
        }
        break;
    };
  };
});
