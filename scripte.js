const filterOptionsClicked = [0, 0, 0];

//waits for DOM to load
window.onload = function () {
    
//get current url
  const url = window.location.href;
  // get the name of file at end of url
  const currentPage = url.substr(url.lastIndexOf("/") + 1);

  //intialize arraylists
  let categoryFilters = new ArrayList();
  let brandFilters = new ArrayList();
  let priceFilters = new ArrayList();
  let randomFilters = new ArrayList();

  //get serach button and searchbar
  const searchButton = document.getElementById("search-button");
  const searchBar = document.getElementById("nav-search");

  //create dictionary for known filters
  let categories = ["tv", "laptop", "phone", "headphone", "game"];
  let brands = [
    "apple",
    "samsung",
    "lg",
    " beats",
    "hp",
    "lenovo",
    "logitech",
    "sony",
  ];

  //click event for search button
  searchButton.addEventListener("click", () => {
    //reset filters
    categoryFilters = new ArrayList();
    brandFilters = new ArrayList();
    priceFilters = new ArrayList();
    randomFilters = new ArrayList();
    //turn string to lower case
    let searchString = searchBar.value.toLowerCase();
    // seperate words by white space and add to array
    let searchArr = searchString.split(" ");
    //iterate through search input
    searchArr.forEach((element) => {

        //if a recognized category phrase add to category filter
      if (categories.includes(element)) {
        categoryFilters.add(element);
      }
     //if a recognized brand phrase add to category filter

       else if (brands.includes(element)) {
        brandFilters.add(element);
      } 
      // if not recognized add to randomFIlter array
      else {
        randomFilters.add(element);
      }
    });
    //call filter product functions
    filterProducts(categoryFilters.data, brandFilters.data, randomFilters.data);
  });

  // to avoid errors, verify page and execute code according to page
  switch (currentPage) {
    case "index.html":
      //slider
      //retrieve slider container
      const slidesContainer = document.querySelector(".slides-container");

      const slideWidth = slidesContainer.querySelector(".slide").clientWidth;
      
      //create refrences for prev and nex btn
      const prevButton = document.querySelector(".prev");
      const nextButton = document.querySelector(".next");
      //hands next button click 
      nextButton.addEventListener("click", () => {
        slidesContainer.scrollLeft += slideWidth * 2;
      });
      //handles prev button click
      prevButton.addEventListener("click", () => {
        slidesContainer.scrollLeft -= slideWidth * 2;
      });
      //slider end

      break;

    case "catalog.html":
      //filter config

      //array of filter toggles
      const toggleFilter = document.getElementsByClassName("filter-toggle");
      //array of filters
      const filter = document.getElementsByClassName("filter");

      //loop through toggle filters
      for (let i = 0; i < toggleFilter.length; i++) {
        let element = toggleFilter[i];
        //click event that excutes hideExpand function passing the element, wether it is already checked and its array position
        element.addEventListener("click", () => {
          switch (element.id) {
            case "category":
              hideExpand(element, filterOptionsClicked[0], 0);
              break;

            case "brand":
              hideExpand(element, filterOptionsClicked[1], 1);
              break;

            case "price":
              hideExpand(element, filterOptionsClicked[2], 2);

              break;
          }
        });
      }

      // loop through filters
      for (let i = 0; i < filter.length; i++) {
        //create element for  current index
        let element = filter[i];
        element.addEventListener("click", () => {
            //each filter has a filter type
            //based on the filter type, add to its corresponding filter array list
            // execute filterProduct function
          switch (element.getAttribute("data-filter-type")) {
            case "category":
              if (element.checked) {
                categoryFilters.add(element.id);
                filterProducts(
                  categoryFilters.data,
                  brandFilters.data,
                  randomFilters.data
                );
              } else {
                categoryFilters.remove(
                  categoryFilters.data.indexOf(element.id)
                );
                filterProducts(
                  categoryFilters.data,
                  brandFilters.data,
                  randomFilters.data
                );
              }
              break;

            case "brand":
              if (element.checked) {
                brandFilters.add(element.id);
                filterProducts(
                  categoryFilters.data,
                  brandFilters.data,
                  randomFilters.data
                );
              } else {
                brandFilters.remove(brandFilters.data.indexOf(element.id));
                filterProducts(
                  categoryFilters.data,
                  brandFilters.data,
                  randomFilters.data
                );
              }
              break;

            case "price":
              if (element.checked) {
                priceFilters.add(element.id);
                filterProducts(
                  categoryFilters.data,
                  brandFilters.data,
                  randomFilters.data
                );
              } else {
                categoryFilters.remove(
                  categoryFilters.data.indexOf(element.id)
                );
                filterProducts(
                  categoryFilters.data,
                  brandFilters.data,
                  randomFilters.data
                );
              }
              break;
          }
        });
      }

      // initial load products

      fetch("products.json")
        .then((response) => response.json())
        .then((products) => {
            //call loadProducts function
          loadProducts(products);
        })
        .catch((err) => console.log(err));

      break;
  }

  // function for collapsing and expanding filter options
  function hideExpand(element, isToggled, i) {
    //retrive elemnt by id plus "-options"
    let hiddenElement = document.getElementById(`${element.id}-options`);
    
    // if element is checked hide and remove from current options clicked
    //else expand and add to current options clicked
    isToggled
      ? ((hiddenElement.style.display = "none"),
        filterOptionsClicked[i]--,
        (element.src = "assets/imgs/plus.png"))
      : ((hiddenElement.style.display = "block"),
        filterOptionsClicked[i]++,
        (element.src = "assets/imgs/minus.png"));
  }
};





