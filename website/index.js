async function fetchUserData() {
    connectionError = false

    var userData = await fetch("http://localhost:7987/users/me")
        .catch((reason => {
            alert("An error occured while connecting to the ForumNet API: " + reason)
        }))

    if (connectionError)
        return

    if (userData.status === 200) {
        
    } else if (userData === 401) {
        location.href = "/auth"
    } else if (userData === 403) {
        location.href = "/blocked"
    }
}

fetchUserData()