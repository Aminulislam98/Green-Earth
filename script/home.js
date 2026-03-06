let cart = [];
const snipperForCategories = (status) => {
  const categoriesSnipper = document.getElementById("snipperAllCategories");
  if (status === true) {
    categoriesSnipper.innerText = "Lodging...";
    return;
  } else {
    categoriesSnipper.innerText = "";
    return;
  }
};
// snipper for card
const snipperForCard = (status) => {
  const snipperCard = document.getElementById("snipperCard");
  if (status === true) {
    snipperCard.classList.remove("active");
    document.getElementById("cardContainer").classList.add("active");
    return;
  } else {
  }
};
const showLoading = (status) => {
  const snipperCard = document.getElementById("snipperCard");
  if (status === true) {
    snipperCard.classList.remove("active");
    document.getElementById("cardContainer").classList.add("active");
    return;
  }
};
const hideLoading = (status) => {
  if (status === false) {
    const snipperCard = document.getElementById("snipperCard");
    snipperCard.classList.add("active");
    document.getElementById("cardContainer").classList.remove("active");
    return;
  }
};
// load all categories from api
const loadAllCategories = async () => {
  // snipper
  snipperForCategories(true);
  const response = await fetch(
    "https://openapi.programming-hero.com/api/categories",
  );
  const data = await response.json();
  showAllCategories(data.categories);
};
loadAllCategories();
// show all categories
const showAllCategories = (allCategoriesData) => {
  const categories = document.getElementById("categories");
  let html = "";
  allCategoriesData.forEach((element) => {
    html += `
   <li onclick="selectedCategories(${element.id});" id="categoriesButton${element.id}" class="categoryButton w-full hover:bg-[#15803D] hover:text-white rounded cursor-pointer py-1 px-2">
     <a class="">${element.category_name}</a>
   </li>
   `;
  });

  categories.innerHTML = html;
  snipperForCategories(false);
};

// select categories
const selectedCategories = async (selectedId) => {
  showLoading(true);
  const allCategoriesButton = document.querySelectorAll(".categoryButton");
  allCategoriesButton.forEach((element) => {
    element.classList.remove("bg-[#15803D]", "text-white");
  });
  const categoriesButton = document.getElementById(
    `categoriesButton${selectedId}`,
  );
  categoriesButton.classList.add("bg-[#15803D]", "text-white");
  const response = await fetch(
    `https://openapi.programming-hero.com/api/category/${selectedId}`,
  );

  const selectedData = await response.json();
  console.log(selectedData.plants);
  showAllPlants(selectedData.plants);
};