//Asynchronous function
//Parameters: Array for: category, brand, and random
async function filterProducts(categoryFilters, brandFilters, randomFilters) {

  //wait for async process  
  const response = await fetch("products.json");
  //wait for async process
  data = await response.json();

  // intialize array for products that match filters
  let alreadyAdded = [];

  // if all filters are empty than load all products
  if (
    categoryFilters.length === 0 &&
    brandFilters.length === 0 &&
    randomFilters.length === 0
  ) {
    loadProducts(data);
    return;
  }

  // iterate through all items in json array
  for (let i = 0; i < data.length; i++) {

    //create objeect for current index
    let product = data[i];

    //iterate through the tags array for current object
    for (let x = 0; x < product.tags.length; x++) {
     
    
//case that handles when only categooryFilters are present
      if (
        brandFilters.length === 0 &&
        randomFilters.length === 0 &&
        categoryFilters.includes(product.tags[x].toLowerCase())
      ) {

        alreadyAdded.push(product);
        break;
      }

      //case that handles when only brandFilters are present

      if (
        categoryFilters.length === 0 &&
        randomFilters.length === 0 &&
        brandFilters.includes(product.tags[x].toLowerCase())
      ) {
        console.log("here");

        alreadyAdded.push(product);
        break;
      }

      //case that handles when only randomFilters are present

      if (
        categoryFilters.length === 0 &&
        brandFilters.length === 0 &&
        randomFilters.includes(product.tags[x].toLowerCase())
      ) {
        alreadyAdded.push(product);
        break;
      }

      //case that handles when only randomFIlters are not present

      if (
        randomFilters.length === 0 &&
        brandFilters.includes(product.brand) &&
        categoryFilters.includes(product.tags[x].toLowerCase())
      ) {
        console.log("here");

        alreadyAdded.push(product);
        break;
      }
      //case that handles when only brandFilters are not present

      if (
        brandFilters.length === 0 &&
        randomFilters.includes(product.tags[x].toLowerCase()) &&
        categoryFilters.includes(product.category)
      ) {
        console.log("here");
        alreadyAdded.push(product);
        break;
      }

            //case that handles when only categoryFilters are not present

      if (
        categoryFilters.length === 0 &&
        randomFilters.includes(product.tags[x].toLowerCase()) &&
        brandFilters.includes(product.brand)
      ) {
        console.log("here");
        alreadyAdded.push(product);
        break;
      }

      //case that handles when all filters are  present

      if (
        categoryFilters.includes(product.category) &&
        randomFilters.includes(product.tags[x].toLowerCase()) &&
        brandFilters.includes(product.brand)
      ) {
        console.log("here");
        alreadyAdded.push(product);
        break;
      }
    }
  }

  //after loop ends load added products
  loadProducts(alreadyAdded);
}


//load products function
//takes a json array, used throughout script file
function loadProducts(products) {
    //string that keeps track of created product elements
  let productsHTML = "";
  //loop through all products
  for (let i = 0; i < products.length; i++) {

    //create object for current index
    let element = products[i];
    // create product tag
    let product = `
  <li>
    <div class="product-row-item">
      <span class="item-row-1">
        <img src="${element.img}" />
      </span>
      <span class="product-text">
      <span class="item-row-2">
        <h2>${element.name}</h2>
        <img src="assets/imgs/heart.png" alt="like" />
      </span>
      <span class="greyed-out">
        <p>${element.description}e</p>
      </span>
      <span>
        <p>${element.price}</p>
      </span>
      </span>
    </div>
  </li>`;

  //add created product to productsHTML
    productsHTML += product;
  }
  // find all tags with class name product-row and retrieve first element
  let productsContainer = document.getElementsByClassName("product-row")[0];
 
  //add all products to DOM
  productsContainer.innerHTML = productsHTML;
}


// Arraylist class
class ArrayList {
  constructor() {
    this.data = [];
  }

  add(value) {
    this.data.push(value);
  }

  insert(index, value) {
    this.data.splice(index, 0, value);
  }

  remove(index) {
    this.data.splice(index, 1);
  }

  get(index) {
    return this.data[index];
  }

  set(index, value) {
    this.data[index] = value;
  }

  size() {
    return this.data.length;
  }
}
