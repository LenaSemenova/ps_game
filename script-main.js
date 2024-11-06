const modal = document.querySelector(".modal-window");
const callModalBtn = document.querySelector(".rules");
const closeBtn = document.querySelector(".close");

callModalBtn.onclick = () => {
    console.log("You clicked rules btn");
    modal.style.display = "flex";
}

closeBtn.onclick = () => {
    modal.style.display = "none"; 
}