// all plants
const loadAllPlants = async () => {
  showLoading(true);
  const response = await fetch(
    "https://openapi.programming-hero.com/api/plants",
  );
  const data = await response.json();
  showAllPlants(data.plants);
};
loadAllPlants();
// show all trees
const showAllPlants = (allPlants) => {
  const cardContainer = document.getElementById("cardContainer");
  let renderHtml = "";
  allPlants.forEach((element) => {
    renderHtml += `

        <div
        class="card max-w-[330px] p-4 flex flex-col  shadow-md bg-white h-full  mt-auto"
    >
        <img onclick="loadCardDetails(${element.id})" class="cursor-pointer h-48 object-cover rounded-md w-full" src="${element.image}" alt="" />
        <div class="mt-3">
        <h4 onclick="loadCardDetails(${element.id})" class="font-semibold text-5 mb-3 cursor-pointer">${element.name}</h4>
        <p
            class=" text-[12px] font-normal text-[#1F2937] mb-3 line-clamp-2"
        >
            ${element.description}
        </p>
        <div class="flex justify-between items-center mb-4">
            <button
            class="py-1 px-4 text-[#15803D] bg-[#DCFCE7] font-medium text-4 rounded-2xl cursor-pointer flex justify-center items-center"
            >
            ${element.category}
            </button>
            <p class="font-bold cursor-pointer">$${element.price}</p>
        </div>
        <!-- show it when add to cart is clicked -->
        <p id="messageAdded${element.id}" class="hidden">Added</p>
        <button onclick="addToCart(${element.id}, '${element.name}', ${element.price})"
            class="bg-[#15803D] text-white font-medium text-4 py-3 w-full rounded-3xl cursor-pointer hover:bg-green-600 "
        >
            Add to Cart
        </button>
        </div>
    </div>
    
    `;
  });
  cardContainer.innerHTML = renderHtml;
  hideLoading(false);
  return;
};
// show card details
const loadCardDetails = async (id) => {
  const response = await fetch(
    `https://openapi.programming-hero.com/api/plant/${id}`,
  );
  const data = await response.json();
  showCardDetails(data.plants);
};
// show modal for card details
const showCardDetails = (details) => {
  console.log(details);
  let modal = document.getElementById("modalForCardDetails");
  modal.showModal();
  let renderModal = document.getElementById("showCardDetail");
  renderModal.innerHTML = `

  <div
        class="card w-full p-4 flex flex-col  shadow-md bg-white h-full  mt-auto"
    >
        <img class="h-48 object-cover rounded-md w-full" src="${details.image}" alt="" />
        <div class="mt-3">
        <h4  class="font-semibold text-5 mb-3">${details.name}</h4>
        <p
            class=" text-[12px] font-normal text-[#1F2937] mb-3 line-clamp-2"
        >
            ${details.description}
        </p>
        
        <div class="flex justify-between items-center mb-4">
            <button
            class="py-1 px-4 text-[#15803D] bg-[#DCFCE7] font-medium text-4 rounded-2xl cursor-pointer flex justify-center items-center"
            >
            ${details.category}
            </button>
            <p class="font-bold cursor-pointer">$${details.price}</p>
        </div>
        <button onclick="addToCart(${details.id}, '${details.name}', ${details.price})"
            class="bg-[#15803D] text-white font-medium text-4 py-3 w-full rounded-3xl cursor-pointer hover:bg-green-600 "
        >
            Add to Cart
        </button>
        </div>
    </div>
  
  `;
};
// add to cart
const addToCart = (id, name, price) => {
  let existingItem = cart.find((element) => element.id == id);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      id,
      name,
      price,
      quantity: 1,
    });
  }

  const showAddedMessage = document.getElementById(`messageAdded${id}`);
  showAddedMessage.classList.remove("hidden");
  setTimeout(() => {
    showAddedMessage.classList.add("hidden");
  }, 3000);
  showCartItem();
};
// show cart item
const showCartItem = () => {
  let totalCost = 0;
  let cartLength = 0;
  const basketCartContainer = document.getElementById("basketCartContainer");

  let html = "";
  cart.forEach((element) => {
    totalCost += element.price * element.quantity;
    cartLength += element.quantity;
    html += `
    <div
        class="basket-card p-2 flex justify-between items-center bg-[#F0FDF4] rounded-md"
      >
        <div>
          <h5 class="font-semibold text-5 mb-2">${element.name}</h5>
          <p class="font-semibold text-5 mb-2">Quantity:${element.quantity}</p>
          <p class="font-semibold text-5 mb-2">Price:$${element.price}</p>
        </div>
        <button>
          <i onclick="deleteItem(${element.id})" class="text-red-600 fa-regular fa-trash-can cursor-pointer"></i>
        </button>
      </div>
    `;
  });
  document.getElementById("totalCost").innerText = `$${totalCost}`;
  document.getElementById("cartLength").innerText = cartLength;
  basketCartContainer.innerHTML = html;
  empty();
};
// delete item
const deleteItem = (id) => {
  let existingItem = cart.filter((item) => item.id != id);
  cart = existingItem;
  showCartItem();
  empty();
};
const empty = () => {
  if (cart.length == 0) {
    document.getElementById("empty").classList.remove("hidden");
    document.getElementById("basket").classList.add("hidden");
  } else {
    document.getElementById("empty").classList.add("hidden");
    document.getElementById("basket").classList.remove("hidden");
  }
};
empty();
