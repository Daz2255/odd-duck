// global variables
// querySelector returns the first element in the document that matches
const productContainer = document.querySelector("section");
const resultsButton = document.querySelector("section + div");
const image1 = document.querySelector("section img:first-child");
const image2 = document.querySelector("section img:nth-child(2)");
const image3 = document.querySelector("section img:nth-child(3)");
let clicks = 0;
const maxClicksAllowed = 25;

let allProducts = [];

function getRandomNumber() {
  return Math.floor(Math.random() * allProducts.length);
}

function Product(name, src) {
  this.name = name;
  this.src = src;
  this.clicks = 0;
  this.views = 0;
  allProducts.push(this);
}

function renderProducts() {
  // we need to generate a number to reference the product we want to render onto the page
  let product1 = getRandomNumber();
  let product2 = getRandomNumber();
  let product3 = getRandomNumber();

  // how could we prevent product1 being the same number a product2?
  while (
    product1 === product2 ||
    product1 === product3 ||
    product2 === product3
  ) {
    product2 = getRandomNumber();
    product3 = getRandomNumber();
  }

  // now we have two random numbers lets set the attributes of our images in the document.
  image1.src = allProducts[product1].src;
  image2.src = allProducts[product2].src;
  image3.src = allProducts[product3].src;
  image1.alt = allProducts[product1].name;
  image2.alt = allProducts[product2].name;
  image3.alt = allProducts[product3].name;
  allProducts[product1].views++;
  allProducts[product2].views++;
  allProducts[product3].views++;
}

function handleProductClick(event) {
  if (event.target === productContainer) {
    alert("Please click on an image");
  } else {
    clicks++;
    // console.log(clicks);
    let clickedProduct = event.target.alt;
    for (let i = 0; i < allProducts.length; i++) {
      if (clickedProduct === allProducts[i].name) {
        allProducts[i].clicks++;
        break;
      }
    }
    if (clicks === maxClicksAllowed) {
      productContainer.removeEventListener("click", handleProductClick);
      productContainer.className = "no-voting";
      resultsButton.addEventListener("click", renderResults);
      resultsButton.textContent = "View Results"; // Change button text to "View Results"
      resultsButton.className = "clicks-allowed";
    } else {
      renderProducts();
    }
  }
}

function renderResults() {
  // console.log("Your results are in!");
  let ul = document.querySelector("ul");
  for (let i = 0; i < allProducts.length; i++) {
    let li = document.createElement("li");
    li.textContent = `${allProducts[i].name} had ${allProducts[i].views} views and was clicked ${allProducts[i].clicks} times.`;
    ul.appendChild(li);
  }
}

const bag = new Product("Bag", "assets/images/bag.jpg");
const banana = new Product("Banana", "assets/images/banana.jpg");
const bathroom = new Product("Bathroom", "assets/images/bathroom.jpg");
const boots = new Product("Boots", "assets/images/boots.jpg");
const breakfast = new Product("Breakfast", "assets/images/breakfast.jpg");
const bubblegum = new Product("Bubblegum", "assets/images/bubblegum.jpg");
const chair = new Product("Chair", "assets/images/chair.jpg");
const cthulhu = new Product("cthulhu", "assets/images/cthulhu.jpg");
const dogduck = new Product("Dog Duck", "assets/images/dog-duck.jpg");
const dragon = new Product("Dragon", "assets/images/dragon.jpg");
const pen = new Product("Pen", "assets/images/pen.jpg");
const petsweep = new Product("Pet Sweep", "assets/images/pet-sweep.jpg");
const scissors = new Product("Scissors", "assets/images/scissors.jpg");
const shark = new Product("Shark", "assets/images/shark.jpg");
const sweep = new Product("Sweep", "assets/images/sweep.png");
const tauntaun = new Product("Tauntaun", "assets/images/tauntaun.jpg");
const unicorn = new Product("Unicorn", "assets/images/unicorn.jpg");
const watercan = new Product("Water Can", "assets/images/water-can.jpg");
const wineglass = new Product("Wine Glass", "assets/images/wine-glass.jpg");

renderProducts();

// Modify the button text initially to "Vote Now"
resultsButton.textContent = "Vote Now";

productContainer.addEventListener("click", handleProductClick);
