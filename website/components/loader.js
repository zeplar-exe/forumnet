function insertComponent(component_name, html_uri) {
    if ($(component_name).length) {
        $.get(html_uri, data => {
            $(component_name).replaceWith(data)
        })
    }
}

$(document).ready(() => {
    insertComponent("#sidebar-component", "/components/sidebar.html")
})