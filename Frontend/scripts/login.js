let email = document.querySelector("#email")
const password  = document.querySelector("#password")
let log = document.querySelector("#sign")
import baseURL from "./baseURL.js"

log.addEventListener("click",()=>{
  let obj ={
    email:email.value,password:password.value
  }
  loginUser(obj)
})

async function loginUser(obj){
  console.log(obj)
    try {
        let url = baseURL+"/user/login"
        let res = await fetch(url,{
            method:"POST",
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify(obj)
        });
        let data = await res.json();
        if(res.status==400){
            alert(data.error)
        }else{
            alert(data.message);
            sessionStorage.setItem("loggedInUser",JSON.stringify(data.user))
            console.log(data.token);
        }
    } catch (error) {
        alert(error.message)
    }
}


document.querySelector("#signup").addEventListener("click",()=>{
    window.location="signup.html"
})


const togglePassword = document.querySelector('#togglePassword');
togglePassword.addEventListener('click', function (e) {
  // toggle the type attribute
  const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
  password.setAttribute('type', type);
  // toggle the eye slash icon
  this.classList.toggle('fa-eye-slash');
});

