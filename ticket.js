const ticketCardArea = document.querySelector(".ticketCard-area");
const searchResultArea = document.querySelector("#searchResult-text");
const addTicketForm = document.querySelector(".addTicket-form");
//下拉選單
const regionSearch = document.querySelector(".regionSearch");
//新增套票
const ticketRegion = document.querySelector("#ticketRegion"); //景點地區
const ticketDescription = document.querySelector("#ticketDescription"); //套票描述
const addInputs = document.querySelectorAll("input");
const insertBtn = document.querySelector(".addTicket-btn"); //新增按鈕
let ticketAllData;

//初始
function init() {
  axios
    .get(
      "https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json"
    )
    .then(function (response) {
      ticketAllData = response.data.data;
      renderData(ticketAllData);
    }).catch(function (error) {
      console.log(error);
    })
    ;
}
init();
//渲染
function renderData(ticketData) {
  ticketCardArea.innerHTML = "";
  console.log(ticketData.length);
  ticketData.forEach((data) => {
    ticketCardArea.innerHTML += `<li class="ticketCard">
        <div class="ticketCard-img">
            <a href="#">
                <img src="${data.imgUrl}" alt="">
            </a>
            <div class="ticketCard-region">${data.area}</div>
            <div class="ticketCard-rank">${data.rate}</div>
        </div>
        <div class="ticketCard-content">
            <div>
                <h3>
                    <a href="#" class="ticketCard-name">${data.name}</a>
                </h3>
                <p class="ticketCard-description">
                ${data.description}
                </p>
            </div>
            <div class="ticketCard-info">
                <p class="ticketCard-num">
                    <span><i class="fas fa-exclamation-circle"></i></span>
                    剩下最後 <span id="ticketCard-num"> ${data.group} </span> 組
                </p>
                <p class="ticketCard-price">
                    TWD <span id="ticketCard-price"> $ ${data.price}</span>
                </p>
            </div>
        </div>`;
  });
  searchResultArea.textContent = `本次搜尋共 ${ticketData.length} 筆資料`;
  chartData(ticketAllData);
  generateChart();
}
//下拉選單
regionSearch.addEventListener("change", function (e) {
  let filterData;
  if (e.target.value === "") {
    filterData = ticketAllData;
  } else {
    filterData = ticketAllData.filter((item) => item.area === e.target.value);
  }
  renderData(filterData);
});
//新增套票物件
function addTicket() {
  ticketAllData.push({
    id: ticketAllData.length === 0 ? 1 : ticketAllData.length + 1,
    area: ticketRegion.value,
    imgUrl: addInputs[1].value,
    rate: addInputs[4].value,
    name: addInputs[0].value,
    description: ticketDescription.value,
    group: addInputs[3].value,
    price: addInputs[2].value,
  });
  addTicketForm.reset();
  regionSearch.value = "";
  renderData(ticketAllData);
}
//新增套票
insertBtn.addEventListener("click", function () {
  window.event.preventDefault();
  addTicket();
});

//整理資料
let citiesObj = {};
let chartDataArr = [];
function chartData(datas) {
  citiesObj = {}; // 重置對象
  chartDataArr = []; // 重置圖表數據陣列
  console.log(datas)
  datas.forEach((item) => {
    console.log(item.area)
    if (citiesObj[item.area] == undefined) {
      //item.area如果是空的就是undefined
      citiesObj[item.area] = 1;
    } else {
      citiesObj[item.area] += 1;
    }
  });
  //重組陣列資料
  // const citiesArr = Object.keys(citiesObj)
  // console.log(citiesArr)
  // citiesArr.forEach(item=>{
  //   let ary={}
  //   ary.city = item;
  //   ary.num = citiesObj[item];
  //   chartDataArr.push(ary);
  // })
  // console.log(chartDataArr);
  // [
  //   {"area":"高雄","num":2},
  //   {"area":"台北","num":1},
  //   {"area":"台中","num":1}
  // ]

  //重組陣列資料 II-為 C3.js 所用
  const citiesArr = Object.keys(citiesObj);
  citiesArr.forEach((item, index) => {
    let ary = [];
    ary.push(item);
    ary.push(citiesObj[item]);
    chartDataArr.push(ary);
  });
}
//圖表
function generateChart() {
  console.log(chartDataArr)
  const chartDonut = c3.generate({
    bindto: "#donutChart", // 綁定的 HTML 元素
    data: {
      columns: chartDataArr,
      type: "donut",
      onclick: function (d, i) {
        console.log("onclick", d, i);
      },
      onmouseover: function (d, i) {
        console.log("onmouseover", d, i);
      },
      onmouseout: function (d, i) {
        console.log("onmouseout", d, i);
      },
    },
    donut: {
      title: "套票地區比重",
      width: 12,
      label: {
        show: false,
      },
    },
    color: {
      台北: "#26BFC7",
      台中: "#5151D3",
      高雄: "#E68619"
    },
    size: {
      width: 170,
      height: 200,
    },
    padding: {
      bottom: 4,
    }
  });
}
