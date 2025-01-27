//SECTION 1
let add_btn = document.getElementById("addItemButton")
function addListItem(){
    let text = document.getElementById("itemInput").value
    if (text !== ""){
    let ul = document.getElementById("itemList")
    let li = document.createElement("li");
    li.appendChild(document.createTextNode(text));
    ul.appendChild(li);
    }
}

add_btn.onclick = addListItem
//SECTION 2

function display(message, id, good){
    let error_part = document.getElementById(id)
    error_part.textContent = message
    if (good){
        color = "green"
    }
    else{
        color = "red"
    }
    error_part.style.color = color
    error_part.style.borderColor = color
}
function isValidEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

function isValidPassword(pass){
    return pass.length >= 8 && /\d/.test(pass) && /[a-z]/.test(pass) && /[A-Z]/.test(pass)
}

function validateForm (){
    let count = 0
    let user_name = document.getElementById("name")
    if (user_name.value === ""){
        display("ⓘ Empty Name is not allow", "nameError", false)
    } 
    else{
        display("", "nameError", false)
        count += 1
    }
    let user_email = document.getElementById("email")
    if (user_email.value === ""){
        display("ⓘ Empty email is not allow", "emailError", false)
    } 
    else if (!isValidEmail(user_email.value)){
        display("ⓘ Wrong email format", "emailError", false)
    }
    else{
        display("", "emailError", false)
        count += 1
    }
    let user_pass = document.getElementById("password")
    if (user_pass.value === ""){
        display("ⓘ Empty password is not allow", "passwordError", false)
    }
    else if (!isValidPassword(user_pass.value)){
        display("ⓘ Password must have minimum 8 characters, at least one uppercase, one lowercase, and one digit", "passwordError", false)
    } 
    else{
        display("", "passwordError", false)
        count += 1
    }
    let user_repass = document.getElementById("repeatPassword")
    if (user_repass.value === ""){
        display("ⓘ Empty fill is not allow", "repeatPasswordError", false)
    }
    else if (user_repass.value !== user_pass.value){
        display("ⓘ Password must match", "repeatPasswordError", false)
    } 
    else{
        display("", "repeatPasswordError", false)
        count += 1
    }
    if (count === 4){
        display("Registration success", "successMessage", true)
    }
}
submit_btn = document.getElementById("submitButton")
submit_btn.onclick = validateForm


// SECTION 3

function todoApp(){
    let text = document.getElementById("newTodo").value
    let li = document.createElement("li")
    let check_box = document.createElement("input")
    check_box.type = 'checkbox'

    let remove_btn = document.createElement("button")
    remove_btn.innerText = "Remove"

    let text_tag = document.createElement("p")
    text_tag.innerText = text
    text_tag.style.display = "inline"
    check_box.checked = false
    // check_box function
    check_box.onclick = function ()
        {
            if (check_box.checked == true){
                li.style.textDecoration = "line-through"
            }
            else{
                li.style.textDecoration = "none"
            }
            const list = document.getElementById("todoList");
        }

    // remove button function

    remove_btn.onclick = function () {
        document.getElementById("todoList").removeChild(li)
    }

    li.appendChild(text_tag)
    li.appendChild(check_box)
    li.appendChild(remove_btn)
    document.getElementById("todoList").appendChild(li)
    document.getElementById("todoList").children[0].style.textDecoration = "line-through"
}

let todo_btn = document.getElementById("addTodoButton")
todo_btn.onclick = todoApp

