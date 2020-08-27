const radioDOM = document.querySelector(".radio-questions");
const orderNumberBox = document.querySelector("#order-number-box");
radioDOM.addEventListener("click", (e) => {
  if (e.target.id === "order") {
    orderNumberBox.classList.remove("hide");
  } else if (
    (e.target.id === "question" || e.target.id === "comment") &&
    !orderNumberBox.classList.contains("hide")
  ) {
    orderNumberBox.classList.add("hide");
    orderNumberBox.value = "";
  }
});
