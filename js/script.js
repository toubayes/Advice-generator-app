let numtip=document.querySelector(".num");
let tips = document.querySelector(".text-advicd");
let refbtn=document.querySelector(".img-btn");
let linebottom=document.querySelector(".line");
let screenwidth =window.screen.width;
// console.log(screenwidth);
function getwidth(){
    if (screenwidth >= 1200) {
        linebottom.src ="images/pattern-divider-desktop.svg";
        console.log("Greater than 1200");
    } else if (screenwidth <= 375) {
        linebottom.src ="images/pattern-divider-mobile.svg";
        console.log("Less than 375");
    }
}

// Call the function
getwidth();

const ulapi ="https://api.adviceslip.com/advice";

 async function displaytip(){
    let requet=  await fetch(ulapi);
    let dataset= await requet.json();
    console.log(dataset);
    numtip.innerHTML= " # " + dataset.slip.id;
    tips.innerHTML="\""+dataset.slip.advice+"\"" ;

}
refbtn.addEventListener("click" ,()=>{
    displaytip();
})
displaytip();