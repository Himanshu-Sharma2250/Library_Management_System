const api_url = 'https://api.freeapi.app/api/v1/public/books';
const navigatorContainer = document.querySelector(".navigator")
const themeBtn = document.getElementById('theme-btn')
const themeBtnImage = document.getElementById('theme-btn-image')

let books = []
let currentPage = 1
let totalPages = 1
let isList = true

async function fetchBooks(page = 1) {
    console.log('in fetch function')
    try {
        const response =  await fetch(`${api_url}?page=${page}&limit=12`);
        // in this url, page gives us the page and limit gives the total books which is 12 when fetched
        const response_data = await response.json()
        books = response_data.data.data;
        console.log(books) // contain the data of book
        totalPages = response_data.data.totalPages
        console.log(totalPages)
        
        createBookCards(books)
        updatePageNumber(currentPage)
    } 
    catch (error) {
        console.log("Error occured in fetching data")
        console.log(error)
    }
}

// create books card
function createBookCards(books) {
    const booksContainer = document.getElementById("books-collection")
    booksContainer.innerHTML = ''
    booksContainer.className = isList ? 'list-format' : 'grid-format'

    books.forEach((book) => {
        const bookCard = document.createElement('div')
        bookCard.className = 'bookCard'

        const {title, authors, publisher, publishedDate, infoLink} = book.volumeInfo
        const {smallThumbnail, thumbnail} = book.volumeInfo.imageLinks

        // partition the bookCard in two section
        // section-1 : contains the image of book
        // section-2 : contain all details
        const bookCard_section1 = document.createElement('div')
        bookCard_section1.style.display = "flex"
        bookCard_section1.style.alignItems = "center"
        const bookThumbnail = document.createElement('img')
        bookThumbnail.setAttribute('src', smallThumbnail)
        bookThumbnail.setAttribute('alt', 'book image')
        // append the child in parent
        bookCard_section1.appendChild(bookThumbnail)

        const bookCard_section2 = createBookCardSection2(title, authors, publisher, publishedDate, infoLink)

        bookCard.appendChild(bookCard_section1)
        bookCard.appendChild(bookCard_section2)
        console.log(bookCard_section2)

        booksContainer.appendChild(bookCard)
    });

}

// create the second section of book card which contain all details
function createBookCardSection2(title, authors, publisher, publishedDate, infoLink) {
    const cardSection = document.createElement('div')
    cardSection.className = "bookCardSection2"

    const titlePara = document.createElement('p')
    titlePara.textContent = `${title}`
    titlePara.className = "book-name"

    const authorPara = document.createElement('p')
    authorPara.textContent = `Author : ${authors[0]}`

    const publisherPara = document.createElement('p')
    publisherPara.textContent = `Publisher : ${publisher}`

    const publishedDatePara = document.createElement('p')
    publishedDatePara.textContent = `Date : ${publishedDate}`

    const info_link = document.createElement('a')
    info_link.setAttribute('href', infoLink)
    info_link.setAttribute('target', "_blank")
    info_link.textContent = "Info"

    // append these 
    cardSection.appendChild(titlePara)
    cardSection.appendChild(authorPara)
    cardSection.appendChild(publisherPara)
    cardSection.appendChild(publishedDatePara)
    cardSection.appendChild(info_link)

    return cardSection
}

// to update the page number every time we click next or prev buttons
function updatePageNumber() {
    document.querySelector('.pageNumber').innerHTML = `${currentPage} / ${totalPages}`
    document.getElementById('prev-btn').disabled = currentPage === 1;
    document.getElementById('next-btn').disabled = currentPage === totalPages;
}

// move to prev page
document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentPage == 1) {
        return
    }

    currentPage--
    fetchBooks(currentPage)
})

// move to next page
document.getElementById('next-btn').addEventListener('click', () => {
    if (currentPage == totalPages) {
        return
    }

    currentPage++
    fetchBooks(currentPage)
})

