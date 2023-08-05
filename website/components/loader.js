$(document).ready(() => {
    $.get("/components/sidebar.html", data => {
        $("#sidebar-component").replaceWith(data)
    })
})