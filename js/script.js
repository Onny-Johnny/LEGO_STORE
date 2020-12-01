let pageIndex = 1;
let totalPrice = 0;
let pagination = document.querySelector(".pagination");
let filter = document.querySelector(".btn-submit");

function FilterObj (diameter, width, startPrice, endPrice, brand) {

  if (diameter) {
    this.diameter = diameter;
  }
  if (width) {
    this.width = width;
  }
  if (startPrice) {
    this.startPrice = startPrice;
  }
  if (endPrice) {
    this.endPrice = endPrice;
  }
  if (brand) {
    this.brand = brand;
  }
}

//================== Function from change page of goods card ======================//
function changePage (goodsArr) {
  pagination.addEventListener("click", function clickPagination (event) {
    let target = event.target;

    if (target.getAttribute("id") === 'next' && pageIndex < 4) {
      pageIndex++;
    }
    if (target.getAttribute("id") === 'previous' && pageIndex > 1) {
      pageIndex--;
    }
    if (target.getAttribute("id") !== 'previous'
        && target.getAttribute("id") !== 'next') {
      pageIndex = +(target.innerHTML);
    }
    renderCards(goodsArr);
  });
}


//======================= Function from sort by filters ========================//
function sortingByFilters (jsonObj) {
  filter.addEventListener("click", function clickFilter (event) {
    pageIndex = 1;
    let diameter = document.querySelectorAll(".filter-bloc-item");
    let width = document.querySelectorAll(".filter-width-item");
    let startPrice = document.querySelector(".range-input-left").value;
    let endPrice = document.querySelector(".range-input-right").value;
    let brand = document.querySelectorAll(".filter-brand-item");
    //
    let getDiameter = undefined;
    let getWidth = [];
    let getStartPrice = startPrice;
    let getEndPrice = endPrice;
    let getBrand = [];

    for (let i = 0; diameter[i]; i++) {
     if(diameter[i].children[0].checked) {
       getDiameter = diameter[i].children[1].innerText.replace(`"`,``);
     }
    }
    for (let i = 0; width[i]; i++) {
      if (width[i].children[0].checked) {
        getWidth.push(width[i].children[1].innerText.replace(`"`,``));
      }
    }
    for (let i = 0; brand[i]; i++) {
      if(brand[i].children[0].checked) {
          getBrand.push(brand[i].children[1].innerText.toLowerCase());
      }
    }
    if (getWidth.length === 0)
      getWidth = undefined;
    if (getBrand.length === 0)
      getBrand = undefined;
    let filterObj = new FilterObj(getDiameter, getWidth, getStartPrice, getEndPrice, getBrand);
    let goodsArr = createGoodsArr(jsonObj, filterObj);
    renderCards(goodsArr);
  })
}


//======= Class from Json Object====>
class Good {
  constructor(jsonObj) {
    this.name = jsonObj.name;
    this.src = jsonObj.src;
    this.diameter = jsonObj.diameter;
    this.width = jsonObj.width;
    this.price = jsonObj.price;
    this.brand = jsonObj.brand;
    this.discount = jsonObj.discount;
    this.popular = jsonObj.popular;
  }
}


//=======handler of JSON==========//
async function getJson() {
  let resJson;
  let jsonStr = await fetch("js/goods.json")
      .then((response) => response.json())
      .then((data) => resJson = data.goods)
      .catch((e)=>console.log(e))
  return Promise.resolve(jsonStr).then(() => {
    return resJson;
  });
}


async function AllGoods() {
  let allGoods = await getJson();
  return allGoods;
}

//================Create Basket Window ==========//
let basketWindow = () => {
  let parentDiv = document.querySelector('.drop-window');
  let basketItem = document.createElement('div');
  let buttonLess = document.createElement('button');
  let buttonMore = document.createElement('button');
  let imageBlock = document.createElement('div');
  let imageItem = document.createElement('img');
  let itemDesc = document.createElement('p');
  let itemPrice = document.createElement('p');

  basketItem.setAttribute('class', 'basket-item');
  buttonLess.setAttribute('id', 'less');
  buttonLess.innerHTML = "-";
  buttonMore.setAttribute('id', 'more');
  buttonMore.innerHTML = "+";
  imageBlock.setAttribute('class', 'basket-img');
  itemDesc.setAttribute('id', 'item-desc');
  itemPrice.setAttribute('id', 'item-price');

  parentDiv.append(basketItem);
  document.getElementsByClassName("purchase-amount")[0].innerHTML = "";
  document.getElementsByClassName("purchase-amount")[0].innerHTML = "Total price: " + totalPrice + " $";
  imageBlock.append(imageItem);
  imageBlock.append(itemDesc);
  imageBlock.append(itemPrice);
  basketItem.append(buttonLess);
  basketItem.append(imageBlock);
  basketItem.append(buttonMore);
  return basketItem;
}


//================Add to cart=====================//
let countItems = 0;

function setCssAttr (elem, attr, value) {
  elem.setAttribute(attr, value);
}

function addElem(parent, child) {
  parent.append(child);
}

