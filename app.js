const productContainer = document.querySelector("section");
const resultsButton = document.querySelector("section + div");
const image1 = document.querySelector("section img:first-child");
const image2 = document.querySelector("section img:nth-child(2)");
const image3 = document.querySelector("section img:nth-child(3)");
let clicks = 0;
const maxClicksAllowed = 25;

let allProducts = [];

// Collect data for the chart
function collectChartData() {
  const dataClicks = [];
  const dataViews = [];
  const labels = [];

  for (const product of allProducts) {
    dataClicks.push(product.clicks);
    dataViews.push(product.views);
    labels.push(product.name);
  }

  //console.log("Data Clicks:", dataClicks);
  //console.log("Data Views:", dataViews);
  //console.log("Labels:", labels);

  const fixedColors = ["#6495ED", "#40E0D0"];
  const clicksDataset = {
    label: "Clicks",
    data: dataClicks,
    backgroundColor: fixedColors[0],
    borderColor: fixedColors[0],
    borderWidth: 1,
  };

  const viewsDataset = {
    label: "Views",
    data: dataViews,
    backgroundColor: fixedColors[1],
    borderColor: fixedColors[1],
    borderWidth: 1,
  };

  return {
    clicksDataset,
    viewsDataset,
    labels,
  };
}
//Render chart
function renderChart(chartType, datasets, labels) {
  const ctx = document.getElementById("myChart").getContext("2d");

  const config = {
    type: chartType,
    data: {
      labels: labels,
      datasets: datasets.map((dataset) => {
        if (chartType === "bar") {
          return {
            ...dataset,
            backgroundColor: dataset.backgroundColor,
            borderColor: dataset.borderColor,
          };
        } else {
          return {
            ...dataset,
            backgroundColor: generateRandomColors(labels.length),
            borderColor: "#FFFF00",
          };
        }
      }),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 1,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        title: {
          display: true,
          text:
            chartType === "bar"
              ? "Number of Clicks and Views"
              : chartType === "pie"
              ? "Number of Clicks"
              : "Number of Views",
        },
      },
    },
  };

  if (myChart) {
    myChart.destroy();
  }

  myChart = new Chart(ctx, config);
}
//Random colour for pie and doughnut charts
function generateRandomColors(count) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    colors.push(color);
  }
  return colors;
}
// make a bar chart to display total views and clicks
function renderTotalChart() {
  const totalClicks = allProducts.reduce(
    (sum, product) => sum + product.clicks,
    0
  );
  const totalViews = allProducts.reduce(
    (sum, product) => sum + product.views,
    0
  );

  const data = [totalClicks, totalViews];
  const labels = ["Total Clicks", "Total Views"];
  const colors = ["#6495ED", "#40E0D0"];

  const dataset = {
    label: "Total",
    data: data,
    backgroundColor: colors,
    borderColor: colors,
    borderWidth: 1,
  };

  renderChart("bar", [dataset], labels);
}
//results button
resultsButton.addEventListener("click", () => {
  if (!myChart) {
    const chartData = collectChartData();
    renderChart(
      "bar",
      [chartData.clicksDataset, chartData.viewsDataset],
      chartData.labels
    );
    resultsButton.textContent = "See More Charts";
  } else if (myChart.config.type === "bar") {
    const chartData = collectChartData();
    renderChart("pie", [chartData.clicksDataset], chartData.labels);
    resultsButton.textContent = "See More Charts";
  } else if (myChart.config.type === "pie") {
    const chartData = collectChartData();
    renderChart("doughnut", [chartData.viewsDataset], chartData.labels);
    resultsButton.style.display = "none";
  }

  image1.style.display = "none";
  image2.style.display = "none";
  image3.style.display = "none";
});

// Get a random product number
function getRandomNumber() {
  return Math.floor(Math.random() * allProducts.length);
}

// Product constructor
function Product(name, src) {
  this.name = name;
  this.src = src;
  this.clicks = 0;
  this.views = 0;
  allProducts.push(this);
  //console.log(allProducts);
}

// Render product images

let previousProducts = [];

function renderProducts() {
  let product1 = getRandomNumber();
  let product2 = getRandomNumber();
  let product3 = getRandomNumber();

  while (
    product1 === product2 ||
    product1 === product3 ||
    product2 === product3 ||
    previousProducts.includes(product1) ||
    previousProducts.includes(product2) ||
    previousProducts.includes(product3)
  ) {
    product1 = getRandomNumber();
    product2 = getRandomNumber();
    product3 = getRandomNumber();
  }

  previousProducts = [product1, product2, product3];

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

// Handle product click
function handleProductClick(event) {
  if (event.target === productContainer) {
    alert("Please click on an image");
  } else {
    clicks++;

    let clickedProduct = event.target.alt;
    for (let i = 0; i < allProducts.length; i++) {
      if (clickedProduct === allProducts[i].name) {
        allProducts[i].clicks++;
        break;
      }
    }
    // I need to call the save product funtion
    saveProductData();

    if (clicks === maxClicksAllowed) {
      productContainer.removeEventListener("click", handleProductClick);

      resultsButton.textContent = "View Results";
      resultsButton.className = "clicks-allowed";

      const refreshButton = document.createElement("button");
      refreshButton.textContent = "Vote Again";
      refreshButton.addEventListener("click", () => {
        location.reload();
      });

      resultsButton.parentNode.insertBefore(
        refreshButton,
        resultsButton.nextSibling
      );
    } else {
      renderProducts();
    }
  }
}
// I need a function to save the product data
function saveProductData() {
  localStorage.setItem("productData", JSON.stringify(allProducts));
}
// I need a function using an if statement to load the product data

function loadProductData() {
  const storedProductData = localStorage.getItem("productData");
  if (storedProductData) {
    allProducts = JSON.parse(storedProductData);
  }
}

// Create products
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

// I need to call loadProducData before renderproducts
loadProductData();
renderProducts();
resultsButton.textContent = "Vote Now";
productContainer.addEventListener("click", handleProductClick);

let myChart = null;
