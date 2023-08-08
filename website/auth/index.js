function login_credentials() {
    fetch("http://localhost:7987/auth/login", {
        method: "POST",
        body: JSON.stringify({ 
            identifier: document.getElementById("login_identifier").value, 
            password: document.getElementById("login_password").value
        })
    }).then(response => {
        if (response.status == 200) {
            localStorage.setItem("session_token", response.body["session_token"])
            location.href = "/home"
        } else {
            
        }
    })
    .catch(reason => {
        
    })
}

function signup_credentials() {
    fetch("http://localhost:7987/auth/signup", {
        method: "POST",
        body: JSON.stringify({ 
            identifier: document.getElementById("signup_identifier").value, 
            password: document.getElementById("signup_password").value
        })
    }).then(response => {
        if (response.status == 200) {
            localStorage.setItem("session_token", response.body["session_token"])
            location.href = "/home"
        } else {

        }
    })
    .catch(reason => {
        
    })
}