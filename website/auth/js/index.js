function login_credentials() {
    fetch("http://localhost:7987/auth/login", {
        method: "POST",
        body: JSON.stringify({ 
            identifier: document.getElementById("identifier").value, 
            password: document.getElementById("password").value
        })
    }).then(response => {
        if (response.status == 200) {
            localStorage.setItem("session_token", response.body["session_token"])
            location.href = "/home"
        }
    })
    .catch(reason => {
        
    })
}

function signup() {
    location.href = "signup"
}