let addToBasket = () => {
  $(".buy").click(function () {

    let toLocalStorage = {
      name: "",
      price: "",
      src: "",
    }

    let getParent = $(this).parents()[0];
    let getImg = getParent.children[0].getAttribute("src");
    let getName = getParent.children[1].innerHTML;
    let getPrice = getParent.children[2].innerHTML.replace('usd','') + "$";
    totalPrice += +getParent.children[2].innerHTML.replace('usd','');
    let insertDiv = basketWindow();

    toLocalStorage.name = getName;
    toLocalStorage.price = getPrice;
    toLocalStorage.src = getImg;

    localStorage.setItem("object" + countItems, JSON.stringify(toLocalStorage));
    countItems++;

    insertDiv.children[1].children[1].innerHTML = getName;
    insertDiv.children[1].children[2].innerHTML = getPrice;
    setCssAttr(insertDiv.children[1].children[0],"src", getImg);
  });
}

//============Create good card=========//
function goodsCard (goods) {
  let parentDiv = document.querySelector(".products-card");
  let goodCard = document.createElement("div")
  let image = document.createElement("img");
  let span = document.createElement("span");
  let p = document.createElement("p");
  let button = document.createElement("button");

  goodCard.setAttribute("class", "goods-card");
  image.setAttribute("src", goods.src);
  button.setAttribute("class", "buy");
  span.innerText = goods.name;
  p.innerText = goods.price + " usd";
  button.innerText = "Add to cart";

  goodCard.append(image);
  goodCard.append(span);
  goodCard.append(p);
  goodCard.append(button);
  parentDiv.append(goodCard);
}

//===========Function from Render product cards==========//
function renderCards(goodsArr) {
  if (goodsArr.length !== 0) {
    document.querySelector(".products-card").innerHTML = "";
    for (let i = (pageIndex - 1) * 9; i < (pageIndex - 1) * 9 + 9 && goodsArr[i]; i++)
      goodsCard(goodsArr[i]);
  }
  addToBasket();
}


//======== Create Array from goods===========//
function createGoodsArr (jsonObj, filterObj) {
  let goodsArr = [];
  let flag = 0;
  let widthFlag = 0;
    if (filterObj) {
      for (let i = 0; jsonObj[i]; i++) {
        widthFlag = 0;
        flag = 0;
      for (let key in filterObj) {
        if (key === "diameter" && flag === 0) {
          if (filterObj[key] !== jsonObj[i][key]) {
            flag = 1;
          }
        }
        if (key === "width" && flag === 0) {
          for (let j = 0; filterObj[key][j]; j++) {
            if(filterObj[key][j] === jsonObj[i][key]) {
              flag = 0;
              break;
            }
            flag = 1;
          }
        }
        if (key === "brand" && flag === 0) {
          for (let j = 0; filterObj[key][j]; j++) {
            if(filterObj[key][j] === jsonObj[i][key]) {
              flag = 0;
              break;
            }
            flag = 1;
          }
        }
        if (+jsonObj[i].price < +filterObj.startPrice || +jsonObj[i].price > +filterObj.endPrice) {
          flag = 1;
        }
      }
      if (flag === 1)
        continue;
      goodsArr.push(new Good(jsonObj[i]));
      }
  }
    else {
      for (let i = 0; jsonObj[i]; i++)
        goodsArr.push(new Good(jsonObj[i]));
    }
  return goodsArr;
}

//============ Search on the goods name===========//
let search = function (jsonObj) {
  let input = document.getElementById('input');
  let inputValue = document.querySelector('.search-widget-field');

  input.addEventListener('click', function () {
    let filter = inputValue.value.toLowerCase();
    let goodsArr = [];
    for (let i = 0; jsonObj[i]; i++) {
     if (jsonObj[i].name.toLowerCase().includes(filter)) {
       goodsArr.push(new Good(jsonObj[i]));
     }
    }
    renderCards(goodsArr);
    inputValue.value = ``;
  })
};


//=========== Sorting from popular goods===============//
let sortPopular = (jsonObj) => {
  let popular = document.querySelector(".popular");
  popular.addEventListener('click', function () {
    pageIndex = 1;
    let goodsArr = [];
    for (let i = 0; jsonObj[i]; i++) {
      if (jsonObj[i].popular === "true") {
        goodsArr.push(new Good(jsonObj[i]));
      }
    }
    renderCards(goodsArr);
  })
}

//=========== Sorting from discount goods===============//
let sortDiscount = (jsonObj) => {
  let discount = document.querySelector(".discount");
  discount.addEventListener('click', function () {
  pageIndex = 1;
    let goodsArr = [];
    for (let i = 0; jsonObj[i]; i++) {
      if (jsonObj[i].discount === "true") {
        goodsArr.push(new Good(jsonObj[i]));
      }
    }
    renderCards(goodsArr);
  })
}

//=========== Sorting from brands===============//
let sortBrand = (jsonObj) => {
  let brands = document.querySelector(".item-wrapper");
  brands.addEventListener('click', function (event) {
  pageIndex = 1;
    let target = event.target;
    let goodsArr = [];

    for (let i = 0; jsonObj[i]; i++) {
      if (jsonObj[i].brand === target.innerHTML.toLowerCase()) {
        goodsArr.push(new Good(jsonObj[i]));
      }
    }
    renderCards(goodsArr);
  })
}

//==========Main function===========//
AllGoods()
    .then((jsonObj)=>{
    let goodsArr = createGoodsArr(jsonObj);
    ///
      renderCards(goodsArr);
      sortingByFilters (jsonObj);
      changePage(goodsArr);
      search(jsonObj);
      sortPopular(jsonObj);
      sortDiscount(jsonObj);
      sortBrand(jsonObj);
    })
    .catch((e)=>console.log(e));