// change the format : list to grid and vice versa
document.querySelector('.list-grid-btn').addEventListener('click', () => {
    isList = !isList
    document.querySelector('.list-grid-btn').textContent = isList ? "List" : "Grid"
    createBookCards(books)
})

// sort the books based on alphabet
document.querySelector('.alpha-sort-btn').addEventListener('click', (event) => {
    books.sort((book1, book2) => book1.volumeInfo.title.localeCompare(book2.volumeInfo.title))
    createBookCards(books)
    console.log('after sort : ', books)
})

// sort books based on published date
document.querySelector('.date-sort-btn').addEventListener('click', (event) => {
    books.sort((book1, book2) => {
        const date1 = new Date(book1.volumeInfo.publishedDate || "0000-01-01");
        const date2 = new Date(book2.volumeInfo.publishedDate || "0000-01-01");
        return date1 - date2;
    })
    createBookCards(books)
    // console.log('after sort : ', books)
})

// to search the book based on title or author
// document.getElementById('input-search-book').addEventListener('input', (event) => {
//     const query = event.target.value.toLowerCase()
//     const filteredBook = books.filter((book) => book.volumeInfo.title.toLowerCase().includes(query) || 
//     (book.volumeInfo.authors && book.volumeInfo.authors.some(author => author.toLowerCase().includes(query))));
//     createBookCards(filteredBook);
// })
// use help of chatgpt in this to implement debouncing 
let debounceTimer;
document.getElementById('input-search-book').addEventListener('input', (event) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        const query = event.target.value.toLowerCase();
        const filteredBooks = books.filter(book => {
            const titleMatch = book.volumeInfo?.title?.toLowerCase().includes(query);
            const authorMatch = book.volumeInfo?.authors?.some(author => author.toLowerCase().includes(query));
            return titleMatch || authorMatch;
        });
        createBookCards(filteredBooks);
    }, 300); // Waits 300ms after last keystroke
});

// change the theme from light to dark and dark to light
document.getElementById('theme-btn').addEventListener('click', () => {
    console.log('mein toh daba raha hu')
    const isDarkMode = themeBtn.classList.toggle('dark-mode');
    themeBtnImage.src = isDarkMode ? "./asset/moon-svgrepo-com.svg" : "./asset/sun-2-svgrepo-com (1).svg";
    document.body.style.backgroundColor = isDarkMode ? "#000" : "#fffffa";
    document.body.style.color = isDarkMode ? "#eaeaea" : "#000";

    // change the nav bar bottom border to black and to white
    navigatorContainer.style.borderBottom = isDarkMode ? "2px solid #fffffa" : "2px solid #000000"

    // select all the book cards in list format and change their bottom border to black
    const allCardsInListFormat = document.querySelectorAll(".list-format .bookCard")
    allCardsInListFormat.forEach((card) => {
        card.style.borderBottom = isDarkMode ? "1px solid #fffffa" : "1px solid rgb(0, 0, 0)"
    })
    // select all the book cards in grid format and change their border to black
    const allCardsInGridFormat = document.querySelectorAll(".grid-format .bookCard")
    allCardsInGridFormat.forEach((card) => {
        card.style.border = isDarkMode ? "1px solid rgb(248, 248, 248)" : "1px solid #000000"
    })

    // select all buttons and change the color of button to black
    document.querySelectorAll('button').forEach((btn) => btn.style.color = isDarkMode ? "#fffffa" : '#000000')

    // select all links (infoLink) and change the color and border of them to black
    document.querySelectorAll(".bookCardSection2 a").forEach(link => link.style.color = isDarkMode ? "#fffffa" : "#000000")
    document.querySelectorAll(".bookCardSection2 a").forEach(link => link.style.border = isDarkMode ? "1px solid rgb(255, 255, 255)" : "1px solid rgb(0, 0, 0)")
})

// fetching the book
fetchBooks(1)