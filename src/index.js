const init = () => {
  let container = document.getElementById("dog-bar");
  fetch("http://localhost:3000/pups")
    .then((resp) => resp.json())
    .then((data) => {
      function loadData(somedata) {
        somedata.forEach((item) => {
          // container.innerHTML = "";
          let dogNameSpan = document.createElement("span");
          dogNameSpan.innerText = item.name;
          container.appendChild(dogNameSpan);
          dogNameSpan.addEventListener("click", () => {
            let infoContainer = document.getElementById("dog-info");
            infoContainer.innerHTML = "";
            let image = document.createElement("img");
            let header = document.createElement("h2");
            let btn = document.createElement("button");
            header.innerText = item.name;
            image.src = item.image;
            infoContainer.appendChild(image);
            infoContainer.appendChild(header);
            infoContainer.appendChild(btn);
            if (item.isGoodDog) {
              btn.innerText = "Good Dog!";
            } else {
              btn.innerText = "Bad Dog!";
            }
            btn.addEventListener("click", (e) => {
              let result = !item.isGoodDog;
              item.isGoodDog = !item.isGoodDog;
              console.log(result);
              fetch(`http://localhost:3000/pups/${item.id}`, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
                body: JSON.stringify({
                  isGoodDog: result,
                }),
              })
                .then((resp) => resp.json())
                .then((json) => {
                  let newResult = json.isGoodDog;
                  newResult
                    ? (btn.innerText = "Good Dog!")
                    : (btn.innerText = "Bad Dog!");
                });
            });
          });
        });
      }

      let filterBtn = document.getElementById("good-dog-filter");
      let clicked = false;
      filterBtn.addEventListener("click", () => {
        if (!clicked) {
          clicked = true;
          filterBtn.innerText = "Filter good dogs: ON";
          fetch("http://localhost:3000/pups")
            .then((resp) => resp.json())
            .then((data) => {
              let filteredData = data.filter((item) => {
                return item["isGoodDog"] === true;
              });
              console.log(filteredData);
              container.innerHTML = "";

              loadData(filteredData);
            });
        } else {
          clicked = false;
          filterBtn.innerText = "Filter good dogs: OFF";
          container.innerHTML = "";
          loadData(data);
        }
      });

      loadData(data);
    });
};

window.addEventListener("DOMContentLoaded", init);
