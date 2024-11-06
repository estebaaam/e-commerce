/*Barra de navegacion lateral*/
const toggleButton = document.getElementById('toggle-btn')
const sidebar = document.getElementById('sidebar')

function  toggleSidebar() {
    sidebar.classList.toggle('close')
    toggleButton.classList.toggle('rotate')

    Array.from(sidebar.getElementsByClassName('show')).forEach(ul => {
        ul.classList.toggle('show')
        ul.previousElementSibling.classList.remove('rotate')
    })
}



function toggleSubMenu(button){
    button.nextElementSibling.classList.toggle('show')
    button.classList.toggle('rotate')

    if(sidebar.classList.contains('close')){
        sidebar.classList.toggle('close')
        toggleButton.classList.toggle('rotate')
    }
 }

 function toggleSubMenuUser(button) {
    button.classList.toggle('active');
    button.nextElementSibling.classList.toggle('show')
    button.classList.toggle('rotate')
        const subMenu = button.nextElementSibling;
        if (subMenu.style.display === 'block') {
            subMenu.style.display = 'none';
        } else {
            subMenu.style.display = 'block';
        }
        if(sidebar.classList.contains('close')){
            sidebar.classList.toggle('close')
            toggleButton.classList.toggle('rotate')
        }
        
}
