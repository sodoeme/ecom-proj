const filterOptionsClicked = [0, 0, 0];
var data = "";
window.onload = function () {
    
  const url = window.location.href;
  const currentPage = url.substr(url.lastIndexOf("/") + 1);
  let categoryFilters = new ArrayList();
  let brandFilters = new ArrayList();
  let priceFilters = new ArrayList();
  let randomFilters = new ArrayList();

  const searchButton = document.getElementById("search-button");
  const searchBar = document.getElementById("nav-search");
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

  searchButton.addEventListener("click", () => {
    categoryFilters = new ArrayList();
    brandFilters = new ArrayList();
    priceFilters = new ArrayList();
    randomFilters = new ArrayList();
    let searchString = searchBar.value.toLowerCase();
    let searchArr = searchString.split(" ");
    searchArr.forEach((element) => {
      if (categories.includes(element)) {
        categoryFilters.add(element);
      } else if (brands.includes(element)) {
        brandFilters.add(element);
      } else {
        randomFilters.add(element);
      }
    });
    filterProducts(categoryFilters.data, brandFilters.data, randomFilters.data);
    console.log(categoryFilters, brandFilters);
  });

  switch (currentPage) {
    case "home.html":
      //slider
      const slidesContainer = document.querySelector(".slides-container");
      const slideWidth = slidesContainer.querySelector(".slide").clientWidth;
      const prevButton = document.querySelector(".prev");
      const nextButton = document.querySelector(".next");
      nextButton.addEventListener("click", () => {
        slidesContainer.scrollLeft += slideWidth * 2;
      });

      prevButton.addEventListener("click", () => {
        slidesContainer.scrollLeft -= slideWidth * 2;
      });
      //slider end

      break;

    case "catalog.html":
      //filter config

      const toggleFilter = document.getElementsByClassName("filter-toggle");
      const filter = document.getElementsByClassName("filter");
      for (let i = 0; i < toggleFilter.length; i++) {
        let element = toggleFilter[i];
        element.addEventListener("click", () => {
          switch (element.id) {
            case "category":
              hideExpand(element, filterOptionsClicked[0], 0);
              break;

            case "brand":
              hideExpand(element, filterOptionsClicked[1], 1);
              break;

            case "price":
              document.getElementById("price-options").style.display = "block";
              hideExpand(element, filterOptionsClicked[2], 2);

              break;
          }
        });
      }

      for (let i = 0; i < filter.length; i++) {
        let element = filter[i];
        element.addEventListener("click", () => {
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

      //load products
      fetch("products.json")
        .then((response) => response.json())
        .then((products) => {
          loadProducts(products);
        })
        .catch((err) => console.log(err));

      break;
  }

  function hideExpand(element, isToggled, i) {
    let hiddenElement = document.getElementById(`${element.id}-options`);
    isToggled
      ? ((hiddenElement.style.display = "none"),
        filterOptionsClicked[i]--,
        (element.src = "assets/imgs/plus.png"))
      : ((hiddenElement.style.display = "block"),
        filterOptionsClicked[i]++,
        (element.src = "assets/imgs/minus.png"));
  }
};

async function filterProducts(categoryFilters, brandFilters, randomFilters) {
  const response = await fetch("products.json");
  data = await response.json();
  let alreadyAdded = [];
  if (
    categoryFilters.length === 0 &&
    brandFilters.length === 0 &&
    randomFilters.length === 0
  ) {
    loadProducts(data);
    return;
  }

  for (let i = 0; i < data.length; i++) {
    let product = data[i];
    for (let x = 0; x < product.tags.length; x++) {
     
     if(product.name =="iPhone 13"){
      
        console.log(categoryFilters.includes(product.category) &&
        randomFilters.includes(product.tags[x].toLowerCase()) &&
        brandFilters.includes(product.brand))
     }

      if (
        brandFilters.length === 0 &&
        randomFilters.length === 0 &&
        categoryFilters.includes(product.tags[x].toLowerCase())
      ) {
        console.log("here");

        alreadyAdded.push(product);
        break;
      }

      if (
        categoryFilters.length === 0 &&
        randomFilters.length === 0 &&
        brandFilters.includes(product.tags[x].toLowerCase())
      ) {
        console.log("here");

        alreadyAdded.push(product);
        break;
      }

      if (
        categoryFilters.length === 0 &&
        brandFilters.length === 0 &&
        randomFilters.includes(product.tags[x].toLowerCase())
      ) {
        alreadyAdded.push(product);
        break;
      }

      if (
        randomFilters.length === 0 &&
        brandFilters.includes(product.brand) &&
        categoryFilters.includes(product.tags[x].toLowerCase())
      ) {
        console.log("here");

        alreadyAdded.push(product);
        break;
      }

      if (
        brandFilters.length === 0 &&
        randomFilters.includes(product.tags[x].toLowerCase()) &&
        categoryFilters.includes(product.category)
      ) {
        console.log("here");
        alreadyAdded.push(product);
        break;
      }

      if (
        categoryFilters.length === 0 &&
        randomFilters.includes(product.tags[x].toLowerCase()) &&
        brandFilters.includes(product.brand)
      ) {
        console.log("here");
        alreadyAdded.push(product);
        break;
      }

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

  loadProducts(alreadyAdded);
}

function loadProducts(products) {
  let productsHTML = "";
  for (let i = 0; i < products.length; i++) {
    let element = products[i];
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
    productsHTML += product;
  }
  let productsContainer = document.getElementsByClassName("product-row")[0];
  productsContainer.innerHTML = productsHTML;
}

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
